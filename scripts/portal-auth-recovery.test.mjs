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

const tests = [
  ["edge function validates empty body", testEdgeFunctionValidation],
  ["edge function rejects non-admin", testEdgeFunctionRejectsNonAdmin],
  ["platformApi prefers edge function", testSourceWiresEdgeFunctionFirst],
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
