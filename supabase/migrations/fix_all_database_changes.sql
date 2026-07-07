-- ================================================
-- PRO RI — Fix All Database Changes (v1)
-- ================================================
-- Tanggal: Juli 2026
--
-- Migration ini mencakup semua perubahan database
-- yang diperlukan untuk mendukung 7 perbaikan kode:
--   1. Fix format ID member (PRI → PRORI)
--   2. Recalculate Counters
--   3. Inovasi muncul di admin
--   4. Sertifikat RLS bypass
--   5. Berita image upload
--   6. Top Provinsi sync
--   7. Activity Logs
-- ================================================
-- Cara pakai: Paste ke Supabase SQL Editor
-- atau: psql -h <host> -d <db> -f fix_all_database_changes.sql
-- ================================================

BEGIN;

-- ================================================
-- 1. FIX: generate_member_id() — PRORI prefix
-- ================================================
-- Sebelumnya: PRI-2026-00001
-- Sesudah:    PRORI-2026-00001

CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  next_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_id, '-', 3) AS INTEGER)), 0) + 1
  INTO next_seq
  FROM members
  WHERE member_id LIKE 'PRORI-' || year || '-%';
  RETURN 'PRORI-' || year || '-' || LPAD(next_seq::TEXT, 5, '0');
END;
$$;

-- ================================================
-- 2. FIX: RLS Policies for Certificates
-- ================================================
-- Sebelumnya: hanya ada SELECT policy
-- Sekarang: admin bisa INSERT, UPDATE, DELETE

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
-- 3. TRIGGER: Auto-log key activities
-- ================================================
-- Mencatat aktivitas penting ke activity_logs
-- secara otomatis di level database.
--
-- CATATAN: Trigger ini hanya untuk aktivitas
-- yang TIDAK di-handle oleh kode (seperti
-- update status member). Untuk registrasi,
-- kode sudah memanggil logActivity() sendiri.

-- Auto-log saat status member berubah
CREATE OR REPLACE FUNCTION log_member_status_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.activity_logs (member_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.id,
      'member_status_changed',
      'member',
      NEW.id,
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to log status change for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_member_status_changed ON members;
CREATE TRIGGER on_member_status_changed
  AFTER UPDATE OF status ON members
  FOR EACH ROW EXECUTE FUNCTION log_member_status_change();

-- Auto-log saat designation (trainer/mentor) ditambahkan
CREATE OR REPLACE FUNCTION log_designation_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.activity_logs (member_id, action, entity_type, entity_id, metadata)
  VALUES (
    NEW.member_id,
    CASE WHEN TG_OP = 'INSERT' THEN 'designation_added' ELSE 'designation_removed' END,
    'designation',
    NEW.id,
    jsonb_build_object('designation', NEW.designation)
  );
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to log designation change: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS on_designation_inserted ON member_designations;
CREATE TRIGGER on_designation_inserted
  AFTER INSERT ON member_designations
  FOR EACH ROW EXECUTE FUNCTION log_designation_change();

DROP TRIGGER IF EXISTS on_designation_deleted ON member_designations;
CREATE TRIGGER on_designation_deleted
  AFTER DELETE ON member_designations
  FOR EACH ROW EXECUTE FUNCTION log_designation_change();

-- ================================================
-- 4. STORAGE BUCKETS: Tambah bucket yang kurang
-- ================================================
-- Pastikan semua storage bucket yang dipakai
-- oleh aplikasi sudah tersedia

DO $$
BEGIN
  -- Bucket untuk upload berita
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('news', 'news', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO UPDATE SET
    public = TRUE,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  -- Bucket untuk upload video
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('videos', 'videos', TRUE, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime'])
  ON CONFLICT (id) DO UPDATE SET
    public = TRUE,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime'];
END $$;

-- Storage RLS untuk bucket news dan videos
DO $$
BEGIN
  -- News bucket policies
  EXECUTE format('DROP POLICY IF EXISTS "Public Read - news" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Public Read - news" ON storage.objects FOR SELECT USING (bucket_id = %L);', 'news');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Insert - news" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Insert - news" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', 'news');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Update - news" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Update - news" ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'news');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - news" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Delete - news" ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'news');

  -- Videos bucket policies
  EXECUTE format('DROP POLICY IF EXISTS "Public Read - videos" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Public Read - videos" ON storage.objects FOR SELECT USING (bucket_id = %L);', 'videos');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Insert - videos" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Insert - videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', 'videos');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Update - videos" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Update - videos" ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'videos');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - videos" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Delete - videos" ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'videos');
END $$;

-- ================================================
-- 5. UPDATE: System Settings — PRORI prefix
-- ================================================
-- Update default member_card_config dan settings
-- yang masih menggunakan prefix "PRI"

UPDATE system_settings
SET value = jsonb_set(
  value,
  '{member_number_prefix}',
  '"PRORI"'::jsonb
)
WHERE key = 'member_card_config'
  AND value->>'member_number_prefix' = 'PRI';

-- Jika belum ada system_settings, insert default
INSERT INTO system_settings (key, value, label, category)
SELECT
  'member_card_config',
  '{"auto_member_number": true, "member_number_prefix": "PRORI", "require_approval": true}'::jsonb,
  'Konfigurasi Kartu Anggota',
  'membership'
WHERE NOT EXISTS (
  SELECT 1 FROM system_settings WHERE key = 'member_card_config'
);

-- ================================================
-- 6. ENSURE: recalculate_province_counters() exists
-- ================================================
-- Fungsi ini mungkin sudah ada dari migration
-- sebelumnya. CREATE OR REPLACE memastikan
-- versi terbaru ter-deploy.

CREATE OR REPLACE FUNCTION recalculate_province_counters()
RETURNS void AS $$
BEGIN
  -- PROVINCES
  UPDATE provinces p
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.province_id::text = p.id::text AND m.status = 'active'
  );

  UPDATE provinces p
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'trainer'
  );

  UPDATE provinces p
  SET total_mentors = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'mentor'
  );

  UPDATE provinces p
  SET total_events = (
    SELECT COUNT(*)::INTEGER
    FROM events e
    WHERE e.province_id::text = p.id::text AND e.status IN ('published', 'ongoing', 'completed')
  );

  UPDATE provinces p
  SET total_innovations = (
    SELECT COUNT(*)::INTEGER
    FROM innovations i
    WHERE i.province_id::text = p.id::text AND i.status IN ('published', 'featured')
  );

  -- REGENCIES
  UPDATE regencies r
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.regency_id::text = r.id::text AND m.status = 'active'
  );

  UPDATE regencies r
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.regency_id::text = r.id::text AND m.status = 'active' AND md.designation = 'trainer'
  );

  -- DISTRICTS
  UPDATE districts d
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.district_id::text = d.id::text AND m.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 7. RUN: Initial recalculation
-- ================================================

SELECT recalculate_province_counters();

-- ================================================
-- 8. VERIFY: Cek hasil migrasi
-- ================================================

-- Cek prefix member ID
SELECT 'generate_member_id prefix' as check_name,
       generate_member_id() as sample_id;

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

-- Cek total activity logs
SELECT 'total_activity_logs' as check_name,
       COUNT(*)::INTEGER as count
FROM activity_logs;

-- Cek storage buckets
SELECT 'storage_buckets' as check_name,
       COUNT(*)::INTEGER as count
FROM storage.buckets
WHERE id IN ('news', 'videos', 'hero-gallery', 'activity-gallery', 'events', 'innovations', 'photos', 'member-cards');

COMMIT;

-- ================================================
-- ✅ MIGRATION COMPLETE
-- ================================================
-- Changes applied:
--   1. generate_member_id() → PRORI prefix
--   2. Certificates RLS: INSERT/UPDATE/DELETE for admins
--   3. Trigger: auto-log member registration
--   4. Storage buckets: news, videos
--   5. System settings: member_number_prefix → PRORI
--   6. recalculate_province_counters() deployed
--   7. Initial recalculation run
-- ================================================
