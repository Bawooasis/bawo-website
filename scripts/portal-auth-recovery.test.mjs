/**
 * Lightweight portal recovery checks (no live email to the owner inbox).
 * Run via `npm test`.
 */
import assert from "node:assert/strict";

const SUPABASE_URL = "https://wyarfsymnyrraowwluhf.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5YXJmc3ltbnlycmFvd3dsdWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NTY3MTYsImV4cCI6MjA4NzMxNjcxNn0.wmET17KAduP60VHCSmKeVADKfHcpM3-m53EzeGnQy2I";

async function testEdgeFunctionValidation() {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/portal-auth-recovery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({}),
    },
  );
  assert.equal(response.status, 400);
  const payload = await response.json();
  assert.equal(payload.success, false);
  assert.match(String(payload.error || ""), /email|phone/i);
}

async function testEdgeFunctionRejectsNonAdmin() {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/portal-auth-recovery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        identifier: "not-a-real-user-portal-test@joinbawo.com",
        mode: "admin",
      }),
    },
  );
  assert.equal(response.status, 403);
  const payload = await response.json();
  assert.equal(payload.success, false);
  assert.ok(payload.error);
}

async function testSourceWiresEdgeFunctionFirst() {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync(
    new URL("../src/portal/platformApi.ts", import.meta.url),
    "utf8",
  );
  assert.match(source, /functions\/v1\/portal-auth-recovery/);
  assert.match(source, /identifier:\s*trimmedEmail/);
  // Ensure success short-circuits before /auth/v1/recover
  const edgeIdx = source.indexOf("portal-auth-recovery");
  const recoverIdx = source.indexOf("/auth/v1/recover");
  assert.ok(edgeIdx > -1 && recoverIdx > edgeIdx);
}

async function testFoundingStorefrontSeeds() {
  const { FOUNDING_STOREFRONTS, seedCatalogFromFounding } = await import(
    "../src/portal/foundingStorefronts.ts"
  );
  assert.equal(FOUNDING_STOREFRONTS.length, 6);
  const buka = FOUNDING_STOREFRONTS.find((store) =>
    store.name.includes("BUKA"),
  );
  assert.ok(buka);
  const catalog = seedCatalogFromFounding(buka);
  assert.ok(catalog.items.length >= 10);
  assert.equal(catalog.payouts.platform_fee_pct, 10);
  const suya = catalog.items.find((item) => /Suya \(Spiced/.test(item.name));
  assert.ok(suya);
  assert.equal(suya.price, 5.6);
}

async function testBusinessPortalTabsWired() {
  const { readFileSync } = await import("node:fs");
  const layout = readFileSync(
    new URL("../src/portal/PortalLayout.tsx", import.meta.url),
    "utf8",
  );
  assert.match(layout, /Products & Prices/);
  assert.match(layout, /Payouts & Split/);
  const api = readFileSync(
    new URL("../src/portal/platformApi.ts", import.meta.url),
    "utf8",
  );
  assert.match(api, /fetchStorefrontCatalog/);
  assert.match(api, /upsertStorefrontItem/);
  assert.match(api, /savePayoutSettings/);
}

async function testModerationSeedsAndWiring() {
  const { SEED_GROUP_CHAT_ALERTS, SEED_LISTING_ISSUE_REPORTS } = await import(
    "../src/portal/moderationSeeds.ts"
  );
  assert.ok(SEED_GROUP_CHAT_ALERTS.length >= 5);
  assert.equal(SEED_LISTING_ISSUE_REPORTS.length, 6);
  assert.ok(
    SEED_LISTING_ISSUE_REPORTS.some((item) => item.listing_name.includes("BUKA")),
  );
  assert.ok(
    SEED_GROUP_CHAT_ALERTS.some((item) => item.alert_type === "spam"),
  );
  const { readFileSync } = await import("node:fs");
  const admin = readFileSync(
    new URL("../src/portal/AdminPortal.tsx", import.meta.url),
    "utf8",
  );
  assert.match(admin, /ModerationSafetyPanel/);
  assert.doesNotMatch(admin, /social_content_items/);
  const api = readFileSync(
    new URL("../src/portal/platformApi.ts", import.meta.url),
    "utf8",
  );
  assert.match(api, /fetchModerationQueues/);
  assert.match(api, /applyGroupChatModeration/);
  assert.match(api, /applyListingIssueModeration/);
  assert.doesNotMatch(api, /social_content_items/);
}

const tests = [
  ["edge function validates empty body", testEdgeFunctionValidation],
  ["edge function rejects non-admin", testEdgeFunctionRejectsNonAdmin],
  ["platformApi prefers edge function", testSourceWiresEdgeFunctionFirst],
  ["founding storefront seeds include 6 partners", testFoundingStorefrontSeeds],
  ["business portal products/payouts wired", testBusinessPortalTabsWired],
  ["moderation queues seeded and wired", testModerationSeedsAndWiring],
];

let failed = 0;
for (const [name, fn] of tests) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}`);
    console.error(error);
  }
}

if (failed) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log(`\n${tests.length} test(s) passed`);
