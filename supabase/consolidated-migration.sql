-- ====================================================================
-- PRO RI DIGITAL COMMAND CENTER
-- Self-Hosted Supabase — MASTER CONSOLIDATED MIGRATION
-- ====================================================================
-- Eksekusi SEKALI pada Supabase instance baru.
--
-- Cara pakai:
--   psql -h <host> -d <db> -f consolidated-migration.sql
--
-- ATAU paste langsung ke Supabase SQL Editor.
--
-- File ini adalah SATU-SATUNYA file migrasi yang perlu dijalankan.
-- Mencakup semua perubahan dari migrations/v1 sampai v6.
-- ====================================================================
-- Isi:
--   PHASE 0  : Extensions + UUID
--   PHASE 1  : Schema (22 tables + constraints)
--   PHASE 2  : Indexes (51 indexes)
--   PHASE 3  : Functions (17 functions)
--   PHASE 4  : Triggers (12 triggers)
--   PHASE 5  : RLS Policies (64+ policies)
--   PHASE 6  : Storage Buckets + RLS (8 buckets)
--   PHASE 7  : Seed Data (roles, provinces, programs, hero/activity gallery)
--   PHASE 8  : Data Migrations (existing data fixes, province coordinates)
--   PHASE 9  : Initial Recalculation
--   APPENDIX : Verify Database Health (opsional — read-only)
-- ====================================================================

-- ====================================================================
-- PHASE 0: EXTENSIONS
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- PHASE 1: SCHEMA — 22 Tables
-- ====================================================================

-- ===========================================
-- 1.1 REGIONS TABLES
-- ===========================================

CREATE TABLE IF NOT EXISTS provinces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  capital VARCHAR(100),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  total_members INTEGER DEFAULT 0,
  total_trainers INTEGER DEFAULT 0,
  total_mentors INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_innovations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  province_id UUID NOT NULL REFERENCES provinces(id) ON DELETE CASCADE,
  code VARCHAR(5) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  total_members INTEGER DEFAULT 0,
  total_trainers INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  total_innovations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS districts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regency_id UUID NOT NULL REFERENCES regencies(id) ON DELETE CASCADE,
  code VARCHAR(8) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  total_members INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS villages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district_id UUID NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  code VARCHAR(13) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.2 ROLES
-- ===========================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

-- ===========================================
-- 1.3 MEMBERS
-- ===========================================

CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  province_id UUID REFERENCES provinces(id),
  regency_id UUID REFERENCES regencies(id),
  district_id UUID REFERENCES districts(id),
  village_id UUID REFERENCES villages(id),
  occupation VARCHAR(100),
  technology_interest TEXT[],
  role_id UUID REFERENCES roles(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  photo_url TEXT,
  qr_code TEXT,
  total_events_attended INTEGER DEFAULT 0,
  total_certificates INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.4 EVENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('webinar', 'workshop', 'competition', 'exhibition')),
  type VARCHAR(50) DEFAULT 'online' CHECK (type IN ('online', 'offline', 'hybrid')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  province_id UUID REFERENCES provinces(id),
  max_participants INTEGER,
  banner_url TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'approved', 'rejected', 'attended', 'cancelled')),
  attended_at TIMESTAMPTZ,
  notes TEXT,
  approved_by UUID REFERENCES members(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- ===========================================
-- 1.5 INNOVATIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS innovations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('robotics', 'ai', 'iot', 'programming', 'research')),
  image_url TEXT,
  creator_id UUID REFERENCES members(id),
  province_id UUID REFERENCES provinces(id),
  year INTEGER,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'featured', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.6 CERTIFICATES
-- ===========================================

CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_number VARCHAR(30) UNIQUE NOT NULL,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('participant', 'trainer', 'mentor', 'winner')),
  title VARCHAR(200) NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.7 NEWS
-- ===========================================

CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  author_id UUID REFERENCES members(id),
  category VARCHAR(50) DEFAULT 'article' CHECK (category IN ('article', 'announcement', 'press_release')),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.8 ACTIVITY LOGS
-- ===========================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.9 HERO GALLERY
-- ===========================================

CREATE TABLE IF NOT EXISTS hero_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  link_label VARCHAR(100) DEFAULT 'Pelajari Selengkapnya',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.10 CONTACT MESSAGES
-- ===========================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.11 VIDEOS
-- ===========================================

CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  poster_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.12 NEWS COMMENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS news_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.13 ACTIVITY GALLERY
-- ===========================================

CREATE TABLE IF NOT EXISTS activity_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('workshop', 'competition', 'exhibition', 'training', 'social', 'meeting', 'other')),
  date_taken DATE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.14 MEMBER DESIGNATIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS member_designations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  designation VARCHAR(20) NOT NULL CHECK (designation IN ('trainer', 'mentor')),
  certified_by UUID REFERENCES members(id),
  certified_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, designation)
);

-- ===========================================
-- 1.15 PROGRAMS
-- ===========================================

CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  icon VARCHAR(50) DEFAULT 'GraduationCap',
  image_url TEXT,
  features TEXT[] DEFAULT '{}',
  target_audience TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  label VARCHAR(50) DEFAULT 'dibuka' CHECK (label IN ('dibuka', 'akan datang', 'ditutup', 'selesai')),
  max_participants INTEGER,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES members(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.16 PROGRAM REGISTRATIONS
-- ===========================================

CREATE TABLE IF NOT EXISTS program_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'approved', 'rejected', 'cancelled', 'completed')),
  notes TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, member_id)
);

-- ===========================================
-- 1.17 MEMBER CARDS
-- ===========================================

CREATE TABLE IF NOT EXISTS member_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_number VARCHAR(20) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  full_name VARCHAR(200) NOT NULL,
  nickname VARCHAR(100),
  family_count INTEGER DEFAULT 1,
  gender VARCHAR(20) CHECK (gender IN ('Laki-laki', 'Perempuan')),
  birth_place VARCHAR(100),
  birth_date DATE,
  religion VARCHAR(50),
  nik VARCHAR(16),
  npwp VARCHAR(20),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  postal_code VARCHAR(10),
  education VARCHAR(100),
  occupation VARCHAR(100),
  interests JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  experience TEXT,
  motivation TEXT,
  photo_url TEXT,
  signature_url TEXT,
  card_image_url TEXT,
  qr_code_url TEXT,
  verified_by UUID REFERENCES members(id),
  verified_at TIMESTAMPTZ,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 1.18 SYSTEM SETTINGS
-- ===========================================

CREATE TABLE IF NOT EXISTS public.system_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  label TEXT,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ====================================================================
-- PHASE 2: INDEXES — 51 indexes
-- ====================================================================

-- Members
CREATE INDEX IF NOT EXISTS idx_members_province ON members(province_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role_id);
CREATE INDEX IF NOT EXISTS idx_members_auth ON members(auth_id);
CREATE INDEX IF NOT EXISTS idx_members_name_search ON members USING gin(to_tsvector('indonesian', full_name));

-- Events
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_province ON events(province_id);
CREATE INDEX IF NOT EXISTS idx_events_title_search ON events USING gin(to_tsvector('indonesian', title));

-- Event Registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_approved ON event_registrations(approved_by);

-- Innovations
CREATE INDEX IF NOT EXISTS idx_innovations_category ON innovations(category);
CREATE INDEX IF NOT EXISTS idx_innovations_province ON innovations(province_id);
CREATE INDEX IF NOT EXISTS idx_innovations_creator ON innovations(creator_id);
CREATE INDEX IF NOT EXISTS idx_innovations_status ON innovations(status);

-- Certificates
CREATE INDEX IF NOT EXISTS idx_certificates_member ON certificates(member_id);
CREATE INDEX IF NOT EXISTS idx_certificates_event ON certificates(event_id);

-- News
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_news_title_search ON news USING gin(to_tsvector('indonesian', title));

-- News Comments
CREATE INDEX IF NOT EXISTS idx_news_comments_news ON news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_approved ON news_comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_news_comments_created ON news_comments(created_at DESC);

-- Activity Logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_member ON activity_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);

-- Regions
CREATE INDEX IF NOT EXISTS idx_regencies_province ON regencies(province_id);
CREATE INDEX IF NOT EXISTS idx_districts_regency ON districts(regency_id);
CREATE INDEX IF NOT EXISTS idx_villages_district ON villages(district_id);

-- Hero Gallery
CREATE INDEX IF NOT EXISTS idx_hero_gallery_active ON hero_gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_gallery_sort ON hero_gallery(sort_order);

-- Activity Gallery
CREATE INDEX IF NOT EXISTS idx_activity_gallery_active ON activity_gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_activity_gallery_sort ON activity_gallery(sort_order);
CREATE INDEX IF NOT EXISTS idx_activity_gallery_category ON activity_gallery(category);

-- Contact Messages
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

-- Videos
CREATE INDEX IF NOT EXISTS idx_videos_active ON videos(is_active);
CREATE INDEX IF NOT EXISTS idx_videos_sort ON videos(sort_order);

-- Member Designations
CREATE INDEX IF NOT EXISTS idx_member_designations_member ON member_designations(member_id);
CREATE INDEX IF NOT EXISTS idx_member_designations_type ON member_designations(designation);

-- Member Cards
CREATE INDEX IF NOT EXISTS idx_member_cards_user ON member_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_member_cards_status ON member_cards(status);
CREATE INDEX IF NOT EXISTS idx_member_cards_number ON member_cards(member_number);

-- Programs
CREATE INDEX IF NOT EXISTS idx_programs_status ON programs(status);
CREATE INDEX IF NOT EXISTS idx_programs_label ON programs(label);
CREATE INDEX IF NOT EXISTS idx_programs_sort ON programs(sort_order);
CREATE INDEX IF NOT EXISTS idx_programs_created_by ON programs(created_by);
CREATE INDEX IF NOT EXISTS idx_programs_title_search ON programs USING gin(to_tsvector('indonesian', title));

-- Program Registrations
CREATE INDEX IF NOT EXISTS idx_program_registrations_program ON program_registrations(program_id);
CREATE INDEX IF NOT EXISTS idx_program_registrations_member ON program_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_program_registrations_status ON program_registrations(status);

-- ====================================================================
-- PHASE 3: FUNCTIONS — 17 functions
-- ====================================================================

-- 3.1 Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3.2 Generate member ID (PRO-RI-2026-00001)
CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  next_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_id, '-', 4) AS INTEGER)), 0) + 1
  INTO next_seq
  FROM members
  WHERE member_id LIKE 'PRO-RI-' || year || '-%';
  RETURN 'PRO-RI-' || year || '-' || LPAD(next_seq::TEXT, 5, '0');
END;
$$;

-- 3.3 Handle new user signup — auto-create member
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  member_role_id UUID;
  new_member_id TEXT;
BEGIN
  SELECT id INTO member_role_id FROM roles WHERE name = 'member' LIMIT 1;
  new_member_id := generate_member_id();

  INSERT INTO public.members (auth_id, member_id, full_name, email, role_id, status, created_at, updated_at)
  VALUES (NEW.id, new_member_id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email, member_role_id, 'active', NOW(), NOW())
  ON CONFLICT (auth_id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create member for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3.4 Generate member card number (PRO-RI-000001)
CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS VARCHAR(20) AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_number, '-', 3) AS INTEGER)), 0) + 1
  INTO next_num
  FROM member_cards
  WHERE member_number IS NOT NULL
    AND member_number LIKE 'PRO-RI-%';
  RETURN 'PRO-RI-' || LPAD(next_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 3.5 Increment download count
CREATE OR REPLACE FUNCTION increment_download_count(card_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE member_cards
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.6 Increment news view count (by ID)
CREATE OR REPLACE FUNCTION increment_news_view(news_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE news SET view_count = view_count + 1 WHERE id = news_id RETURNING view_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.7 Increment news view count (by slug)
CREATE OR REPLACE FUNCTION increment_view_count(slug_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE news SET view_count = COALESCE(view_count, 0) + 1 WHERE slug = slug_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.8 Recalculate province counters (for triggers)
CREATE OR REPLACE FUNCTION trigger_recalculate_counters()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalculate_province_counters();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.9 Recalculate province counters (for triggers)
CREATE OR REPLACE FUNCTION recalculate_province_counters()
RETURNS void AS $$
BEGIN
  -- PROVINCES
  UPDATE provinces p SET
    total_members = (SELECT COUNT(*)::INTEGER FROM members m WHERE m.province_id::text = p.id::text AND m.status = 'active'),
    total_trainers = (SELECT COUNT(DISTINCT m.id)::INTEGER FROM members m JOIN member_designations md ON md.member_id = m.id WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'trainer'),
    total_mentors = (SELECT COUNT(DISTINCT m.id)::INTEGER FROM members m JOIN member_designations md ON md.member_id = m.id WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'mentor'),
    total_events = (SELECT COUNT(*)::INTEGER FROM events e WHERE e.province_id::text = p.id::text AND e.status IN ('published', 'ongoing', 'completed')),
    total_innovations = (SELECT COUNT(*)::INTEGER FROM innovations i WHERE i.province_id::text = p.id::text AND i.status IN ('published', 'featured'))
  WHERE TRUE;

  -- REGENCIES
  UPDATE regencies r SET
    total_members = (SELECT COUNT(*)::INTEGER FROM members m WHERE m.regency_id::text = r.id::text AND m.status = 'active'),
    total_trainers = (SELECT COUNT(DISTINCT m.id)::INTEGER FROM members m JOIN member_designations md ON md.member_id = m.id WHERE m.regency_id::text = r.id::text AND m.status = 'active' AND md.designation = 'trainer')
  WHERE TRUE;

  -- DISTRICTS
  UPDATE districts d SET
    total_members = (SELECT COUNT(*)::INTEGER FROM members m WHERE m.district_id::text = d.id::text AND m.status = 'active')
  WHERE TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.10 Alternative recalculate (all at once, with WHERE TRUE for safety)
CREATE OR REPLACE FUNCTION recalculate_all_counters()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE provinces p SET
    total_members = (SELECT COUNT(*) FROM members WHERE province_id::text = p.id::text AND status = 'active'),
    total_trainers = (SELECT COUNT(*) FROM member_designations md JOIN members m2 ON m2.id = md.member_id WHERE m2.province_id::text = p.id::text AND md.designation = 'trainer'),
    total_events = (SELECT COUNT(*) FROM events WHERE province_id::text = p.id::text),
    total_innovations = (SELECT COUNT(*) FROM innovations WHERE province_id::text = p.id::text AND status != 'archived')
  WHERE TRUE;

  UPDATE regencies r SET
    total_members = (SELECT COUNT(*) FROM members WHERE regency_id::text = r.id::text AND status = 'active'),
    total_trainers = (SELECT COUNT(*) FROM member_designations md JOIN members m2 ON m2.id = md.member_id WHERE m2.regency_id::text = r.id::text AND md.designation = 'trainer'),
    total_events = 0,
    total_innovations = 0
  WHERE TRUE;

  UPDATE districts d SET
    total_members = (SELECT COUNT(*) FROM members WHERE district_id::text = d.id::text AND status = 'active')
  WHERE TRUE;
END;
$$;

-- 3.11 Count members by province
CREATE OR REPLACE FUNCTION count_members_by_province()
RETURNS TABLE(province_id UUID, total BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT m.province_id, COUNT(*)::BIGINT AS total
  FROM members m
  WHERE m.province_id IS NOT NULL
  GROUP BY m.province_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.12 RLS Helper: get current member role
CREATE OR REPLACE FUNCTION get_current_member_role()
RETURNS VARCHAR(50) AS $$
DECLARE
  user_role VARCHAR(50);
BEGIN
  SELECT r.name INTO user_role
  FROM members m JOIN roles r ON m.role_id = r.id
  WHERE m.auth_id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.13 RLS Helper: check admin or super admin
CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_member_role() IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.14 Set member designation (bypass PostgREST)
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

-- 3.15 Log member status change (trigger function)
CREATE OR REPLACE FUNCTION log_member_status_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.activity_logs (member_id, action, entity_type, entity_id, metadata)
    VALUES (
      NEW.id, 'member_status_changed', 'member', NEW.id,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to log status change for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 3.16 Log designation change (trigger function)
CREATE OR REPLACE FUNCTION log_designation_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.activity_logs (member_id, action, entity_type, entity_id, metadata)
  VALUES (
    NEW.member_id,
    CASE WHEN TG_OP = 'INSERT' THEN 'designation_added' ELSE 'designation_removed' END,
    'designation', NEW.id,
    jsonb_build_object('designation', NEW.designation)
  );
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to log designation change: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- 3.17 System Settings helpers
CREATE OR REPLACE FUNCTION get_setting(p_key TEXT)
RETURNS JSONB AS $$
DECLARE
  v_value JSONB;
BEGIN
  SELECT value INTO v_value FROM public.system_settings WHERE key = p_key;
  RETURN COALESCE(v_value, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_feature_enabled(p_feature TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_features JSONB;
BEGIN
  SELECT value INTO v_features FROM public.system_settings WHERE key = 'features';
  RETURN COALESCE((v_features->>p_feature)::BOOLEAN, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_maintenance_mode()
RETURNS BOOLEAN AS $$
DECLARE
  v_maintenance JSONB;
BEGIN
  SELECT value INTO v_maintenance FROM public.system_settings WHERE key = 'maintenance';
  RETURN COALESCE((v_maintenance->>'enabled')::BOOLEAN, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- PHASE 4: TRIGGERS — 16 triggers
-- ====================================================================

-- 4.1 Member updated_at
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.2 Events updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.3 Innovations updated_at
DROP TRIGGER IF EXISTS update_innovations_updated_at ON innovations;
CREATE TRIGGER update_innovations_updated_at
  BEFORE UPDATE ON innovations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.4 News updated_at
DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.5 Hero gallery updated_at
DROP TRIGGER IF EXISTS update_hero_gallery_updated_at ON hero_gallery;
CREATE TRIGGER update_hero_gallery_updated_at
  BEFORE UPDATE ON hero_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.6 Activity gallery updated_at
DROP TRIGGER IF EXISTS update_activity_gallery_updated_at ON activity_gallery;
CREATE TRIGGER update_activity_gallery_updated_at
  BEFORE UPDATE ON activity_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.7 Member cards updated_at
DROP TRIGGER IF EXISTS update_member_cards_updated_at ON member_cards;
CREATE TRIGGER update_member_cards_updated_at
  BEFORE UPDATE ON member_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.8 Programs updated_at
DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.9 Videos updated_at
DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4.10 Auto-create member on auth signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4.11 Auto-recalculate on designation change
DROP TRIGGER IF EXISTS on_member_designation_change ON member_designations;
CREATE TRIGGER on_member_designation_change
  AFTER INSERT OR UPDATE OR DELETE ON member_designations
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

-- 4.12 Auto-recalculate on member status change
DROP TRIGGER IF EXISTS on_member_status_change ON members;
CREATE TRIGGER on_member_status_change
  AFTER UPDATE OF status ON members
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

-- 4.13 Auto-log member status change
DROP TRIGGER IF EXISTS on_member_status_changed ON members;
CREATE TRIGGER on_member_status_changed
  AFTER UPDATE OF status ON members
  FOR EACH ROW EXECUTE FUNCTION log_member_status_change();

-- 4.14 Auto-log designation inserted
DROP TRIGGER IF EXISTS on_designation_inserted ON member_designations;
CREATE TRIGGER on_designation_inserted
  AFTER INSERT ON member_designations
  FOR EACH ROW EXECUTE FUNCTION log_designation_change();

-- 4.15 Auto-log designation deleted
DROP TRIGGER IF EXISTS on_designation_deleted ON member_designations;
CREATE TRIGGER on_designation_deleted
  AFTER DELETE ON member_designations
  FOR EACH ROW EXECUTE FUNCTION log_designation_change();

-- 4.16 Recalculate triggers (from v3)
DROP TRIGGER IF EXISTS trg_members_recalculate ON members;
CREATE TRIGGER trg_members_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON members
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

DROP TRIGGER IF EXISTS trg_events_recalculate ON events;
CREATE TRIGGER trg_events_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

DROP TRIGGER IF EXISTS trg_innovations_recalculate ON innovations;
CREATE TRIGGER trg_innovations_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON innovations
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

DROP TRIGGER IF EXISTS trg_designations_recalculate ON member_designations;
CREATE TRIGGER trg_designations_recalculate
  AFTER INSERT OR UPDATE OR DELETE ON member_designations
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

-- ====================================================================
-- PHASE 5: RLS POLICIES — 64+ policies
-- ====================================================================

-- 5.1 MEMBERS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members are publicly viewable" ON members FOR SELECT USING (status = 'active');
CREATE POLICY "Members can view own profile" ON members FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Admins can view all members" ON members FOR SELECT USING (is_admin_or_super());
CREATE POLICY "Members can update own profile" ON members FOR UPDATE USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());
CREATE POLICY "Admins can update any member" ON members FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Super admin can delete members" ON members FOR DELETE USING (get_current_member_role() = 'super_admin');

-- 5.2 EVENTS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are publicly viewable" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Members can view all events" ON events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can create events" ON events FOR INSERT WITH CHECK (is_admin_or_super());
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING (is_admin_or_super());

-- 5.3 EVENT REGISTRATIONS
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own registrations" ON event_registrations FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Members can register for events" ON event_registrations FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can manage event registrations" ON event_registrations FOR ALL
  USING (is_admin_or_super());

-- 5.4 INNOVATIONS
ALTER TABLE innovations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published innovations are publicly viewable" ON innovations FOR SELECT
  USING (status IN ('published', 'featured'));
CREATE POLICY "Members can view all innovations" ON innovations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Members can create innovations" ON innovations FOR INSERT
  WITH CHECK (creator_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Creators can update own innovations" ON innovations FOR UPDATE
  USING (creator_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can moderate innovations" ON innovations FOR UPDATE USING (is_admin_or_super());

-- 5.5 CERTIFICATES
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Certificates are verifiable" ON certificates FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert certificates" ON certificates FOR INSERT WITH CHECK (is_admin_or_super());
CREATE POLICY "Admins can update certificates" ON certificates FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Admins can delete certificates" ON certificates FOR DELETE USING (is_admin_or_super());

-- 5.6 NEWS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published news are publicly viewable" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage news" ON news FOR ALL USING (is_admin_or_super());

-- 5.7 REGIONS
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE regencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Regions are publicly viewable" ON provinces FOR SELECT USING (TRUE);
CREATE POLICY "Regencies are publicly viewable" ON regencies FOR SELECT USING (TRUE);
CREATE POLICY "Districts are publicly viewable" ON districts FOR SELECT USING (TRUE);
CREATE POLICY "Villages are publicly viewable" ON villages FOR SELECT USING (TRUE);

-- 5.8 ACTIVITY LOGS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own logs" ON activity_logs FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can view all logs" ON activity_logs FOR SELECT USING (is_admin_or_super());
CREATE POLICY "System can insert logs" ON activity_logs FOR INSERT WITH CHECK (TRUE);

-- 5.9 HERO GALLERY
ALTER TABLE hero_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero gallery is publicly viewable" ON hero_gallery FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage hero gallery" ON hero_gallery FOR ALL USING (is_admin_or_super());

-- 5.10 ACTIVITY GALLERY
ALTER TABLE activity_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity gallery is publicly viewable" ON activity_gallery FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage activity gallery" ON activity_gallery FOR ALL USING (is_admin_or_super());

-- 5.11 CONTACT MESSAGES
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT USING (is_admin_or_super());
CREATE POLICY "Admins can manage contact messages" ON contact_messages FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Admins can delete contact messages" ON contact_messages FOR DELETE USING (is_admin_or_super());

-- 5.12 VIDEOS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "videos_select_public" ON videos FOR SELECT USING (is_active = TRUE);
CREATE POLICY "videos_select_admin" ON videos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "videos_insert_admin" ON videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "videos_update_admin" ON videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "videos_delete_admin" ON videos FOR DELETE USING (auth.role() = 'authenticated');

-- 5.13 NEWS COMMENTS
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert news comments" ON news_comments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Approved comments are publicly viewable" ON news_comments FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Admins can manage news comments" ON news_comments FOR ALL USING (is_admin_or_super());

-- 5.14 MEMBER DESIGNATIONS
ALTER TABLE member_designations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage designations" ON member_designations FOR ALL
  USING (is_admin_or_super()) WITH CHECK (is_admin_or_super());
CREATE POLICY "Members can view own designations" ON member_designations FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Public can view designations" ON member_designations FOR SELECT USING (TRUE);

-- 5.15 PROGRAMS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published programs are publicly viewable" ON programs FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can view all programs" ON programs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage programs" ON programs FOR ALL USING (is_admin_or_super());

CREATE POLICY "Members can view own program registrations" ON program_registrations FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()) OR is_admin_or_super());
CREATE POLICY "Members can register for programs" ON program_registrations FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Members can cancel own program registration" ON program_registrations FOR UPDATE
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can manage program registrations" ON program_registrations FOR ALL
  USING (is_admin_or_super());

-- 5.16 MEMBER CARDS
ALTER TABLE member_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own member card" ON member_cards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own member card" ON member_cards FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own pending card" ON member_cards FOR UPDATE
  USING (user_id = auth.uid() AND status IN ('pending', 'rejected'))
  WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'rejected'));
CREATE POLICY "Admins can view all member cards" ON member_cards FOR SELECT USING (is_admin_or_super());
CREATE POLICY "Admins can update member cards" ON member_cards FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Public can verify approved cards" ON member_cards FOR SELECT USING (status = 'approved');

-- 5.17 ROLES
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read roles" ON roles FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage roles" ON roles FOR ALL USING (is_admin_or_super());

-- 5.18 SYSTEM SETTINGS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admin can manage system settings" ON public.system_settings
  FOR ALL USING (get_current_member_role() = 'super_admin')
  WITH CHECK (get_current_member_role() = 'super_admin');

-- ====================================================================
-- PHASE 6: STORAGE BUCKETS — 8 buckets + RLS
-- ====================================================================

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('news', 'news', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('events', 'events', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('innovations', 'innovations', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('photos', 'photos', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('member-cards', 'member-cards', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('hero-gallery', 'hero-gallery', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('activity-gallery', 'activity-gallery', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('videos', 'videos', TRUE, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE;
END $$;

-- Storage RLS policies
DO $$
DECLARE
  bucket_list TEXT[] := ARRAY['news', 'events', 'innovations', 'photos', 'member-cards', 'hero-gallery', 'activity-gallery', 'videos'];
  b TEXT;
BEGIN
  FOREACH b IN ARRAY bucket_list
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public Read - %s" ON storage.objects;', b);
    EXECUTE format('CREATE POLICY "Public Read - %s" ON storage.objects FOR SELECT USING (bucket_id = %L);', b, b);
    EXECUTE format('DROP POLICY IF EXISTS "Auth Insert - %s" ON storage.objects;', b);
    EXECUTE format('CREATE POLICY "Auth Insert - %s" ON storage.objects FOR INSERT WITH CHECK (bucket_id = %L AND auth.role() = ''authenticated'');', b, b);
    EXECUTE format('DROP POLICY IF EXISTS "Auth Update - %s" ON storage.objects;', b);
    EXECUTE format('CREATE POLICY "Auth Update - %s" ON storage.objects FOR UPDATE USING (bucket_id = %L AND auth.role() = ''authenticated'');', b, b);
    EXECUTE format('DROP POLICY IF EXISTS "Auth Delete - %s" ON storage.objects;', b);
    EXECUTE format('CREATE POLICY "Auth Delete - %s" ON storage.objects FOR DELETE USING (bucket_id = %L AND auth.role() = ''authenticated'');', b, b);
  END LOOP;
END $$;

-- ====================================================================
-- PHASE 7: SEED DATA
-- ====================================================================

-- 7.1 ROLES
INSERT INTO roles (name, description) VALUES
  ('guest', 'Guest user - not registered'),
  ('member', 'Regular member'),
  ('admin', 'Administrator with management access'),
  ('super_admin', 'Super administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- 7.2 38 PROVINCES (numeric Kemendagri codes)
INSERT INTO provinces (code, name) VALUES
  ('11', 'Aceh'), ('12', 'Sumatera Utara'), ('13', 'Sumatera Barat'),
  ('14', 'Riau'), ('15', 'Jambi'), ('16', 'Sumatera Selatan'),
  ('17', 'Bengkulu'), ('18', 'Lampung'), ('19', 'Kepulauan Bangka Belitung'),
  ('21', 'Kepulauan Riau'), ('31', 'Daerah Khusus Ibukota Jakarta'),
  ('32', 'Jawa Barat'), ('33', 'Jawa Tengah'), ('34', 'Daerah Istimewa Yogyakarta'),
  ('35', 'Jawa Timur'), ('36', 'Banten'), ('51', 'Bali'),
  ('52', 'Nusa Tenggara Barat'), ('53', 'Nusa Tenggara Timur'),
  ('61', 'Kalimantan Barat'), ('62', 'Kalimantan Tengah'), ('63', 'Kalimantan Selatan'),
  ('64', 'Kalimantan Timur'), ('65', 'Kalimantan Utara'),
  ('71', 'Sulawesi Utara'), ('72', 'Sulawesi Tengah'), ('73', 'Sulawesi Selatan'),
  ('74', 'Sulawesi Tenggara'), ('75', 'Gorontalo'), ('76', 'Sulawesi Barat'),
  ('81', 'Maluku'), ('82', 'Maluku Utara'),
  ('91', 'Papua'), ('92', 'Papua Barat'), ('93', 'Papua Selatan'),
  ('94', 'Papua Tengah'), ('95', 'Papua Pegunungan'), ('96', 'Papua Barat Daya')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- 7.3 HERO GALLERY SEED
INSERT INTO hero_gallery (title, description, image_url, link_url, link_label, sort_order, is_active)
SELECT * FROM (VALUES
  ('Mencetak Generasi Robotik Indonesia'::VARCHAR, 'Membangun talenta teknologi, inovator, dan pemimpin masa depan menuju Indonesia Emas 2045.'::TEXT, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80'::TEXT, '/register'::TEXT, 'Daftar Anggota'::VARCHAR, 1::INTEGER, TRUE::BOOLEAN),
  ('6 Program Unggulan PRO RI'::VARCHAR, 'Sekolah Robotika Rakyat, Robotika Masuk Sekolah, Akademi AI, Kompetisi Robotika Nasional, Inkubator Inovasi, dan Robotika untuk UMKM.'::TEXT, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80'::TEXT, '/programs'::TEXT, 'Lihat Program'::VARCHAR, 2::INTEGER, TRUE::BOOLEAN),
  ('Indonesia Emas 2045 Dimulai dari Sekarang'::VARCHAR, 'Jadilah bagian dari gerakan robotika nasional. Bersama PRO RI, kita wujudkan kedaulatan teknologi Indonesia.'::TEXT, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80'::TEXT, '/register'::TEXT, 'Daftar Sekarang'::VARCHAR, 3::INTEGER, TRUE::BOOLEAN)
) AS v(title, description, image_url, link_url, link_label, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM hero_gallery LIMIT 1);

-- 7.4 ACTIVITY GALLERY SEED
INSERT INTO activity_gallery (title, description, image_url, category, date_taken, sort_order)
SELECT * FROM (VALUES
  ('Workshop Robotika Dasar'::VARCHAR, 'Peserta sedang belajar merakit robot dasar'::TEXT, 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80'::TEXT, 'workshop'::VARCHAR, '2026-05-15'::DATE, 1),
  ('Kompetisi Robot Line Follower'::VARCHAR, 'Suasana kompetisi robot line follower'::TEXT, 'https://images.unsplash.com/photo-1561144257-e322e8f9f0b9?w=800&q=80'::TEXT, 'competition'::VARCHAR, '2026-04-20'::DATE, 2),
  ('Pameran Teknologi AI'::VARCHAR, 'Stand PRO RI di pameran teknologi AI'::TEXT, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'::TEXT, 'exhibition'::VARCHAR, '2026-03-10'::DATE, 3),
  ('Pelatihan IoT untuk Pemula'::VARCHAR, 'Sesi pelatihan Internet of Things'::TEXT, 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80'::TEXT, 'training'::VARCHAR, '2026-02-28'::DATE, 4),
  ('Kegiatan Sosial Robotika'::VARCHAR, 'Pengenalan robotika kepada anak-anak'::TEXT, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'::TEXT, 'social'::VARCHAR, '2026-01-15'::DATE, 5),
  ('Rapat Koordinasi Nasional'::VARCHAR, 'Rapat koordinasi pengurus PRO RI'::TEXT, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'::TEXT, 'meeting'::VARCHAR, '2025-12-10'::DATE, 6)
) AS v(title, description, image_url, category, date_taken, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM activity_gallery LIMIT 1);

-- 7.5 DEFAULT PROGRAMS
INSERT INTO programs (title, slug, description, short_description, icon, features, target_audience, status, label, sort_order)
SELECT * FROM (VALUES
  ('Sekolah Robotika Rakyat'::VARCHAR, 'sekolah-robotika-rakyat'::VARCHAR, 'Program pendidikan dan pelatihan robotika berbasis komunitas yang diselenggarakan di tingkat desa/kelurahan di seluruh Indonesia.'::TEXT, 'Pendidikan robotika berbasis komunitas di tingkat desa/kelurahan'::TEXT, 'GraduationCap'::VARCHAR, ARRAY['Modul belajar terstruktur', 'Perangkat praktik disediakan', 'Pendampingan instruktur', 'Sertifikat partisipasi']::TEXT[], 'Masyarakat umum dari berbagai usia dan latar belakang'::TEXT, 'published'::VARCHAR, 'dibuka'::VARCHAR, 1::INTEGER),
  ('Robotika Masuk Sekolah'::VARCHAR, 'robotika-masuk-sekolah'::VARCHAR, 'Program integrasi kurikulum robotika ke dalam sistem pendidikan formal.'::TEXT, 'Integrasi kurikulum robotika ke pendidikan formal'::TEXT, 'BookOpen'::VARCHAR, ARRAY['Modul ajar siap pakai', 'Pelatihan guru', 'Laboratorium robotika', 'Kurikulum terintegrasi']::TEXT[], 'Satuan pendidikan SD, SMP, SMA, dan sederajat'::TEXT, 'published'::VARCHAR, 'dibuka'::VARCHAR, 2::INTEGER),
  ('Akademi AI'::VARCHAR, 'akademi-ai'::VARCHAR, 'Program pelatihan intensif kecerdasan buatan yang mencakup machine learning, computer vision, dan NLP.'::TEXT, 'Pelatihan intensif AI dengan sertifikasi kompetensi'::TEXT, 'Bot'::VARCHAR, ARRAY['Machine Learning', 'Computer Vision', 'NLP & Robotics', 'Sertifikasi kompetensi']::TEXT[], 'Mahasiswa, fresh graduate, dan profesional'::TEXT, 'published'::VARCHAR, 'dibuka'::VARCHAR, 3::INTEGER),
  ('Kompetisi Robotika Nasional'::VARCHAR, 'kompetisi-robotika-nasional'::VARCHAR, 'Ajang kompetisi robotika tahunan tingkat nasional berbagai kategori.'::TEXT, 'Kompetisi robotika tahunan tingkat nasional'::TEXT, 'Trophy'::VARCHAR, ARRAY['Berbagai kategori lomba', 'Hadiah menarik', 'Juri nasional', 'Jalur ke internasional']::TEXT[], 'Pelajar, mahasiswa, dan komunitas robotika'::TEXT, 'published'::VARCHAR, 'akan datang'::VARCHAR, 4::INTEGER),
  ('Inkubator Inovasi Teknologi'::VARCHAR, 'inkubator-inovasi-teknologi'::VARCHAR, 'Program inkubasi startup yang berfokus pada pengembangan produk berbasis robotika dan AI.'::TEXT, 'Inkubasi startup robotika dan AI'::TEXT, 'Rocket'::VARCHAR, ARRAY['Mentoring intensif', 'Akses laboratorium', 'Pendanaan awal', 'Koneksi industri']::TEXT[], 'Wirausahawan muda dan tim startup tahap awal'::TEXT, 'published'::VARCHAR, 'akan datang'::VARCHAR, 5::INTEGER),
  ('Robotika untuk UMKM'::VARCHAR, 'robotika-untuk-umkm'::VARCHAR, 'Program penerapan teknologi robotika dan otomatisasi untuk meningkatkan produktivitas UMKM.'::TEXT, 'Otomatisasi robotika untuk UMKM'::TEXT, 'Store'::VARCHAR, ARRAY['Konsultasi teknologi', 'Implementasi otomatisasi', 'Pendampingan', 'Efisiensi produksi']::TEXT[], 'Pelaku UMKM di seluruh Indonesia'::TEXT, 'published'::VARCHAR, 'dibuka'::VARCHAR, 6::INTEGER)
) AS v(title, slug, description, short_description, icon, features, target_audience, status, label, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM programs LIMIT 1);

-- 7.6 SYSTEM SETTINGS SEED
INSERT INTO public.system_settings (key, value, label, description, category) VALUES
(
  'site_info',
  '{"name": "PRO RI", "description": "Perkumpulan Robotika Indonesia", "logo_url": "/images/logo-putih.jpeg", "favicon_url": "/favicon.ico"}'::jsonb,
  'Informasi Situs', 'Nama, deskripsi, dan logo website', 'general'
),
(
  'features',
  '{"public_registration": true, "member_card": true, "event_registration": true, "program_registration": true, "innovation_submission": true, "news_comments": true}'::jsonb,
  'Fitur Website', 'Aktif/nonaktifkan fitur-fitur website', 'features'
),
(
  'maintenance',
  '{"enabled": false, "message": "Website sedang dalam perbaikan. Silakan kembali lagi nanti.", "allowed_roles": ["super_admin", "admin"]}'::jsonb,
  'Maintenance Mode', 'Mode pemeliharaan website', 'system'
),
(
  'member_card_config',
  '{"auto_member_number": true, "member_number_prefix": "PRO-RI", "require_approval": true}'::jsonb,
  'Konfigurasi Kartu Anggota', 'Pengaturan nomor anggota dan persetujuan kartu', 'member'
),
(
  'registration_config',
  '{"require_email_verification": false, "default_role": "member", "allow_guest_registration": false}'::jsonb,
  'Konfigurasi Pendaftaran', 'Pengaturan proses pendaftaran anggota baru', 'member'
)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category;

-- ====================================================================
-- PHASE 8: DATA MIGRATIONS
-- ====================================================================

-- 8.1 Province Coordinates (v6)
UPDATE provinces SET latitude = 5.5483, longitude = 95.3238 WHERE code = '11';
UPDATE provinces SET latitude = 3.5952, longitude = 98.6722 WHERE code = '12';
UPDATE provinces SET latitude = -0.9471, longitude = 100.4172 WHERE code = '13';
UPDATE provinces SET latitude = 0.5071, longitude = 101.4478 WHERE code = '14';
UPDATE provinces SET latitude = -1.6101, longitude = 103.6131 WHERE code = '15';
UPDATE provinces SET latitude = -2.9761, longitude = 104.7754 WHERE code = '16';
UPDATE provinces SET latitude = -3.7925, longitude = 102.2608 WHERE code = '17';
UPDATE provinces SET latitude = -5.4500, longitude = 105.2667 WHERE code = '18';
UPDATE provinces SET latitude = -2.1332, longitude = 106.1130 WHERE code = '19';
UPDATE provinces SET latitude = 0.9139, longitude = 104.4533 WHERE code = '21';
UPDATE provinces SET latitude = -6.2088, longitude = 106.8456 WHERE code = '31';
UPDATE provinces SET latitude = -6.9147, longitude = 107.6098 WHERE code = '32';
UPDATE provinces SET latitude = -6.9667, longitude = 110.4167 WHERE code = '33';
UPDATE provinces SET latitude = -7.7956, longitude = 110.3695 WHERE code = '34';
UPDATE provinces SET latitude = -7.2504, longitude = 112.7688 WHERE code = '35';
UPDATE provinces SET latitude = -6.1129, longitude = 106.1517 WHERE code = '36';
UPDATE provinces SET latitude = -8.6500, longitude = 115.2167 WHERE code = '51';
UPDATE provinces SET latitude = -8.5833, longitude = 116.1167 WHERE code = '52';
UPDATE provinces SET latitude = -10.1772, longitude = 123.6072 WHERE code = '53';
UPDATE provinces SET latitude = -0.0263, longitude = 109.3425 WHERE code = '61';
UPDATE provinces SET latitude = -2.2134, longitude = 113.9137 WHERE code = '62';
UPDATE provinces SET latitude = -3.4478, longitude = 114.8322 WHERE code = '63';
UPDATE provinces SET latitude = -0.5022, longitude = 117.1536 WHERE code = '64';
UPDATE provinces SET latitude = 2.8465, longitude = 117.3621 WHERE code = '65';
UPDATE provinces SET latitude = 1.4748, longitude = 124.8421 WHERE code = '71';
UPDATE provinces SET latitude = 0.5333, longitude = 123.0667 WHERE code = '75';
UPDATE provinces SET latitude = -0.8917, longitude = 119.8707 WHERE code = '72';
UPDATE provinces SET latitude = -2.6738, longitude = 118.8876 WHERE code = '76';
UPDATE provinces SET latitude = -5.1477, longitude = 119.4327 WHERE code = '73';
UPDATE provinces SET latitude = -3.9922, longitude = 122.5236 WHERE code = '74';
UPDATE provinces SET latitude = -3.6554, longitude = 128.1908 WHERE code = '81';
UPDATE provinces SET latitude = 0.7350, longitude = 127.5614 WHERE code = '82';
UPDATE provinces SET latitude = -2.5330, longitude = 140.7170 WHERE code = '91';
UPDATE provinces SET latitude = -0.8629, longitude = 134.0640 WHERE code = '92';
UPDATE provinces SET latitude = -3.5095, longitude = 135.7521 WHERE code = '94';
UPDATE provinces SET latitude = -4.0921, longitude = 138.9462 WHERE code = '95';
UPDATE provinces SET latitude = -8.4991, longitude = 140.4050 WHERE code = '93';
UPDATE provinces SET latitude = -0.8762, longitude = 131.2558 WHERE code = '96';

-- 8.2 Fix existing member IDs — PRI → PRO-RI prefix
UPDATE members
SET member_id = regexp_replace(member_id, '^PRI-', 'PRO-RI-')
WHERE member_id LIKE 'PRI-%';

UPDATE member_cards
SET member_number = regexp_replace(member_number, '^PRI-', 'PRO-RI-')
WHERE member_number LIKE 'PRI-%';

UPDATE member_cards
SET member_number = regexp_replace(member_number, '^PRORI-', 'PRO-RI-')
WHERE member_number LIKE 'PRORI-%';

-- ====================================================================
-- PHASE 9: INITIAL RECALCULATION
-- ====================================================================

SELECT recalculate_province_counters();

-- ====================================================================
-- PHASE 10: ACADEMY TABLES (PRO RI Academy LMS)
-- ====================================================================

-- 10.1 COURSES
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category VARCHAR(50) DEFAULT 'programming' CHECK (category IN ('robotics', 'ai', 'iot', 'programming', 'robotik', 'technology', 'other')),
  level VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced', 'all')),
  learning_path VARCHAR(100),
  image_url TEXT,
  duration_hours INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES members(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.2 COURSE MODULES
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10.3 COURSE LESSONS
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

-- 10.4 COURSE ENROLLMENTS
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress_percent INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(course_id, member_id)
);

-- 10.5 LESSON COMPLETIONS
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, member_id)
);

-- 10.6 ACADEMY CERTIFICATES
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

-- Indexes for Academy
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_sort ON courses(sort_order);
CREATE INDEX IF NOT EXISTS idx_courses_created_by ON courses(created_by);

CREATE INDEX IF NOT EXISTS idx_course_modules_course ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_sort ON course_modules(sort_order);

CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_sort ON course_lessons(sort_order);

CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_member ON course_enrollments(member_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_status ON course_enrollments(status);

CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_member ON lesson_completions(member_id);

CREATE INDEX IF NOT EXISTS idx_course_certificates_course ON course_certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_course_certificates_member ON course_certificates(member_id);

-- RLS for Courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published courses are publicly viewable" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can view all courses" ON courses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can manage courses" ON courses FOR ALL USING (is_admin_or_super());

-- RLS for Course Modules
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course modules are viewable" ON course_modules FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage course modules" ON course_modules FOR ALL USING (is_admin_or_super());

-- RLS for Course Lessons
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Course lessons are viewable" ON course_lessons FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage course lessons" ON course_lessons FOR ALL USING (is_admin_or_super());

-- RLS for Course Enrollments
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view own enrollments" ON course_enrollments FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Members can enroll" ON course_enrollments FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Members can update own enrollment" ON course_enrollments FOR UPDATE
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can manage enrollments" ON course_enrollments FOR ALL
  USING (is_admin_or_super());

-- RLS for Lesson Completions
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view own completions" ON lesson_completions FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Members can complete lessons" ON lesson_completions FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can manage completions" ON lesson_completions FOR ALL
  USING (is_admin_or_super());

-- RLS for Course Certificates
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certificates are viewable by owner" ON course_certificates FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can manage course certificates" ON course_certificates FOR ALL
  USING (is_admin_or_super());

-- ====================================================================
-- ✅ MIGRATION COMPLETE
-- ====================================================================
-- 28 tables, 65+ indexes, 17 functions, 20 triggers,
-- 80+ RLS policies, 8 storage buckets, seed data,
-- province coordinates, data prefix fix, counters recalculated,
-- Academy LMS (courses, modules, lessons, enrollments, completions).
-- ====================================================================

-- ====================================================================
-- APPENDIX: VERIFY DATABASE HEALTH (opsional — jalankan terpisah)
-- ====================================================================
-- Di bawah ini adalah query read-only untuk memverifikasi bahwa
-- semua komponen database berfungsi dengan benar.
-- Copy dan paste ke Supabase SQL Editor jika diperlukan.
-- ====================================================================
/*
-- == CEK TABEL ==
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;

-- == CEK FUNGSI ==
SELECT proname FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname NOT LIKE 'pg_%'
ORDER BY proname;

-- == CEK TRIGGER ==
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- == CEK RLS ENABLED ==
SELECT relname FROM pg_class
WHERE relnamespace = 'public'::regnamespace
  AND relrowsecurity = TRUE
ORDER BY relname;

-- == CEK STORAGE BUCKETS ==
SELECT id FROM storage.buckets ORDER BY id;

-- == CEK SEED DATA ==
SELECT 'Roles' as item, COUNT(*)::TEXT as count FROM roles
UNION ALL SELECT 'Provinces', COUNT(*)::TEXT FROM provinces
UNION ALL SELECT 'Programs', COUNT(*)::TEXT FROM programs;

-- == CEK SAMPLE MEMBER ID ==
SELECT generate_member_id() as sample_member_id;

-- == CEK PROVINCE COORDINATES ==
SELECT COUNT(*) as provinces_with_coords FROM provinces
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
*/
