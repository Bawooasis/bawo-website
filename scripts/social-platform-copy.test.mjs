import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(
  join(root, "src/portal/social/platformCopy.ts"),
  "utf8",
);

/** Lightweight parse of exported constants from the TS module text. */
function readLimits() {
  const match = source.match(
    /export const PLATFORM_LIMITS[^=]*=\s*\{([^}]+)\}/s,
  );
  assert.ok(match, "PLATFORM_LIMITS export missing");
  const limits = {};
  for (const line of match[1].split(",")) {
    const pair = line.trim().match(/([\w_]+)\s*:\s*(\d+)/);
    if (pair) limits[pair[1]] = Number(pair[2]);
  }
  return limits;
}

function truncate(text, limit) {
  if (text.length <= limit) return { visible: text, truncated: false };
  return { visible: `${text.slice(0, limit).trimEnd()}…`, truncated: true };
}

const soft = {
  instagram_feed: 125,
  instagram_reel: 90,
  tiktok: 100,
  linkedin: 140,
  x: 280,
  facebook: 125,
};

const limits = readLimits();
assert.equal(limits.instagram_feed, 2200);
assert.equal(limits.tiktok, 4000);
assert.equal(limits.x, 280);
assert.equal(limits.linkedin, 3000);

const long =
  "When the pot comes off the fire, the whole block already knows. Tag the cousin who brings the best plantain and save this for Sunday. #BawoSocial #NYCNaija";

for (const [platform, softLimit] of Object.entries(soft)) {
  const result = truncate(long, softLimit);
  assert.equal(result.truncated, long.length > softLimit);
  assert.ok(result.visible.length <= softLimit + 1);
}

const tags = long.match(/#[\w]+/g) || [];
assert.deepEqual(tags, ["#BawoSocial", "#NYCNaija"]);

const ny = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
}).format(new Date("2026-11-04T18:00:00.000Z"));
assert.match(ny, /2026/);

console.log("social-platform-copy.test.mjs: ok");
void require;
