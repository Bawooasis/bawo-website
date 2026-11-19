#!/usr/bin/env node
/**
 * Generate unique, readable partner codes for public.partner_profiles.
 *
 * Usage:
 *   node scripts/generate-partner-code.mjs --type promoter
 *   node scripts/generate-partner-code.mjs --type venue --type student_society --count 1
 *   node scripts/generate-partner-code.mjs --house --sql
 *
 * Alphabet: Crockford base32 without I L O U (ambiguous).
 * Prefixes: PRM- / VEN- / STU-
 */
import { randomInt } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(root, "src/directory/partnerCodes.ts");

/** Crockford base32 minus ambiguous I, L, O, U */
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

const TYPE_PREFIX = {
  promoter: "PRM",
  venue: "VEN",
  student_society: "STU",
};

const TYPE_LABEL = {
  promoter: "Promoters & DJs",
  venue: "Restaurants / salons / stores",
  student_society: "Student & alumni societies",
};

function parseArgs(argv) {
  const types = [];
  let count = 1;
  let sql = false;
  let house = false;
  let writeConfig = false;
  let length = 8;
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--type" && argv[i + 1]) {
      types.push(argv[++i]);
    } else if (arg === "--count" && argv[i + 1]) {
      count = Number(argv[++i]);
    } else if (arg === "--length" && argv[i + 1]) {
      length = Number(argv[++i]);
    } else if (arg === "--sql") {
      sql = true;
    } else if (arg === "--house") {
      house = true;
    } else if (arg === "--write-config") {
      writeConfig = true;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  if (house) {
    return {
      types: ["promoter", "venue", "student_society"],
      count: 1,
      sql: true,
      house: true,
      writeConfig,
      length,
    };
  }
  if (!types.length) types.push("promoter");
  return { types, count, sql, house, writeConfig, length };
}

function printHelp() {
  console.log(`generate-partner-code.mjs

Options:
  --type <promoter|venue|student_society>   Partner type (repeatable)
  --count <n>                               Codes per type (default 1)
  --length <n>                              Random segment length (default 8)
  --house                                   One BawoSocial house code per kit + SQL
  --sql                                     Print SQL inserts for partner_profiles
  --write-config                            Write src/directory/partnerCodes.ts
`);
}

function randomSegment(length) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[randomInt(ALPHABET.length)];
  }
  return out;
}

function loadExistingCodes() {
  const existing = new Set();
  if (existsSync(CONFIG_PATH)) {
    const text = readFileSync(CONFIG_PATH, "utf8");
    for (const match of text.matchAll(/code:\s*"([A-Z0-9-]+)"/g)) {
      existing.add(match[1]);
    }
  }
  return existing;
}

function generateCode(type, length, existing) {
  const prefix = TYPE_PREFIX[type];
  if (!prefix) {
    throw new Error(`Unknown partner type: ${type}`);
  }
  for (let attempt = 0; attempt < 64; attempt++) {
    const code = `${prefix}-${randomSegment(length)}`;
    if (!existing.has(code)) {
      existing.add(code);
      return code;
    }
  }
  throw new Error(`Could not generate unique code for ${type}`);
}

function sqlInsert(row) {
  const sampleLink = partnerRefUrl(row.code, row.partner_type);
  return `insert into public.partner_profiles (
  id,
  code,
  partner_type,
  organization_name,
  contact_name,
  contact_email,
  status,
  sample_link,
  notes,
  reviewed_at
) values (
  '${row.id}'::uuid,
  '${row.code}',
  '${row.partner_type}',
  '${row.organization_name.replace(/'/g, "''")}',
  '${row.contact_name.replace(/'/g, "''")}',
  '${row.contact_email.replace(/'/g, "''")}',
  'approved',
  '${sampleLink.replace(/'/g, "''")}',
  '${(row.notes || "").replace(/'/g, "''")}',
  now()
) on conflict (code) do update set
  partner_type = excluded.partner_type,
  organization_name = excluded.organization_name,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  status = excluded.status,
  sample_link = excluded.sample_link,
  notes = excluded.notes,
  updated_at = now();`;
}

function partnerRefUrl(code, partnerType) {
  const campaign =
    partnerType === "promoter"
      ? "partner_promoter"
      : partnerType === "venue"
        ? "partner_venue"
        : "partner_student";
  const params = new URLSearchParams({
    utm_source: "partner",
    utm_medium: "qr",
    utm_campaign: campaign,
    ref: code,
  });
  return `https://www.joinbawo.com/nyc?${params.toString()}`;
}

function randomUuid() {
  // RFC4122-ish via crypto random — fine for seed file ids
  const hex = [...Array(16)]
    .map(() => randomInt(256).toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function writePartnerCodesConfig(rows) {
  const body = `/**
 * House partner codes for /partners kit previews.
 * Generated by scripts/generate-partner-code.mjs — source of truth until
 * public.partner_profiles is live and the UI reads approved rows from Supabase.
 */
import type { PartnerApplicantType } from "./types";

export type HousePartnerCode = {
  id: string;
  code: string;
  partnerType: PartnerApplicantType;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  label: string;
};

export const HOUSE_PARTNER_CODES: Record<PartnerApplicantType, HousePartnerCode> = {
${rows
  .map(
    (row) => `  ${row.partner_type}: {
    id: "${row.id}",
    code: "${row.code}",
    partnerType: "${row.partner_type}",
    organizationName: "${row.organization_name}",
    contactName: "${row.contact_name}",
    contactEmail: "${row.contact_email}",
    label: "${TYPE_LABEL[row.partner_type]}",
  },`,
  )
  .join("\n")}
};

export function houseCodeFor(type: PartnerApplicantType): HousePartnerCode {
  return HOUSE_PARTNER_CODES[type];
}

export const ALL_HOUSE_PARTNER_CODES = Object.values(HOUSE_PARTNER_CODES);
`;
  writeFileSync(CONFIG_PATH, body, "utf8");
  console.error(`Wrote ${CONFIG_PATH}`);
}

function main() {
  const opts = parseArgs(process.argv);
  const existing = loadExistingCodes();
  const rows = [];

  for (const type of opts.types) {
    for (let i = 0; i < opts.count; i++) {
      const code = generateCode(type, opts.length, existing);
      const row = {
        id: randomUuid(),
        code,
        partner_type: type,
        organization_name: "BawoSocial",
        contact_name: "Alexander",
        contact_email: "hello@joinbawo.com",
        notes: opts.house
          ? `BawoSocial house kit code for ${TYPE_LABEL[type]}`
          : `Generated ${new Date().toISOString()}`,
      };
      rows.push(row);
      console.log(`${type}\t${code}`);
    }
  }

  if (opts.sql) {
    console.log("\n-- SQL inserts for public.partner_profiles");
    for (const row of rows) {
      console.log(sqlInsert(row));
      console.log("");
    }
  }

  if (opts.writeConfig) {
    if (rows.length !== 3 || !opts.house) {
      console.error("--write-config expects --house (one code per kit type)");
      process.exit(1);
    }
    writePartnerCodesConfig(rows);
  }

  // Machine-readable summary for piping
  console.error(JSON.stringify({ codes: rows.map((r) => ({ type: r.partner_type, code: r.code, id: r.id })) }));
}

main();
