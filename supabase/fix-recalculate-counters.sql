-- ================================================
-- PRO RI — Fix Existing Data
-- ================================================
-- Run this ONCE after deployment to fix existing members
-- that were created before the trigger/UNIQUE constraint fix.
-- ================================================

-- 1. Fix members that don't have a role_id (created by fallback code)
UPDATE public.members m
SET role_id = r.id
FROM public.roles r
WHERE m.role_id IS NULL
  AND r.name = 'member';

-- 2. Recalculate province counters from actual member data
SELECT recalculate_province_counters();

-- 3. Verify the fixes
SELECT 'members_without_role' as check_name, COUNT(*) as count FROM public.members WHERE role_id IS NULL
UNION ALL
SELECT 'members_with_role', COUNT(*) FROM public.members WHERE role_id IS NOT NULL
UNION ALL
SELECT 'provinces_with_members', COUNT(*) FROM public.provinces WHERE total_members > 0;

-- ================================================
-- ✅ FIX COMPLETE
-- ================================================
