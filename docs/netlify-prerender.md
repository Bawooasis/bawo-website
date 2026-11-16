# Netlify prerender (Playwright / Chromium)

## Goal

`npm run build` ends with `scripts/prerender.mjs`, which launches Chromium via
Playwright, loads the Vite `dist/` output, waits for hero copy (“Find your
people” / “Feel at home”), and writes the rendered DOM back to
`dist/index.html` for first paint SEO.

## Netlify build wiring

`netlify.toml` runs:

```text
npx playwright install chromium && npm run build
```

`[functions] directory = "netlify/functions"` so the Mailchimp subscribe port
and `/api/*` 404 helper ship with the site.

## Soft-skip behavior

`prerender.mjs` **never fails the marketing build**. If Chromium cannot be
installed or launched (missing OS libraries, sandbox limits, network blocks on
browser download), it logs a warning and leaves the Vite static shell in place
(`process.exit(0)`).

That means:

- Deploy previews always publish even when prerender soft-skips.
- Confirm success in the Netlify build log by looking for:
  `[prerender] Wrote landing HTML to dist/index.html (…)`.
- Soft-skip looks like:
  `[prerender] Chromium install failed…` or
  `[prerender] Skipped after error…`.

## Why soft-skip exists

Netlify’s build image usually can download Playwright’s Chromium build, but
some environments lack the shared libraries Chromium needs at launch time.
Failing the whole site build over prerender would block deploys of an otherwise
valid SPA. The Vite shell already contains the marketing content; prerender is
an enhancement for crawlers and first paint.

## Local verification

```bash
npx playwright install chromium
npm run build
# expect: [prerender] Wrote landing HTML to dist/index.html
```
