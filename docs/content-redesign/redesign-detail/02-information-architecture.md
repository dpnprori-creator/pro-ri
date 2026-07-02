# Information Architecture & Sitemap — PRO RI Redesain

## Sitemap (New)

```
prori.vps313.com/
├── /                          # Beranda (Homepage) — landing page utama
├── /tentang-kami              # Tentang Kami — visi, misi, sejarah, program
│   └── /tentang-kami/sejarah  # Sejarah PRO RI (deep page)
├── /program                   # Program Unggulan — detail 6 program utama
│   ├── /program/sekolah-robotika
│   ├── /program/robotika-masuk-sekolah
│   ├── /program/akademi-ai
│   ├── /program/kompetisi-robotika-nasional
│   ├── /program/inkubator-inovasi-teknologi
│   └── /program/robotika-untuk-umkm
├── /pengurus                   # Struktur & Susunan Pengurus
├── /informasi                  # Blog / Berita / Artikel
│   ├── /informasi/kegiatan     # Kategori: Kegiatan
│   └── /informasi/[slug]       # Artikel individu
├── /anggota                    # Pendaftaran Anggota
└── /kontak                     # Hubungi Kami
```

## Perubahan dari Sitemap Lama

| Lama | Baru | Alasan |
|------|------|--------|
| `/susunan-pengurus/` | `/pengurus/` | Path lebih pendek, slug lebih clean |
| `Blog` di menu | `/informasi/` dipertahankan | Konsisten dengan label existing |
| Tidak ada `/program/` | Ditambahkan | 6 program utama perlu halaman dedicated |
| Tidak ada `/tentang-kami/sejarah` | Ditambahkan | Narrative origin story untuk credibility |

## Information Architecture — Content Grouping by User Journey

### Top Navigation (Primary Menu)
1. **Beranda** — `/`
2. **Tentang Kami** — `/tentang-kami`
3. **Program** — `/program`
4. **Pengurus** — `/pengurus`
5. **Informasi** — `/informasi`
6. **Daftar Anggota** — `/anggota` (CTA button style di menu)
7. **Kontak** — `/kontak`

### Page-by-Page IA

#### 1. HOMEPAGE — New Section Hierarchy
```
Hero Section
├── Headline: "Gerakan Robotika Rakyat Indonesia"
├── Subheadline: "Mewujudkan Kedaulatan Teknologi untuk Indonesia Emas 2045"
├── Primary CTA: "Daftar Anggota →" /anggota
└── Secondary CTA: "Pelajari Program →" /program

Trust Bar / Statistik
├── [X] Anggota Tersebar di 38 Provinsi
├── [6] Program Unggulan Nasional
├── [X] Mitra Strategis
└── [2026] Tahun Berdiri

Sekilas PRO RI
├── Paragraf tentang misi organisasi
└── CTA "Tentang Kami →"

Program Unggulan (Grid 3x2)
├── Sekolah Robotika Rakyat
├── Robotika Masuk Sekolah
├── Akademi AI
├── Kompetisi Robotika Nasional
├── Inkubator Inovasi Teknologi
└── Robotika untuk UMKM

Berita Terkini
├── 3 blog post cards (existing content)
└── CTA "Lihat Semua →" /informasi

CTA Section — "Bergabunglah dengan Gerakan"
├── Headline: "Indonesia Emas 2045 Dimulai dari Sekarang"
├── Subheadline: "Jadilah bagian dari generasi robotik Indonesia"
└── CTA "Daftar Anggota →"

Footer
├── Logo + Tagline
├── Navigasi (links)
├── Kontak (email, sosial media)
└── Copyright
```

#### 2. TENTANG KAMI — New Content Structure
```
Hero Section (small)
├── Headline: "Tentang Pusat Robotika Rakyat Indonesia"

Sejarah PRO RI (narrative text)
├── Origin story — dibentuk oleh PRI, diluncurkan 6 Juni 2026
├── Quotes from tokoh
└── Timeline visual

Visi & Misi (text + infographic as visual aid)
├── Visi: "Terwujudnya Kedaulatan Teknologi Indonesia..."
└── Misi: 4-5 bullet points

Tujuan Organisasi (text + infographic)
├── List tujuan dengan penjelasan singkat

Peta Jalan (Roadmap)
├── 2026: Founding & organizational setup
├── 2027-2028: Program rollout 38 provinsi
├── 2029-2030: Impact scaling
└── 2045: Indonesia Emas

Struktur Organisasi
├── DPN (Pusat) → DPD (Provinsi) → DPC (Kab/Kota)
└── CTA "Lihat Pengurus →" /pengurus

Filosofi Logo (text explanation + infographic)
├── Makna setiap elemen logo PRO RI

Sister Organizations
├── MURI, PERI, LBH RI, AMRI, PATRIOT RI, PERISAI RI Kristiani

CTA Section
└── "Bergabung →" /anggota
```

#### 3. PROGRAM — New Page (did not exist before)
```
Hero Section
├── Headline: "Program Unggulan PRO RI"
├── Subheadline: "6 Program Strategis Mewujudkan Kedaulatan Teknologi"

Program Cards (6 items)
├── Each card:
│   ├── Ikon/Ilustrasi
│   ├── Nama Program
│   ├── Deskripsi singkat (1-2 kalimat)
│   ├── Target sasaran
│   └── CTA "Selengkapnya" (link ke halaman detail)

Bottom CTA
└── "Daftar Anggota →"
```

#### 4. PENGURUS — Redesigned (was empty)
```
Hero Section
├── Headline: "Susunan Pengurus PRO RI"
├── Subheadline: "Struktur Kepemimpinan Pusat Robotika Rakyat Indonesia"

DPN (Dewan Pimpinan Nasional)
├── Ketua: Adityo Handoko
├── Sekretaris: Muhamad Ied
├── Bendahara: [TBA]
└── [Other positions]

Struktur Organisasi
├── Diagram/Illustration of DPN → DPD → DPC

Info Tambahan
├── Penjelasan struktur organisasi nasional
└── CTA "Hubungi Kami" /kontak
```

#### 5. INFORMASI / BLOG
```
Hero Section (small)
├── Headline: "Informasi & Berita Terkini"

Blog Listing
├── Post cards (featured image, title, date, category, excerpt)
├── Category filter (if multiple categories exist later)
└── Pagination (for future)

Sidebar
├── Recent Posts
├── Categories
└── (future: newsletter subscribe)

CTA Section
└── "Ikuti Perkembangan PRO RI → Subscribe"
```

#### 6. ANGGOTA (Registration)
```
Hero Section (small)
├── Headline: "Daftar Anggota PRO RI"

Benefit Section (NEW — was missing)
├── Apa yang Anda dapatkan sebagai anggota:
│   ├ Akses ke program pelatihan robotika
│   ├ Partisipasi kompetisi nasional
│   ├ Jaringan nasional 38 provinsi
│   ├ Sertifikat keanggotaan
│   └ Informasi eksklusif

Membership Tiers
├── Pelajar
├── Mahasiswa
├── Umum
├── Asosiasi/Instansi/Corporate
└── [Fee info if applicable] (Future)

Registration Form
├── Existing fields (Nama, TTL, Alamat, Email, Telepon, Jenis Anggota, Persetujuan)
├── + CAPTCHA/security (recommended)
└── + Success message with next steps

CTA Section
└── "Punya Pertanyaan? Hubungi Kami →" /kontak
```

#### 7. KONTAK — Redesigned
```
Hero Section (small)
├── Headline: "Hubungi Kami"

Contact Information (NEW — was missing)
├── Alamat: [alamat DPP PRI / PRO RI]
├── Email: [email resmi]
├── Telepon: [nomor kontak]
├── Social Media: [links]

Contact Form
├── Existing fields
├── + Subject/Perihal dropdown
└── + Response time promise

Social Media Links
├── Instagram
├── YouTube
├── Twitter/X
├── TikTok
└── [others]

FAQ Section (optional)
└── Pertanyaan umum
