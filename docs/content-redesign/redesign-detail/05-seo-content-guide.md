# SEO Content Guide — PRO RI

## Meta Tags per Page

| Page | Title Tag (H1) | Meta Description | Target Keywords |
|------|----------------|-----------------|-----------------|
| **Homepage** | Pusat Robotika Rakyat Indonesia — PRO RI | Pusat Robotika Rakyat Indonesia (PRO RI): gerakan nasional robotika untuk kedaulatan teknologi Indonesia. Daftar anggota, 6 program unggulan, 38 provinsi. | robotika indonesia, pusat robotika rakyat, pro ri, gerakan robotika nasional, indonesia emas 2045 |
| **Tentang Kami** | Tentang PRO RI — Pusat Robotika Rakyat Indonesia | Pelajari sejarah, visi, misi, tujuan, dan peta jalan Pusat Robotika Rakyat Indonesia (PRO RI) — gerakan robotika nasional. | tentang pro ri, sejarah pro ri, visi misi robotika indonesia |
| **Program** | 6 Program Unggulan PRO RI — Robotika untuk Indonesia | Program unggulan PRO RI: Sekolah Robotika Rakyat, Robotika Masuk Sekolah, Akademi AI, Kompetisi Robotika Nasional, Inkubator Inovasi, Robotika UMKM. | program robotika, sekolah robotika, akademi ai, kompetisi robotika nasional, robotika umkm |
| **Pengurus** | Susunan Pengurus PRO RI — Dewan Pimpinan Nasional | Struktur kepemimpinan Pusat Robotika Rakyat Indonesia (PRO RI): Dewan Pimpinan Nasional, Dewan Pimpinan Daerah, Dewan Pimpinan Cabang. | pengurus pro ri, dpn pro ri, struktur organisasi pro ri |
| **Informasi** | Informasi & Berita — PRO RI | Berita terbaru dan informasi kegiatan Pusat Robotika Rakyat Indonesia (PRO RI). Ikuti perkembangan gerakan robotika nasional. | berita robotika, kegiatan pro ri, informasi robotika indonesia |
| **Anggota** | Daftar Anggota PRO RI — Bergabung dengan Gerakan Robotika Nasional | Daftar menjadi anggota Pusat Robotika Rakyat Indonesia (PRO RI). Nikmati akses pelatihan robotika, kompetisi, dan jaringan 38 provinsi. | daftar anggota pro ri, pendaftaran robotika, anggota robotika indonesia |
| **Kontak** | Hubungi PRO RI — Pusat Robotika Rakyat Indonesia | Hubungi Pusat Robotika Rakyat Indonesia (PRO RI). Kirim pesan, pertanyaan, atau ajakan kolaborasi melalui form kontak. | kontak pro ri, hubungi robotika indonesia |

## Heading Hierarchy Guidelines

### Setiap halaman WAJIB memiliki:
1. **1 H1** — Judul utama halaman (unique per page)
2. **H2** — Sub-seksi utama (multiple allowed)
3. **H3** — Sub-bagian dari H2

### Larangan:
- ❌ Lebih dari 1 H1 per halaman
- ❌ H1 kosong / tidak ada (current issue)
- ❌ Loncat heading level (H1 → H3 tanpa H2)

## URL Structure Best Practices

| Aturan | Contoh |
|--------|--------|
| Gunakan slug pendek & deskriptif | `/program` bukan `/program-unggulan-pro-ri` |
| Hindari tanggal di URL | ❌ `/2026/06/program` ✅ `/program` |
| Hindari underscore | ❌ `/tentang_kami` ✅ `/tentang-kami` |
| Gunakan huruf kecil | ❌ `/TentangKami` ✅ `/tentang-kami` |

## Internal Linking Strategy

### Suggested Internal Links per Page

| Page | Link to |
|------|---------|
| Homepage | → `/tentang-kami` (learn more), `/program` (programs), `/anggota` (join), `/informasi` (news) |
| Tentang Kami | → `/pengurus` (structure), `/program` (our programs), `/anggota` (join) |
| Program | → `/anggota` (join), `/kontak` (contact for partnership) |
| Pengurus | → `/tentang-kami` (about), `/kontak` (contact) |
| Informasi | → `/anggota` (join — newsletter), `/program` (relevant programs) |
| Anggota | → `/program` (see benefits), `/kontak` (questions) |
| Kontak | → `/anggota` (join instead) |

## Open Graph Tags

Setiap halaman perlu:

```
og:title       = [Page Title]
og:description = [Meta Description]
og:image       = [Hero image or logo]
og:url         = [Canonical URL]
og:type        = website
```

## Schema.org Markup

### Organization Schema (for PRO RI)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pusat Robotika Rakyat Indonesia (PRO RI)",
  "alternateName": "PRO RI",
  "description": "Pusat Robotika Rakyat Indonesia — gerakan nasional robotika untuk kedaulatan teknologi Indonesia",
  "url": "https://prori.vps313.com",
  "logo": "https://prori.vps313.com/wp-content/uploads/2026/06/prori_log_new.png",
  "foundingDate": "2026-06-06",
  "founder": {
    "@type": "Organization",
    "name": "Perkumpulan Robotika Indonesia (PRI)"
  },
  "sameAs": [
    "https://instagram.com/pro_ri",
    "https://youtube.com/@pro_ri"
  ]
}
```

### WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pusat Robotika Rakyat Indonesia",
  "url": "https://prori.vps313.com"
}
```

### BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Beranda", "item": "https://prori.vps313.com" },
    { "@type": "ListItem", "position": 2, "name": "Tentang Kami", "item": "https://prori.vps313.com/tentang-kami" }
  ]
}
```

## Image SEO Rules
- Alt text WAJIB diisi semua `<img>` (accessibility + SEO)
- Format: WebP preferred (konversi dari JPEG/PNG)
- Ukuran: optimasi < 200KB per image (kecuali hero)
- Nama file: gunakan `kebab-case` deskriptif (e.g., `pelantikan-dpn-pro-ri-2026.webp`)
