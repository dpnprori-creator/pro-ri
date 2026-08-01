-- ====================================================================
-- PRO RI DIGITAL COMMAND CENTER
-- DROP ACADEMY — Hapus semua objek database terkait Academy
-- ====================================================================
-- Academy sudah dipindahkan ke platform terpisah:
--   https://pro-ri-acedemy.vercel.app
--
-- File ini menghapus SEMUA yang berhubungan dengan Academy dari
-- database project ini, yaitu:
--   1. Storage bucket 'academy' + RLS policy storage
--   2. Tabel: courses, course_modules, course_lessons,
--      course_enrollments, lesson_completions, course_certificates,
--      lesson_attachments
--   3. Fungsi: calculate_course_progress, trigger_recalculate_course_progress,
--      generate_course_certificate_number, trigger_auto_issue_course_certificate
--   4. Trigger: trg_lesson_completion_progress, trg_auto_course_certificate,
--      update_courses_updated_at, update_course_modules_updated_at,
--      update_course_lessons_updated_at
--
-- Cara pakai:
--   psql -h <host> -d <db> -f drop-academy.sql
--   ATAU paste langsung ke Supabase SQL Editor
-- ====================================================================

-- ====================================================================
-- 1. STORAGE BUCKET 'academy' + RLS POLICY
-- ====================================================================
DO $$
DECLARE
  b TEXT := 'academy';
BEGIN
  -- Hapus file di bucket
  DELETE FROM storage.objects WHERE bucket_id = b;

  -- Hapus RLS policy storage
  EXECUTE format('DROP POLICY IF EXISTS "Public Read - %s" ON storage.objects;', b);
  EXECUTE format('DROP POLICY IF EXISTS "Auth Insert - %s" ON storage.objects;', b);
  EXECUTE format('DROP POLICY IF EXISTS "Auth Update - %s" ON storage.objects;', b);
  EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - %s" ON storage.objects;', b);

  -- Hapus bucket
  DELETE FROM storage.buckets WHERE id = b;
END $$;

-- ====================================================================
-- 2. DROP TRIGGERS (harus sebelum fungsi & tabel)
-- ====================================================================
DROP TRIGGER IF EXISTS trg_lesson_completion_progress ON lesson_completions;
DROP TRIGGER IF EXISTS trg_auto_course_certificate ON course_enrollments;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_course_modules_updated_at ON course_modules;
DROP TRIGGER IF EXISTS update_course_lessons_updated_at ON course_lessons;

-- ====================================================================
-- 3. DROP FUNCTIONS
-- ====================================================================
DROP FUNCTION IF EXISTS calculate_course_progress(UUID, UUID);
DROP FUNCTION IF EXISTS trigger_recalculate_course_progress();
DROP FUNCTION IF EXISTS generate_course_certificate_number();
DROP FUNCTION IF EXISTS trigger_auto_issue_course_certificate();

-- ====================================================================
-- 4. DROP TABLES (RLS policy otomatis terhapus bersama tabel)
-- ====================================================================
DROP TABLE IF EXISTS lesson_attachments CASCADE;
DROP TABLE IF EXISTS course_certificates CASCADE;
DROP TABLE IF EXISTS lesson_completions CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS course_lessons CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- ====================================================================
-- 5. VERIFIKASI — objek academy sudah tidak ada
-- ====================================================================
SELECT 'Dropped tables' AS info, COUNT(*) AS total
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('courses', 'course_modules', 'course_lessons',
                     'course_enrollments', 'lesson_completions',
                     'course_certificates', 'lesson_attachments');

SELECT 'Academy storage bucket' AS info, COUNT(*) AS total
FROM storage.buckets WHERE id = 'academy';

-- ====================================================================
-- ✅ ACADEMY REMOVED
-- ====================================================================
