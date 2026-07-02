# Sitemap — PRO RI Website

> Current structure with proposed improvements

---

## Current Sitemap

```
/
├── Beranda (/)                          [PUBLIC]
├── Peta Nasional (/national-map)        [PUBLIC]
├── Tentang (/about)                     [PUBLIC]
├── Program (/programs)                  [PUBLIC]
├── Pengurus (/pengurus)                 [PUBLIC]
├── Informasi (/news)                    [PUBLIC]
│   └── Artikel (/news/[slug])           [PUBLIC]
├── Events (/events)                     [PUBLIC]
│   └── Detail Event (/events/[slug])    [PUBLIC]
├── Inovasi (/innovations)               [PUBLIC]
│   └── Detail Inovasi (/innovations/[slug]) [PUBLIC]
├── Daftar (/register)                   [PUBLIC]
├── Masuk (/login)                       [PUBLIC]
├── Kontak (/kontak)                     [PUBLIC]
│
├── Dashboard (/dashboard)               [MEMBER]
│   ├── Membership (/membership)
│   ├── Sertifikat (/membership/certificates)
│   ├── Peta Nasional (/dashboard/national-map)
│   ├── Direktori (/members)
│   ├── Events (/dashboard/events)
│   ├── Inovasi (/dashboard/innovations)
│   ├── Akademi (/academy)
│   └── Profil (/profile)
│
└── Admin (/admin)                       [ADMIN/SUPER_ADMIN]
    ├── Dashboard (/admin)
    ├── Members (/admin/members)
    ├── Events (/admin/events)
    ├── Inovasi (/admin/innovations)
    ├── Sertifikat (/admin/certificates)
    ├── Berita (/admin/news)
    ├── Monitoring (/admin/monitoring)
    ├── Super Admin (/admin/super-admin)
    ├── Role Management (/admin/roles)
    ├── Activity Logs (/admin/activity)
    ├── Admin Users (/admin/admins)
    └── Settings (/admin/settings)
```

---

## Proposed Sitemap (Content Redesign)

```
/
├── Beranda (/)                          ★ REDESIGN
├── Peta Nasional (/national-map)         ★ ADD CTA + CONTEXT
├── Tentang Kami (/about)                ★ ENRICH TIMELINE
│   └── Sejarah (/about/sejarah)
│   └── Visi Misi (/about/visi-misi)
│   └── Peta Jalan (/about/roadmap)
├── Program Unggulan (/programs)         ★ ADD DETAIL PAGES
│   ├── Sekolah Robotika Rakyat (/programs/sekolah-robotika)
│   ├── Robotika Masuk Sekolah (/programs/robotika-sekolah)
│   ├── Akademi AI (/programs/akademi-ai)
│   ├── Kompetisi Robotika (/programs/kompetisi-robotika)
│   ├── Inkubator Inovasi (/programs/inkubator-inovasi)
│   └── Robotika UMKM (/programs/robotika-umkm)
├── Pengurus (/pengurus)                 ★ FILL DATA + ADD PHOTOS
│   ├── DPN (/pengurus/dpn)
│   ├── Dewan Pembina (/pengurus/pembina)
│   └── Struktur (/pengurus/struktur)
├── Informasi (/berita)                  ★ ADD FILTER + SEARCH
│   └── Artikel (/berita/[slug])
├── Events (/events)                     ★ ADD CALENDAR + FILTER
│   └── Detail Event (/events/[slug])
├── Galeri Inovasi (/inovasi)            ★ ADD SUBMIT CTA
│   └── Detail Inovasi (/inovasi/[slug])
├── Daftar Anggota (/daftar)             ★ SIMPLIFY FORM
├── Masuk (/masuk)                       ★ ADD SOCIAL LOGIN
├── Kontak (/kontak)                     ★ COMPLETE DATA + MAP
│
├── FAQ (/faq)                           ★ NEW
├── Mitra & Kolaborasi (/mitra)          ★ NEW
├── Karir (/karir)                       ★ NEW
│
└── [Dashboard, Admin unchanged]
```

---

## Page Type Breakdown

| Type | Count |
|------|-------|
| Public Pages | 11 |
| Member Pages | 9 |
| Admin Pages | 12 |
| **Total** | **32** |

## Navigation Structure

### Primary Navigation (Public Header)
```
Beranda | Peta Nasional | Tentang | Program | Pengurus | Informasi | Events | Inovasi | Kontak
```

### Secondary Navigation (Footer)
```
Navigasi: Beranda, Peta Nasional, Tentang, Program, Pengurus, Informasi, Events, Inovasi, Kontak
Informasi: FAQ, Karir, Mitra
Kontak: Email, Website, Akademi
```

### Member Navigation (Dashboard Sidebar)
```
Dashboard | Membership | Peta Nasional | Direktori | Events | Inovasi | Akademi | Sertifikat | Profil
```

### Admin Navigation (Admin Sidebar)
```
Dashboard | Members | Events | Inovasi | Sertifikat | Berita | Monitoring
[Super Admin] Super Admin | Role Mgmt | Pengaturan
```
