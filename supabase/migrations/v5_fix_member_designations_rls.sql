-- ================================================
-- v5 Migration: Fix Member Designations RLS Policy
-- ================================================
-- Masalah: Policy "Authenticated can manage designations"
-- hanya punya USING clause tanpa WITH CHECK, sehingga
-- INSERT ke member_designations ditolak oleh RLS.
--
-- Solusi:
--   1. Hapus policy lama yang FOR ALL USING (tanpa WITH CHECK)
--   2. Buat policy baru dengan USING + WITH CHECK untuk admin
--   3. Juga buat policy SELECT untuk publik/member
-- ================================================
-- Cara pakai: Paste ke Supabase SQL Editor → Run
-- ================================================

BEGIN;

-- Hapus policy lama yang bermasalah
DROP POLICY IF EXISTS "Authenticated can manage designations" ON member_designations;

-- Buat policy baru untuk admin (INSERT, UPDATE, DELETE) — dengan WITH CHECK
DROP POLICY IF EXISTS "Admins can manage designations" ON member_designations;
CREATE POLICY "Admins can manage designations" ON member_designations
  FOR ALL
  USING (is_admin_or_super())
  WITH CHECK (is_admin_or_super());

-- Buat policy SELECT untuk member (melihat designation sendiri)
DROP POLICY IF EXISTS "Members can view own designations" ON member_designations;
CREATE POLICY "Members can view own designations" ON member_designations
  FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));

-- Buat policy SELECT untuk publik (melihat designation siapa pun)
DROP POLICY IF EXISTS "Public can view designations" ON member_designations;
CREATE POLICY "Public can view designations" ON member_designations
  FOR SELECT
  USING (TRUE);

-- ================================================
-- 4. Buat RPC function untuk set_member_designation
-- ================================================
-- Fungsi ini bypass PostgREST layer dan langsung
-- INSERT/DELETE di PostgreSQL. Digunakan oleh server
-- action setMemberDesignation() untuk menghindari error
-- "update requires a WHERE clause" dari PostgREST.

CREATE OR REPLACE FUNCTION set_member_designation(
  p_member_id UUID,
  p_designation TEXT,
  p_active BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_active THEN
    INSERT INTO member_designations (member_id, designation)
    VALUES (p_member_id, p_designation)
    ON CONFLICT (member_id, designation) DO NOTHING;
  ELSE
    DELETE FROM member_designations
    WHERE member_id = p_member_id AND designation = p_designation;
  END IF;
  
  RETURN TRUE;
END;
$$;

COMMIT;

-- ================================================
-- ✅ v5 MIGRATION COMPLETE
-- ================================================
