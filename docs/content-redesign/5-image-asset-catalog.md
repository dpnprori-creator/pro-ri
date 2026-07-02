# Image Asset Catalog — PRO RI Website

> Images currently used on the website with recommendations

---

## Current Logo Images

| # | Current URL | Original Filename | Downloaded Filename | Page Location | Section | Purpose | Alt Text |
|---|-------------|-------------------|--------------------|---------------|---------|---------|----------|
| 1 | `/images/logo-persegi.jpeg` | `logo-persegi.jpeg` | `logo-pro-ri-persegi.jpeg` | All pages | Navbar/Header | Brand logo | Pusat Robotika Rakyat Indonesia |
| 2 | `/images/logo-putih.jpeg` | `logo-putih.jpeg` | `logo-pro-ri-putih.jpeg` | (mungkin di footer) | Footer/Brand | Brand logo putih | Logo PRO RI |
| 3 | `/images/logo-hitam.jpeg` | `logo-hitam.jpeg` | `logo-pro-ri-hitam.jpeg` | (cadangan) | - | Brand logo hitam | Logo PRO RI |

**Action:** Keep as-is. Consider converting to WebP for performance.

---

## Hero Section Images

| # | Source | Description | Page | Section | Recommended Usage | Recommended Filename |
|---|--------|-------------|------|---------|-------------------|---------------------|
| 1 | Unsplash: robot hand | Robot AI holding chip | Beranda | Hero | ✅ Keep (current) | `hero-robot-ai.webp` |
| 2 | Unsplash: AI brain | AI technology abstract | Tentang | Hero | ✅ Keep (current) | `hero-about-pro-ri.webp` |
| 3 | Unsplash: team meeting | Team collaborating | Pengurus | Hero | ✅ Keep (current) | `hero-pengurus-pro-ri.webp` |
| 4 | Unsplash: circuit board | Circuit technology | Program | Hero | ✅ Keep (current) | `hero-program-pro-ri.webp` |
| 5 | Unsplash: email | Contact communication | Kontak | Hero | ✅ Keep (current) | `hero-kontak-pro-ri.webp` |

**Action:** Download all hero images locally to `/assets/images/` for performance and reliability.

---

## Program Card Images

| # | Source | Description | Page | Section | Recommended Usage | Recommended Filename |
|---|--------|-------------|------|---------|-------------------|---------------------|
| 1 | Unsplash: classroom | Students learning | Program | Sekolah Robotika Rakyat | ✅ Keep (replace with real photo later) | `program-sekolah-robotika.webp` |
| 2 | Unsplash: books | Education | Program | Robotika Masuk Sekolah | ✅ Keep (replace with real photo later) | `program-robotika-sekolah.webp` |
| 3 | Unsplash: AI brain | AI Technology | Program | Akademi AI | ✅ Keep (replace with real photo later) | `program-akademi-ai.webp` |
| 4 | Unsplash: robot competition | Robots in competition | Program | Kompetisi Robotika | ✅ Keep (replace with real photo later) | `program-kompetisi-robotika.webp` |
| 5 | Unsplash: circuit | Circuit board | Program | Inkubator Inovasi | ✅ Keep (replace with real photo later) | `program-inkubator-inovasi.webp` |
| 6 | Unsplash: business meeting | UMKM meeting | Program | Robotika UMKM | ✅ Keep (replace with real photo later) | `program-robotika-umkm.webp` |

**Action:** Replace with original PRO RI event/activity photos when available.

---

## Video Section

| # | Source | Description | Page | Section | Recommended Usage |
|---|--------|-------------|------|---------|-------------------|
| 1 | YouTube (d6VGhJnwyoY) | Robot Indonesia video | Beranda | Video Showcase | ✅ Keep |
| 2 | YouTube (yjztvddhZmI) | AI & Inovasi video | Beranda | Video Showcase | ✅ Keep |

**Action:** Ensure playlists are curated and relevant.

---

## News Card Images

| # | Source | Description | Page | Section | Recommended Usage |
|---|--------|-------------|------|---------|-------------------|
| 1+ | Supabase Storage | Dynamic news images | Berita / Beranda | News cards | ✅ Keep (original) |
| - | Placeholder gradient | Fallback when no image | Berita | News cards | ✅ Keep as fallback |

**Action:** All news images already use Supabase storage — good. Ensure alt text is descriptive.

---

## Recommended Image Placements (Redesigned)

| Section | Recommended Image | Placement | Ratio | Alt Text |
|---------|-------------------|-----------|-------|----------|
| Hero Banner | Existing hero robot image | Right side / Full background | 16:9 | Pelajar Indonesia mempelajari robotika dan teknologi masa depan |
| Apa Itu PRO RI | Existing organizational image | Left side | 4:3 | Rapat koordinasi nasional PRO RI |
| Mengapa Robotika Penting | AI + Robotics composite | Split left/right | 16:9 | Ilustrasi AI, robotika, IoT, dan otomatisasi |
| Program Unggulan | Existing program card images | Card background | 3:2 | Program unggulan robotika PRO RI |
| Dampak Nasional | Data visualization | Full width | - | Grafik dampak nasional PRO RI |
| Roadmap Indonesia Emas | Timeline visual | Full width | - | Peta jalan PRO RI menuju Indonesia Emas 2045 |
| Informasi Terkini | Dynamic news images | Card grid | 16:9 | Berita terbaru PRO RI |
| Mitra Strategis | Partner logos | Grid list | 1:1 | Logo mitra strategis PRO RI |
| CTA Gabung | Inspirational group photo | Full background | 16:9 | Anggota PRO RI dari berbagai daerah |

---

## Image Storage Organization

```
/assets/images/
├── home/
│   ├── hero-generasi-robotik.webp
│   └── cta-join-membership.webp
├── about/
│   ├── hero-about-pro-ri.webp
│   └── sejarah-pro-ri.webp
├── programs/
│   ├── program-sekolah-robotika.webp
│   ├── program-robotika-sekolah.webp
│   ├── program-akademi-ai.webp
│   ├── program-kompetisi-robotika.webp
│   ├── program-inkubator-inovasi.webp
│   └── program-robotika-umkm.webp
├── pengurus/
│   ├── hero-pengurus-pro-ri.webp
│   └── foto-ketua-pro-ri.webp
├── news/
│   └── (dynamic from Supabase)
├── membership/
│   └── (membership-related images)
└── contact/
    └── hero-kontak-pro-ri.webp
```
