-- =============================================================================
-- Events Manager schema (additive / idempotent)
-- Tables touched: external_events, events, public_events (view), admin_event_audit,
--                 storage.objects policies for event-images
-- DO NOT apply to production without explicit approval.
--
-- ROLLBACK NOTES (manual, only if needed — prefer forward fixes):
--   1. DROP POLICY IF EXISTS "Platform admins manage external events" ON public.external_events;
--   2. DROP POLICY IF EXISTS "Platform admins manage event images" ON storage.objects;
--   3. DROP POLICY IF EXISTS "admin_event_audit_select_admin" ON public.admin_event_audit;
--   4. DROP POLICY IF EXISTS "admin_event_audit_service_insert" ON public.admin_event_audit;
--   5. DROP TABLE IF EXISTS public.admin_event_audit;
--   6. DROP INDEX IF EXISTS public.idx_external_events_moderation_status;
--   7. DROP INDEX IF EXISTS public.idx_external_events_feed_visible;
--   8. DROP INDEX IF EXISTS public.idx_external_events_status_moderation;
--   9. DROP INDEX IF EXISTS public.idx_events_starts_at;
--  10. DROP INDEX IF EXISTS public.idx_events_status;
--  11. ALTER TABLE public.external_events DROP CONSTRAINT IF EXISTS chk_external_events_status;
--  12. ALTER TABLE public.events DROP CONSTRAINT IF EXISTS chk_events_status;
--  13. DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
--  14. Columns borough/neighborhood/organizer_name/address are additive — leave in place
--      (do not DROP) unless a follow-up migration explicitly retires them after app cutover.
--  15. Restore sync_native_event_to_external_events / public_events from prior migration
--      definitions if this replace must be reverted.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1) external_events: location/organizer fields the panel edits
-- ---------------------------------------------------------------------------
ALTER TABLE public.external_events
  ADD COLUMN IF NOT EXISTS borough text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS organizer_name text,
  ADD COLUMN IF NOT EXISTS address text;

COMMENT ON COLUMN public.external_events.borough IS
  'NYC borough for Culture Hub / Events Manager (additive).';
COMMENT ON COLUMN public.external_events.neighborhood IS
  'Neighborhood label for Culture Hub / Events Manager (additive).';
COMMENT ON COLUMN public.external_events.organizer_name IS
  'Organizer or partner name shown in Events Manager (additive).';
COMMENT ON COLUMN public.external_events.address IS
  'Street address; distinct from legacy location free-text (additive).';

-- ---------------------------------------------------------------------------
-- 2) events: mirror location fields so native + public_events stay in sync
-- ---------------------------------------------------------------------------
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS borough text,
  ADD COLUMN IF NOT EXISTS neighborhood text,
  ADD COLUMN IF NOT EXISTS address text;

COMMENT ON COLUMN public.events.borough IS
  'NYC borough (additive; Events Manager / public_events).';
COMMENT ON COLUMN public.events.neighborhood IS
  'Neighborhood (additive; Events Manager / public_events).';
COMMENT ON COLUMN public.events.address IS
  'Street address (additive; location remains legacy free-text).';

-- ---------------------------------------------------------------------------
-- 3) Status value constraints (additive allow-lists; existing rows already match)
--    Live inventory uses status in {approved, expired}; review path may write active.
--    Panel adds draft | hidden. Keep all historical values.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_external_events_status'
      AND conrelid = 'public.external_events'::regclass
  ) THEN
    ALTER TABLE public.external_events
      ADD CONSTRAINT chk_external_events_status
      CHECK (
        status IS NULL OR status = ANY (ARRAY[
          'approved'::text,
          'active'::text,
          'pending'::text,
          'draft'::text,
          'hidden'::text,
          'expired'::text,
          'rejected'::text
        ])
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_events_status'
      AND conrelid = 'public.events'::regclass
  ) THEN
    ALTER TABLE public.events
      ADD CONSTRAINT chk_events_status
      CHECK (
        status IS NULL OR status::text = ANY (ARRAY[
          'pending'::text,
          'approved'::text,
          'rejected'::text,
          'draft'::text,
          'hidden'::text,
          'expired'::text
        ])
      );
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4) Indexes for feed + admin list filters
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_external_events_moderation_status
  ON public.external_events (moderation_status);

CREATE INDEX IF NOT EXISTS idx_external_events_status_moderation
  ON public.external_events (status, moderation_status);

-- Partial index aligned with get-events-nyc visibility after draft/hidden exclusion
CREATE INDEX IF NOT EXISTS idx_external_events_feed_visible
  ON public.external_events (region, starts_at)
  WHERE moderation_status = 'approved'
    AND (status IS NULL OR status NOT IN ('expired', 'hidden', 'draft', 'pending', 'rejected'));

CREATE INDEX IF NOT EXISTS idx_events_starts_at
  ON public.events (starts_at);

CREATE INDEX IF NOT EXISTS idx_events_status
  ON public.events (status);

CREATE INDEX IF NOT EXISTS idx_events_event_date
  ON public.events (event_date);

-- ---------------------------------------------------------------------------
-- 5) updated_at trigger on events (external_events already has one)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'pg_catalog', 'public', 'extensions'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 6) Audit table for Events Manager mutations (also continue writing admin_audit_log)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_event_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  action text NOT NULL,
  event_id uuid NOT NULL,
  outcome text NOT NULL CHECK (outcome = ANY (ARRAY['success'::text, 'failure'::text])),
  reason text,
  before_row jsonb NOT NULL DEFAULT '{}'::jsonb,
  after_row jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_event_audit_event_id
  ON public.admin_event_audit (event_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_event_audit_actor
  ON public.admin_event_audit (actor_user_id, created_at DESC);

ALTER TABLE public.admin_event_audit ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_event_audit_select_admin" ON public.admin_event_audit;
CREATE POLICY "admin_event_audit_select_admin"
  ON public.admin_event_audit
  FOR SELECT
  TO authenticated
  USING (private.is_current_user_platform_admin());

-- Inserts come from service_role edge functions; allow authenticated admin insert as fallback
DROP POLICY IF EXISTS "admin_event_audit_insert_admin" ON public.admin_event_audit;
CREATE POLICY "admin_event_audit_insert_admin"
  ON public.admin_event_audit
  FOR INSERT
  TO authenticated
  WITH CHECK (
    private.is_current_user_platform_admin()
    AND actor_user_id = auth.uid()
  );

-- ---------------------------------------------------------------------------
-- 7) RLS: platform admins can manage external_events (service_role remains primary)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Platform admins manage external events" ON public.external_events;
CREATE POLICY "Platform admins manage external events"
  ON public.external_events
  FOR ALL
  TO authenticated
  USING (private.is_current_user_platform_admin())
  WITH CHECK (private.is_current_user_platform_admin());

-- ---------------------------------------------------------------------------
-- 8) Storage: admin-scoped management for event-images (public read already exists)
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Platform admins manage event images" ON storage.objects;
CREATE POLICY "Platform admins manage event images"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (
    bucket_id = 'event-images'
    AND private.is_current_user_platform_admin()
  )
  WITH CHECK (
    bucket_id = 'event-images'
    AND private.is_current_user_platform_admin()
  );

-- Ensure bucket stays public-read for app cover images (idempotent upsert)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = COALESCE(storage.buckets.file_size_limit, EXCLUDED.file_size_limit),
  allowed_mime_types = COALESCE(storage.buckets.allowed_mime_types, EXCLUDED.allowed_mime_types);

-- ---------------------------------------------------------------------------
-- 9) Keep native → external sync aware of new statuses + columns
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_native_event_to_external_events()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  computed_starts_at timestamptz;
  computed_moderation text;
  computed_status text;
  submitter_uuid uuid;
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.external_events
    WHERE id = OLD.id
       OR (provider = 'bawosocial' AND provider_id = 'bawosocial_' || OLD.id::text);
    RETURN OLD;
  END IF;

  computed_starts_at := COALESCE(
    NEW.starts_at,
    ((NEW.event_date)::text || 'T' || COALESCE((NEW.event_time)::text, '19:00:00') || '-04:00')::timestamptz
  );

  computed_moderation := CASE
    WHEN NEW.status::text IN ('approved', 'hidden', 'expired') THEN 'approved'
    WHEN NEW.status::text = 'rejected' THEN 'rejected'
    ELSE 'pending'
  END;

  computed_status := CASE
    WHEN NEW.status::text = 'approved' THEN 'approved'
    WHEN NEW.status::text = 'hidden' THEN 'hidden'
    WHEN NEW.status::text = 'expired' THEN 'expired'
    WHEN NEW.status::text = 'rejected' THEN 'rejected'
    WHEN NEW.status::text = 'draft' THEN 'draft'
    ELSE 'pending'
  END;

  IF NEW.organizer_id IS NOT NULL
     AND NEW.organizer_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  THEN
    submitter_uuid := NEW.organizer_id::uuid;
  ELSE
    submitter_uuid := NULL;
  END IF;

  INSERT INTO public.external_events (
    id,
    provider,
    provider_id,
    title,
    description,
    url,
    source_url,
    starts_at,
    ends_at,
    city,
    country,
    venue_name,
    location,
    address,
    borough,
    neighborhood,
    organizer_name,
    image_url,
    category,
    tags,
    source,
    region,
    status,
    moderation_status,
    is_featured,
    submitted_by,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    'bawosocial',
    'bawosocial_' || NEW.id::text,
    NEW.title,
    NEW.description,
    NEW.ticket_url,
    NEW.ticket_url,
    computed_starts_at,
    NEW.ends_at,
    COALESCE(NEW.city, 'New York'),
    'US',
    COALESCE(NEW.venue_name, NEW.location),
    NEW.location,
    COALESCE(NEW.address, NEW.location),
    NEW.borough,
    NEW.neighborhood,
    NEW.organizer_name,
    NEW.image_url,
    LOWER(COALESCE(NEW.category, 'social')),
    ARRAY['diaspora', 'nigerian', 'community', LOWER(COALESCE(NEW.category, 'social'))],
    'bawosocial',
    'nyc',
    computed_status,
    computed_moderation,
    COALESCE(NEW.is_featured, false),
    submitter_uuid,
    COALESCE(NEW.created_at, now()),
    now()
  )
  ON CONFLICT (provider, provider_id) DO UPDATE
  SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    url = EXCLUDED.url,
    source_url = EXCLUDED.source_url,
    starts_at = EXCLUDED.starts_at,
    ends_at = EXCLUDED.ends_at,
    city = EXCLUDED.city,
    venue_name = EXCLUDED.venue_name,
    location = EXCLUDED.location,
    address = EXCLUDED.address,
    borough = EXCLUDED.borough,
    neighborhood = EXCLUDED.neighborhood,
    organizer_name = EXCLUDED.organizer_name,
    image_url = EXCLUDED.image_url,
    category = EXCLUDED.category,
    status = EXCLUDED.status,
    moderation_status = EXCLUDED.moderation_status,
    is_featured = EXCLUDED.is_featured,
    updated_at = now();

  RETURN NEW;
END;
$function$;

-- ---------------------------------------------------------------------------
-- 10) public_events view: include new columns (still approved + upcoming only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.public_events AS
SELECT
  id,
  title,
  description,
  category,
  event_date,
  event_time,
  location,
  address,
  borough,
  neighborhood,
  image_url,
  ticket_price,
  max_tickets_per_person,
  total_tickets_available,
  tickets_sold,
  organizer_name,
  attendees_count,
  is_featured,
  created_at,
  updated_at,
  status,
  organizer_email,
  organizer_id,
  organizer_phone,
  venue_name,
  city,
  ticket_url,
  starts_at,
  ends_at,
  group_id,
  allow_rsvp
FROM public.events
WHERE status::text = 'approved'
  AND event_date >= CURRENT_DATE
ORDER BY is_featured DESC, event_date;
