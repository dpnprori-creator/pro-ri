-- ====================================================================
-- PRO RI ACADEMY — Auto Generate Course Certificate
-- ====================================================================
-- File ini membuat:
--   1. Fungsi generate_course_certificate_number() — format CRS-YYYYMMDD-XXXXX
--   2. Trigger auto-generate sertifikat saat enrollment status = 'completed'
--   3. RLS policy untuk member bisa melihat sertifikat sendiri
--   4. RLS policy untuk public bisa verifikasi sertifikat (read-only)
--
-- Cara pakai:
--   psql -h <host> -d <db> -f auto_course_certificate.sql
--   ATAU paste langsung ke Supabase SQL Editor
-- ====================================================================

-- ====================================================================
-- 1. FUNCTION: Generate Course Certificate Number
-- Format: CRS-YYYYMMDD-XXXXX (CRS = Course, YYYYMMDD = tanggal, XXXXX = urutan)
-- ====================================================================
CREATE OR REPLACE FUNCTION generate_course_certificate_number()
RETURNS VARCHAR(30)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  date_part VARCHAR(8) := TO_CHAR(NOW(), 'YYYYMMDD');
  next_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(certificate_number, '-', 3) AS INTEGER)), 0) + 1
  INTO next_seq
  FROM course_certificates
  WHERE certificate_number LIKE 'CRS-' || date_part || '-%';

  RETURN 'CRS-' || date_part || '-' || LPAD(next_seq::TEXT, 5, '0');
END;
$$;

-- ====================================================================
-- 2. FUNCTION: Trigger — Auto-issue certificate on enrollment completion
-- ====================================================================
CREATE OR REPLACE FUNCTION trigger_auto_issue_course_certificate()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hanya ketika status berubah menjadi 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    -- Cek apakah sertifikat sudah ada (idempotent)
    IF NOT EXISTS (
      SELECT 1 FROM course_certificates
      WHERE course_id = NEW.course_id AND member_id = NEW.member_id
    ) THEN
      INSERT INTO course_certificates (certificate_number, course_id, member_id)
      VALUES (generate_course_certificate_number(), NEW.course_id, NEW.member_id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- ====================================================================
-- 3. TRIGGER: Pasang trigger pada course_enrollments
-- ====================================================================
DROP TRIGGER IF EXISTS trg_auto_course_certificate ON course_enrollments;
CREATE TRIGGER trg_auto_course_certificate
  AFTER UPDATE OF status ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_auto_issue_course_certificate();

-- ====================================================================
-- 4. RLS: Tambah policy untuk verifikasi publik (read-only)
-- ====================================================================
DO $$
BEGIN
  -- Public bisa verifikasi sertifikat (tanpa login)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'course_certificates'
    AND policyname = 'Course certificates are verifiable'
  ) THEN
    CREATE POLICY "Course certificates are verifiable" ON course_certificates
      FOR SELECT USING (TRUE);
  END IF;
END $$;

-- ====================================================================
-- 5. BACKFILL: Buat sertifikat untuk enrollment yang sudah completed
-- ====================================================================
-- Jalankan sekali untuk enrollment yang sudah selesai sebelum trigger dibuat
INSERT INTO course_certificates (certificate_number, course_id, member_id, issued_at, verified)
SELECT
  generate_course_certificate_number(),
  ce.course_id,
  ce.member_id,
  COALESCE(ce.completed_at, NOW()),
  TRUE
FROM course_enrollments ce
WHERE ce.status = 'completed'
  AND NOT EXISTS (
    SELECT 1 FROM course_certificates cc
    WHERE cc.course_id = ce.course_id AND cc.member_id = ce.member_id
  );

-- ====================================================================
-- 6. VERIFIKASI
-- ====================================================================
SELECT 'Auto Course Certificate Migration' as migration,
       COUNT(*) as certificates_created
FROM course_certificates;

-- ====================================================================
-- ✅ MIGRATION COMPLETE
-- ====================================================================
