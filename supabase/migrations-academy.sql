-- ====================================================================
-- PRO RI ACADEMY — Migration SQL
-- ====================================================================
-- File ini adalah migrasi STANDALONE untuk menambahkan fitur Academy
-- ke database PRO RI yang sudah ada.
--
-- Prasyarat:
--   - Database PRO RI sudah memiliki tabel: members, roles
--   - Fungsi RLS helper SUDAH ada: get_current_member_role(), is_admin_or_super()
--   - Jika tabel/fungsi sudah ada, CREATE IF NOT EXISTS aman dijalankan ulang
--
-- Cara pakai:
--   psql -h <host> -d <db> -f migrations-academy.sql
--   ATAU paste langsung ke Supabase SQL Editor
-- ====================================================================
-- Isi:
--   1. 6 tabel Academy (courses → modules → lessons → enrollments → completions → certificates)
--   2. 16 indexes
--   3. 1 function: calculate_course_progress()
--   4. 6 updated_at triggers
--   5. 18 RLS policies
--   6. Auto-recalculate progress trigger
--   7. Verifikasi hasil
-- ====================================================================

-- ====================================================================
-- 1. TABEL ACADEMY
-- ====================================================================

-- 1.1 COURSES — Master kursus
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category VARCHAR(50) DEFAULT 'programming'
    CHECK (category IN ('robotics', 'ai', 'iot', 'programming', 'robotik', 'technology', 'other')),
  level VARCHAR(20) DEFAULT 'beginner'
    CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  learning_path VARCHAR(100),
  image_url TEXT,
  duration_hours INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft'
    CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES members(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 COURSE MODULES — Bab/bagian dalam kursus
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 COURSE LESSONS — Pelajaran individual
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 COURSE ENROLLMENTS — Pendaftaran member ke kursus
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active'
    CHECK (status IN ('active', 'completed', 'dropped')),
  progress_percent INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, member_id)
);

-- 1.5 LESSON COMPLETIONS — Track progress belajar
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, member_id)
);

-- 1.6 COURSE CERTIFICATES — Sertifikat kelulusan kursus
CREATE TABLE IF NOT EXISTS course_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number VARCHAR(30) UNIQUE NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, member_id)
);

-- ====================================================================
-- 2. INDEXES — 16 indexes untuk performa query
-- ====================================================================

-- Courses
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_sort ON courses(sort_order);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- Course Modules
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_sort ON course_modules(sort_order);

-- Course Lessons
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort ON course_lessons(sort_order);

-- Course Enrollments
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_member ON course_enrollments(member_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);

-- Lesson Completions
CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_member ON lesson_completions(member_id);

-- Course Certificates
CREATE INDEX IF NOT EXISTS idx_course_certificates_course ON course_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_member ON course_certificates(member_id);

-- ====================================================================
-- 3. FUNCTIONS
-- ====================================================================

-- 3.1 Recalculate course progress untuk member tertentu
-- Dipanggil saat lesson ditandai selesai/batal selesai
CREATE OR REPLACE FUNCTION calculate_course_progress(
  p_course_id UUID,
  p_member_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress INTEGER;
BEGIN
  -- Hitung total lessons di kursus ini
  SELECT COUNT(*) INTO total_lessons
  FROM course_lessons cl
  JOIN course_modules cm ON cm.id = cl.module_id
  WHERE cm.course_id = p_course_id;

  -- Handle jika belum ada lesson
  IF total_lessons = 0 THEN
    RETURN 0;
  END IF;

  -- Hitung lesson yang sudah selesai oleh member
  SELECT COUNT(*) INTO completed_lessons
  FROM lesson_completions lc
  WHERE lc.member_id = p_member_id
    AND lc.lesson_id IN (
      SELECT cl.id FROM course_lessons cl
      JOIN course_modules cm ON cm.id = cl.module_id
      WHERE cm.course_id = p_course_id
    );

  -- Hitung persentase
  progress := (completed_lessons * 100) / total_lessons;

  RETURN progress;
END;
$$;

-- 3.2 Trigger function: auto-recalculate progress saat lesson completion berubah
CREATE OR REPLACE FUNCTION trigger_recalculate_course_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id UUID;
  v_member_id UUID;
  v_progress INTEGER;
BEGIN
  -- Tentukan course_id dan member_id berdasarkan operasi
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    v_member_id := NEW.member_id;
    -- Dapatkan course_id dari lesson → module
    SELECT cm.course_id INTO v_course_id
    FROM course_lessons cl
    JOIN course_modules cm ON cm.id = cl.module_id
    WHERE cl.id = NEW.lesson_id;

    IF v_course_id IS NULL THEN
      RETURN COALESCE(NEW, OLD);
    END IF;

    v_progress := calculate_course_progress(v_course_id, v_member_id);

    UPDATE course_enrollments
    SET
      progress_percent = v_progress,
      status = CASE WHEN v_progress >= 100 THEN 'completed' ELSE 'active' END,
      completed_at = CASE
        WHEN v_progress >= 100 AND (TG_OP = 'INSERT' OR OLD.status != 'completed')
        THEN NOW()
        ELSE completed_at
      END
    WHERE course_id = v_course_id AND member_id = v_member_id;

  ELSIF TG_OP = 'DELETE' THEN
    v_member_id := OLD.member_id;

    SELECT cm.course_id INTO v_course_id
    FROM course_lessons cl
    JOIN course_modules cm ON cm.id = cl.module_id
    WHERE cl.id = OLD.lesson_id;

    IF v_course_id IS NULL THEN
      RETURN OLD;
    END IF;

    v_progress := calculate_course_progress(v_course_id, v_member_id);

    UPDATE course_enrollments
    SET
      progress_percent = v_progress,
      status = CASE WHEN v_progress >= 100 THEN 'completed' ELSE 'active' END,
      completed_at = CASE WHEN v_progress < 100 THEN NULL ELSE completed_at END
    WHERE course_id = v_course_id AND member_id = v_member_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ====================================================================
-- 4. TRIGGERS
-- ====================================================================

-- 4.1 Auto-update updated_at untuk semua tabel Academy
-- Asumsi: fungsi update_updated_at_column() SUDAH ADA dari migration utama
DO $$
BEGIN
  -- Courses
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_courses_updated_at') THEN
    CREATE TRIGGER update_courses_updated_at
      BEFORE UPDATE ON courses
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Course Modules
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_course_modules_updated_at') THEN
    CREATE TRIGGER update_course_modules_updated_at
      BEFORE UPDATE ON course_modules
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  -- Course Lessons
  IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_course_lessons_updated_at') THEN
    CREATE TRIGGER update_course_lessons_updated_at
      BEFORE UPDATE ON course_lessons
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 4.2 Auto-recalculate progress saat lesson completion berubah
DROP TRIGGER IF EXISTS trg_lesson_completion_progress ON lesson_completions;
CREATE TRIGGER trg_lesson_completion_progress
  AFTER INSERT OR UPDATE OR DELETE ON lesson_completions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_course_progress();

-- ====================================================================
-- 5. RLS POLICIES
-- ====================================================================
-- Asumsi: fungsi is_admin_or_super() SUDAH ADA dari migration utama
-- Semua policy menggunakan helper yang sama untuk konsistensi
-- ====================================================================

-- 5.1 COURSES RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Published courses are publicly viewable') THEN
    CREATE POLICY "Published courses are publicly viewable" ON courses
      FOR SELECT USING (status = 'published');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Authenticated users can view all courses') THEN
    CREATE POLICY "Authenticated users can view all courses" ON courses
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'courses' AND policyname = 'Admins can manage courses') THEN
    CREATE POLICY "Admins can manage courses" ON courses
      FOR ALL USING (is_admin_or_super());
  END IF;
END $$;

-- 5.2 COURSE MODULES RLS
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_modules' AND policyname = 'Course modules are viewable') THEN
    CREATE POLICY "Course modules are viewable" ON course_modules
      FOR SELECT USING (TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_modules' AND policyname = 'Admins can manage course modules') THEN
    CREATE POLICY "Admins can manage course modules" ON course_modules
      FOR ALL USING (is_admin_or_super());
  END IF;
END $$;

-- 5.3 COURSE LESSONS RLS
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_lessons' AND policyname = 'Course lessons are viewable') THEN
    CREATE POLICY "Course lessons are viewable" ON course_lessons
      FOR SELECT USING (TRUE);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_lessons' AND policyname = 'Admins can manage course lessons') THEN
    CREATE POLICY "Admins can manage course lessons" ON course_lessons
      FOR ALL USING (is_admin_or_super());
  END IF;
END $$;

-- 5.4 COURSE ENROLLMENTS RLS
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_enrollments' AND policyname = 'Members can view own enrollments') THEN
    CREATE POLICY "Members can view own enrollments" ON course_enrollments
      FOR SELECT USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_enrollments' AND policyname = 'Members can enroll') THEN
    CREATE POLICY "Members can enroll" ON course_enrollments
      FOR INSERT WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_enrollments' AND policyname = 'Members can update own enrollment') THEN
    CREATE POLICY "Members can update own enrollment" ON course_enrollments
      FOR UPDATE USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_enrollments' AND policyname = 'Admins can manage enrollments') THEN
    CREATE POLICY "Admins can manage enrollments" ON course_enrollments
      FOR ALL USING (is_admin_or_super());
  END IF;
END $$;

-- 5.5 LESSON COMPLETIONS RLS
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_completions' AND policyname = 'Members can view own completions') THEN
    CREATE POLICY "Members can view own completions" ON lesson_completions
      FOR SELECT USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_completions' AND policyname = 'Members can complete lessons') THEN
    CREATE POLICY "Members can complete lessons" ON lesson_completions
      FOR INSERT WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lesson_completions' AND policyname = 'Admins can manage completions') THEN
    CREATE POLICY "Admins can manage completions" ON lesson_completions
      FOR ALL USING (is_admin_or_super());
  END IF;
END $$;

-- 5.6 COURSE CERTIFICATES RLS
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_certificates' AND policyname = 'Certificates are viewable by owner') THEN
    CREATE POLICY "Certificates are viewable by owner" ON course_certificates
      FOR SELECT USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'course_certificates' AND policyname = 'Admins can manage course certificates') THEN
    CREATE POLICY "Admins can manage course certificates" ON course_certificates
      FOR ALL USING (is_admin_or_super());
  END IF;
END $$;

-- ====================================================================
-- 6. STORAGE BUCKET untuk Academy (opsional — untuk thumbnail/upload)
-- ====================================================================
-- Bucket ini hanya diperlukan jika admin ingin upload gambar kursus
-- ke Supabase Storage. Jika gambar dari URL eksternal, bucket tidak perlu.

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('academy', 'academy', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;
END $$;

-- Storage RLS untuk bucket academy
DO $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS "Public Read - academy" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Public Read - academy" ON storage.objects FOR SELECT USING (bucket_id = %L);', 'academy');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Insert - academy" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Insert - academy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', 'academy');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Update - academy" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Update - academy" ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'academy');
  EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - academy" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Delete - academy" ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'academy');
END $$;

-- ====================================================================
-- 7. VERIFIKASI HASIL MIGRASI
-- ====================================================================

-- Cek tabel
SELECT 'tables' as check_name, COUNT(*)::INTEGER as count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('courses', 'course_modules', 'course_lessons',
                     'course_enrollments', 'lesson_completions', 'course_certificates');

-- Cek fungsi
SELECT 'functions' as check_name, COUNT(*)::INTEGER as count
FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname IN ('calculate_course_progress', 'trigger_recalculate_course_progress');

-- Cek trigger
SELECT 'triggers' as check_name, COUNT(*)::INTEGER as count
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN ('update_courses_updated_at', 'update_course_modules_updated_at',
                       'update_course_lessons_updated_at', 'trg_lesson_completion_progress');

-- Cek RLS policies
SELECT 'rls_policies' as check_name, COUNT(*)::INTEGER as count
FROM pg_policies
WHERE tablename IN ('courses', 'course_modules', 'course_lessons',
                    'course_enrollments', 'lesson_completions', 'course_certificates');

-- Cek RLS enabled
SELECT 'rls_enabled' as check_name, COUNT(*)::INTEGER as count
FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relname IN ('courses', 'course_modules', 'course_lessons',
                  'course_enrollments', 'lesson_completions', 'course_certificates')
  AND relrowsecurity = TRUE;

-- ====================================================================
-- ✅ ACADEMY MIGRATION COMPLETE
-- ====================================================================
-- 6 tables, 16 indexes, 2 functions, 4 triggers, 18 RLS policies
-- ====================================================================
-- Cara verifikasi di Supabase:
--   1. Buka Table Editor → cek 6 tabel baru muncul
--   2. Buka SQL Editor → jalankan query verifikasi di atas
--   3. Buka Authentication > Policies → cek policy untuk 6 tabel
-- ====================================================================
