import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(root, "src/portal/events/eventStatus.ts");
const source = readFileSync(sourcePath, "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    esModuleInterop: true,
  },
});

const modulePath = join(root, "scripts/.events-status.generated.cjs");
import { writeFileSync, unlinkSync } from "node:fs";
writeFileSync(modulePath, outputText);
const require = createRequire(import.meta.url);
const {
  panelStatusFromDb,
  parseTagsInput,
  fromNyDatetimeLocal,
  toNyDatetimeLocal,
} = require(modulePath);

assert.equal(panelStatusFromDb("approved", "approved"), "published");
assert.equal(panelStatusFromDb("active", "approved"), "published");
assert.equal(panelStatusFromDb("draft", "pending"), "draft");
assert.equal(panelStatusFromDb("hidden", "approved"), "hidden");
assert.equal(panelStatusFromDb("expired", "approved"), "expired");
assert.equal(panelStatusFromDb("rejected", "rejected"), "hidden");

assert.deepEqual(parseTagsInput("Diaspora, Nightlife #nyc"), [
  "diaspora",
  "nightlife",
  "nyc",
]);

const local = "2026-11-15T20:30";
const iso = fromNyDatetimeLocal(local);
assert.ok(iso && !Number.isNaN(Date.parse(iso)));
assert.equal(toNyDatetimeLocal(iso), local);

unlinkSync(modulePath);
console.log("events-manager-status.test.mjs: ok");
