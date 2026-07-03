#!/usr/bin/env node
/**
 * IMPORT DATA WILAYAH INDONESIA LENGKAP
 * cahyadsn/wilayah (MySQL) → PRO RI Schema
 *
 * Strategi:
 * 1. Download wilayah.sql (MySQL) ke temp file
 * 2. Parse dari file lokal (tidak timeout)
 * 3. Generate SQL insert untuk provinces, regencies, districts, villages
 * 4. Normalisasi format kode: XX, XX.XX, XX.XX.XX, XX.XX.XX.XXXX
 *
 * Cara pakai:
 *   node scripts/import-wilayah-data.mjs
 * Output: supabase/migrations/wilayah_indonesia_lengkap.sql
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_FILE = path.join(PROJECT_ROOT, "supabase", "migrations", "wilayah_indonesia_lengkap.sql");
const SQL_URL = "https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah.sql";
const TEMP_FILE = path.join(PROJECT_ROOT, "scripts", ".temp_wilayah.sql");
const BATCH_SIZE = 2000;

// ============================================
// HELPERS
// ============================================
function sqlStr(val) {
  if (val === null || val === undefined) return "NULL";
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function parentCode(kode) {
  const parts = kode.split(".");
  if (parts.length <= 1) return "";
  return parts.slice(0, -1).join(".");
}

// ============================================
// STEP 1: Download file
// ============================================
function downloadFile() {
  console.log("📥 Download data dari cahyadsn/wilayah...");
  // Use node fetch or curl -L to download
  execSync(`curl -sL "${SQL_URL}" -o "${TEMP_FILE}" 2>&1`, { timeout: 120000, stdio: "pipe" });
  const stats = fs.statSync(TEMP_FILE);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`   ✅ ${sizeMB} MB downloaded -> ${TEMP_FILE}`);
}

// ============================================
// STEP 2: Parse file
// ============================================
function parseFile() {
  const content = fs.readFileSync(TEMP_FILE, "utf-8");
  console.log("🔍 Parsing data...");

  // Find the single INSERT INTO wilayah statement
  // Format: INSERT INTO wilayah (kode, nama) VALUES ('11','Aceh'),('11.01','...'),...;
  const insertStart = content.indexOf("INSERT INTO wilayah");
  if (insertStart === -1) throw new Error("INSERT INTO wilayah not found in downloaded file");

  // Cari semicolon TERAKHIR (INSERT statement adalah statement terakhir di file)
  const insertEnd = content.lastIndexOf(";");
  if (insertEnd === -1 || insertEnd <= insertStart) throw new Error("No semicolon after INSERT statement");

  const valuesBlock = content.substring(insertStart, insertEnd + 1);

  // Extract all value groups: ('code','name') using manual char-by-char parsing
  const rows = [];
  let startPos = valuesBlock.indexOf("VALUES");
  if (startPos === -1) throw new Error("VALUES keyword not found");
  startPos += 6; // skip "VALUES"

  let i = startPos;
  while (i < valuesBlock.length) {
    // Skip to next opening paren
    while (i < valuesBlock.length && valuesBlock[i] !== "(") i++;
    if (i >= valuesBlock.length) break;
    i++; // skip '('

    let current = "";
    // Read until closing paren, respecting nested parens (shouldn't happen but be safe)
    while (i < valuesBlock.length && valuesBlock[i] !== ")") {
      current += valuesBlock[i];
      i++;
    }
    if (i >= valuesBlock.length) break;
    i++; // skip ')'

    // Parse the two values inside: 'code','name'
    const vals = parseQuotedValues(current);
    if (vals.length >= 2 && vals[0] && vals[1]) {
      rows.push({ kode: vals[0], nama: vals[1] });
    }
  }

  return rows;
}

function parseQuotedValues(str) {
  const result = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "'" && !inQuote) {
      inQuote = true;
      current = "";
    } else if (ch === "'" && inQuote) {
      if (i + 1 < str.length && str[i + 1] === "'") {
        current += "'";
        i++;
      } else {
        result.push(current);
        inQuote = false;
        current = "";
      }
    } else if (ch === "," && !inQuote) {
      // skip - values separated by commas
    } else if (!inQuote && ch !== " ") {
      // unquoted value (shouldn't happen for this dataset but handle it)
      result.push(ch);
    } else if (inQuote) {
      current += ch;
    }
  }
  return result;
}

// ============================================
// STEP 3: Group by level
// ============================================
function groupByLevel(rows) {
  console.log("📊 Mengelompokkan berdasarkan level...");
  const grouped = { provinces: [], regencies: [], districts: [], villages: [] };
  let unknown = 0;

  for (const row of rows) {
    const raw = row.kode.replace(/\./g, "");
    const len = raw.length;

    if (len === 2) {
      grouped.provinces.push(row);
    } else if (len === 4) {
      grouped.regencies.push(row);
    } else if (len === 6) {
      grouped.districts.push(row);
    } else if (len >= 7 && len <= 13) {
      grouped.villages.push(row);
    } else {
      unknown++;
    }
  }

  console.log(`   🏛️  ${grouped.provinces.length} provinces`);
  console.log(`   🏙️  ${grouped.regencies.length} regencies`);
  console.log(`   📍  ${grouped.districts.length} districts`);
  console.log(`   🏘️  ${grouped.villages.length} villages`);
  if (unknown > 0) console.log(`   ❓ ${unknown} unknown`);

  return grouped;
}

// ============================================
// STEP 4: Generate SQL
// ============================================
function generateSQL(grouped) {
  console.log("⚙️  Generating SQL...");
  const total = grouped.provinces.length + grouped.regencies.length + grouped.districts.length + grouped.villages.length;
  const lines = [];

  // Header
  lines.push("-- ================================================");
  lines.push("-- DATA WILAYAH INDONESIA LENGKAP");
  lines.push("-- Sumber: cahyadsn/wilayah (Kepmendagri)");
  lines.push("-- Format kode: XX, XX.XX, XX.XX.XX, XX.XX.XX.XXXX");
  lines.push(`-- ${grouped.provinces.length} prov, ${grouped.regencies.length} kab/kota,`);
  lines.push(`-- ${grouped.districts.length} kec, ${grouped.villages.length} desa/kel`);
  lines.push("-- ================================================");
  lines.push("");

  // === PROVINCES ===
  lines.push("-- PROVINCES --");
  for (let i = 0; i < grouped.provinces.length; i += BATCH_SIZE) {
    const batch = grouped.provinces.slice(i, i + BATCH_SIZE);
    lines.push("INSERT INTO provinces (code, name) VALUES");
    lines.push(batch.map(p => `  (${sqlStr(p.kode)}, ${sqlStr(p.nama)})`).join(",\n"));
    lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
  }

  // === REGENCIES ===
  lines.push("-- REGENCIES --");
  for (let i = 0; i < grouped.regencies.length; i += BATCH_SIZE) {
    const batch = grouped.regencies.slice(i, i + BATCH_SIZE);
    const values = batch.map(r => `    (${sqlStr(r.kode)}, ${sqlStr(r.nama)}, ${sqlStr(r.kode.substring(0, 2))})`);
    lines.push("INSERT INTO regencies (province_id, code, name)");
    lines.push("SELECT p.id, v.code, v.name FROM (VALUES");
    lines.push(values.join(",\n"));
    lines.push(") AS v(code, name, prov_code) JOIN provinces p ON p.code = v.prov_code");
    lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
  }

  // === DISTRICTS ===
  lines.push("-- DISTRICTS --");
  for (let i = 0; i < grouped.districts.length; i += BATCH_SIZE) {
    const batch = grouped.districts.slice(i, i + BATCH_SIZE);
    const values = batch.map(d => `    (${sqlStr(d.kode)}, ${sqlStr(d.nama)}, ${sqlStr(parentCode(d.kode))})`);
    lines.push("INSERT INTO districts (regency_id, code, name)");
    lines.push("SELECT r.id, v.code, v.name FROM (VALUES");
    lines.push(values.join(",\n"));
    lines.push(") AS v(code, name, reg_code) JOIN regencies r ON r.code = v.reg_code");
    lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
  }

  // === VILLAGES ===
  lines.push("-- VILLAGES --");
  for (let i = 0; i < grouped.villages.length; i += BATCH_SIZE) {
    const batch = grouped.villages.slice(i, i + BATCH_SIZE);
    const values = batch.map(v => `    (${sqlStr(v.kode)}, ${sqlStr(v.nama)}, ${sqlStr(parentCode(v.kode))})`);
    lines.push("INSERT INTO villages (district_id, code, name)");
    lines.push("SELECT d.id, v.code, v.name FROM (VALUES");
    lines.push(values.join(",\n"));
    lines.push(") AS v(code, name, dist_code) JOIN districts d ON d.code = v.dist_code");
    lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
  }

  // Footer
  lines.push("-- ================================================");
  lines.push("-- ✅ SELESAI");
  lines.push(`-- ${grouped.provinces.length} provinces`);
  lines.push(`-- ${grouped.regencies.length} regencies`);
  lines.push(`-- ${grouped.districts.length} districts`);
  lines.push(`-- ${grouped.villages.length} villages`);
  lines.push("-- ================================================");

  return lines.join("\n");
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║  IMPORT WILAYAH INDONESIA LENGKAP    ║");
  console.log("╚══════════════════════════════════════╝\n");

  const start = Date.now();

  try {
    downloadFile();
    const rows = parseFile();
    console.log(`   ${rows.length.toLocaleString()} total baris terparsing`);
    const grouped = groupByLevel(rows);
    const sql = generateSQL(grouped);
    fs.writeFileSync(OUTPUT_FILE, sql, "utf-8");
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const fileSizeMB = (sql.length / 1024 / 1024).toFixed(2);

    console.log(`\n📄 ${OUTPUT_FILE}`);
    console.log(`   ${fileSizeMB} MB, ${elapsed}s`);
    console.log("\n✅ SELESAI!");
    console.log("\n📋 Jalankan di VPS:");
    console.log("   psql -h <host> -d <db> -f supabase/migrations/wilayah_indonesia_lengkap.sql");
    console.log("\n📋 Atau copy-paste ke Supabase SQL Editor");
  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    process.exit(1);
  } finally {
    // Cleanup temp file
    try { fs.unlinkSync(TEMP_FILE); } catch (e) { /* ignore */ }
  }
}

main();
