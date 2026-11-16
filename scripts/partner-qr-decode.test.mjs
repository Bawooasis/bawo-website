/**
 * Generates partner-kit QR PNGs with the same settings as src/directory/qr.ts
 * and asserts jsQR decodes each back to the exact displayed URL.
 */
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { PNG } from "pngjs";

const require = createRequire(import.meta.url);
const QRCode = require("qrcode");
const jsQR = require("jsqr");

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "tmp/partner-qr-verify");
mkdirSync(outDir, { recursive: true });

/** Must stay in sync with PARTNER_QR_OPTIONS in src/directory/qr.ts */
const PARTNER_QR_OPTIONS = {
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: "#000000", light: "#FFFFFF" },
};

function partnerRefUrl(code) {
  return `https://www.joinbawo.com/nyc?ref=${code}`;
}

/** URLs shown under QR in /partners tabs + Business Portal Partner link. */
const CASES = [
  { label: "partners-promoters", code: "BAWO-PROMO-DEMO", width: 280 },
  { label: "partners-venues", code: "BAWO-VENUE-DEMO", width: 280 },
  { label: "partners-campus", code: "BAWO-CAMPUS-DEMO", width: 280 },
  { label: "portal-partner-link-png", code: "BAWO-PENDING", width: 512 },
  { label: "portal-partner-link-svg-matrix", code: "BAWO-PENDING", width: 512 },
];

async function decodePngBuffer(buffer, label) {
  const png = PNG.sync.read(buffer);
  const result = jsQR(
    new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.byteLength),
    png.width,
    png.height,
    { inversionAttempts: "dontInvert" },
  );
  assert.ok(result, `${label}: jsQR could not decode PNG (${png.width}x${png.height})`);
  return result.data;
}

const report = [];

for (const testCase of CASES) {
  const expected = partnerRefUrl(testCase.code);

  const pngBuffer = await QRCode.toBuffer(expected, {
    ...PARTNER_QR_OPTIONS,
    width: testCase.width,
    type: "png",
  });

  const pngPath = join(outDir, `${testCase.label}.png`);
  writeFileSync(pngPath, pngBuffer);

  const decoded = await decodePngBuffer(pngBuffer, testCase.label);
  assert.equal(
    decoded,
    expected,
    `${testCase.label}: decoded "${decoded}" !== expected "${expected}"`,
  );

  // SVG download uses the same payload + ECC/margin; assert generation + PNG twin.
  if (testCase.label.includes("svg")) {
    const svg = await QRCode.toString(expected, {
      ...PARTNER_QR_OPTIONS,
      type: "svg",
      width: testCase.width,
    });
    assert.match(svg, /^<svg[\s\S]*<\/svg>\s*$/);
    assert.ok(svg.includes('viewBox') || svg.includes("<path") || svg.includes("<rect"));
    const svgPath = join(outDir, `${testCase.label}.svg`);
    writeFileSync(svgPath, svg);
    report.push({
      label: testCase.label,
      expected,
      decoded,
      width: testCase.width,
      ecc: PARTNER_QR_OPTIONS.errorCorrectionLevel,
      margin: PARTNER_QR_OPTIONS.margin,
      png: pngPath,
      svg: svgPath,
      ok: true,
    });
  } else {
    report.push({
      label: testCase.label,
      expected,
      decoded,
      width: testCase.width,
      ecc: PARTNER_QR_OPTIONS.errorCorrectionLevel,
      margin: PARTNER_QR_OPTIONS.margin,
      png: pngPath,
      ok: true,
    });
  }

  console.log(`PASS ${testCase.label}`);
  console.log(`  expected: ${expected}`);
  console.log(`  decoded:  ${decoded}`);
}

const reportPath = join(outDir, "decode-report.json");
writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nAll ${report.length} partner QR payloads decoded OK.`);
console.log(`Report: ${reportPath}`);
