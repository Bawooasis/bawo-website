/**
 * Offline policy inventory for partner RLS migrations (no DB apply).
 * Asserts expected policy / view / function / trigger names are present.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rls = readFileSync(
  join(root, "supabase/migrations/20261119_partner_rls.sql"),
  "utf8",
);
const seed = readFileSync(
  join(root, "supabase/migrations/20261119_partner_house_codes_seed.sql"),
  "utf8",
);
const checkSql = readFileSync(
  join(root, "scripts/check-partner-rls.sql"),
  "utf8",
);

const expected = {
  partner_profiles: [
    "partner_profiles_select_own",
    "partner_profiles_admin_insert",
    "partner_profiles_admin_update",
    "partner_profiles_admin_delete",
  ],
  partner_link_events: [
    "partner_link_events_select_own",
    "partner_link_events_admin_write",
  ],
  partner_applications: [
    "partner_applications_anon_insert",
    "partner_applications_admin_select",
    "partner_applications_admin_update",
  ],
};

assert.match(rls, /enable row level security/i);
assert.match(rls, /partner_public_profiles/);
assert.match(rls, /record_partner_link_event/);
assert.match(rls, /is_current_user_admin\(\)/);
assert.match(rls, /trg_guard_user_attribution_columns/);
assert.match(rls, /signup_source/);
assert.match(rls, /partner_ref/);
assert.match(rls, /first_activated_at/);
assert.match(rls, /week4_retained/);

for (const [table, policies] of Object.entries(expected)) {
  console.log(`\n${table}`);
  for (const policy of policies) {
    assert.match(rls, new RegExp(`policy ${policy}`));
    console.log(`  - ${policy}`);
  }
}

console.log("\nextras");
console.log("  - view partner_public_profiles (approved code/type/org)");
console.log("  - function record_partner_link_event (anon click insert)");
console.log("  - trigger trg_guard_user_attribution_columns on users");

for (const code of ["PRM-P8Y7R2EP", "VEN-Y0FDJB9F", "STU-W1HK44BA"]) {
  assert.match(seed, new RegExp(code));
}
assert.match(checkSql, /pg_policies/);

console.log("\ncheck-partner-rls.mjs: ok");
