-- ================================================
-- PRO RI DIGITAL COMMAND CENTER
-- Self-Hosted Supabase — Consolidated Migration
-- ================================================
-- EXECUTE ONCE on a fresh Supabase instance.
-- Run via: psql -h <host> -d <db> -f consolidated-migration.sql
-- Or paste into Supabase SQL Editor (if applicable).
-- ================================================

-- ================================================
-- PHASE 1: EXTENSIONS & BASE SCHEMA
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- REGIONS TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS provinces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(2) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  capital VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
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
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
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

-- ============================================
-- ROLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

-- ============================================
-- MEMBERS TABLE
-- ============================================

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

-- ============================================
-- EVENTS TABLES
-- ============================================

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

-- ============================================
-- INNOVATIONS TABLE
-- ============================================

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

-- ============================================
-- CERTIFICATES TABLE
-- ============================================

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

-- ============================================
-- NEWS TABLE
-- ============================================

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

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================

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

-- ================================================
-- PHASE 2: MIGRATION TABLES
-- ================================================

-- === HERO GALLERY ===

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

-- === CONTACT MESSAGES ===

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === VIDEOS ===

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

-- === NEWS COMMENTS ===

CREATE TABLE IF NOT EXISTS news_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- === ACTIVITY GALLERY ===

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

-- === MEMBER DESIGNATIONS ===

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

-- === PROGRAMS ===

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

-- === PROGRAM REGISTRATIONS ===

CREATE TABLE IF NOT EXISTS program_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'approved', 'rejected', 'cancelled', 'completed')),
  notes TEXT,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, member_id)
);

-- === MEMBER CARDS (V2) ===

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

-- ================================================
-- PHASE 3: INDEXES
-- ================================================

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

-- ================================================
-- PHASE 4: TRIGGERS & FUNCTIONS
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_innovations_updated_at ON innovations;
CREATE TRIGGER update_innovations_updated_at
  BEFORE UPDATE ON innovations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hero_gallery_updated_at ON hero_gallery;
CREATE TRIGGER update_hero_gallery_updated_at
  BEFORE UPDATE ON hero_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_activity_gallery_updated_at ON activity_gallery;
CREATE TRIGGER update_activity_gallery_updated_at
  BEFORE UPDATE ON activity_gallery
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_member_cards_updated_at ON member_cards;
CREATE TRIGGER update_member_cards_updated_at
  BEFORE UPDATE ON member_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_programs_updated_at ON programs;
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- === FUNCTION: Generate member ID ===

CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
  next_seq INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_id, '-', 3) AS INTEGER)), 0) + 1
  INTO next_seq
  FROM members
  WHERE member_id LIKE 'PRI-' || year || '-%';
  RETURN 'PRI-' || year || '-' || LPAD(next_seq::TEXT, 5, '0');
END;
$$;

-- === FUNCTION: Handle new user signup ===

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

-- === TRIGGER: Auto-create member on auth signup ===

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- === FUNCTION: Generate member card number ===

CREATE OR REPLACE FUNCTION generate_member_number()
RETURNS VARCHAR(20) AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(member_number, '-', 2) AS INTEGER)), 0) + 1
  INTO next_num
  FROM member_cards
  WHERE member_number IS NOT NULL;
  RETURN 'PRORI-' || LPAD(next_num::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- === FUNCTION: Increment download count ===

CREATE OR REPLACE FUNCTION increment_download_count(card_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE member_cards SET download_count = COALESCE(download_count, 0) + 1 WHERE id = card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === FUNCTION: Increment news view count (by ID) ===

CREATE OR REPLACE FUNCTION increment_news_view(news_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE news SET view_count = view_count + 1 WHERE id = news_id RETURNING view_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === FUNCTION: Increment news view count (by slug) ===
-- Used by news/[slug]/page.tsx via supabase.rpc("increment_view_count", { slug_param })

CREATE OR REPLACE FUNCTION increment_view_count(slug_param TEXT)
RETURNS void AS $$
BEGIN
  UPDATE news SET view_count = COALESCE(view_count, 0) + 1 WHERE slug = slug_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === FUNCTION: Recalculate province counters ===

CREATE OR REPLACE FUNCTION recalculate_province_counters()
RETURNS void AS $$
BEGIN
  -- ===========================================
  -- PROVINCES
  -- ===========================================

  -- total_members (with ::text comparison to handle TEXT columns)
  UPDATE provinces p
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.province_id::text = p.id::text AND m.status = 'active'
  )
  WHERE TRUE;

  -- total_trainers
  UPDATE provinces p
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'trainer'
  )
  WHERE TRUE;

  -- total_mentors
  UPDATE provinces p
  SET total_mentors = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.province_id::text = p.id::text AND m.status = 'active' AND md.designation = 'mentor'
  )
  WHERE TRUE;

  -- total_events
  UPDATE provinces p
  SET total_events = (
    SELECT COUNT(*)::INTEGER
    FROM events e
    WHERE e.province_id::text = p.id::text AND e.status IN ('published', 'ongoing', 'completed')
  )
  WHERE TRUE;

  -- total_innovations
  UPDATE provinces p
  SET total_innovations = (
    SELECT COUNT(*)::INTEGER
    FROM innovations i
    WHERE i.province_id::text = p.id::text AND i.status IN ('published', 'featured')
  )
  WHERE TRUE;

  -- ===========================================
  -- REGENCIES
  -- ===========================================

  -- total_members
  UPDATE regencies r
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.regency_id::text = r.id::text AND m.status = 'active'
  )
  WHERE TRUE;

  -- total_trainers
  UPDATE regencies r
  SET total_trainers = (
    SELECT COUNT(DISTINCT m.id)::INTEGER
    FROM members m
    JOIN member_designations md ON md.member_id = m.id
    WHERE m.regency_id::text = r.id::text AND m.status = 'active' AND md.designation = 'trainer'
  )
  WHERE TRUE;

  -- ===========================================
  -- DISTRICTS
  -- ===========================================

  -- total_members
  UPDATE districts d
  SET total_members = (
    SELECT COUNT(*)::INTEGER
    FROM members m
    WHERE m.district_id::text = d.id::text AND m.status = 'active'
  )
  WHERE TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === FUNCTION: Count members by province ===

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

-- === FUNCTION: Trigger recalculate counters on designation changes ===
-- Auto-updates province/regency counters when member_designations or member status changes

CREATE OR REPLACE FUNCTION trigger_recalculate_counters()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM recalculate_province_counters();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_member_designation_change ON member_designations;
CREATE TRIGGER on_member_designation_change
  AFTER INSERT OR UPDATE OR DELETE ON member_designations
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

DROP TRIGGER IF EXISTS on_member_status_change ON members;
CREATE TRIGGER on_member_status_change
  AFTER UPDATE OF status ON members
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_recalculate_counters();

-- ================================================
-- PHASE 5: RLS POLICIES
-- ================================================

-- Helper: Get current member's role
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

-- Helper: Check if user is admin or super admin
CREATE OR REPLACE FUNCTION is_admin_or_super()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_current_member_role() IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === MEMBERS RLS ===
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members are publicly viewable" ON members FOR SELECT USING (status = 'active');
CREATE POLICY "Members can view own profile" ON members FOR SELECT USING (auth_id = auth.uid());
CREATE POLICY "Admins can view all members" ON members FOR SELECT USING (is_admin_or_super());
CREATE POLICY "Members can update own profile" ON members FOR UPDATE USING (auth_id = auth.uid()) WITH CHECK (auth_id = auth.uid());
CREATE POLICY "Admins can update any member" ON members FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Super admin can delete members" ON members FOR DELETE USING (get_current_member_role() = 'super_admin');

-- === EVENTS RLS ===
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are publicly viewable" ON events FOR SELECT USING (status = 'published');
CREATE POLICY "Members can view all events" ON events FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can create events" ON events FOR INSERT WITH CHECK (is_admin_or_super());
CREATE POLICY "Admins can update events" ON events FOR UPDATE USING (is_admin_or_super());

-- === EVENT REGISTRATIONS RLS ===
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own registrations" ON event_registrations FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Members can register for events" ON event_registrations FOR INSERT
  WITH CHECK (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can manage event registrations" ON event_registrations FOR ALL
  USING (is_admin_or_super());

-- === INNOVATIONS RLS ===
ALTER TABLE innovations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published innovations are publicly viewable" ON innovations FOR SELECT
  USING (status IN ('published', 'featured'));
CREATE POLICY "Members can view all innovations" ON innovations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Members can create innovations" ON innovations FOR INSERT
  WITH CHECK (creator_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Creators can update own innovations" ON innovations FOR UPDATE
  USING (creator_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can moderate innovations" ON innovations FOR UPDATE USING (is_admin_or_super());

-- === CERTIFICATES RLS ===
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certificates are verifiable" ON certificates FOR SELECT USING (TRUE);

-- === NEWS RLS ===
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published news are publicly viewable" ON news FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage news" ON news FOR ALL USING (is_admin_or_super());

-- === REGIONS RLS ===
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE regencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Regions are publicly viewable" ON provinces FOR SELECT USING (TRUE);
CREATE POLICY "Regencies are publicly viewable" ON regencies FOR SELECT USING (TRUE);
CREATE POLICY "Districts are publicly viewable" ON districts FOR SELECT USING (TRUE);
CREATE POLICY "Villages are publicly viewable" ON villages FOR SELECT USING (TRUE);

-- === ACTIVITY LOGS RLS ===
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own logs" ON activity_logs FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Admins can view all logs" ON activity_logs FOR SELECT USING (is_admin_or_super());
CREATE POLICY "System can insert logs" ON activity_logs FOR INSERT WITH CHECK (TRUE);

-- === HERO GALLERY RLS ===
ALTER TABLE hero_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hero gallery is publicly viewable" ON hero_gallery FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage hero gallery" ON hero_gallery FOR ALL USING (is_admin_or_super());

-- === ACTIVITY GALLERY RLS ===
ALTER TABLE activity_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity gallery is publicly viewable" ON activity_gallery FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage activity gallery" ON activity_gallery FOR ALL USING (is_admin_or_super());

-- === CONTACT MESSAGES RLS ===
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT USING (is_admin_or_super());
CREATE POLICY "Admins can manage contact messages" ON contact_messages FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Admins can delete contact messages" ON contact_messages FOR DELETE USING (is_admin_or_super());

-- === VIDEOS RLS ===
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "videos_select_public" ON videos FOR SELECT USING (is_active = TRUE);
CREATE POLICY "videos_select_admin" ON videos FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "videos_insert_admin" ON videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "videos_update_admin" ON videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "videos_delete_admin" ON videos FOR DELETE USING (auth.role() = 'authenticated');

-- === NEWS COMMENTS RLS ===
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert news comments" ON news_comments FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Approved comments are publicly viewable" ON news_comments FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Admins can manage news comments" ON news_comments FOR ALL USING (is_admin_or_super());

-- === MEMBER DESIGNATIONS RLS ===
ALTER TABLE member_designations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage member designations" ON member_designations FOR ALL USING (is_admin_or_super());
CREATE POLICY "Members can view own designations" ON member_designations FOR SELECT
  USING (member_id IN (SELECT id FROM members WHERE auth_id = auth.uid()));
CREATE POLICY "Public can view designations" ON member_designations FOR SELECT USING (TRUE);

-- === PROGRAMS RLS ===
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

-- === MEMBER CARDS RLS ===
ALTER TABLE member_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own member card" ON member_cards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own member card" ON member_cards FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own pending card" ON member_cards FOR UPDATE
  USING (user_id = auth.uid() AND status IN ('pending', 'rejected'))
  WITH CHECK (user_id = auth.uid() AND status IN ('pending', 'rejected'));
CREATE POLICY "Admins can view all member cards" ON member_cards FOR SELECT USING (is_admin_or_super());
CREATE POLICY "Admins can update member cards" ON member_cards FOR UPDATE USING (is_admin_or_super());
CREATE POLICY "Public can verify approved cards" ON member_cards FOR SELECT USING (status = 'approved');

-- ================================================
-- PHASE 6: SEED DATA
-- ================================================

-- === ROLES ===
INSERT INTO roles (name, description) VALUES
  ('guest', 'Guest user - not registered'),
  ('member', 'Regular member'),
  ('admin', 'Administrator with management access'),
  ('super_admin', 'Super administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- === 38 PROVINCES (numeric Kemendagri codes — matching wilayah/*.sql files) ===
INSERT INTO provinces (code, name) VALUES
  ('11', 'Aceh'),
  ('12', 'Sumatera Utara'),
  ('13', 'Sumatera Barat'),
  ('14', 'Riau'),
  ('15', 'Jambi'),
  ('16', 'Sumatera Selatan'),
  ('17', 'Bengkulu'),
  ('18', 'Lampung'),
  ('19', 'Kepulauan Bangka Belitung'),
  ('21', 'Kepulauan Riau'),
  ('31', 'Daerah Khusus Ibukota Jakarta'),
  ('32', 'Jawa Barat'),
  ('33', 'Jawa Tengah'),
  ('34', 'Daerah Istimewa Yogyakarta'),
  ('35', 'Jawa Timur'),
  ('36', 'Banten'),
  ('51', 'Bali'),
  ('52', 'Nusa Tenggara Barat'),
  ('53', 'Nusa Tenggara Timur'),
  ('61', 'Kalimantan Barat'),
  ('62', 'Kalimantan Tengah'),
  ('63', 'Kalimantan Selatan'),
  ('64', 'Kalimantan Timur'),
  ('65', 'Kalimantan Utara'),
  ('71', 'Sulawesi Utara'),
  ('72', 'Sulawesi Tengah'),
  ('73', 'Sulawesi Selatan'),
  ('74', 'Sulawesi Tenggara'),
  ('75', 'Gorontalo'),
  ('76', 'Sulawesi Barat'),
  ('81', 'Maluku'),
  ('82', 'Maluku Utara'),
  ('91', 'Papua'),
  ('92', 'Papua Barat'),
  ('93', 'Papua Selatan'),
  ('94', 'Papua Tengah'),
  ('95', 'Papua Pegunungan'),
  ('96', 'Papua Barat Daya')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

-- === HERO GALLERY SEED ===
INSERT INTO hero_gallery (title, description, image_url, link_url, link_label, sort_order, is_active)
SELECT * FROM (VALUES
  ('Mencetak Generasi Robotik Indonesia'::VARCHAR, 'Membangun talenta teknologi, inovator, dan pemimpin masa depan menuju Indonesia Emas 2045.'::TEXT, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&q=80'::TEXT, '/register'::TEXT, 'Daftar Anggota'::VARCHAR, 1::INTEGER, TRUE::BOOLEAN),
  ('6 Program Unggulan PRO RI'::VARCHAR, 'Sekolah Robotika Rakyat, Robotika Masuk Sekolah, Akademi AI, Kompetisi Robotika Nasional, Inkubator Inovasi, dan Robotika untuk UMKM.'::TEXT, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80'::TEXT, '/programs'::TEXT, 'Lihat Program'::VARCHAR, 2::INTEGER, TRUE::BOOLEAN),
  ('Indonesia Emas 2045 Dimulai dari Sekarang'::VARCHAR, 'Jadilah bagian dari gerakan robotika nasional. Bersama PRO RI, kita wujudkan kedaulatan teknologi Indonesia.'::TEXT, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1920&q=80'::TEXT, '/register'::TEXT, 'Daftar Sekarang'::VARCHAR, 3::INTEGER, TRUE::BOOLEAN)
) AS v(title, description, image_url, link_url, link_label, sort_order, is_active)
WHERE NOT EXISTS (SELECT 1 FROM hero_gallery LIMIT 1);

-- === ACTIVITY GALLERY SEED ===
INSERT INTO activity_gallery (title, description, image_url, category, date_taken, sort_order)
SELECT * FROM (VALUES
  ('Workshop Robotika Dasar'::VARCHAR, 'Peserta sedang belajar merakit robot dasar dalam workshop Robotika Masuk Sekolah'::TEXT, 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&q=80'::TEXT, 'workshop'::VARCHAR, '2026-05-15'::DATE, 1),
  ('Kompetisi Robot Line Follower'::VARCHAR, 'Suasana kompetisi robot line follower tingkat nasional'::TEXT, 'https://images.unsplash.com/photo-1561144257-e322e8f9f0b9?w=800&q=80'::TEXT, 'competition'::VARCHAR, '2026-04-20'::DATE, 2),
  ('Pameran Teknologi AI'::VARCHAR, 'Stand PRO RI di pameran teknologi AI terbesar di Indonesia'::TEXT, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80'::TEXT, 'exhibition'::VARCHAR, '2026-03-10'::DATE, 3),
  ('Pelatihan IoT untuk Pemula'::VARCHAR, 'Sesi pelatihan Internet of Things untuk anggota baru PRO RI'::TEXT, 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80'::TEXT, 'training'::VARCHAR, '2026-02-28'::DATE, 4),
  ('Kegiatan Sosial Robotika'::VARCHAR, 'Pengenalan robotika kepada anak-anak di daerah terpencil'::TEXT, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80'::TEXT, 'social'::VARCHAR, '2026-01-15'::DATE, 5),
  ('Rapat Koordinasi Nasional'::VARCHAR, 'Rapat koordinasi pengurus PRO RI dari seluruh provinsi'::TEXT, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'::TEXT, 'meeting'::VARCHAR, '2025-12-10'::DATE, 6)
) AS v(title, description, image_url, category, date_taken, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM activity_gallery LIMIT 1);

-- ================================================
-- PHASE 6: STORAGE BUCKETS
-- ================================================
-- Bucket names must match lib/storage.ts constants:
--   news, events, innovations, photos,
--   member-cards, hero-gallery, activity-gallery
-- ================================================

DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('news', 'news', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 5242880;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('events', 'events', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 5242880;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('innovations', 'innovations', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 5242880;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('photos', 'photos', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 5242880;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('member-cards', 'member-cards', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 10485760;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('hero-gallery', 'hero-gallery', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 10485760;

  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES ('activity-gallery', 'activity-gallery', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
  ON CONFLICT (id) DO UPDATE SET public = TRUE, file_size_limit = 10485760;
END $$;

-- === STORAGE RLS: Public read for all buckets ===
DO $$
DECLARE
  bucket_list TEXT[] := ARRAY['news', 'events', 'innovations', 'photos', 'member-cards', 'hero-gallery', 'activity-gallery'];
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

-- ================================================
-- PHASE 7: SEED DATA
-- ================================================
-- ================================================

-- === DEFAULT PROGRAMS ===
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

-- ================================================
-- FINAL: Run initial recalculation
-- ================================================

SELECT recalculate_province_counters();

-- ================================================
-- ✅ CONSOLIDATED MIGRATION COMPLETE
-- ================================================
-- 21 tables, 51 indexes, 12 functions, 12 triggers,
-- 64 RLS policies, 7 storage buckets, seed data
-- ================================================
