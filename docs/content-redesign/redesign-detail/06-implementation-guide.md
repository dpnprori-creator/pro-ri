# Implementation Guide — Content Redesign to Next.js

## Overview

Dokumen ini menghubungkan hasil redesign konten ke implementasi di aplikasi Next.js 15 + Supabase.

**Target:** Mengubah halaman public di `app/(public)/` sesuai dengan IA dan copywriting baru.

---

## File Mapping: Content → Code

| Halaman | File Next.js (Route) | Komponen Utama |
|---------|---------------------|----------------|
| Homepage | `app/(public)/page.tsx` | HeroSection, TrustBar, AboutPreview, ProgramGrid, NewsSection, CTASection |
| Tentang Kami | `app/(public)/tentang-kami/page.tsx` | Hero, Sejarah, VisiMisi, Tujuan, Roadmap, FilosofiLogo, SisterOrgs |
| Program | `app/(public)/program/page.tsx` | Hero, ProgramCard (×6) |
| Pengurus | `app/(public)/pengurus/page.tsx` | Hero, DPNTable, StrukturDiagram, CTASection |
| Informasi | `app/(public)/informasi/page.tsx` | (existing blog listing from DB) |
| Anggota | `app/(public)/anggota/page.tsx` | Hero, BenefitSection, TierCards, Form |
| Kontak | `app/(public)/kontak/page.tsx` | Hero, ContactInfo, Form, FAQ |

---

## Data Strategy

### Data yang perlu di-hardcode (static content)
Semua copy dari `03-copywriting-master.md` akan di-hardcode langsung di komponen/page karena ini adalah konten organisasi yang jarang berubah.

### Data dari Supabase
| Data | Tabel | Sumber |
|------|-------|--------|
| Blog posts | `posts` table (existing) | Supabase |
| Members | `members` table (existing) | Supabase |
| Events | `events` table (existing) | Supabase |
| Leadership | `pengurus` table (NEW — perlu dibuat) | Supabase |

### New Table: `pengurus` (untuk halaman Pengurus)
```
pengurus
├── id          UUID PRIMARY KEY DEFAULT gen_random_uuid()
├── nama        TEXT NOT NULL
├── jabatan     TEXT NOT NULL (Ketua, Sekretaris, Bendahara, dll)
├── tingkat     TEXT NOT NULL (DPN, DPD, DPC)
├── provinsi    TEXT (untuk DPD)
├── foto_url    TEXT
├── bio         TEXT
├── urutan      INT (display order)
└── created_at  TIMESTAMPTZ DEFAULT now()
```

---

## Component Implementation Plan

### Homepage — New Components Needed

| Komponen | Deskripsi | Status |
|----------|-----------|--------|
| `HeroSection` | Hero dengan headline, subheadline, 2 CTAs | ✅ Existing (update copy) |
| `TrustBar` | 3 statistik (38 provinsi, 6 program, 2026) | **NEW** |
| `AboutPreview` | Paragraf sekilas PRO RI | **NEW** |
| `ProgramGrid` | Grid 3×2 program cards | **NEW** |
| `NewsSection` | Blog posts (existing component) | ✅ Existing |
| `CTASection` | CTA bergabung (bottom) | **NEW** |

### Shared/Common Components

| Komponen | Lokasi | Keterangan |
|----------|--------|------------|
| PageHero | `components/public/page-hero.tsx` | Hero kecil untuk halaman interior (About, Program, Pengurus, dll) — **NEW** |
| SectionTitle | `components/public/section-title.tsx` | Judul seksi dengan variasi ukuran — **NEW** |
| CTASection | `components/public/cta-section.tsx` | CTA reusable dengan background — **NEW** |

---

## Priority Implementation Order

### Phase 1 — Quick Wins (High Impact, Low Effort)
1. **Homepage**: Update hero copy, tambah Primary CTA button
   - File: `app/(public)/page.tsx`
   - Effort: ~30 min
   
2. **Homepage**: Tambah TrustBar section (3 statistik)
   - Component baru: `components/public/trust-bar.tsx`
   - Effort: ~1 hour

3. **Tentang Kami**: Tambah text content (visi, misi, sejarah) sebelum infographic images
   - File: `app/(public)/tentang-kami/page.tsx`
   - Effort: ~1 hour

### Phase 2 — New Pages
4. **Halaman Program** (halaman baru)
   - Route: `app/(public)/program/page.tsx`
   - Effort: ~2 hours

5. **Halaman Pengurus** (redesign dari halaman kosong)
   - Route: `app/(public)/pengurus/page.tsx`
   - Effort: ~1 hour

### Phase 3 — Conversion Optimization
6. **Halaman Anggota** — tambah benefit section & tier info
   - File: `app/(public)/anggota/page.tsx`
   - Effort: ~2 hours

7. **Halaman Kontak** — tambah contact info & FAQ
   - File: `app/(public)/kontak/page.tsx`
   - Effort: ~2 hours

### Phase 4 — SEO & Polish
8. Add H1 tags to all pages (current issue — none have H1)
9. Add meta descriptions for all pages
10. Add Open Graph tags
11. Add Schema.org markup
12. Image alt text audit

---

## Dependencies

### External Dependencies (belum ada di project)
| Dependency | Untuk | Prioritas |
|------------|-------|-----------|
| Ikon 6 program | Program cards | Medium — bisa pakai Lucide icons dulu |
| Foto dokumentasi pelantikan | Halaman Tentang Kami & Berita | High — perlu dari client |

### Supabase DB Changes
| Perubahan | Untuk | Prioritas |
|-----------|-------|-----------|
| Table `pengurus` baru | Halaman Pengurus | Medium |
| Seed data pengurus | Halaman Pengurus | Medium |

---

## Testing Plan

### Visual Check
- [ ] Layout tidak broken di mobile (responsive)
- [ ] Hero CTA buttons visible dan clickable
- [ ] Trust Bar statistik rapi di grid
- [ ] Program cards sejajar dan konsisten
- [ ] Form registrasi & kontak berfungsi

### Content Check
- [ ] Tidak ada typo di copy
- [ ] H1 tag ada dan unique per page
- [ ] Meta description terisi
- [ ] Alt text semua gambar terisi
- [ ] Internal links berfungsi

### Functional Check
- [ ] `/anggota` form submit → insert ke Supabase
- [ ] `/kontak` form submit → insert ke Supabase (atau email)
- [ ] Blog listing fetch dari Supabase correctly
- [ ] Pengurus data fetch dari Supabase (if table created)

---

## Deployment Notes
- Aplikasi Next.js sudah di-deploy (Vercel atau hosting sendiri)
- Setelah perubahan konten: `npm run build` → deploy
- Static pages (home, tentang, program, pengurus, kontak) akan di-build sebagai static HTML — performa maksimal
- Halaman dinamis (anggota form, blog) tetap server-rendered

---

## Reference Files

| File | Isi |
|------|-----|
| `docs/content-redesign/01-content-inventory.md` | All current content raw |
| `docs/content-redesign/02-information-architecture.md` | New sitemap & IA |
| `docs/content-redesign/03-copywriting-master.md` | Full copy to implement |
| `docs/content-redesign/04-image-catalog.md` | All image assets |
| `docs/content-redesign/05-seo-content-guide.md` | SEO metadata & schema |
| `ARCHITECTURE-PLAN.md` | Next.js project architecture |
| `modification.md` | Original redesign specification |
