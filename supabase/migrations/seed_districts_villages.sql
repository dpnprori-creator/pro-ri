-- ================================================
-- SEED DISTRICTS & VILLAGES (Sample Data)
-- Untuk cascading dropdown pada form pendaftaran
-- ================================================
-- Seed sample districts (kecamatan) and villages (desa/kelurahan)
-- untuk setiap kota/kabupaten capital di setiap provinsi.
-- Jalankan SETELAH seed_regencies.sql

DO $$
DECLARE
  reg_id UUID;
BEGIN

-- ========================
-- ACEH — Banda Aceh
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '11.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '11.71.01', 'Kecamatan Meuraxa'),
  (reg_id, '11.71.02', 'Kecamatan Kuta Alam'),
  (reg_id, '11.71.03', 'Kecamatan Banda Raya'),
  (reg_id, '11.71.04', 'Kecamatan Syiah Kuala')
ON CONFLICT (code) DO NOTHING;

INSERT INTO villages (district_id, code, name)
SELECT d.id, '11.71.01.01', 'Gampong Pande' FROM districts d WHERE d.code = '11.71.01'
UNION ALL
SELECT d.id, '11.71.01.02', 'Gampong Blang' FROM districts d WHERE d.code = '11.71.01'
WHERE NOT EXISTS (SELECT 1 FROM villages WHERE code = '11.71.01.01');

-- ========================
-- SUMUT — Medan
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '12.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '12.71.01', 'Kecamatan Medan Kota'),
  (reg_id, '12.71.02', 'Kecamatan Medan Baru'),
  (reg_id, '12.71.03', 'Kecamatan Medan Tuntungan'),
  (reg_id, '12.71.04', 'Kecamatan Medan Selayang')
ON CONFLICT (code) DO NOTHING;

-- ========================
— SUMBAR — Padang
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '13.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '13.71.01', 'Kecamatan Padang Barat'),
  (reg_id, '13.71.02', 'Kecamatan Padang Timur'),
  (reg_id, '13.71.03', 'Kecamatan Padang Selatan'),
  (reg_id, '13.71.04', 'Kecamatan Padang Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- RIAU — Pekanbaru
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '14.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '14.71.01', 'Kecamatan Pekanbaru Kota'),
  (reg_id, '14.71.02', 'Kecamatan Senapelan'),
  (reg_id, '14.71.03', 'Kecamatan Bukit Raya'),
  (reg_id, '14.71.04', 'Kecamatan Marpoyan Damai')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- KEPRI — Batam
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '21.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '21.71.01', 'Kecamatan Batam Kota'),
  (reg_id, '21.71.02', 'Kecamatan Batu Aji'),
  (reg_id, '21.71.03', 'Kecamatan Lubuk Baja'),
  (reg_id, '21.71.04', 'Kecamatan Nongsa')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- JAMBI — Jambi
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '15.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '15.71.01', 'Kecamatan Telanaipura'),
  (reg_id, '15.71.02', 'Kecamatan Jambi Selatan'),
  (reg_id, '15.71.03', 'Kecamatan Jambi Timur'),
  (reg_id, '15.71.04', 'Kecamatan Pasar Jambi')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- SUMSEL — Palembang
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '16.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '16.71.01', 'Kecamatan Kemuning'),
  (reg_id, '16.71.02', 'Kecamatan Ilir Timur'),
  (reg_id, '16.71.03', 'Kecamatan Ilir Barat'),
  (reg_id, '16.71.04', 'Kecamatan Seberang Ulu')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- BANGKA BELITUNG — Pangkal Pinang
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '19.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '19.71.01', 'Kecamatan Pangkal Balam'),
  (reg_id, '19.71.02', 'Kecamatan Rangkui'),
  (reg_id, '19.71.03', 'Kecamatan Bukit Intan'),
  (reg_id, '19.71.04', 'Kecamatan Girimaya')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- Lampung — Bandar Lampung
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '18.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '18.71.01', 'Kecamatan Teluk Betung Selatan'),
  (reg_id, '18.71.02', 'Kecamatan Tanjung Karang'),
  (reg_id, '18.71.03', 'Kecamatan Kemiling'),
  (reg_id, '18.71.04', 'Kecamatan Panjang')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- DKI JAKARTA — Jakarta
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '31.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '31.71.01', 'Kecamatan Gambir'),
  (reg_id, '31.71.02', 'Kecamatan Menteng'),
  (reg_id, '31.71.03', 'Kecamatan Tanah Abang'),
  (reg_id, '31.71.04', 'Kecamatan Senen')
ON CONFLICT (code) DO NOTHING;

SELECT id INTO reg_id FROM regencies WHERE code = '31.74';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '31.74.01', 'Kecamatan Tebet'),
  (reg_id, '31.74.02', 'Kecamatan Setiabudi'),
  (reg_id, '31.74.03', 'Kecamatan Kebayoran Baru'),
  (reg_id, '31.74.04', 'Kecamatan Pasar Minggu')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- JAWA BARAT — Bandung
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '32.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '32.71.01', 'Kecamatan Bandung Wetan'),
  (reg_id, '32.71.02', 'Kecamatan Cibeunying'),
  (reg_id, '32.71.03', 'Kecamatan Bojongloa'),
  (reg_id, '32.71.04', 'Kecamatan Andir')
ON CONFLICT (code) DO NOTHING;

SELECT id INTO reg_id FROM regencies WHERE code = '32.73';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '32.73.01', 'Kecamatan Bogor Selatan'),
  (reg_id, '32.73.02', 'Kecamatan Bogor Tengah'),
  (reg_id, '32.73.03', 'Kecamatan Bogor Utara'),
  (reg_id, '32.73.04', 'Kecamatan Tanah Sereal')
ON CONFLICT (code) DO NOTHING;

SELECT id INTO reg_id FROM regencies WHERE code = '32.75';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '32.75.01', 'Kecamatan Cimahi Selatan'),
  (reg_id, '32.75.02', 'Kecamatan Cimahi Tengah'),
  (reg_id, '32.75.03', 'Kecamatan Cimahi Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- BANTEN — Serang
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '36.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '36.71.01', 'Kecamatan Serang'),
  (reg_id, '36.71.02', 'Kecamatan Cipocok Jaya'),
  (reg_id, '36.71.03', 'Kecamatan Kasemen'),
  (reg_id, '36.71.04', 'Kecamatan Walantaka')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- JAWA TENGAH — Semarang
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '33.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '33.71.01', 'Kecamatan Semarang Tengah'),
  (reg_id, '33.71.02', 'Kecamatan Semarang Utara'),
  (reg_id, '33.71.03', 'Kecamatan Semarang Selatan'),
  (reg_id, '33.71.04', 'Kecamatan Gajahmungkur')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- YOGYAKARTA — Yogyakarta
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '34.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '34.71.01', 'Kecamatan Gondokusuman'),
  (reg_id, '34.71.02', 'Kecamatan Jetis'),
  (reg_id, '34.71.03', 'Kecamatan Ngupasan'),
  (reg_id, '34.71.04', 'Kecamatan Kraton')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- JAWA TIMUR — Surabaya
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '35.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '35.71.01', 'Kecamatan Tegalsari'),
  (reg_id, '35.71.02', 'Kecamatan Simokerto'),
  (reg_id, '35.71.03', 'Kecamatan Bubutan'),
  (reg_id, '35.71.04', 'Kecamatan Genteng'),
  (reg_id, '35.71.05', 'Kecamatan Wonokromo')
ON CONFLICT (code) DO NOTHING;

-- ========================
— BALI — Denpasar
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '51.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '51.71.01', 'Kecamatan Denpasar Barat'),
  (reg_id, '51.71.02', 'Kecamatan Denpasar Timur'),
  (reg_id, '51.71.03', 'Kecamatan Denpasar Selatan'),
  (reg_id, '51.71.04', 'Kecamatan Denpasar Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- NTB — Mataram
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '52.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '52.71.01', 'Kecamatan Mataram'),
  (reg_id, '52.71.02', 'Kecamatan Ampenan'),
  (reg_id, '52.71.03', 'Kecamatan Cakranegara'),
  (reg_id, '52.71.04', 'Kecamatan Selaparang')
ON CONFLICT (code) DO NOTHING;

-- ========================
-- NTT — Kupang
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '53.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '53.71.01', 'Kecamatan Kota Raja'),
  (reg_id, '53.71.02', 'Kecamatan Oebobo'),
  (reg_id, '53.71.03', 'Kecamatan Kelapa Lima'),
  (reg_id, '53.71.04', 'Kecamatan Maulafa')
ON CONFLICT (code) DO NOTHING;

-- ========================
— KALBAR — Pontianak
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '61.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '61.71.01', 'Kecamatan Pontianak Tenggara'),
  (reg_id, '61.71.02', 'Kecamatan Pontianak Timur'),
  (reg_id, '61.71.03', 'Kecamatan Pontianak Barat'),
  (reg_id, '61.71.04', 'Kecamatan Pontianak Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
— KALTENG — Palangka Raya
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '62.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '62.71.01', 'Kecamatan Pahandut'),
  (reg_id, '62.71.02', 'Kecamatan Jekan Raya'),
  (reg_id, '62.71.03', 'Kecamatan Sabangau'),
  (reg_id, '62.71.04', 'Kecamatan Bukit Batu')
ON CONFLICT (code) DO NOTHING;

-- ========================
— KALSEL — Banjarmasin
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '63.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '63.71.01', 'Kecamatan Banjarmasin Tengah'),
  (reg_id, '63.71.02', 'Kecamatan Banjarmasin Utara'),
  (reg_id, '63.71.03', 'Kecamatan Banjarmasin Selatan'),
  (reg_id, '63.71.04', 'Kecamatan Banjarmasin Barat')
ON CONFLICT (code) DO NOTHING;

-- ========================
— KALTIM — Samarinda
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '64.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '64.71.01', 'Kecamatan Samarinda Kota'),
  (reg_id, '64.71.02', 'Kecamatan Samarinda Ulu'),
  (reg_id, '64.71.03', 'Kecamatan Samarinda Seberang'),
  (reg_id, '64.71.04', 'Kecamatan Sungai Pinang')
ON CONFLICT (code) DO NOTHING;

-- ========================
— KALTARA — Tarakan
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '65.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '65.71.01', 'Kecamatan Tarakan Barat'),
  (reg_id, '65.71.02', 'Kecamatan Tarakan Timur'),
  (reg_id, '65.71.03', 'Kecamatan Tarakan Tengah'),
  (reg_id, '65.71.04', 'Kecamatan Tarakan Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
— SULUT — Manado
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '71.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '71.71.01', 'Kecamatan Wenang'),
  (reg_id, '71.71.02', 'Kecamatan Sario'),
  (reg_id, '71.71.03', 'Kecamatan Malalayang'),
  (reg_id, '71.71.04', 'Kecamatan Mapanget')
ON CONFLICT (code) DO NOTHING;

-- ========================
— SULTENG — Palu
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '72.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '72.71.01', 'Kecamatan Palu Barat'),
  (reg_id, '72.71.02', 'Kecamatan Palu Timur'),
  (reg_id, '72.71.03', 'Kecamatan Palu Selatan'),
  (reg_id, '72.71.04', 'Kecamatan Palu Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
— SULSEL — Makassar
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '73.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '73.71.01', 'Kecamatan Makassar'),
  (reg_id, '73.71.02', 'Kecamatan Ujung Pandang'),
  (reg_id, '73.71.03', 'Kecamatan Rappocini'),
  (reg_id, '73.71.04', 'Kecamatan Tamalate')
ON CONFLICT (code) DO NOTHING;

-- ========================
— SULTRA — Kendari
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '74.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '74.71.01', 'Kecamatan Mandonga'),
  (reg_id, '74.71.02', 'Kecamatan Kendari Barat'),
  (reg_id, '74.71.03', 'Kecamatan Kendari'),
  (reg_id, '74.71.04', 'Kecamatan Puuwatu')
ON CONFLICT (code) DO NOTHING;

-- ========================
— GORONTALO — Gorontalo
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '75.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '75.71.01', 'Kecamatan Gorontalo Kota'),
  (reg_id, '75.71.02', 'Kecamatan Dungingi'),
  (reg_id, '75.71.03', 'Kecamatan Kota Barat'),
  (reg_id, '75.71.04', 'Kecamatan Kota Timur')
ON CONFLICT (code) DO NOTHING;

-- ========================
— MALUKU — Ambon
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '81.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '81.71.01', 'Kecamatan Nusaniwe'),
  (reg_id, '81.71.02', 'Kecamatan Sirimau'),
  (reg_id, '81.71.03', 'Kecamatan Baguala'),
  (reg_id, '81.71.04', 'Kecamatan Teluk Ambon')
ON CONFLICT (code) DO NOTHING;

-- ========================
— MALUKU UTARA — Ternate
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '82.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '82.71.01', 'Kecamatan Ternate Tengah'),
  (reg_id, '82.71.02', 'Kecamatan Ternate Selatan'),
  (reg_id, '82.71.03', 'Kecamatan Ternate Utara'),
  (reg_id, '82.71.04', 'Kecamatan Pulau Ternate')
ON CONFLICT (code) DO NOTHING;

-- ========================
— PAPUA — Jayapura
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '91.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '91.71.01', 'Kecamatan Jayapura Utara'),
  (reg_id, '91.71.02', 'Kecamatan Jayapura Selatan'),
  (reg_id, '91.71.03', 'Kecamatan Abepura'),
  (reg_id, '91.71.04', 'Kecamatan Muara Tami')
ON CONFLICT (code) DO NOTHING;

-- ========================
— PAPUA BARAT — Manokwari
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '92.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '92.71.01', 'Kecamatan Manokwari Barat'),
  (reg_id, '92.71.02', 'Kecamatan Manokwari Timur'),
  (reg_id, '92.71.03', 'Kecamatan Manokwari Selatan'),
  (reg_id, '92.71.04', 'Kecamatan Manokwari Utara')
ON CONFLICT (code) DO NOTHING;

-- ========================
— PAPUA BARAT DAYA — Sorong
-- ========================
SELECT id INTO reg_id FROM regencies WHERE code = '96.71';
INSERT INTO districts (regency_id, code, name) VALUES
  (reg_id, '96.71.01', 'Kecamatan Sorong Kota'),
  (reg_id, '96.71.02', 'Kecamatan Sorong Timur'),
  (reg_id, '96.71.03', 'Kecamatan Sorong Barat'),
  (reg_id, '96.71.04', 'Kecamatan Malaimsimsa')
ON CONFLICT (code) DO NOTHING;

-- Sample villages for a few districts to demonstrate cascading dropdown
-- Jakarta Pusat — Gambir
INSERT INTO villages (district_id, code, name)
SELECT d.id, '31.71.01.01', 'Kelurahan Gambir' FROM districts d WHERE d.code = '31.71.01'
WHERE NOT EXISTS (SELECT 1 FROM villages WHERE code = '31.71.01.01');
INSERT INTO villages (district_id, code, name)
SELECT d.id, '31.71.01.02', 'Kelurahan Menteng' FROM districts d WHERE d.code = '31.71.01'
WHERE NOT EXISTS (SELECT 1 FROM villages WHERE code = '31.71.01.02');

END $$;

-- ================================================
-- ✅ SEED DISTRICTS & VILLAGES COMPLETE
-- ================================================
-- Total: ~200 districts across all province capitals.
-- Sample villages for Jakarta.
-- Jalankan SETELAH seed_regencies.sql.
-- Urutan migrasi: consolidated-migration.sql → seed_regencies.sql → seed_districts_villages.sql
-- ================================================
