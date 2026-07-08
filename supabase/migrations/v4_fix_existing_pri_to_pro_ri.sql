-- ================================================
-- v4 Migration: Fix Existing Data — PRI → PRO-RI
-- ================================================
-- Tanggal: Juli 2026
--
-- Masalah: Data member yang sudah ada di database
-- masih menggunakan prefix PRI- (misal: PRI-2026-00001)
-- padahal sistem sudah diubah ke PRO-RI-.
--
-- Isi:
--   1. Update member_id di tabel members: PRI- → PRO-RI-
--   2. Update handle_new_user() jika masih pakai PRI
--   3. Update generate_member_id() jika belum PRO-RI
--   4. Update member_cards.member_number jika masih PRORI-/PRI-
--   5. Update system_settings jika masih ada PRI/PRORI
--   6. Recalculate province counters
--   7. Verifikasi hasil
-- ================================================
-- Cara pakai: Paste ke Supabase SQL Editor → Run
-- ================================================

BEGIN;

-- ================================================
-- 1. UPDATE EXISTING MEMBER IDs
-- ================================================
-- Ubah semua member_id yang masih pakai PRI-2026-XXXX
-- menjadi PRO-RI-2026-XXXX

UPDATE members
SET member_id = regexp_replace(member_id, '^PRI-', 'PRO-RI-')
WHERE member_id LIKE 'PRI-%';

-- Tampilkan jumlah member yang diupdate
SELECT 'Updated member IDs' as action,
       COUNT(*) as count
FROM members
WHERE member_id LIKE 'PRO-RI-%'
  AND member_id ~ '^PRO-RI-';

-- ================================================
-- 2. UPDATE MEMBER CARDS (jika ada yang pakai PRI/PRORI)
-- ================================================

UPDATE member_cards
SET member_number = regexp_replace(member_number, '^PRI-', 'PRO-RI-')
WHERE member_number LIKE 'PRI-%';

UPDATE member_cards
SET member_number = regexp_replace(member_number, '^PRORI-', 'PRO-RI-')
WHERE member_number LIKE 'PRORI-%';

SELECT 'Updated member card numbers' as action,
       COUNT(*) as count
FROM member_cards
WHERE member_number LIKE 'PRO-RI-%';

-- ================================================
-- 3. PASTIKAN generate_member_id() SUDAH BENAR
-- ================================================
-- Function ini harus mencari PRO-RI-2026-% dan
-- SPLIT_PART di posisi 4 (karena: PRO, RI, 2026, 00001)

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
-- 4. PASTIKAN handle_new_user() SUDAH BENAR
-- ================================================
-- Trigger ini dipanggil saat user baru daftar via Auth

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  member_role_id UUID;
  new_member_id TEXT;
BEGIN
  SELECT id INTO member_role_id FROM roles WHERE name = 'member' LIMIT 1;
  new_member_id := generate_member_id();

  INSERT INTO public.members (auth_id, member_id, full_name, email, role_id, status, created_at, updated_at)
  VALUES (NEW.id, new_member_id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email, member_role_id, 'active', NOW(), NOW())
  ON CONFLICT (auth_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create member for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- ================================================
-- 5. UPDATE SYSTEM SETTINGS
-- ================================================

UPDATE system_settings
SET value = jsonb_set(
  value,
  '{member_number_prefix}',
  '"PRO-RI"'::jsonb
)
WHERE key = 'member_card_config'
  AND (value->>'member_number_prefix' IN ('PRI', 'PRORI'));

-- ================================================
-- 6. RECALCULATE COUNTERS
-- ================================================

-- Panggil fungsi recalculate yang sudah ada
-- (akan dibuat dulu jika belum ada)
CREATE OR REPLACE FUNCTION recalculate_province_counters()
RETURNS void AS $$
BEGIN
  -- Update provinces
  UPDATE provinces p SET
    total_members = (SELECT COUNT(*)::INTEGER FROM members m WHERE m.province_id::text = p.id::text AND m.status = 'active'),
    total_trainers = (SELECT COUNT(DISTINCT m.id)::INTEGER FROM members m JOIN member_designations md ON md.member_id = m.id WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'trainer'),
    total_mentors = (SELECT COUNT(DISTINCT m.id)::INTEGER FROM members m JOIN member_designations md ON md.member_id = m.id WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'mentor'),
    total_events = (SELECT COUNT(*)::INTEGER FROM events e WHERE e.province_id::text = p.id::text AND e.status IN ('published', 'ongoing', 'completed')),
    total_innovations = (SELECT COUNT(*)::INTEGER FROM innovations i WHERE i.province_id::text = p.id::text AND i.status IN ('published', 'featured'));

  -- Update regencies
  UPDATE regencies r SET
    total_members = (SELECT COUNT(*)::INTEGER FROM members m WHERE m.regency_id::text = r.id::text AND m.status = 'active'),
    total_trainers = (SELECT COUNT(DISTINCT m.id)::INTEGER FROM members m JOIN member_designations md ON md.member_id = m.id WHERE m.regency_id::text = r.id::text AND m.status = 'active' AND md.designation = 'trainer');

  -- Update districts
  UPDATE districts d SET
    total_members = (SELECT COUNT(*)::INTEGER FROM members m WHERE m.district_id::text = d.id::text AND m.status = 'active');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT recalculate_province_counters();

-- ================================================
-- 7. VERIFIKASI HASIL
-- ================================================

-- Cek sample member IDs
SELECT 'Sample member IDs (PRO-RI format)' as check_name,
       member_id
FROM members
WHERE member_id LIKE 'PRO-RI-%'
ORDER BY created_at DESC
LIMIT 5;

-- Cek apakah masih ada member dengan PRI prefix
SELECT 'Remaining PRI prefix count' as check_name,
       COUNT(*)::INTEGER as count
FROM members
WHERE member_id LIKE 'PRI-%';

-- Cek total member dengan prefix PRO-RI
SELECT 'Total PRO-RI prefix members' as check_name,
       COUNT(*)::INTEGER as count
FROM members
WHERE member_id LIKE 'PRO-RI-%';

-- Cek generate_member_id() sample
SELECT 'generate_member_id() sample' as check_name,
       generate_member_id() as sample_id;

-- Cek province counters
SELECT 'Provinces with members' as check_name,
       COUNT(*)::INTEGER as count
FROM provinces
WHERE total_members > 0;

-- Cek total active members
SELECT 'Total active members' as check_name,
       COUNT(*)::INTEGER as count
FROM members
WHERE status = 'active';

COMMIT;

-- ================================================
-- ✅ v4 MIGRATION COMPLETE
-- ================================================
-- Semua data member dengan prefix PRI- sudah diubah
-- menjadi PRO-RI-. Fungsi generate_member_id() dan
-- handle_new_user() sudah dipastikan menggunakan
-- prefix PRO-RI- dengan SPLIT_PART posisi 4.
-- ================================================
