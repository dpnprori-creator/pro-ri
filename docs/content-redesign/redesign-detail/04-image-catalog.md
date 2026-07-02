# Image Asset Catalog — PRO RI

## Notes
- Website live lambat: hanya 1 dari 11 gambar berhasil didownload.
- Semua URL gambar asli dari WordPress dicantumkan untuk referensi implementasi.
- Gambar akan di-rehosting di `/assets/images/` di aplikasi Next.js.

---

## 1. Logo PRO RI

| Atribut | Detail |
|---------|--------|
| **URL Asli** | https://prori.vps313.com/wp-content/uploads/2026/06/prori_log_new.png |
| **Path Lokal** | `assets/images/prori_log_new.png` |
| **Tipe** | PNG |
| **Lokasi Halaman** | Semua halaman (header & footer) |
| **Alt Text** | Logo Pusat Robotika Rakyat Indonesia (PRO RI) |
| **Catatan** | — |
| **Download Status** | ❌ Timeout |

---

## 2. Hero Background — Homepage

| Atribut | Detail |
|---------|--------|
| **URL Asli** | https://prori.vps313.com/wp-content/uploads/2026/06/photo-1694532415679-13a10fb3d519-scaled.jpg |
| **Path Lokal** | `assets/images/home/hero-bg.jpg` |
| **Tipe** | JPEG (2560px — scaled) |
| **Ukuran** | ~320KB |
| **Lokasi Halaman** | Homepage — Hero Section |
| **Alt Text** | Generasi muda Indonesia sedang belajar robotika |
| **Catatan** | Foto stok, mungkin perlu diganti dengan foto asli kegiatan PRO RI |
| **Download Status** | ✅ Berhasil |

---

## 3. Section Background — Homepage

| Atribut | Detail |
|---------|--------|
| **URL Asli** | https://prori.vps313.com/wp-content/uploads/2026/06/photo-1678225867994-e7a5b071ebfd-scaled.jpg |
| **Path Lokal** | `assets/images/home/section-bg.jpg` |
| **Tipe** | JPEG (2560px — scaled) |
| **Lokasi Halaman** | Homepage — Content Section 2 |
| **Alt Text** | Inovasi teknologi robotika Indonesia |
| **Download Status** | ❌ Timeout |

---

## 4. Blog Card Images (3 items)

| # | URL Asli | Path Lokal | Halaman |
|---|----------|------------|---------|
| 1 | https://prori.vps313.com/wp-content/uploads/2026/06/prori26.webp | `assets/images/news/prori26.webp` | Homepage & Blog — card artikel "Meraih Indonesia Emas 2045" |
| 2 | https://prori.vps313.com/wp-content/uploads/2026/06/pengurus-prori.webp | `assets/images/news/pengurus-prori.webp` | Homepage & Blog — card artikel "PRI Bentuk PRO RI" |
| 3 | https://prori.vps313.com/wp-content/uploads/2026/06/prori-juni26.webp | `assets/images/news/prori-juni26.webp` | Homepage & Blog — card artikel "Kawal Indonesia Emas 2045" |

**Download Status:** ❌ Semua timeout

---

## 5. Infographics — Tentang Kami (5 items)

| # | URL Asli | Path Lokal | Konten |
|---|----------|------------|--------|
| 1 | https://prori.vps313.com/wp-content/uploads/2026/06/tujuan-prori.jpeg | `assets/images/about/tujuan-prori.jpeg` | Tujuan PRO RI |
| 2 | https://prori.vps313.com/wp-content/uploads/2026/06/visi-misi-prori.jpeg | `assets/images/about/visi-misi-prori.jpeg` | Visi & Misi PRO RI |
| 3 | https://prori.vps313.com/wp-content/uploads/2026/06/peta-jalan-prori.jpeg | `assets/images/about/peta-jalan-prori.jpeg` | Peta Jalan PRO RI |
| 4 | https://prori.vps313.com/wp-content/uploads/2026/06/konstruksi-logo-prori.jpeg | `assets/images/about/konstruksi-logo-prori.jpeg` | Konstruksi Logo PRO RI |
| 5 | https://prori.vps313.com/wp-content/uploads/2026/06/filosofi-logo_prori.jpeg | `assets/images/about/filosofi-logo_prori.jpeg` | Filosofi Logo PRO RI |

**Download Status:** ❌ Semua timeout (server lambat)

---

## Image Recommendations for Implementation

### Must-Have New Images (not on existing site)
1. **Foto asli kegiatan** — dokumentasi pelantikan DPN PRO RI (13 Juni 2026)
2. **Foto Adityo Handoko** — portrait Ketua PRO RI
3. **Foto Muhammad Nazaruddin** — portrait Ketum PRI
4. **Foto Muhamad Ied** — portrait Sekretaris PRO RI
5. **Ilustrasi/ikon 6 program** — untuk halaman Program
6. **Map of Indonesia** — visual 38 provinsi untuk Trust Bar
7. **Team/founder photo** — jika ada dokumentasi

### Alt Text Convention
Semua gambar harus memiliki alt text deskriptif dengan format:
```
[Deskripsi visual] — [konteks halaman] — PRO RI
```
Contoh: "Suasana pelantikan DPN PRO RI di DPP PRI Jakarta — 13 Juni 2026 — PRO RI"
