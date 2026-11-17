# Migration approval needed: `cms_listing_relationships`

**Status:** Written in this PR. **Not applied** to production Supabase (`wyarfsymnyrraowwluhf`).

## Why

Places (`nigerian_restaurants`) and directory rows (`community_resources`) have no Client / Prospect / Not contacted field today. NYC job partners already expose `partner_status` / `is_partner`, which the preview derives from.

To let Control Center store and edit relationship status for every listing type, we need a small admin-owned table.

## File

`supabase/migrations/20261109180000_cms_listing_relationships.sql`

## Shape

| Column | Type | Notes |
|--------|------|--------|
| `id` | uuid PK | `gen_random_uuid()` |
| `entity_type` | text | `venue` \| `directory` \| `job_partner` |
| `entity_id` | text | listing id / partner id |
| `status` | text | `client` \| `prospect` \| `not_contacted` |
| `notes` | text | optional |
| `created_at` / `updated_at` | timestamptz | |

Unique `(entity_type, entity_id)`. RLS: admin SELECT/write only.

## Preview fallback (live now)

Until approved and applied, the UI derives status:

1. Stored row from `cms_listing_relationships` if the table exists
2. Else `nyc_job_partners.partner_status` / `is_partner`
3. Else `owner_user_id` present → Prospect
4. Else Not contacted

## Ask

Alexander: approve applying this migration to the Bawosocial production project before enabling editable Client/Prospect status writes.
