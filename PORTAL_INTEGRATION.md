# BawoSocial Portal Integration

The JoinBawo marketing site remains the public homepage. The same Vite application now owns two protected platform routes:

- `/business` — vendor listings, claims, and clearly labeled growth/billing readiness.
- `/admin` — consumer access, groups, business approvals, administrator access, and audit history.

The application also recognizes `business.joinbawo.com` and `admin.joinbawo.com` when those hosts are connected later. No separate website repository is required.

## Production dependencies

Add only these public browser values to the Vercel project:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

Never add a Supabase service-role key to a `VITE_` variable. The browser signs users in with Supabase Auth, then calls the secured Edge Functions with the user's access token.

The backend must have these functions and their migration deployed before the portal becomes operational:

- `platform-control-center`
- `vendor-portal`

Configure `PLATFORM_PORTAL_ORIGINS` on the Edge Functions to include the production origins actually used, such as:

```text
https://www.joinbawo.com,https://joinbawo.com,https://admin.joinbawo.com,https://business.joinbawo.com
```

## Status boundaries

- Business claims and owned listings are connected to the vendor endpoint.
- Consumer, group, business-approval, access, and audit controls are connected to the control-center endpoint.
- Vendor click analytics are visibly marked **Not connected yet** until click events and reporting are deployed.
- The `$29` and `$49` plans are visibly marked as targets, not active billing, until Stripe checkout, webhooks, and entitlements are approved and implemented.

## Release sequence

1. Merge and deploy the backend migration/functions.
2. Add the two public Vercel environment values.
3. Verify an authorized admin account and a normal business account.
4. Preview this website branch and test `/admin` and `/business`.
5. Merge this website branch to `main` only after those checks pass.

Vercel's SPA rewrites are included in `vercel.json`; refreshing either portal route resolves to `index.html` rather than a 404.
