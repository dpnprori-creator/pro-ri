-- ================================================
-- SEED REGENCIES (Kota/Kabupaten)
-- Untuk dropdown wilayah pada form pendaftaran
-- ================================================
-- Jalankan setelah consolidated-migration.sql

-- Helper: get province ID by code
DO $$
DECLARE
  v_id UUID;
BEGIN

-- === ACEH (AC) ===
SELECT id INTO v_id FROM provinces WHERE code = 'AC';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '11.71', 'Kota Banda Aceh'),
  (v_id, '11.72', 'Kota Sabang'),
  (v_id, '11.73', 'Kota Lhokseumawe'),
  (v_id, '11.01', 'Kabupaten Aceh Selatan'),
  (v_id, '11.02', 'Kabupaten Aceh Tenggara')
ON CONFLICT (code) DO NOTHING;

-- === SUMATERA UTARA (SU) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SU';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '12.71', 'Kota Medan'),
  (v_id, '12.72', 'Kota Pematangsiantar'),
  (v_id, '12.73', 'Kota Binjai'),
  (v_id, '12.74', 'Kota Tebing Tinggi'),
  (v_id, '12.01', 'Kabupaten Deli Serdang')
ON CONFLICT (code) DO NOTHING;

-- === SUMATERA BARAT (SB) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SB';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '13.71', 'Kota Padang'),
  (v_id, '13.72', 'Kota Bukittinggi'),
  (v_id, '13.73', 'Kota Payakumbuh'),
  (v_id, '13.01', 'Kabupaten Pesisir Selatan'),
  (v_id, '13.02', 'Kabupaten Agam')
ON CONFLICT (code) DO NOTHING;

-- === RIAU (RI) ===
SELECT id INTO v_id FROM provinces WHERE code = 'RI';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '14.71', 'Kota Pekanbaru'),
  (v_id, '14.72', 'Kota Dumai'),
  (v_id, '14.01', 'Kabupaten Kampar'),
  (v_id, '14.02', 'Kabupaten Rokan Hulu')
ON CONFLICT (code) DO NOTHING;

-- === KEPULAUAN RIAU (KR) ===
SELECT id INTO v_id FROM provinces WHERE code = 'KR';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '21.71', 'Kota Batam'),
  (v_id, '21.72', 'Kota Tanjung Pinang'),
  (v_id, '21.01', 'Kabupaten Bintan'),
  (v_id, '21.02', 'Kabupaten Karimun')
ON CONFLICT (code) DO NOTHING;

-- === JAMBI (JA) ===
SELECT id INTO v_id FROM provinces WHERE code = 'JA';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '15.71', 'Kota Jambi'),
  (v_id, '15.72', 'Kota Sungai Penuh'),
  (v_id, '15.01', 'Kabupaten Kerinci'),
  (v_id, '15.02', 'Kabupaten Merangin')
ON CONFLICT (code) DO NOTHING;

-- === SUMATERA SELATAN (SS) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SS';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '16.71', 'Kota Palembang'),
  (v_id, '16.72', 'Kota Lubuklinggau'),
  (v_id, '16.73', 'Kota Pagar Alam'),
  (v_id, '16.01', 'Kabupaten Ogan Komering Ulu'),
  (v_id, '16.02', 'Kabupaten Muara Enim')
ON CONFLICT (code) DO NOTHING;

-- === BANGKA BELITUNG (BB) ===
SELECT id INTO v_id FROM provinces WHERE code = 'BB';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '19.71', 'Kota Pangkal Pinang'),
  (v_id, '19.01', 'Kabupaten Bangka'),
  (v_id, '19.02', 'Kabupaten Belitung')
ON CONFLICT (code) DO NOTHING;

-- === BENGKULU (BE) ===
SELECT id INTO v_id FROM provinces WHERE code = 'BE';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '17.71', 'Kota Bengkulu'),
  (v_id, '17.01', 'Kabupaten Bengkulu Selatan'),
  (v_id, '17.02', 'Kabupaten Rejang Lebong')
ON CONFLICT (code) DO NOTHING;

-- === LAMPUNG (LA) ===
SELECT id INTO v_id FROM provinces WHERE code = 'LA';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '18.71', 'Kota Bandar Lampung'),
  (v_id, '18.72', 'Kota Metro'),
  (v_id, '18.01', 'Kabupaten Lampung Selatan'),
  (v_id, '18.02', 'Kabupaten Lampung Tengah')
ON CONFLICT (code) DO NOTHING;

-- === DKI JAKARTA (JK) ===
SELECT id INTO v_id FROM provinces WHERE code = 'JK';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '31.71', 'Kota Jakarta Pusat'),
  (v_id, '31.72', 'Kota Jakarta Utara'),
  (v_id, '31.73', 'Kota Jakarta Barat'),
  (v_id, '31.74', 'Kota Jakarta Selatan'),
  (v_id, '31.75', 'Kota Jakarta Timur'),
  (v_id, '31.01', 'Kabupaten Kepulauan Seribu')
ON CONFLICT (code) DO NOTHING;

-- === JAWA BARAT (JB) ===
SELECT id INTO v_id FROM provinces WHERE code = 'JB';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '32.71', 'Kota Bandung'),
  (v_id, '32.72', 'Kota Bekasi'),
  (v_id, '32.73', 'Kota Bogor'),
  (v_id, '32.74', 'Kota Depok'),
  (v_id, '32.75', 'Kota Cimahi'),
  (v_id, '32.01', 'Kabupaten Bandung'),
  (v_id, '32.02', 'Kabupaten Bekasi'),
  (v_id, '32.03', 'Kabupaten Bogor')
ON CONFLICT (code) DO NOTHING;

-- === BANTEN (BT) ===
SELECT id INTO v_id FROM provinces WHERE code = 'BT';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '36.71', 'Kota Serang'),
  (v_id, '36.72', 'Kota Cilegon'),
  (v_id, '36.73', 'Kota Tangerang'),
  (v_id, '36.74', 'Kota Tangerang Selatan'),
  (v_id, '36.01', 'Kabupaten Tangerang'),
  (v_id, '36.02', 'Kabupaten Lebak')
ON CONFLICT (code) DO NOTHING;

-- === JAWA TENGAH (JT) ===
SELECT id INTO v_id FROM provinces WHERE code = 'JT';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '33.71', 'Kota Semarang'),
  (v_id, '33.72', 'Kota Surakarta'),
  (v_id, '33.73', 'Kota Salatiga'),
  (v_id, '33.74', 'Kota Pekalongan'),
  (v_id, '33.75', 'Kota Magelang'),
  (v_id, '33.01', 'Kabupaten Cilacap'),
  (v_id, '33.02', 'Kabupaten Banyumas'),
  (v_id, '33.03', 'Kabupaten Klaten')
ON CONFLICT (code) DO NOTHING;

-- === DI YOGYAKARTA (DI) ===
SELECT id INTO v_id FROM provinces WHERE code = 'DI';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '34.71', 'Kota Yogyakarta'),
  (v_id, '34.01', 'Kabupaten Sleman'),
  (v_id, '34.02', 'Kabupaten Bantul'),
  (v_id, '34.03', 'Kabupaten Gunung Kidul')
ON CONFLICT (code) DO NOTHING;

-- === JAWA TIMUR (JI) ===
SELECT id INTO v_id FROM provinces WHERE code = 'JI';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '35.71', 'Kota Surabaya'),
  (v_id, '35.72', 'Kota Malang'),
  (v_id, '35.73', 'Kota Kediri'),
  (v_id, '35.74', 'Kota Probolinggo'),
  (v_id, '35.01', 'Kabupaten Malang'),
  (v_id, '35.02', 'Kabupaten Sidoarjo'),
  (v_id, '35.03', 'Kabupaten Pasuruan')
ON CONFLICT (code) DO NOTHING;

-- === BALI (BA) ===
SELECT id INTO v_id FROM provinces WHERE code = 'BA';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '51.71', 'Kota Denpasar'),
  (v_id, '51.01', 'Kabupaten Badung'),
  (v_id, '51.02', 'Kabupaten Gianyar'),
  (v_id, '51.03', 'Kabupaten Buleleng')
ON CONFLICT (code) DO NOTHING;

-- === NUSA TENGGARA BARAT (NB) ===
SELECT id INTO v_id FROM provinces WHERE code = 'NB';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '52.71', 'Kota Mataram'),
  (v_id, '52.72', 'Kota Bima'),
  (v_id, '52.01', 'Kabupaten Lombok Barat'),
  (v_id, '52.02', 'Kabupaten Lombok Tengah'),
  (v_id, '52.03', 'Kabupaten Sumbawa')
ON CONFLICT (code) DO NOTHING;

-- === NUSA TENGGARA TIMUR (NT) ===
SELECT id INTO v_id FROM provinces WHERE code = 'NT';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '53.71', 'Kota Kupang'),
  (v_id, '53.01', 'Kabupaten Timor Tengah Selatan'),
  (v_id, '53.02', 'Kabupaten Flores Timur'),
  (v_id, '53.03', 'Kabupaten Sikka')
ON CONFLICT (code) DO NOTHING;

-- === KALIMANTAN BARAT (KB) ===
SELECT id INTO v_id FROM provinces WHERE code = 'KB';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '61.71', 'Kota Pontianak'),
  (v_id, '61.72', 'Kota Singkawang'),
  (v_id, '61.01', 'Kabupaten Sambas'),
  (v_id, '61.02', 'Kabupaten Mempawah')
ON CONFLICT (code) DO NOTHING;

-- === KALIMANTAN TENGAH (KT) ===
SELECT id INTO v_id FROM provinces WHERE code = 'KT';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '62.71', 'Kota Palangka Raya'),
  (v_id, '62.01', 'Kabupaten Kotawaringin Barat'),
  (v_id, '62.02', 'Kabupaten Kapuas'),
  (v_id, '62.03', 'Kabupaten Barito Selatan')
ON CONFLICT (code) DO NOTHING;

-- === KALIMANTAN SELATAN (KS) ===
SELECT id INTO v_id FROM provinces WHERE code = 'KS';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '63.71', 'Kota Banjarmasin'),
  (v_id, '63.72', 'Kota Banjarbaru'),
  (v_id, '63.01', 'Kabupaten Banjar'),
  (v_id, '63.02', 'Kabupaten Tanah Laut'),
  (v_id, '63.03', 'Kabupaten Tapin')
ON CONFLICT (code) DO NOTHING;

-- === KALIMANTAN TIMUR (KI) ===
SELECT id INTO v_id FROM provinces WHERE code = 'KI';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '64.71', 'Kota Samarinda'),
  (v_id, '64.72', 'Kota Balikpapan'),
  (v_id, '64.73', 'Kota Bontang'),
  (v_id, '64.01', 'Kabupaten Kutai Kartanegara'),
  (v_id, '64.02', 'Kabupaten Kutai Timur')
ON CONFLICT (code) DO NOTHING;

-- === KALIMANTAN UTARA (KU) ===
SELECT id INTO v_id FROM provinces WHERE code = 'KU';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '65.71', 'Kota Tarakan'),
  (v_id, '65.01', 'Kabupaten Bulungan'),
  (v_id, '65.02', 'Kabupaten Malinau')
ON CONFLICT (code) DO NOTHING;

-- === SULAWESI UTARA (SA) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SA';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '71.71', 'Kota Manado'),
  (v_id, '71.72', 'Kota Bitung'),
  (v_id, '71.73', 'Kota Tomohon'),
  (v_id, '71.01', 'Kabupaten Minahasa'),
  (v_id, '71.02', 'Kabupaten Minahasa Utara')
ON CONFLICT (code) DO NOTHING;

-- === SULAWESI TENGAH (SG) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SG';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '72.71', 'Kota Palu'),
  (v_id, '72.01', 'Kabupaten Donggala'),
  (v_id, '72.02', 'Kabupaten Poso'),
  (v_id, '72.03', 'Kabupaten Banggai')
ON CONFLICT (code) DO NOTHING;

-- === SULAWESI SELATAN (SR) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SR';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '73.71', 'Kota Makassar'),
  (v_id, '73.72', 'Kota Parepare'),
  (v_id, '73.73', 'Kota Palopo'),
  (v_id, '73.01', 'Kabupaten Gowa'),
  (v_id, '73.02', 'Kabupaten Maros'),
  (v_id, '73.03', 'Kabupaten Bone'),
  (v_id, '73.04', 'Kabupaten Wajo')
ON CONFLICT (code) DO NOTHING;

-- === SULAWESI TENGGARA (SE) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SE';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '74.71', 'Kota Kendari'),
  (v_id, '74.72', 'Kota Baubau'),
  (v_id, '74.01', 'Kabupaten Kolaka'),
  (v_id, '74.02', 'Kabupaten Konawe')
ON CONFLICT (code) DO NOTHING;

-- === GORONTALO (GO) ===
SELECT id INTO v_id FROM provinces WHERE code = 'GO';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '75.71', 'Kota Gorontalo'),
  (v_id, '75.01', 'Kabupaten Gorontalo'),
  (v_id, '75.02', 'Kabupaten Bone Bolango')
ON CONFLICT (code) DO NOTHING;

-- === SULAWESI BARAT (SN) ===
SELECT id INTO v_id FROM provinces WHERE code = 'SN';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '76.71', 'Kota Mamuju'),
  (v_id, '76.01', 'Kabupaten Polewali Mandar'),
  (v_id, '76.02', 'Kabupaten Majene')
ON CONFLICT (code) DO NOTHING;

-- === MALUKU (MA) ===
SELECT id INTO v_id FROM provinces WHERE code = 'MA';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '81.71', 'Kota Ambon'),
  (v_id, '81.72', 'Kota Tual'),
  (v_id, '81.01', 'Kabupaten Maluku Tengah'),
  (v_id, '81.02', 'Kabupaten Seram Bagian Barat')
ON CONFLICT (code) DO NOTHING;

-- === MALUKU UTARA (MU) ===
SELECT id INTO v_id FROM provinces WHERE code = 'MU';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '82.71', 'Kota Ternate'),
  (v_id, '82.72', 'Kota Tidore Kepulauan'),
  (v_id, '82.01', 'Kabupaten Halmahera Barat'),
  (v_id, '82.02', 'Kabupaten Halmahera Timur')
ON CONFLICT (code) DO NOTHING;

-- === PAPUA (PA) ===
SELECT id INTO v_id FROM provinces WHERE code = 'PA';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '91.71', 'Kota Jayapura'),
  (v_id, '91.01', 'Kabupaten Jayapura'),
  (v_id, '91.02', 'Kabupaten Sarmi')
ON CONFLICT (code) DO NOTHING;

-- === PAPUA BARAT (PB) ===
SELECT id INTO v_id FROM provinces WHERE code = 'PB';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '92.71', 'Kota Manokwari'),
  (v_id, '92.01', 'Kabupaten Manokwari'),
  (v_id, '92.02', 'Kabupaten Sorong')
ON CONFLICT (code) DO NOTHING;

-- === PAPUA TENGAH (PT) ===
SELECT id INTO v_id FROM provinces WHERE code = 'PT';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '94.01', 'Kabupaten Nabire'),
  (v_id, '94.02', 'Kabupaten Paniai'),
  (v_id, '94.03', 'Kabupaten Mimika')
ON CONFLICT (code) DO NOTHING;

-- === PAPUA SELATAN (PS) ===
SELECT id INTO v_id FROM provinces WHERE code = 'PS';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '93.01', 'Kabupaten Merauke'),
  (v_id, '93.02', 'Kabupaten Boven Digoel'),
  (v_id, '93.03', 'Kabupaten Mappi')
ON CONFLICT (code) DO NOTHING;

-- === PAPUA PEGUNUNGAN (PG) ===
SELECT id INTO v_id FROM provinces WHERE code = 'PG';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '95.01', 'Kabupaten Jayawijaya'),
  (v_id, '95.02', 'Kabupaten Lanny Jaya'),
  (v_id, '95.03', 'Kabupaten Nduga')
ON CONFLICT (code) DO NOTHING;

-- === PAPUA BARAT DAYA (PD) ===
SELECT id INTO v_id FROM provinces WHERE code = 'PD';
INSERT INTO regencies (province_id, code, name) VALUES
  (v_id, '96.71', 'Kota Sorong'),
  (v_id, '96.01', 'Kabupaten Sorong'),
  (v_id, '96.02', 'Kabupaten Raja Ampat')
ON CONFLICT (code) DO NOTHING;

END $$;

-- ================================================
-- ✅ SEED REGENCIES COMPLETE
-- ================================================
-- Total: ~130+ regencies across all 38 provinces.
-- Jalankan: psql -h <host> -d <db> -f seed_regencies.sql
-- ================================================
