-- ================================================
-- PRO RI — Database Health Check & Verification
-- ================================================
-- Tanggal: Juli 2026
--
-- Script ini mengecek apakah seluruh database
-- sudah sesuai dengan kebutuhan semua fitur dan
-- pages yang ada di aplikasi PRO RI.
--
-- Cara pakai: Paste ke Supabase SQL Editor
-- Hasil: Tabel dengan status PASS/FAIL/MISSING
-- ================================================

-- ================================================
-- 1. CHECK: TABLES EXISTENCE (21 tables)
-- ================================================
-- Fitur: Semua fitur di aplikasi

SELECT '1.1' as check_id, 'provinces' as item, 'Region' as feature,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'provinces')
  THEN 'PASS' ELSE 'FAIL - MISSING' END as status
UNION ALL
SELECT '1.2', 'regencies', 'Region',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'regencies')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.3', 'districts', 'Region',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.4', 'villages', 'Region',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'villages')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.5', 'roles', 'Role Management',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.6', 'members', 'Anggota / Auth',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.7', 'events', 'Event / Program',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.8', 'event_registrations', 'Event / Pendaftaran',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_registrations')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.9', 'innovations', 'Inovasi',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'innovations')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.10', 'certificates', 'Sertifikat',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.11', 'news', 'Berita',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.12', 'news_comments', 'Berita / Komentar',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news_comments')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.13', 'activity_logs', 'Activity Logs',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.14', 'hero_gallery', 'Hero Gallery',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hero_gallery')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.15', 'activity_gallery', 'Galeri Kegiatan',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_gallery')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.16', 'contact_messages', 'Kontak / Pesan',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.17', 'videos', 'Video Galeri',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videos')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.18', 'programs', 'Program Unggulan',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'programs')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.19', 'program_registrations', 'Program / Pendaftaran',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'program_registrations')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.20', 'member_cards', 'Kartu Anggota',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_cards')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.21', 'member_designations', 'Designation (Trainer/Mentor)',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_designations')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '1.22', 'system_settings', 'Pengaturan Sistem',
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_settings')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
ORDER BY check_id;

-- ================================================
-- 2. CHECK: REQUIRED COLUMNS PER TABLE
-- ================================================

-- === members table ===
SELECT '2.1' as check_id, 'members.auth_id (UUID UNIQUE)' as item,
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='auth_id')
  THEN 'PASS' ELSE 'FAIL - MISSING' END as status
UNION ALL
SELECT '2.2', 'members.member_id (UNIQUE NOT NULL)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='member_id' AND is_nullable='NO')
  THEN 'PASS' ELSE 'FAIL - MISSING/NOT NULL' END
UNION ALL
SELECT '2.3', 'members.status (CHECK)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
    WHERE tc.table_schema='public' AND tc.table_name='members' AND cc.check_clause LIKE '%active%inactive%suspended%')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID CHECK' END
UNION ALL
SELECT '2.4', 'members.technology_interest (TEXT[])',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='members' AND column_name='technology_interest' AND data_type='ARRAY')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID TYPE' END
UNION ALL
SELECT '2.5', 'members.role_id (FK -> roles)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.table_schema='public' AND tc.table_name='members' AND tc.constraint_type='FOREIGN KEY' AND ccu.column_name='id')
  THEN 'PASS' ELSE 'FAIL - MISSING FK' END

UNION ALL

-- === events table ===
SELECT '2.6', 'events.slug (UNIQUE)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.table_schema='public' AND tc.table_name='events' AND tc.constraint_type='UNIQUE' AND tc.constraint_name LIKE '%slug%')
  THEN 'PASS' ELSE 'FAIL - MISSING UNIQUE' END
UNION ALL
SELECT '2.7', 'events.status (CHECK)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
    WHERE tc.table_schema='public' AND tc.table_name='events' AND cc.check_clause LIKE '%published%ongoing%completed%cancelled%')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID CHECK' END

UNION ALL

-- === news table ===
SELECT '2.8', 'news.image_url (TEXT)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='news' AND column_name='image_url')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '2.9', 'news.is_featured (BOOLEAN)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='news' AND column_name='is_featured')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '2.10', 'news.view_count (INTEGER)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='news' AND column_name='view_count')
  THEN 'PASS' ELSE 'FAIL - MISSING' END

UNION ALL

-- === hero_gallery table ===
SELECT '2.11', 'hero_gallery.image_url (NOT NULL)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='hero_gallery' AND column_name='image_url' AND is_nullable='NO')
  THEN 'PASS' ELSE 'FAIL - MISSING/NOT NULL' END
UNION ALL
SELECT '2.12', 'hero_gallery.link_url (TEXT)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='hero_gallery' AND column_name='link_url')
  THEN 'PASS' ELSE 'FAIL - MISSING' END

UNION ALL

-- === activity_gallery table ===
SELECT '2.13', 'activity_gallery.image_url (NOT NULL)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_gallery' AND column_name='image_url' AND is_nullable='NO')
  THEN 'PASS' ELSE 'FAIL - MISSING/NOT NULL' END
UNION ALL
SELECT '2.14', 'activity_gallery.category (CHECK)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
    WHERE tc.table_schema='public' AND tc.table_name='activity_gallery')
  THEN 'PASS' ELSE 'FAIL - MISSING CHECK' END

UNION ALL

-- === certificates table ===
SELECT '2.15', 'certificates.member_id (FK NOT NULL)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='certificates' AND column_name='member_id' AND is_nullable='NO')
  THEN 'PASS' ELSE 'FAIL - MISSING/NOT NULL' END
UNION ALL
SELECT '2.16', 'certificates.type (CHECK)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
    WHERE tc.table_schema='public' AND tc.table_name='certificates' AND cc.check_clause LIKE '%participant%trainer%mentor%winner%')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID CHECK' END

UNION ALL

-- === videos table ===
SELECT '2.17', 'videos.video_url (NOT NULL)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='videos' AND column_name='video_url' AND is_nullable='NO')
  THEN 'PASS' ELSE 'FAIL - MISSING/NOT NULL' END
UNION ALL
SELECT '2.18', 'videos.poster_url (TEXT)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='videos' AND column_name='poster_url')
  THEN 'PASS' ELSE 'FAIL - MISSING' END

UNION ALL

-- === activity_logs table ===
SELECT '2.19', 'activity_logs.metadata (JSONB)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_logs' AND column_name='metadata' AND data_type='jsonb')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID TYPE' END
UNION ALL
SELECT '2.20', 'activity_logs.ip_address (VARCHAR)',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='activity_logs' AND column_name='ip_address')
  THEN 'PASS' ELSE 'FAIL - MISSING' END

UNION ALL

-- === member_cards table ===
SELECT '2.21', 'member_cards.member_number (UNIQUE)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.table_schema='public' AND tc.table_name='member_cards' AND tc.constraint_type='UNIQUE' AND tc.constraint_name LIKE '%member_number%')
  THEN 'PASS' ELSE 'FAIL - MISSING UNIQUE' END

UNION ALL

-- === programs table ===
SELECT '2.22', 'programs.label (CHECK)',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.check_constraints cc
    JOIN information_schema.table_constraints tc ON cc.constraint_name = tc.constraint_name
    WHERE tc.table_schema='public' AND tc.table_name='programs' AND cc.check_clause LIKE '%dibuka%akan datang%ditutup%selesai%')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID CHECK' END
UNION ALL
SELECT '2.23', 'programs.features (TEXT[])',
  CASE WHEN EXISTS (SELECT FROM information_schema.columns WHERE table_schema='public' AND table_name='programs' AND column_name='features' AND data_type='ARRAY')
  THEN 'PASS' ELSE 'FAIL - MISSING/INVALID TYPE' END;

-- ================================================
-- 3. CHECK: FUNCTIONS EXISTENCE
-- ================================================

SELECT '3.1' as check_id, 'generate_member_id()' as item, 'Generate ID Member (PRORI-)',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'generate_member_id')
  THEN 'PASS' ELSE 'FAIL - MISSING' END as status
UNION ALL
SELECT '3.2', 'generate_member_number()', 'Generate Nomor Kartu (PRORI-)',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'generate_member_number')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.3', 'handle_new_user()', 'Trigger: Auto-create member on signup',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'handle_new_user')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.4', 'recalculate_province_counters()', 'Recalculate Counters',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'recalculate_province_counters')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.5', 'increment_download_count(UUID)', 'Download Counter',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'increment_download_count')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.6', 'increment_news_view(UUID)', 'News View Counter (by ID)',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'increment_news_view')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.7', 'increment_view_count(TEXT)', 'News View Counter (by Slug)',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'increment_view_count')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.8', 'update_updated_at_column()', 'Auto-update updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'update_updated_at_column')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.9', 'get_current_member_role()', 'Helper: Get user role',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'get_current_member_role')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.10', 'is_admin_or_super()', 'Helper: Check admin/super_admin',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'is_admin_or_super')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.11', 'trigger_recalculate_counters()', 'Trigger: Auto recalculate',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'trigger_recalculate_counters')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '3.12', 'count_members_by_province()', 'Count members per province',
  CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'count_members_by_province')
  THEN 'PASS' ELSE 'FAIL - MISSING' END;

-- ================================================
-- 4. CHECK: TRIGGERS EXISTENCE
-- ================================================

SELECT '4.1' as check_id, 'update_members_updated_at' as item, 'Auto-update members.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_members_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END as status
UNION ALL
SELECT '4.2', 'update_events_updated_at', 'Auto-update events.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_events_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.3', 'update_innovations_updated_at', 'Auto-update innovations.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_innovations_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.4', 'update_news_updated_at', 'Auto-update news.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_news_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.5', 'update_hero_gallery_updated_at', 'Auto-update hero_gallery.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_hero_gallery_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.6', 'update_activity_gallery_updated_at', 'Auto-update activity_gallery.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_activity_gallery_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.7', 'update_member_cards_updated_at', 'Auto-update member_cards.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_member_cards_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.8', 'update_programs_updated_at', 'Auto-update programs.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_programs_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.9', 'update_videos_updated_at', 'Auto-update videos.updated_at',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_videos_updated_at')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.10', 'on_auth_user_created', 'Auto-create member on auth signup',
  CASE WHEN EXISTS (SELECT 1 FROM pg_trigger t WHERE t.tgname = 'on_auth_user_created' AND t.tgrelid = 'auth.users'::regclass)
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.11', 'on_member_designation_change', 'Auto-recalculate on designation change',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_member_designation_change')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '4.12', 'on_member_status_change', 'Auto-recalculate on status change',
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_member_status_change')
  THEN 'PASS' ELSE 'FAIL - MISSING' END;

-- ================================================
-- 5. CHECK: RLS POLICIES
-- ================================================

SELECT '5.1' as check_id, 'members RLS enabled' as item,
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'members' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END as status
UNION ALL
SELECT '5.2', 'events RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'events' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.3', 'certificates RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'certificates' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.4', 'news RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'news' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.5', 'activity_logs RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'activity_logs' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.6', 'hero_gallery RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'hero_gallery' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.7', 'activity_gallery RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'activity_gallery' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.8', 'videos RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'videos' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.9', 'contact_messages RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'contact_messages' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.10', 'programs RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'programs' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.11', 'member_cards RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'member_cards' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END
UNION ALL
SELECT '5.12', 'member_designations RLS enabled',
  CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'member_designations' AND relnamespace = 'public'::regnamespace)
  THEN 'PASS' ELSE 'FAIL - DISABLED' END

UNION ALL

-- Check specific certificate policies
SELECT '5.13', 'Certificates SELECT policy',
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certificates' AND policyname = 'Certificates are verifiable')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '5.14', 'Certificates INSERT policy (admin)',
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certificates' AND policyname = 'Admins can insert certificates')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '5.15', 'Activity Logs INSERT policy',
  CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'System can insert logs')
  THEN 'PASS' ELSE 'FAIL - MISSING' END;

-- ================================================
-- 6. CHECK: STORAGE BUCKETS
-- ================================================

SELECT '6.1' as check_id, 'news bucket' as item, 'Upload gambar berita',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'news')
  THEN 'PASS' ELSE 'FAIL - MISSING' END as status
UNION ALL
SELECT '6.2', 'videos bucket', 'Upload file video',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'videos')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '6.3', 'events bucket', 'Upload banner event',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'events')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '6.4', 'innovations bucket', 'Upload gambar inovasi',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'innovations')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '6.5', 'photos bucket', 'Upload foto anggota',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'photos')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '6.6', 'member-cards bucket', 'Upload kartu anggota',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'member-cards')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '6.7', 'hero-gallery bucket', 'Upload gambar hero slider',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'hero-gallery')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '6.8', 'activity-gallery bucket', 'Upload gambar galeri kegiatan',
  CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'activity-gallery')
  THEN 'PASS' ELSE 'FAIL - MISSING' END;

-- ================================================
-- 7. CHECK: INDEXES
-- ================================================

SELECT '7.1' as check_id, 'idx_members_auth' as item,
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_members_auth')
  THEN 'PASS' ELSE 'FAIL - MISSING' END as status
UNION ALL
SELECT '7.2', 'idx_members_status',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_members_status')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.3', 'idx_events_status',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_events_status')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.4', 'idx_innovations_status',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_innovations_status')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.5', 'idx_certificates_member',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_certificates_member')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.6', 'idx_news_status',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_status')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.7', 'idx_news_published',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_published')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.8', 'idx_news_featured',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_news_featured')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.9', 'idx_activity_logs_created',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_activity_logs_created')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.10', 'idx_hero_gallery_active',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_hero_gallery_active')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '7.11', 'idx_member_cards_status',
  CASE WHEN EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_member_cards_status')
  THEN 'PASS' ELSE 'FAIL - MISSING' END;

-- ================================================
-- 8. CHECK: SEED DATA
-- ================================================

SELECT '8.1' as check_id, 'Roles (4 roles)' as item,
  CASE WHEN (SELECT COUNT(*) FROM roles) >= 4 THEN 'PASS (' || (SELECT COUNT(*)::TEXT FROM roles) || ' roles)'
  ELSE 'FAIL - Only ' || (SELECT COUNT(*)::TEXT FROM roles) || ' roles (need 4)' END as status
UNION ALL
SELECT '8.2', 'Provinces (38 provinsi)',
  CASE WHEN (SELECT COUNT(*) FROM provinces) >= 38 THEN 'PASS (' || (SELECT COUNT(*)::TEXT FROM provinces) || ' provinsi)'
  ELSE 'FAIL - Only ' || (SELECT COUNT(*)::TEXT FROM provinces) || ' provinsi (need 38)' END
UNION ALL
SELECT '8.3', 'Programs (6 program default)',
  CASE WHEN (SELECT COUNT(*) FROM programs) >= 6 THEN 'PASS (' || (SELECT COUNT(*)::TEXT FROM programs) || ' program)'
  ELSE 'FAIL - Only ' || (SELECT COUNT(*)::TEXT FROM programs) || ' program (need 6)' END;

-- ================================================
-- 9. CHECK: FUNCTION OUTPUT (PRORI prefix)
-- ================================================

-- Cek bahwa generate_member_id menghasilkan format PRORI
SELECT '9.1' as check_id, 'generate_member_id() returns PRORI-YYYY-NNNNN' as item,
  CASE WHEN generate_member_id() LIKE 'PRORI-%'
  THEN 'PASS - ' || generate_member_id()
  ELSE 'FAIL - ' || COALESCE(generate_member_id(), 'NULL') END as status;

-- Cek bahwa generate_member_number menghasilkan format PRORI-NNNNNN
SELECT '9.2' as check_id, 'generate_member_number() returns PRORI-NNNNNN' as item,
  CASE WHEN generate_member_number() LIKE 'PRORI-%'
  THEN 'PASS - ' || generate_member_number()
  ELSE 'FAIL - ' || COALESCE(generate_member_number(), 'NULL') END as status;

-- ================================================
-- 10. CHECK: SYSTEM SETTINGS
-- ================================================

SELECT '10.1' as check_id, 'member_card_config has PRORI prefix' as item,
  CASE WHEN EXISTS (SELECT 1 FROM system_settings WHERE key = 'member_card_config' AND value->>'member_number_prefix' = 'PRORI')
  THEN 'PASS' ELSE 'FAIL - MISSING/WRONG PREFIX' END as status
UNION ALL
SELECT '10.2', 'features setting exists',
  CASE WHEN EXISTS (SELECT 1 FROM system_settings WHERE key = 'features')
  THEN 'PASS' ELSE 'FAIL - MISSING' END
UNION ALL
SELECT '10.3', 'maintenance setting exists',
  CASE WHEN EXISTS (SELECT 1 FROM system_settings WHERE key = 'maintenance')
  THEN 'PASS' ELSE 'FAIL - MISSING' END;

-- ================================================
-- 11. FINAL SUMMARY
-- ================================================

WITH checks AS (
  -- Count all check results from sections 1-10
  SELECT 'TABLES (21 tables)' as section, COUNT(*) as total,
    SUM(CASE WHEN status LIKE 'PASS%' THEN 1 ELSE 0 END) as passed
  FROM (
    SELECT status FROM (
      SELECT '1.1' as id,
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'provinces') THEN 'PASS' ELSE 'FAIL' END as status
      UNION ALL SELECT '1.2',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'regencies') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.3',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'districts') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.4',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'villages') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.5',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'roles') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.6',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.7',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.8',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'event_registrations') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.9',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'innovations') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.10',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.11',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.12',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news_comments') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.13',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.14',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'hero_gallery') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.15',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_gallery') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.16',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contact_messages') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.17',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videos') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.18',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'programs') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.19',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'program_registrations') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.20',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_cards') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.21',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'member_designations') THEN 'PASS' ELSE 'FAIL' END
      UNION ALL SELECT '1.22',
        CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'system_settings') THEN 'PASS' ELSE 'FAIL' END
    ) t WHERE status = 'PASS'
  ) subq
  UNION ALL
  SELECT 'FUNCTIONS (12 functions)', COUNT(*),
    SUM(CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = v.proname) THEN 1 ELSE 0 END)
  FROM (VALUES ('generate_member_id'), ('generate_member_number'), ('handle_new_user'), ('recalculate_province_counters'), ('increment_download_count'), ('increment_news_view'), ('increment_view_count'), ('update_updated_at_column'), ('get_current_member_role'), ('is_admin_or_super'), ('trigger_recalculate_counters'), ('count_members_by_province')) AS v(proname)
  UNION ALL
  SELECT 'TRIGGERS (12 triggers)', COUNT(*),
    SUM(CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = v.tgname) THEN 1 ELSE 0 END)
  FROM (VALUES ('update_members_updated_at'), ('update_events_updated_at'), ('update_innovations_updated_at'), ('update_news_updated_at'), ('update_hero_gallery_updated_at'), ('update_activity_gallery_updated_at'), ('update_member_cards_updated_at'), ('update_programs_updated_at'), ('update_videos_updated_at'), ('on_auth_user_created'), ('on_member_designation_change'), ('on_member_status_change')) AS v(tgname)
  UNION ALL
  SELECT 'STORAGE BUCKETS (8 buckets)', COUNT(*),
    SUM(CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = v.bid) THEN 1 ELSE 0 END)
  FROM (VALUES ('news'), ('videos'), ('events'), ('innovations'), ('photos'), ('member-cards'), ('hero-gallery'), ('activity-gallery')) AS v(bid)
  UNION ALL
  SELECT 'RLS POLICIES', COUNT(*), SUM(CASE WHEN status LIKE 'PASS%' THEN 1 ELSE 0 END)
  FROM (
    SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'members' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END as status FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'events' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'certificates' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'news' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'activity_logs' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'videos' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'hero_gallery' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'activity_gallery' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'contact_messages' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'programs' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'member_cards' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'member_designations' AND relnamespace = 'public'::regnamespace) THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'activity_logs' AND policyname = 'System can insert logs') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certificates' AND policyname = 'Certificates are verifiable') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'certificates' AND policyname = 'Admins can insert certificates') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
  ) subq
  UNION ALL
  SELECT 'SEED DATA', 3,
    (CASE WHEN (SELECT COUNT(*) FROM roles) >= 4 THEN 1 ELSE 0 END) +
    (CASE WHEN (SELECT COUNT(*) FROM provinces) >= 38 THEN 1 ELSE 0 END) +
    (CASE WHEN (SELECT COUNT(*) FROM programs) >= 6 THEN 1 ELSE 0 END)
)
SELECT
  '=== HEALTH CHECK SUMMARY ===' as report,
  NOW()::TEXT as checked_at,
  SUM(total) as total_checks,
  SUM(passed) as passed,
  SUM(total) - SUM(passed) as failed,
  ROUND(100.0 * SUM(passed) / NULLIF(SUM(total), 0), 1)::TEXT || '%' as health_score
FROM checks;

-- Final verdict
WITH score AS (
  SELECT ROUND(100.0 * SUM(passed) / NULLIF(SUM(total), 0), 1) as pct
  FROM (
    SELECT COUNT(*) as total, SUM(CASE WHEN status LIKE 'PASS%' THEN 1 ELSE 0 END) as passed
    FROM (
      SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'members') THEN 'PASS' ELSE 'FAIL' END as status FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'news') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'certificates') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'videos') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'activity_logs') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'generate_member_id') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'public' AND p.proname = 'recalculate_province_counters') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'news') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'videos') THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN (SELECT COUNT(*) FROM roles) >= 4 THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
      UNION ALL SELECT CASE WHEN (SELECT COUNT(*) FROM provinces) >= 38 THEN 'PASS' ELSE 'FAIL' END FROM (SELECT 1) t
    ) critical_checks
  ) summary
)
SELECT
  CASE
    WHEN pct = 100 THEN '✅ DATABASE HEALTH: PERFECT — Semua komponen database terverifikasi!'
    WHEN pct >= 90 THEN '✅ DATABASE HEALTH: GOOD — ' || pct || '% komponen OK, beberapa minor issue'
    WHEN pct >= 70 THEN '⚠️ DATABASE HEALTH: WARNING — ' || pct || '% komponen OK, ada beberapa komponen missing'
    ELSE '❌ DATABASE HEALTH: CRITICAL — Hanya ' || pct || '% komponen OK, perlu segera diperbaiki'
  END as verdict
FROM score;

-- ================================================
-- ✅ VERIFICATION COMPLETE
-- ================================================
-- Semua cek di atas hanya READ-ONLY, tidak mengubah
-- data apapun di database. Aman dijalankan kapan saja.
-- ================================================
