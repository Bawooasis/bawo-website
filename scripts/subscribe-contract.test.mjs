/**
 * Contract checks for shared Mailchimp subscribe core (no real Mailchimp calls).
 */
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Assert shared source contracts + exercise a tiny JS mirror of early returns.
const require = createRequire(import.meta.url);
const fs = require("node:fs");
const corePath = join(root, "api/_lib/subscribeCore.ts");
const vercelPath = join(root, "api/subscribe.ts");
const netlifyPath = join(root, "netlify/functions/subscribe.ts");

for (const file of [corePath, vercelPath, netlifyPath]) {
  assert.ok(fs.existsSync(file), `missing ${file}`);
}

const core = fs.readFileSync(corePath, "utf8");
assert.match(core, /Method not allowed/);
assert.match(core, /Email is required/);
assert.match(core, /Server configuration error/);
assert.match(core, /Subscription failed\. Please try again\./);
assert.match(core, /status_if_new:\s*"subscribed"/);

const vercel = fs.readFileSync(vercelPath, "utf8");
assert.match(vercel, /runSubscribe/);
assert.match(vercel, /MAILCHIMP_API_KEY/);
assert.match(vercel, /MAILCHIMP_SERVER/);
assert.match(vercel, /MAILCHIMP_AUDIENCE_ID/);

const netlify = fs.readFileSync(netlifyPath, "utf8");
assert.match(netlify, /runSubscribe/);
assert.match(netlify, /MAILCHIMP_API_KEY/);
assert.match(netlify, /Netlify\.env\.get/);

/** Early-return mirror of runSubscribe for offline contract checks */
function early(method, email, envReady) {
  if (method !== "POST") return { status: 405, body: { error: "Method not allowed" } };
  if (!envReady) return { status: 500, body: { error: "Server configuration error" } };
  if (!email || typeof email !== "string") {
    return { status: 400, body: { error: "Email is required" } };
  }
  return null;
}

assert.deepEqual(early("GET", "x", true), {
  status: 405,
  body: { error: "Method not allowed" },
});
assert.deepEqual(early("POST", "not-an-email", false), {
  status: 500,
  body: { error: "Server configuration error" },
});
assert.deepEqual(early("POST", undefined, true), {
  status: 400,
  body: { error: "Email is required" },
});
assert.equal(early("POST", "not-an-email", true), null);

console.log("subscribe-contract.test.mjs: ok");
