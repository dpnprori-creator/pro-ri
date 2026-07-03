#!/usr/bin/env node
/**
 * SPLIT WILAYAH INDONESIA → PER PROVINSI
 * Menghasilkan file SQL kecil per provinsi (bukan 1 file besar 4MB)
 * agar bisa di-copy paste ke Supabase SQL Editor (ada limit ukuran)
 *
 * Cara pakai:
 *   node scripts/split-wilayah-sql.mjs
 *
 * Output: supabase/migrations/wilayah/
 *   00_provinces.sql          — Semua provinsi
 *   01_aceh.sql               — Aceh
 *   02_sumatera-utara.sql     — Sumatera Utara
 *   ... (per provinsi)
 *   38_papua-barat-daya.sql   — Papua Barat Daya
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, "..");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "supabase", "migrations", "wilayah");
const SQL_URL = "https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah.sql";
const TEMP_FILE = path.join(PROJECT_ROOT, "scripts", ".temp_wilayah.sql");

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

function provCodeFromKode(kode) {
  // "11.01" → "11", "11.71.01" → "11", etc.
  return kode.split(".")[0];
}

/** Slugify province name for filename */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================
// STEP 1: Download & Parse
// ============================================
function downloadFile() {
  console.log("📥 Download data dari cahyadsn/wilayah...");
  execSync(`curl -sL "${SQL_URL}" -o "${TEMP_FILE}" 2>&1`, { timeout: 120000, stdio: "pipe" });
  const stats = fs.statSync(TEMP_FILE);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`   ✅ ${sizeMB} MB downloaded`);
}

function parseFile() {
  const content = fs.readFileSync(TEMP_FILE, "utf-8");
  console.log("🔍 Parsing data...");

  const insertStart = content.indexOf("INSERT INTO wilayah");
  if (insertStart === -1) throw new Error("INSERT INTO wilayah not found");
  const insertEnd = content.lastIndexOf(";");
  if (insertEnd === -1 || insertEnd <= insertStart) throw new Error("No semicolon");

  const valuesBlock = content.substring(insertStart, insertEnd + 1);
  const rows = [];
  let startPos = valuesBlock.indexOf("VALUES");
  if (startPos === -1) throw new Error("VALUES keyword not found");
  startPos += 6;

  let i = startPos;
  while (i < valuesBlock.length) {
    while (i < valuesBlock.length && valuesBlock[i] !== "(") i++;
    if (i >= valuesBlock.length) break;
    i++;
    let current = "";
    while (i < valuesBlock.length && valuesBlock[i] !== ")") {
      current += valuesBlock[i];
      i++;
    }
    if (i >= valuesBlock.length) break;
    i++;
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
      // skip
    } else if (inQuote) {
      current += ch;
    }
  }
  return result;
}

// ============================================
// STEP 2: Group by level & province
// ============================================
function groupByLevelAndProvince(rows) {
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

  // Build province lookup by code
  const provMap = {};
  for (const p of grouped.provinces) {
    provMap[p.kode] = p.nama;
  }

  // Group regencies by province code
  const regByProv = {};
  for (const r of grouped.regencies) {
    const pc = provCodeFromKode(r.kode);
    if (!regByProv[pc]) regByProv[pc] = [];
    regByProv[pc].push(r);
  }

  // Group districts by province code
  const distByProv = {};
  for (const d of grouped.districts) {
    const pc = provCodeFromKode(d.kode);
    if (!distByProv[pc]) distByProv[pc] = [];
    distByProv[pc].push(d);
  }

  // Group villages by province code
  const villByProv = {};
  for (const v of grouped.villages) {
    const pc = provCodeFromKode(v.kode);
    if (!villByProv[pc]) villByProv[pc] = [];
    villByProv[pc].push(v);
  }

  return {
    provinces: grouped.provinces,
    regByProv,
    distByProv,
    villByProv,
    provMap,
  };
}

// ============================================
// STEP 3: Generate base provinces file
// ============================================
function generateProvincesSQL(provinces) {
  const lines = [
    "-- ================================================",
    "-- PROVINSI INDONESIA",
    "-- Sumber: cahyadsn/wilayah (Kepmendagri)",
    "-- ================================================",
    "-- !!! JALANKAN FILE INI PERTAMA !!!",
    "-- Lalu jalankan file per-provinsi (01_*.sql - 38_*.sql)",
    "-- ================================================",
    "",
    "-- PROVINCES --",
    "INSERT INTO provinces (code, name) VALUES",
    provinces.map(p => `  (${sqlStr(p.kode)}, ${sqlStr(p.nama)})`).join(",\n"),
    "ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;",
    "",
    `-- ${provinces.length} provinces`,
    "-- ✅ SELESAI",
  ];
  return lines.join("\n");
}

// ============================================
// STEP 4: Generate per-province SQL
// ============================================
function generateProvinceSQL(provCode, provName, regencies, districts, villages) {
  const lines = [
    `-- ================================================`,
    `-- ${provName.toUpperCase()} (${provCode})`,
    `-- ${regencies.length} kab/kota, ${districts.length} kec, ${villages.length} desa/kel`,
    `-- ================================================`,
    `-- Wajib: jalankan 00_provinces.sql dulu!`,
    `-- ================================================`,
    ``,
  ];

  // === REGENCIES ===
  if (regencies.length > 0) {
    lines.push(`-- ${provName} — Kabupaten/Kota --`);
    const values = regencies.map(r =>
      `    (${sqlStr(r.kode)}, ${sqlStr(r.nama)}, ${sqlStr(r.kode.substring(0, 2))})`
    );

    for (let i = 0; i < values.length; i += 500) {
      const batch = values.slice(i, i + 500);
      lines.push("INSERT INTO regencies (province_id, code, name)");
      lines.push("SELECT p.id, v.code, v.name FROM (VALUES");
      lines.push(batch.join(",\n"));
      lines.push(") AS v(code, name, prov_code) JOIN provinces p ON p.code = v.prov_code");
      lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
    }
  }

  // === DISTRICTS ===
  if (districts.length > 0) {
    lines.push(`-- ${provName} — Kecamatan --`);
    const values = districts.map(d =>
      `    (${sqlStr(d.kode)}, ${sqlStr(d.nama)}, ${sqlStr(parentCode(d.kode))})`
    );

    for (let i = 0; i < values.length; i += 500) {
      const batch = values.slice(i, i + 500);
      lines.push("INSERT INTO districts (regency_id, code, name)");
      lines.push("SELECT r.id, v.code, v.name FROM (VALUES");
      lines.push(batch.join(",\n"));
      lines.push(") AS v(code, name, reg_code) JOIN regencies r ON r.code = v.reg_code");
      lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
    }
  }

  // === VILLAGES ===
  if (villages.length > 0) {
    lines.push(`-- ${provName} — Desa/Kelurahan --`);
    const values = villages.map(v =>
      `    (${sqlStr(v.kode)}, ${sqlStr(v.nama)}, ${sqlStr(parentCode(v.kode))})`
    );

    for (let i = 0; i < values.length; i += 500) {
      const batch = values.slice(i, i + 500);
      lines.push("INSERT INTO villages (district_id, code, name)");
      lines.push("SELECT d.id, v.code, v.name FROM (VALUES");
      lines.push(batch.join(",\n"));
      lines.push(") AS v(code, name, dist_code) JOIN districts d ON d.code = v.dist_code");
      lines.push("ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;\n");
    }
  }

  lines.push(`-- ✅ ${provName.toUpperCase()} SELESAI --`);

  return lines.join("\n");
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log("╔══════════════════════════════════════╗");
  console.log("║  SPLIT WILAYAH INDONESIA PER PROV    ║");
  console.log("╚══════════════════════════════════════╝\n");

  const start = Date.now();

  try {
    // Download & parse
    downloadFile();
    const rows = parseFile();
    console.log(`   ${rows.length.toLocaleString()} total rows parsed\n`);

    // Group by level and province
    const data = groupByLevelAndProvince(rows);

    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // === Generate 00_provinces.sql ===
    console.log("📄 Generating 00_provinces.sql...");
    const provSQL = generateProvincesSQL(data.provinces);
    fs.writeFileSync(path.join(OUTPUT_DIR, "00_provinces.sql"), provSQL, "utf-8");
    const provSize = (provSQL.length / 1024).toFixed(1);
    console.log(`   ✅ ${provSize} KB\n`);

    // === Generate per-province files ===
    let fileIndex = 0;
    const provCodes = Object.keys(data.regByProv).sort();

    for (const pc of provCodes) {
      fileIndex++;
      const provName = data.provMap[pc] || `Provinsi ${pc}`;
      const regencies = data.regByProv[pc] || [];
      const districts = data.distByProv[pc] || [];
      const villages = data.villByProv[pc] || [];

      const filename = `${String(fileIndex).padStart(2, "0")}_${slugify(provName)}.sql`;
      const filepath = path.join(OUTPUT_DIR, filename);

      const sql = generateProvinceSQL(pc, provName, regencies, districts, villages);
      fs.writeFileSync(filepath, sql, "utf-8");

      const fileSize = (sql.length / 1024).toFixed(1);
      console.log(`   📄 ${filename} — ${regencies.length} kab, ${districts.length} kec, ${villages.length} desa (${fileSize} KB)`);
    }

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`\n✅ SELESAI! ${fileIndex} file dihasilkan dalam ${elapsed}s`);
    console.log(`📁 ${OUTPUT_DIR}`);
    console.log("\n📋 Cara pakai:");
    console.log("   1. Buka Supabase Dashboard → SQL Editor");
    console.log("   2. Copy-paste & jalankan 00_provinces.sql dulu");
    console.log("   3. Lalu jalankan file per-provinsi (01_*.sql - 38_*.sql)");
    console.log("      Urutan tidak masalah, karena pakai ON CONFLICT.");
  } catch (err) {
    console.error("\n❌ ERROR:", err.message);
    process.exit(1);
  } finally {
    try { fs.unlinkSync(TEMP_FILE); } catch (e) { /* ignore */ }
  }
}

main();
