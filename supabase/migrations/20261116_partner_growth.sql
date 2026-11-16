-- Partner attribution + growth tracking (FILE ONLY — do not apply from this website repo).
-- Apply from the BawoSocial app/backend migration workflow after Alexander reviews.
-- Public pages continue to use Mailchimp /api/subscribe as the partner application fallback.

create table if not exists public.partner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  code text not null unique,
  partner_type text not null check (partner_type in ('promoter', 'venue', 'student_society')),
  organization_name text not null,
  contact_name text not null,
  contact_email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paused')),
  sample_link text,
  notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_link_events (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partner_profiles (id) on delete cascade,
  event_type text not null check (event_type in ('click', 'signup', 'save', 'activation')),
  session_id text,
  path text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists partner_link_events_partner_created_idx
  on public.partner_link_events (partner_id, created_at desc);

create table if not exists public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  partner_type text not null check (partner_type in ('promoter', 'venue', 'student_society')),
  name text not null,
  email text not null,
  organization text not null,
  city text,
  website text,
  message text,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- Optional user attribution columns for Growth tab (sign-ups by source / activation / retention)
alter table public.users
  add column if not exists signup_source text,
  add column if not exists partner_ref text,
  add column if not exists first_activated_at timestamptz,
  add column if not exists week4_retained boolean;

comment on table public.partner_profiles is 'Approved partner codes for /partners kits and Business Portal Partner link tab';
comment on table public.partner_link_events is 'Click / signup / save / activation events for partner analytics';
comment on table public.partner_applications is 'Inbound partner applications pending Alexander review';
