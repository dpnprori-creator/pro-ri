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
CREATE POLICY "Admins can manage designations" ON member_designations
  FOR ALL
  USING (is_admin_or_super())
  WITH CHECK (is_admin_or_super());

-- Buat policy SELECT untuk member (melihat designation sendiri)
CREATE POLICY "Members can view own designations" ON member_designations
  FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));

-- Buat policy SELECT untuk publik (melihat designation siapa pun)
CREATE POLICY "Public can view designations" ON member_designations
  FOR SELECT
  USING (TRUE);

COMMIT;

-- ================================================
-- ✅ v5 MIGRATION COMPLETE
-- ================================================
