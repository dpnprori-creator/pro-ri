-- ================================================
-- PRO RI — v2 Migration: Final Fixes
-- ================================================
-- Tanggal: Juli 2026
--
-- Berisi:
--   1. Fix generate_member_id() → prefix PRO-RI + SPLIT_PART posisi 4
--   2. Fix generate_member_number() → prefix PRO-RI
--   3. RLS Policies untuk Certificates (INSERT/UPDATE/DELETE)
--   4. Storage bucket innovations + videos
--   5. System settings: member_number_prefix → PRO-RI
--   6. Recalculate province counters
-- ================================================
-- Cara pakai: Paste ke Supabase SQL Editor → Run
-- ================================================

BEGIN;

-- ================================================
-- 1. FIX: generate_member_id() — PRO-RI prefix
-- ================================================
-- Sebelum: PRI-2026-00001
-- Sesudah:  PRO-RI-2026-00001
-- SPLIT_PART posisi 4 karena: ['PRO','RI','2026','00001']

CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  next_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_id, '-', 4) AS INTEGER)), 0) + 1
  INTO next_seq
  FROM members
  WHERE member_id LIKE 'PRO-RI-' || year || '-%';
  RETURN 'PRO-RI-' || year || '-' || LPAD(next_seq::TEXT, 5, '0');
END;
$$;

-- ================================================
-- 2. FIX: generate_member_number() — PRO-RI prefix
-- ================================================
-- Untuk member card number

CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS VARCHAR(20) AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_number, '-', 3) AS INTEGER)), 0) + 1
  INTO next_num
  FROM member_cards
  WHERE member_number IS NOT NULL
    AND member_number LIKE 'PRO-RI-%';
  RETURN 'PRO-RI-' || LPAD(next_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- 3. FIX: RLS Policies for Certificates
-- ================================================
-- Admin bisa INSERT, UPDATE, DELETE certificates

DROP POLICY IF EXISTS "Admins can insert certificates" ON certificates;
CREATE POLICY "Admins can insert certificates" ON certificates
  FOR INSERT WITH CHECK (is_admin_or_super());

DROP POLICY IF EXISTS "Admins can update certificates" ON certificates;
CREATE POLICY "Admins can update certificates" ON certificates
  FOR UPDATE USING (is_admin_or_super());

DROP POLICY IF EXISTS "Admins can delete certificates" ON certificates;
CREATE POLICY "Admins can delete certificates" ON certificates
  FOR DELETE USING (is_admin_or_super());

-- ================================================
-- 4. STORAGE: Innovations bucket & policies
-- ================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('innovations', 'innovations', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DO $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS "Public Read - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Public Read - innovations" ON storage.objects FOR SELECT USING (bucket_id = %L);', 'innovations');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Insert - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Insert - innovations" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', 'innovations');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Update - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Update - innovations" ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'innovations');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Delete - innovations" ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'innovations');
END $$;

-- ================================================
-- 5. FIX: System Settings — PRO-RI prefix
-- ================================================
-- Update member_number_prefix untuk existing settings

UPDATE system_settings
SET value = jsonb_set(
  value,
  '{member_number_prefix}',
  '"PRO-RI"'::jsonb
)
WHERE key = 'member_card_config'
  AND (value->>'member_number_prefix' IN ('PRI', 'PRORI'));

-- Jika belum ada system_settings, insert default
INSERT INTO system_settings (key, value, label, category)
SELECT
  'member_card_config',
  '{"auto_member_number": true, "member_number_prefix": "PRO-RI", "require_approval": true}'::jsonb,
  'Konfigurasi Kartu Anggota',
  'membership'
WHERE NOT EXISTS (
  SELECT 1 FROM system_settings WHERE key = 'member_card_config'
);

-- ================================================
-- 6. RUN: Recalculate province counters
-- ================================================

SELECT recalculate_province_counters();

-- ================================================
-- 7. VERIFY
-- ================================================

-- Cek prefix member ID
SELECT 'generate_member_id()' as check_name,
       generate_member_id() as sample_id;

-- Cek prefix member card number
SELECT 'generate_member_number()' as check_name,
       generate_member_number() as sample_number;

-- Cek storage buckets
SELECT 'storage_buckets' as check_name,
       COUNT(*)::INTEGER as count
FROM storage.buckets
WHERE id IN ('news', 'videos', 'hero-gallery', 'activity-gallery', 'events', 'innovations', 'photos', 'member-cards');

-- Cek system settings prefix
SELECT 'member_number_prefix' as check_name,
       value->>'member_number_prefix' as prefix
FROM system_settings
WHERE key = 'member_card_config';

-- Cek jumlah provinsi dengan anggota
SELECT 'provinces_with_members' as check_name,
       COUNT(*)::INTEGER as count
FROM provinces
WHERE total_members > 0;

-- Cek total anggota aktif
SELECT 'total_active_members' as check_name,
       COUNT(*)::INTEGER as count
FROM members
WHERE status = 'active';

COMMIT;

-- ================================================
-- ✅ v2 MIGRATION COMPLETE
-- ================================================
-- Applied:
--   1. generate_member_id() → PRO-RI prefix
--   2. generate_member_number() → PRO-RI prefix
--   3. Certificates RLS
--   4. Innovations storage bucket
--   5. System settings prefix
--   6. Province recalculation
-- ================================================
