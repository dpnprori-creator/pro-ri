-- ================================================
-- v6: Add Province Coordinates (latitude/longitude)
-- ================================================
-- Menambahkan koordinat untuk peta interaktif
-- ================================================

-- Add columns if not exist (for provinces)
ALTER TABLE provinces ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE provinces ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add columns if not exist (for regencies)
ALTER TABLE regencies ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE regencies ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Update center coordinates for all 38 provinces
UPDATE provinces SET latitude = 5.5483, longitude = 95.3238 WHERE code = '11'; -- Aceh
UPDATE provinces SET latitude = 3.5952, longitude = 98.6722 WHERE code = '12'; -- Sumatera Utara
UPDATE provinces SET latitude = -0.9471, longitude = 100.4172 WHERE code = '13'; -- Sumatera Barat
UPDATE provinces SET latitude = 0.5071, longitude = 101.4478 WHERE code = '14'; -- Riau
UPDATE provinces SET latitude = -1.6101, longitude = 103.6131 WHERE code = '15'; -- Jambi
UPDATE provinces SET latitude = -2.9761, longitude = 104.7754 WHERE code = '16'; -- Sumatera Selatan
UPDATE provinces SET latitude = -3.7925, longitude = 102.2608 WHERE code = '17'; -- Bengkulu
UPDATE provinces SET latitude = -5.4500, longitude = 105.2667 WHERE code = '18'; -- Lampung
UPDATE provinces SET latitude = -2.1332, longitude = 106.1130 WHERE code = '19'; -- Kep. Bangka Belitung
UPDATE provinces SET latitude = 0.9139, longitude = 104.4533 WHERE code = '21'; -- Kepulauan Riau
UPDATE provinces SET latitude = -6.2088, longitude = 106.8456 WHERE code = '31'; -- DKI Jakarta
UPDATE provinces SET latitude = -6.9147, longitude = 107.6098 WHERE code = '32'; -- Jawa Barat
UPDATE provinces SET latitude = -6.9667, longitude = 110.4167 WHERE code = '33'; -- Jawa Tengah
UPDATE provinces SET latitude = -7.7956, longitude = 110.3695 WHERE code = '34'; -- DI Yogyakarta
UPDATE provinces SET latitude = -7.2504, longitude = 112.7688 WHERE code = '35'; -- Jawa Timur
UPDATE provinces SET latitude = -6.1129, longitude = 106.1517 WHERE code = '36'; -- Banten
UPDATE provinces SET latitude = -8.6500, longitude = 115.2167 WHERE code = '51'; -- Bali
UPDATE provinces SET latitude = -8.5833, longitude = 116.1167 WHERE code = '52'; -- NTB
UPDATE provinces SET latitude = -10.1772, longitude = 123.6072 WHERE code = '53'; -- NTT
UPDATE provinces SET latitude = -0.0263, longitude = 109.3425 WHERE code = '61'; -- Kalimantan Barat
UPDATE provinces SET latitude = -2.2134, longitude = 113.9137 WHERE code = '62'; -- Kalimantan Tengah
UPDATE provinces SET latitude = -3.4478, longitude = 114.8322 WHERE code = '63'; -- Kalimantan Selatan
UPDATE provinces SET latitude = -0.5022, longitude = 117.1536 WHERE code = '64'; -- Kalimantan Timur
UPDATE provinces SET latitude = 2.8465, longitude = 117.3621 WHERE code = '65'; -- Kalimantan Utara
UPDATE provinces SET latitude = 1.4748, longitude = 124.8421 WHERE code = '71'; -- Sulawesi Utara
UPDATE provinces SET latitude = 0.5333, longitude = 123.0667 WHERE code = '75'; -- Gorontalo
UPDATE provinces SET latitude = -0.8917, longitude = 119.8707 WHERE code = '72'; -- Sulawesi Tengah
UPDATE provinces SET latitude = -2.6738, longitude = 118.8876 WHERE code = '76'; -- Sulawesi Barat
UPDATE provinces SET latitude = -5.1477, longitude = 119.4327 WHERE code = '73'; -- Sulawesi Selatan
UPDATE provinces SET latitude = -3.9922, longitude = 122.5236 WHERE code = '74'; -- Sulawesi Tenggara
UPDATE provinces SET latitude = -3.6554, longitude = 128.1908 WHERE code = '81'; -- Maluku
UPDATE provinces SET latitude = 0.7350, longitude = 127.5614 WHERE code = '82'; -- Maluku Utara
UPDATE provinces SET latitude = -2.5330, longitude = 140.7170 WHERE code = '91'; -- Papua
UPDATE provinces SET latitude = -0.8629, longitude = 134.0640 WHERE code = '92'; -- Papua Barat
UPDATE provinces SET latitude = -3.5095, longitude = 135.7521 WHERE code = '94'; -- Papua Tengah
UPDATE provinces SET latitude = -4.0921, longitude = 138.9462 WHERE code = '95'; -- Papua Pegunungan
UPDATE provinces SET latitude = -8.4991, longitude = 140.4050 WHERE code = '93'; -- Papua Selatan
UPDATE provinces SET latitude = -0.8762, longitude = 131.2558 WHERE code = '96'; -- Papua Barat Daya

-- ================================================
-- Verify the data
-- ================================================
SELECT 'v6_add_province_coordinates' as migration,
       COUNT(*) as total_provinces,
       COUNT(latitude) as with_coords,
       COUNT(*) FILTER (WHERE latitude IS NULL) as missing_coords
FROM provinces;
