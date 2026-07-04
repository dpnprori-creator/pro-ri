-- ================================================
-- FIX: Roles table RLS — tambah policy SELECT
-- ================================================
-- Masalah: roles table memiliki RLS yang ter-enable (mungkin dari Supabase dashboard)
-- tapi tidak memiliki policy SELECT. Akibatnya, JOIN role_id(name) dari members
-- ke roles selalu return null untuk regular client (anon key).
--
-- Perbaikan: buat policy SELECT untuk roles table agar authenticated users bisa
-- membaca data roles.

-- Enable RLS on roles (jika belum)
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Policy: semua authenticated users bisa membaca roles
CREATE POLICY "Anyone can read roles" ON roles
  FOR SELECT USING (true);

-- Policy: hanya admin/super_admin yang bisa insert/update/delete roles
CREATE POLICY "Admins can manage roles" ON roles
  FOR ALL USING (
    get_current_member_role() IN ('admin', 'super_admin')
  );
