-- ============================================================================
-- Migration v3: Fix Maps Data, Member Designations, Storage & Recalculate
-- ============================================================================
-- Jalankan di Supabase SQL Editor (https://supabase.com/dashboard/project/fsojisyplyfcvugajbup/sql/new)
-- ============================================================================

-- 1. Recalculate Function untuk Province & Regency Counters
-- ============================================================================
-- Fungsi ini menghitung ulang total_members, total_trainers, total_events, total_innovations
-- untuk setiap provinsi dan kabupaten/kota secara real-time

CREATE OR REPLACE FUNCTION recalculate_all_counters()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update provinces counters using correlated subqueries
  -- Gunakan ::text cast karena foreign key columns mungkin bertipe text sedangkan id UUID
  UPDATE provinces p SET
    total_members = (SELECT COUNT(*) FROM members WHERE province_id::text = p.id::text AND status = 'active'),
    total_trainers = (SELECT COUNT(*) FROM member_designations md JOIN members m2 ON m2.id = md.member_id WHERE m2.province_id::text = p.id::text AND md.designation = 'trainer'),
    total_events = (SELECT COUNT(*) FROM events WHERE province_id::text = p.id::text),
    total_innovations = (SELECT COUNT(*) FROM innovations WHERE province_id::text = p.id::text AND status != 'archived');

  -- Update regencies counters
  UPDATE regencies r SET
    total_members = (SELECT COUNT(*) FROM members WHERE regency_id::text = r.id::text AND status = 'active'),
    total_trainers = (SELECT COUNT(*) FROM member_designations md JOIN members m2 ON m2.id = md.member_id WHERE m2.regency_id::text = r.id::text AND md.designation = 'trainer'),
    total_events = 0,
    total_innovations = 0;

  -- Update districts counters
  UPDATE districts d SET
    total_members = (SELECT COUNT(*) FROM members WHERE district_id::text = d.id::text AND status = 'active');
END;
$$;

-- 2. Trigger untuk auto-recalculate setelah perubahan data
-- ============================================================================

CREATE OR REPLACE FUNCTION trigger_recalculate_counters()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Panggil recalculate langsung (synchronous, tapi statement-level trigger jadi hanya sekali per statement)
  PERFORM recalculate_all_counters();
  RETURN NEW;
END;
$$;

-- Trigger on members table
DROP TRIGGER IF EXISTS trg_members_recalculate ON members;
CREATE TRIGGER trg_members_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON members
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_recalculate_counters();

-- Trigger on events table
DROP TRIGGER IF EXISTS trg_events_recalculate ON events;
CREATE TRIGGER trg_events_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_recalculate_counters();

-- Trigger on innovations table
DROP TRIGGER IF EXISTS trg_innovations_recalculate ON innovations;
CREATE TRIGGER trg_innovations_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON innovations
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_recalculate_counters();

-- Trigger on member_designations table
DROP TRIGGER IF EXISTS trg_designations_recalculate ON member_designations;
CREATE TRIGGER trg_designations_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON member_designations
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_recalculate_counters();

-- 3. Storage Bucket Policies untuk Innovations
-- ============================================================================
DO $$
BEGIN
  -- Ensure innovations bucket exists
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('innovations', 'innovations', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO UPDATE SET public = true;

  -- Auth upload policy for innovations
  EXECUTE format('DROP POLICY IF EXISTS "Auth Upload - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Upload - innovations" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', 'innovations');

  -- Public read policy for innovations
  EXECUTE format('DROP POLICY IF EXISTS "Public Read - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Public Read - innovations" ON storage.objects FOR SELECT USING (bucket_id = %L);', 'innovations');

  -- Auth delete policy for innovations
  EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - innovations" ON storage.objects;');
  EXECUTE format('CREATE POLICY "Auth Delete - innovations" ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', 'innovations');
END $$;

-- 4. Pastikan tabel member_designations memiliki RLS yang benar
-- ============================================================================
ALTER TABLE IF EXISTS member_designations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can manage designations" ON member_designations;
CREATE POLICY "Authenticated can manage designations" ON member_designations
  FOR ALL USING (auth.role() = 'authenticated');

-- 5. Jalankan recalculate sekali untuk update data existing
-- ============================================================================
SELECT recalculate_all_counters();

-- 6. Update total_members di tabel districts & villages (jika ada kolom)
-- ============================================================================
-- Districts mungkin belum punya kolom total_members, tambahkan jika belum ada
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'districts' AND column_name = 'total_members'
  ) THEN
    ALTER TABLE districts ADD COLUMN total_members INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'villages' AND column_name = 'total_members'
  ) THEN
    ALTER TABLE villages ADD COLUMN total_members INTEGER DEFAULT 0;
  END IF;
END $$;

-- Update existing district counters
UPDATE districts d
SET total_members = (
  SELECT COUNT(*) FROM members
  WHERE status = 'active' AND district_id::text = d.id::text
);

-- Update existing village counters
UPDATE villages v
SET total_members = (
  SELECT COUNT(*) FROM members
  WHERE status = 'active' AND village_id::text = v.id::text
);
