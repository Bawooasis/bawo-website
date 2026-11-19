-- Partner attribution RLS + public view + user attribution column guards.
-- FILE ONLY — do not apply to production without Alexander's go-ahead.
-- Depends on: 20261116_partner_growth.sql
-- Admin check: public.is_current_user_admin() (existing: is_admin OR role in admin/super_admin)

-- ---------------------------------------------------------------------------
-- Public-safe projection of approved partner kits (no emails / contact PII)
-- ---------------------------------------------------------------------------
create or replace view public.partner_public_profiles
with (security_invoker = true)
as
select
  code,
  partner_type,
  organization_name,
  sample_link
from public.partner_profiles
where status = 'approved';

comment on view public.partner_public_profiles is
  'Anon/authenticated may read approved partner code/type/org only (no emails)';

grant select on public.partner_public_profiles to anon, authenticated;

-- ---------------------------------------------------------------------------
-- partner_profiles RLS
-- ---------------------------------------------------------------------------
alter table public.partner_profiles enable row level security;

drop policy if exists partner_profiles_select_own on public.partner_profiles;
create policy partner_profiles_select_own
  on public.partner_profiles
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_current_user_admin());

drop policy if exists partner_profiles_admin_insert on public.partner_profiles;
create policy partner_profiles_admin_insert
  on public.partner_profiles
  for insert
  to authenticated
  with check (public.is_current_user_admin());

drop policy if exists partner_profiles_admin_update on public.partner_profiles;
create policy partner_profiles_admin_update
  on public.partner_profiles
  for update
  to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

drop policy if exists partner_profiles_admin_delete on public.partner_profiles;
create policy partner_profiles_admin_delete
  on public.partner_profiles
  for delete
  to authenticated
  using (public.is_current_user_admin());

-- Anon has no direct table SELECT (use partner_public_profiles view instead).
revoke all on table public.partner_profiles from anon;
grant select, insert, update, delete on table public.partner_profiles to authenticated;
grant all on table public.partner_profiles to service_role;

-- ---------------------------------------------------------------------------
-- partner_link_events RLS + secure insert helper for anon clicks
-- ---------------------------------------------------------------------------
alter table public.partner_link_events enable row level security;

create or replace function public.record_partner_link_event(
  p_partner_code text,
  p_event_type text,
  p_session_id text default null,
  p_path text default null,
  p_meta jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_partner_id uuid;
  v_event_id uuid;
begin
  if p_event_type is null
     or p_event_type not in ('click', 'signup', 'save', 'activation') then
    raise exception 'invalid event_type' using errcode = '22023';
  end if;

  select id
    into v_partner_id
  from public.partner_profiles
  where code = p_partner_code
    and status = 'approved'
  limit 1;

  if v_partner_id is null then
    raise exception 'partner code not found or not approved' using errcode = 'P0002';
  end if;

  insert into public.partner_link_events (
    partner_id, event_type, session_id, path, meta
  ) values (
    v_partner_id,
    p_event_type,
    nullif(btrim(coalesce(p_session_id, '')), ''),
    nullif(btrim(coalesce(p_path, '')), ''),
    coalesce(p_meta, '{}'::jsonb)
  )
  returning id into v_event_id;

  return v_event_id;
end;
$$;

revoke all on function public.record_partner_link_event(text, text, text, text, jsonb) from public;
grant execute on function public.record_partner_link_event(text, text, text, text, jsonb)
  to anon, authenticated, service_role;

drop policy if exists partner_link_events_select_own on public.partner_link_events;
create policy partner_link_events_select_own
  on public.partner_link_events
  for select
  to authenticated
  using (
    public.is_current_user_admin()
    or exists (
      select 1
      from public.partner_profiles pp
      where pp.id = partner_id
        and pp.user_id = auth.uid()
    )
  );

-- No direct anon insert on the table; use record_partner_link_event().
-- Admins may insert/update/delete for ops.
drop policy if exists partner_link_events_admin_write on public.partner_link_events;
create policy partner_link_events_admin_write
  on public.partner_link_events
  for all
  to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

revoke all on table public.partner_link_events from anon;
grant select on table public.partner_link_events to authenticated;
grant all on table public.partner_link_events to service_role;

-- ---------------------------------------------------------------------------
-- partner_applications RLS
-- ---------------------------------------------------------------------------
alter table public.partner_applications enable row level security;

drop policy if exists partner_applications_anon_insert on public.partner_applications;
create policy partner_applications_anon_insert
  on public.partner_applications
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists partner_applications_admin_select on public.partner_applications;
create policy partner_applications_admin_select
  on public.partner_applications
  for select
  to authenticated
  using (public.is_current_user_admin());

drop policy if exists partner_applications_admin_update on public.partner_applications;
create policy partner_applications_admin_update
  on public.partner_applications
  for update
  to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

-- Force pending on insert even if client sends another status
create or replace function public.partner_applications_force_pending()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  new.status := 'pending';
  return new;
end;
$$;

drop trigger if exists trg_partner_applications_force_pending on public.partner_applications;
create trigger trg_partner_applications_force_pending
  before insert on public.partner_applications
  for each row
  execute function public.partner_applications_force_pending();

revoke all on table public.partner_applications from public;
grant insert on table public.partner_applications to anon, authenticated;
grant select, update on table public.partner_applications to authenticated;
grant all on table public.partner_applications to service_role;

-- ---------------------------------------------------------------------------
-- users attribution columns: users must not self-set these
-- (does not weaken existing users RLS; trigger blocks column mutation)
-- ---------------------------------------------------------------------------
create schema if not exists private;

alter table public.users
  add column if not exists signup_source text,
  add column if not exists partner_ref text,
  add column if not exists first_activated_at timestamptz,
  add column if not exists week4_retained boolean;

create or replace function private.guard_user_attribution_columns()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_is_service boolean := (auth.role() = 'service_role');
  v_is_admin boolean := false;
begin
  if tg_op <> 'UPDATE' then
    return new;
  end if;

  if v_is_service then
    return new;
  end if;

  begin
    v_is_admin := public.is_current_user_admin();
  exception when others then
    v_is_admin := false;
  end;

  if v_is_admin then
    return new;
  end if;

  if new.signup_source is distinct from old.signup_source
     or new.partner_ref is distinct from old.partner_ref
     or new.first_activated_at is distinct from old.first_activated_at
     or new.week4_retained is distinct from old.week4_retained then
    raise exception 'attribution columns are not user-writable'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_user_attribution_columns on public.users;
create trigger trg_guard_user_attribution_columns
  before update on public.users
  for each row
  execute function private.guard_user_attribution_columns();

comment on column public.users.signup_source is 'Set only by service role / admin / attribution jobs';
comment on column public.users.partner_ref is 'Partner code at signup — not user-writable';
comment on column public.users.first_activated_at is 'Activation timestamp — not user-writable';
comment on column public.users.week4_retained is 'Retention flag — not user-writable';
