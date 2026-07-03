-- ================================================
-- PRO RI — Fix Province Counters (v2)
-- ================================================
-- Run this ONCE via: psql -h <host> -d <db> -f fix-recalculate-counters.sql
-- Or paste into Supabase SQL Editor.
-- ================================================

-- ================================================
-- 1. FIX: recalculate_province_counters() function
--    Menambahkan update total_members dan semua counters
-- ================================================

CREATE OR REPLACE FUNCTION recalculate_province_counters()
RETURNS void AS $$
BEGIN
  -- Update total_members for provinces (COUNT active members per province)
  UPDATE provinces p
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.province_id = p.id AND m.status = 'active'
  )
  WHERE TRUE;

  -- Update total_trainers for provinces
  UPDATE provinces p
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id = p.id AND m.status = 'active' AND md.designation = 'trainer'
  )
  WHERE TRUE;

  -- Update total_mentors for provinces
  UPDATE provinces p
  SET total_mentors = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id = p.id AND m.status = 'active' AND md.designation = 'mentor'
  )
  WHERE TRUE;

  -- Update total_events for provinces
  UPDATE provinces p
  SET total_events = (
    SELECT COUNT(*)::INTEGER
    FROM events e
    WHERE e.province_id = p.id AND e.status IN ('published', 'ongoing', 'completed')
  )
  WHERE TRUE;

  -- Update total_innovations for provinces
  UPDATE provinces p
  SET total_innovations = (
    SELECT COUNT(*)::INTEGER
    FROM innovations i
    WHERE i.province_id = p.id AND i.status IN ('published', 'featured')
  )
  WHERE TRUE;

  -- Update total_members for regencies
  UPDATE regencies r
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.regency_id = r.id AND m.status = 'active'
  )
  WHERE TRUE;

  -- Update total_trainers for regencies
  UPDATE regencies r
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.regency_id = r.id AND m.status = 'active' AND md.designation = 'trainer'
  )
  WHERE TRUE;

  -- Update total_innovations for provinces
  UPDATE provinces p
  SET total_innovations = (
    SELECT COUNT(*)::INTEGER
    FROM innovations i
    WHERE i.province_id = p.id AND i.status IN ('published', 'featured')
  )
  WHERE TRUE;

  -- Update total_members for regencies
  UPDATE regencies r
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.regency_id = r.id AND m.status = 'active'
  )
  WHERE TRUE;

  -- Update total_trainers for regencies
  UPDATE regencies r
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.regency_id = r.id AND m.status = 'active' AND md.designation = 'trainer'
  )
  WHERE TRUE;

  -- Update total_members for districts
  UPDATE districts d
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.district_id = d.id AND m.status = 'active'
  )
  WHERE TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 2. RUN: Recalculate all counters NOW
-- ================================================

SELECT recalculate_province_counters();

-- ================================================
-- 3. VERIFY: Cek hasil update
-- ================================================

SELECT
  'provinces_with_members' as check_name,
  COUNT(*)::INTEGER as count
FROM public.provinces
WHERE total_members > 0

UNION ALL

SELECT
  'total_members_sum',
  COALESCE(SUM(total_members), 0)::INTEGER
FROM public.provinces

UNION ALL

SELECT
  'total_active_members',
  COUNT(*)::INTEGER
FROM public.members
WHERE status = 'active';

-- ================================================
-- ✅ FIX COMPLETE
-- ================================================
