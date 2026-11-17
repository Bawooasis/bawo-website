# Mailchimp env vars on Netlify (`bawosocial`)

The Netlify subscribe function (`netlify/functions/subscribe.ts`) and the Vercel
rollback handler (`api/subscribe.ts`) both need:

| Variable | Purpose |
|----------|---------|
| `MAILCHIMP_API_KEY` | Mailchimp API key |
| `MAILCHIMP_SERVER` | Data-center prefix (e.g. `us21`) |
| `MAILCHIMP_AUDIENCE_ID` | Audience / list id |

## Deploy Preview parity

Until these are available to **Deploy Previews** (and Production) on the
`bawosocial` Netlify site, `POST /api/subscribe` on a DP returns:

```json
{"error":"Server configuration error"}
```

with HTTP 500 — matching the shared core when env is missing.

Production on Vercel (current `joinbawo.com`) with env present returns for an
obviously invalid address:

```json
{"error":"Subscription failed. Please try again."}
```

with HTTP 400 (Mailchimp rejects the address).

**This repo does not set Netlify dashboard env vars or touch DNS.** Alexander
(or an operator) should copy the three Vercel values into Netlify → Site
configuration → Environment variables for:

- Production
- Deploy Previews
- Branch deploys (optional)

Then re-check:

```bash
curl -sS -X POST "$DP/api/subscribe" \
  -H 'Content-Type: application/json' \
  -d '{"email":"not-an-email"}'
# expect: {"error":"Subscription failed. Please try again."}
```
