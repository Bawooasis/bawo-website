-- BawoSocial Control Center: Clients & Prospects relationship status
-- DO NOT APPLY to production until Alexander approves.
-- Preview uses a derived fallback (see deriveListingStatus) until this ships.

create table if not exists public.cms_listing_relationships (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null
    check (entity_type in ('venue', 'directory', 'job_partner')),
  entity_id text not null,
  status text not null
    check (status in ('client', 'prospect', 'not_contacted'))
    default 'not_contacted',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id)
);

create index if not exists cms_listing_relationships_status_idx
  on public.cms_listing_relationships (status);

create index if not exists cms_listing_relationships_entity_idx
  on public.cms_listing_relationships (entity_type, entity_id);

alter table public.cms_listing_relationships enable row level security;

-- Admins (and service role) can read all rows.
drop policy if exists cms_listing_relationships_admin_select
  on public.cms_listing_relationships;
create policy cms_listing_relationships_admin_select
  on public.cms_listing_relationships
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and (
          u.is_admin = true
          or u.role in ('admin', 'superadmin')
        )
    )
  );

-- Admin-only writes.
drop policy if exists cms_listing_relationships_admin_write
  on public.cms_listing_relationships;
create policy cms_listing_relationships_admin_write
  on public.cms_listing_relationships
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and (
          u.is_admin = true
          or u.role in ('admin', 'superadmin')
        )
    )
  )
  with check (
    exists (
      select 1
      from public.users u
      where u.id = auth.uid()
        and (
          u.is_admin = true
          or u.role in ('admin', 'superadmin')
        )
    )
  );

comment on table public.cms_listing_relationships is
  'Control Center Clients & Prospects status for venues, directory listings, and NYC job partners.';
