-- BawoSocial house partner codes for /partners kit previews.
-- FILE ONLY — do not apply to production without Alexander's go-ahead.
-- Generated via: node scripts/generate-partner-code.mjs --house --write-config
-- Source of truth in app until live: src/directory/partnerCodes.ts

insert into public.partner_profiles (
  id,
  code,
  partner_type,
  organization_name,
  contact_name,
  contact_email,
  status,
  sample_link,
  notes,
  reviewed_at
) values (
  'ec376095-ab4c-45d8-a459-ceab152e6dd5'::uuid,
  'PRM-P8Y7R2EP',
  'promoter',
  'BawoSocial',
  'Alexander',
  'hello@joinbawo.com',
  'approved',
  'https://www.joinbawo.com/nyc?utm_source=partner&utm_medium=qr&utm_campaign=partner_promoter&ref=PRM-P8Y7R2EP',
  'BawoSocial house kit code for Promoters & DJs',
  now()
) on conflict (code) do update set
  partner_type = excluded.partner_type,
  organization_name = excluded.organization_name,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  status = excluded.status,
  sample_link = excluded.sample_link,
  notes = excluded.notes,
  updated_at = now();

insert into public.partner_profiles (
  id,
  code,
  partner_type,
  organization_name,
  contact_name,
  contact_email,
  status,
  sample_link,
  notes,
  reviewed_at
) values (
  '7f0cca4c-8b47-46c6-a0d0-802bfee09909'::uuid,
  'VEN-Y0FDJB9F',
  'venue',
  'BawoSocial',
  'Alexander',
  'hello@joinbawo.com',
  'approved',
  'https://www.joinbawo.com/nyc?utm_source=partner&utm_medium=qr&utm_campaign=partner_venue&ref=VEN-Y0FDJB9F',
  'BawoSocial house kit code for Restaurants / salons / stores',
  now()
) on conflict (code) do update set
  partner_type = excluded.partner_type,
  organization_name = excluded.organization_name,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  status = excluded.status,
  sample_link = excluded.sample_link,
  notes = excluded.notes,
  updated_at = now();

insert into public.partner_profiles (
  id,
  code,
  partner_type,
  organization_name,
  contact_name,
  contact_email,
  status,
  sample_link,
  notes,
  reviewed_at
) values (
  '467af326-3ac4-4074-a14f-0bd65ce3a30d'::uuid,
  'STU-W1HK44BA',
  'student_society',
  'BawoSocial',
  'Alexander',
  'hello@joinbawo.com',
  'approved',
  'https://www.joinbawo.com/nyc?utm_source=partner&utm_medium=qr&utm_campaign=partner_student&ref=STU-W1HK44BA',
  'BawoSocial house kit code for Student & alumni societies',
  now()
) on conflict (code) do update set
  partner_type = excluded.partner_type,
  organization_name = excluded.organization_name,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  status = excluded.status,
  sample_link = excluded.sample_link,
  notes = excluded.notes,
  updated_at = now();
