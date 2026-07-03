-- ================================================
-- PRO RI — Fix Province Counters (v3)
-- ================================================
-- FIX: Gunakan ::text comparison (bukan ::uuid cast)
-- untuk menghindari error jika ada string kosong.
-- ================================================

-- ================================================
-- 1. FIX: recalculate_province_counters() function
-- ================================================

CREATE OR REPLACE FUNCTION recalculate_province_counters()
RETURNS void AS $$
BEGIN
  -- ===========================================
  -- PROVINCES
  -- ===========================================

  -- total_members
  UPDATE provinces p
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.province_id::text = p.id::text AND m.status = 'active'
  );

  -- total_trainers
  UPDATE provinces p
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'trainer'
  );

  -- total_mentors
  UPDATE provinces p
  SET total_mentors = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'mentor'
  );

  -- total_events
  UPDATE provinces p
  SET total_events = (
    SELECT COUNT(*)::INTEGER
    FROM events e
    WHERE e.province_id::text = p.id::text AND e.status IN ('published', 'ongoing', 'completed')
  );

  -- total_innovations
  UPDATE provinces p
  SET total_innovations = (
    SELECT COUNT(*)::INTEGER
    FROM innovations i
    WHERE i.province_id::text = p.id::text AND i.status IN ('published', 'featured')
  );

  -- ===========================================
  -- REGENCIES
  -- ===========================================

  -- total_members
  UPDATE regencies r
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.regency_id::text = r.id::text AND m.status = 'active'
  );

  -- total_trainers
  UPDATE regencies r
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.regency_id::text = r.id::text AND m.status = 'active' AND md.designation = 'trainer'
  );

  -- ===========================================
  -- DISTRICTS
  -- ===========================================

  -- total_members
  UPDATE districts d
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.district_id::text = d.id::text AND m.status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 2. RUN: Recalculate all counters NOW
-- ================================================

SELECT recalculate_province_counters();

-- ================================================
-- 3. VERIFY
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
