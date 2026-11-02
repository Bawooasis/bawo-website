# Events Manager — schema & panel report

**Status:** Migration files and panel code are in this PR only.  
**Do not apply** `supabase/migrations/20261102010000_events_manager_schema.sql` to production without Alexander’s approval.  
**Do not deploy** `admin-events` / updated `get-events-nyc` edge functions without approval.

## Tables the app reads for events

| Source | Role |
|---|---|
| `public.external_events` | Live NYC Culture Hub feed via `get-events-nyc` |
| `public.events` | Native “Create an event” inventory |
| `public.public_events` | View over `events` (`status = approved` and `event_date >= CURRENT_DATE`) |
| `storage.buckets` / `storage.objects` (`event-images`) | Cover images |

`get-events-nyc` filters: `moderation_status = approved`, region `nyc|null`, excludes non-visible statuses, then upcoming by `ends_at \|\| starts_at` in JS.

## Panel write path

1. `/admin` → Events tab → `EventsPanel`
2. `PlatformApi` → Edge Function `admin-events` (service role after admin JWT check)
3. Upserts `external_events` (feed truth)
4. When `provider = bawosocial`, also upserts `events` (trigger keeps mirror in sync)
5. Audit → `admin_audit_log` + `admin_event_audit`
6. Covers → signed upload to `event-images` / `control-center/{eventId}/…`

Panel statuses map to DB as:

| Panel | `external_events.status` | `moderation_status` | `events.status` |
|---|---|---|---|
| draft | `draft` | `pending` | `draft` |
| published | `approved` | `approved` | `approved` |
| hidden | `hidden` | `approved` | `hidden` |
| expired | `expired` | `approved` | `expired` |

Existing feed rows with `status = approved` or `active` read as **Published**. No hard deletes.

## Database / SQL changes (each listed)

| # | Table / object | Change | Why | Risk |
|---|---|---|---|---|
| 1 | `external_events` | `ADD COLUMN borough text` | Panel neighborhood/borough field | Low — nullable additive |
| 2 | `external_events` | `ADD COLUMN neighborhood text` | Panel field | Low |
| 3 | `external_events` | `ADD COLUMN organizer_name text` | Organizer/partner field | Low |
| 4 | `external_events` | `ADD COLUMN address text` | Street address distinct from legacy `location` | Low — `location` retained |
| 5 | `events` | `ADD COLUMN borough text` | Keep native/public_events aligned | Low |
| 6 | `events` | `ADD COLUMN neighborhood text` | Same | Low |
| 7 | `events` | `ADD COLUMN address text` | Same | Low |
| 8 | `external_events` | `CHECK chk_external_events_status` allow-list including draft/hidden/active/approved/expired/pending/rejected | Prevent invalid panel statuses; preserve live values | Low — matches current inventory |
| 9 | `events` | `CHECK chk_events_status` allow-list including draft/hidden/expired | Same for native rows | Low — no prior CHECK |
| 10 | `external_events` | Index `idx_external_events_moderation_status` | Faster moderation filters | Low |
| 11 | `external_events` | Index `idx_external_events_status_moderation` | Admin list filters | Low |
| 12 | `external_events` | Partial index `idx_external_events_feed_visible` | Align with feed visibility after draft/hidden | Low — additive |
| 13 | `events` | Indexes on `starts_at`, `status`, `event_date` | Admin + public_events | Low |
| 14 | `events` | Trigger `update_events_updated_at` via `set_updated_at()` | Persist honest `updated_at` | Low — `external_events` already had one |
| 15 | `admin_event_audit` | New table + indexes | Event-specific audit trail | Low — new object |
| 16 | `admin_event_audit` | RLS select/insert for platform admins | Confidential audit | Low |
| 17 | `external_events` | RLS policy “Platform admins manage external events” | Allow admin JWT writes (edge still preferred) | Medium — broadens who can mutate if admin flag set |
| 18 | `storage.objects` | Policy “Platform admins manage event images” | Admin cover upload/replace | Low — authenticated upload already existed |
| 19 | `storage.buckets` | Idempotent upsert `event-images` public + mime/size | Ensure bucket config for covers | Low |
| 20 | `sync_native_event_to_external_events()` | REPLACE to map draft/hidden/expired + copy new columns | Panel ↔ native consistency | Medium — behavior change for native creates; keep SECURITY DEFINER |
| 21 | `public_events` view | `CREATE OR REPLACE` add `address`, `borough`, `neighborhood` | Expose new fields to native consumers | Low — still filters `approved` + upcoming |

Rollback notes are in the migration file header. Prefer forward fixes over dropping additive columns.

## Edge function sources (deploy separately after approval)

- `supabase/functions/admin-events/index.ts` — new
- `supabase/functions/get-events-nyc/index.ts` — exclude `hidden|draft|pending|rejected` statuses; return new location fields

Until deployed + migration applied, the Events Manager UI loads, but list/save shows a clear error / empty list.

## Hardcoded / pinned app events

Mobile app repo is not in this workspace, so client hardcodes cannot be confirmed here.

Database curated pin (editable via Events Manager once backend is live):

- **La Cangri · Halloween AfterDark**
- `id`: `f5dc04c9-cdd3-4108-9244-72a21f85fe8c`
- `provider`: `curated`
- `provider_id`: `halloween-afterdark-2026-cigarro-p-la-cangri`
- `status` / `moderation_status`: `approved`
- `is_featured`: `true`
- `starts_at`: `2026-11-01`

Other Halloween hits in `external_events` are normal Eventbrite/Ticketmaster rows, not pins.

## Access

- URL: `/admin` (same Control Center)
- Auth: existing admin email/password, recovery email OTP, phone→owner email alias
- Server enforcement: `users.is_admin` / `role=admin` inside `admin-events` + RLS helpers

## Never touched

- `public.social_content_items`
- No row deletes
- No production schema apply / no edge deploy from this agent run
EOF