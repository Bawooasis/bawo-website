-- Policy / RLS checklist for partner attribution (run after migrations apply).
-- FILE ONLY helper — does not mutate data. Safe to run in SQL editor.
-- Expected: tables exist, RLS on, policies named below present.

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'partner_profiles',
    'partner_link_events',
    'partner_applications',
    'users'
  )
order by 1;

select
  tablename,
  policyname,
  cmd,
  roles::text as roles
from pg_policies
where schemaname = 'public'
  and tablename in (
    'partner_profiles',
    'partner_link_events',
    'partner_applications'
  )
order by tablename, policyname;

-- Public view for approved kits (no emails)
select
  table_name,
  column_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'partner_public_profiles'
order by ordinal_position;

-- Secure anon click helper
select
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'record_partner_link_event';

-- Attribution guard trigger on users
select
  tg.tgname as trigger_name,
  c.relname as table_name
from pg_trigger tg
join pg_class c on c.oid = tg.tgrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'users'
  and tg.tgname = 'trg_guard_user_attribution_columns'
  and not tg.tgisinternal;

-- House seed codes present (after seed migration)
select code, partner_type, organization_name, status
from public.partner_profiles
where code in ('PRM-P8Y7R2EP', 'VEN-Y0FDJB9F', 'STU-W1HK44BA')
order by partner_type;
