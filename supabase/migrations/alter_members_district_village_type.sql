-- ================================================
-- ALTER members table: district_id & village_id
-- Change from UUID → TEXT so we can store
-- string codes from emsifa API
-- ================================================

-- Drop FK constraints first
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_district_id_fkey;
ALTER TABLE members DROP CONSTRAINT IF EXISTS members_village_id_fkey;

-- Change column types from UUID to TEXT
ALTER TABLE members ALTER COLUMN district_id TYPE TEXT;
ALTER TABLE members ALTER COLUMN village_id TYPE TEXT;

-- ================================================
-- ✅ DONE
-- ================================================
-- Run after: consolidated-migration.sql
-- ================================================
