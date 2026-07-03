#!/usr/bin/env node
/**
 * Seed regencies via Supabase REST API (no direct psql needed)
 * Reads seed_regencies.sql logic and executes via Supabase client
 *
 * Usage: node scripts/run-seed-regencies.mjs
 *
 * After run, DELETE THIS FILE or remove the credentials!
 * (to avoid committing passwords to git)
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_FILE = path.join(__dirname, "..", "supabase", "migrations", "seed_regencies.sql");

// 🔐 Ambil dari environment variable — jangan hardcode!
// export SUPABASE_URL="https://srv1796225.hstgr.cloud"
// export SERVICE_KEY="<your-service-role-key>"
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SERVICE_KEY = process.env.SERVICE_KEY || "";

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Set SUPABASE_URL dan SERVICE_KEY environment variables");
  console.log("   export SUPABASE_URL=https://srv1796225.hstgr.cloud");
  console.log("   export SERVICE_KEY=<your-key>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// ============================================
// EXTRACT REGENCY DATA FROM SQL FILE
// ============================================
function extractRegencyData(sql) {
  // Parse DO $$ ... END $$; block
  // Pattern: SELECT id INTO v_id FROM provinces WHERE code = 'XX';
  //          INSERT INTO regencies (province_id, code, name) VALUES (v_id, 'XX.XX', 'Name'), ...;

  const regencies = [];

  // Split by province blocks
  const provPattern = /WHERE code = '(\w+)';\nINSERT INTO regencies[^;]+;/g;
  let match;

  while ((match = provPattern.exec(sql)) !== null) {
    const provCode = match[1];
    const block = match[0];

    // Extract all (v_id, 'code', 'name') or (v_id, 'code', 'name') values
    // Format: (v_id, '11.71', 'Kota Banda Aceh')
    const valuePattern = /\([^)]+\)/g;
    let valMatch;

    while ((valMatch = valuePattern.exec(block)) !== null) {
      const inner = valMatch[0].replace(/^\(|\)$/g, "");
      const parts = parseValues(inner);
      // Skip column list (province_id, code, name) - valid regency codes have a dot
      if (parts.length >= 3 && parts[1].includes('.')) {
        regencies.push({
          province_code: provCode,
          code: parts[1],
          name: parts[2],
        });
      }
    }
  }

  return regencies;
}

function parseValues(str) {
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
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) result.push(current.trim());
  // Filter out empty strings — quote-end + comma sequence produces empty entries
  return result.filter(v => v !== '');
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log("🔌 Connecting to Supabase...");
  console.log(`   URL: ${SUPABASE_URL}\n`);

  // Step 1: Check provinces
  console.log("📋 Checking provinces...");
  const { data: provinces, error: provErr } = await supabase
    .from("provinces")
    .select("id, code, name")
    .order("code");

  if (provErr) {
    console.error("❌ Error fetching provinces:", provErr.message);
    console.log("\n   Cek apakah consolidated-migration.sql sudah dijalankan.");
    return;
  }

  console.log(`   Found ${provinces.length} provinces`);

  if (provinces.length === 0) {
    console.error("❌ Table provinces kosong! Jalankan consolidated-migration.sql dulu.");
    return;
  }

  // Build lookup map
  const provMap = {};
  for (const p of provinces) {
    provMap[p.code] = p.id;
  }

  // Show sample provinces
  console.log("   Sample:");
  provinces.slice(0, 3).forEach((p) => console.log(`     ${p.code} - ${p.name}`));
  console.log("");

  // Step 2: Parse seed data
  console.log("📄 Parsing seed_regencies.sql...");
  const sql = fs.readFileSync(SEED_FILE, "utf-8");
  const regencyData = extractRegencyData(sql);
  console.log(`   Found ${regencyData.length} regencies to insert\n`);

  // Step 3: Clean up bad data from previous run (empty names)
  console.log("🧹 Membersihkan data lama yang rusak...");
  // Hapus data yang namanya empty string atau null
  const { error: delErr, count: delCount } = await supabase
    .from("regencies")
    .delete()
    .eq("name", "");
  if (delErr) {
    console.log(`   Gagal hapus data lama: ${delErr.message}`);
  } else {
    console.log(`   ${delCount || 0} data lama dihapus`);
  }

  // Step 4: Insert regencies in batches
  console.log("\n🚀 Inserting regencies...");
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  const batchSize = 20;
  const existingCodes = new Set();

  // Check what already exists
  const { data: existing } = await supabase.from("regencies").select("code");
  if (existing) {
    existing.forEach((r) => existingCodes.add(r.code));
  }
  console.log(`   ${existingCodes.size} regencies already in database`);

  // Filter out existing
  const toInsert = regencyData.filter((r) => {
    const exists = existingCodes.has(r.code);
    if (exists) skipped++;
    return !exists;
  });

  console.log(`   ${toInsert.length} new regencies to insert\n`);

  // Batch insert
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    const records = batch.map((r) => ({
      province_id: provMap[r.province_code],
      code: r.code,
      name: r.name,
    }));

    const { error } = await supabase.from("regencies").insert(records, {
      onConflict: "code",
      ignoreDuplicates: true,
    });

    if (error) {
      console.error(`   ❌ Batch ${i / batchSize + 1}: ${error.message}`);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`   ✅ ${inserted}/${toInsert.length} inserted\r`);
    }
  }

  console.log(`\n\n📊 Hasil:`);
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Skipped (already exist): ${skipped}`);
  console.log(`   Errors: ${errors}`);

  // Step 5: Verify
  console.log("\n📊 Verifikasi:");
  const { count: regCount } = await supabase
    .from("regencies")
    .select("*", { count: "exact", head: true });

  const { data: provCovered } = await supabase
    .from("regencies")
    .select("province_id");

  const coveredProvinces = new Set(provCovered?.map((r) => r.province_id) || []);
  console.log(`   Total regencies in DB: ${regCount ?? 0}`);
  console.log(`   Provinces covered: ${coveredProvinces.size}/${provinces.length}`);

  // Show sample
  const { data: samples } = await supabase
    .from("regencies")
    .select("name, province_id(id, name)")
    .limit(5);

  if (samples && samples.length > 0) {
    console.log("\n📋 Sample:");
    samples.forEach((s) => {
      const prov = s.province_id;
      console.log(`   ${s.name} (${prov?.name || "?"})`);
    });
  }

  console.log("\n✅ Selesai!");
  console.log("\n⚠️  JANGAN COMMIT file ini ke git! Hapus kredensial atau jalankan:");
  console.log("   git checkout scripts/run-seed-regencies.mjs");
}

main().catch((err) => {
  console.error("\n❌ Fatal:", err.message);
  process.exit(1);
});
