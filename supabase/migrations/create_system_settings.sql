-- ================================================
-- PRO RI — System Settings Table
-- Untuk menyimpan konfigurasi sistem, fitur toggle,
-- dan pengaturan website yang bisa diubah via UI
-- ================================================

-- Create system_settings table
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

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only super_admin can manage system settings
CREATE POLICY "Super admin can manage system settings"
  ON public.system_settings
  FOR ALL
  USING (get_current_member_role() = 'super_admin')
  WITH CHECK (get_current_member_role() = 'super_admin');

-- Seed default settings
INSERT INTO public.system_settings (key, value, label, description, category) VALUES
(
  'site_info',
  '{"name": "PRO RI", "description": "Perkumpulan Robotika Indonesia", "logo_url": "/images/logo-putih.jpeg", "favicon_url": "/favicon.ico"}'::jsonb,
  'Informasi Situs',
  'Nama, deskripsi, dan logo website',
  'general'
),
(
  'features',
  '{"public_registration": true, "member_card": true, "event_registration": true, "program_registration": true, "innovation_submission": true, "news_comments": true}'::jsonb,
  'Fitur Website',
  'Aktif/nonaktifkan fitur-fitur website',
  'features'
),
(
  'maintenance',
  '{"enabled": false, "message": "Website sedang dalam perbaikan. Silakan kembali lagi nanti.", "allowed_roles": ["super_admin", "admin"]}'::jsonb,
  'Maintenance Mode',
  'Mode pemeliharaan website',
  'system'
),
(
  'member_card_config',
  '{"auto_member_number": true, "member_number_prefix": "PRI", "require_approval": true}'::jsonb,
  'Konfigurasi Kartu Anggota',
  'Pengaturan nomor anggota dan persetujuan kartu',
  'member'
),
(
  'registration_config',
  '{"require_email_verification": false, "default_role": "member", "allow_guest_registration": false}'::jsonb,
  'Konfigurasi Pendaftaran',
  'Pengaturan proses pendaftaran anggota baru',
  'member'
)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  category = EXCLUDED.category;

-- Function to get a setting value by key
CREATE OR REPLACE FUNCTION get_setting(p_key TEXT)
RETURNS JSONB AS $$
DECLARE
  v_value JSONB;
BEGIN
  SELECT value INTO v_value FROM public.system_settings WHERE key = p_key;
  RETURN COALESCE(v_value, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a feature is enabled
CREATE OR REPLACE FUNCTION is_feature_enabled(p_feature TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_features JSONB;
BEGIN
  SELECT value INTO v_features FROM public.system_settings WHERE key = 'features';
  RETURN COALESCE((v_features->>p_feature)::BOOLEAN, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if maintenance mode is active
CREATE OR REPLACE FUNCTION is_maintenance_mode()
RETURNS BOOLEAN AS $$
DECLARE
  v_maintenance JSONB;
BEGIN
  SELECT value INTO v_maintenance FROM public.system_settings WHERE key = 'maintenance';
  RETURN COALESCE((v_maintenance->>'enabled')::BOOLEAN, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
