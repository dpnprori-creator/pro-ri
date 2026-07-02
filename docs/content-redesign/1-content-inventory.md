# Content Inventory — PRO RI (Pusat Robotika Rakyat Indonesia)

> Generated: June 21, 2026
> Target: https://prori.vps313.com/

---

## 1. Halaman Beranda (`/`)

| Item | Detail |
|------|--------|
| **Hero Headline** | "Gerakan Robotika untuk Kedaulatan Teknologi Indonesia" |
| **Hero Subheadline** | "PRO RI — Pusat Robotika Rakyat Indonesia — hadir untuk membangun generasi muda yang unggul dalam penguasaan robotika dan kecerdasan buatan, demi mewujudkan Indonesia Emas 2045." |
| **Hero CTAs** | "Daftar Anggota Sekarang", "Pelajari Program Kami" |
| **Trust Bar** | 38 Provinsi Tersebar, 6 Program Unggulan, 2026 Tahun Berdiri |
| **Section 1 — Sekilas PRO RI** | Tentang organisasi, visi nasional |
| **Section 2 — Dampak Nasional** | Statistik: Anggota, Trainers, Provinsi, Kab/Kota, Events, Inovasi |
| **Section 3 — Program Unggulan** | 6 cards: Sekolah Robotika Rakyat, Robotika Masuk Sekolah, Akademi AI, Kompetisi Robotika Nasional, Inkubator Inovasi Teknologi, Robotika untuk UMKM |
| **Section 4 — Video Showcase** | 2 YouTube embeds (Robotika Indonesia, AI & Inovasi) + YouTube channel link |
| **Section 5 — Kegiatan Terbaru** | 4 event cards (dinamis dari database) |
| **Section 6 — Inovasi Terkini** | 3 innovation cards (dinamis dari database) |
| **Section 7 — Informasi Terkini** | 3 news cards (dinamis dari database) |
| **Section 8 — CTA** | "Indonesia Emas 2045 Dimulai dari Sekarang" + Daftar button |
| **Images** | Hero: Unsplash robot image, SVG robot diagram, video thumbnails |

### Weaknesses:
- Hero uses English "Robotika untuk Kedaulatan Teknologi" — lacks nationalistic framing
- Stat section doesn't explain WHY the numbers matter
- Program cards lack direct CTA link to detailed pages
- No partner/collaborator showcase despite being a new organization
- No clear membership value proposition above the fold
- CTA section is generic, lacks urgency

---

## 2. Peta Nasional (`/national-map`)

| Item | Detail |
|------|--------|
| **Hero** | "Peta Nasional {APP_NAME}" — visualisasi interaktif |
| **Content** | Realtime dashboard: statistik anggota, provinsi, pertumbuhan bulanan, distribusi teknologi, peta interaktif Leaflet |
| **CTAs** | None directly — interactive exploration |
| **Images** | None (fully interactive) |

### Weaknesses:
- No explanation of what visitors should look for
- No CTA to act on the data (join, donate, etc.)

---

## 3. Tentang Kami (`/about`)

| Item | Detail |
|------|--------|
| **Hero** | "Tentang PRO RI" dengan deskripsi sejarah |
| **Section 1 — Sejarah** | Launch 6 Juni 2026 oleh PRI, quotes from Muhammad Nazaruddin (Ketum PRI) and Adityo Handoko (Ketua PRO RI) |
| **Section 2 — Milestone** | 3 milestones (Peluncuran, Pelantikan DPN, Target 38 provinsi) |
| **Section 3 — Visi, Misi, Komitmen** | 4 cards: Misi, Visi, Komitmen, Jangkauan |
| **Section 4 — Tujuan Organisasi** | 5 numbered goals with descriptions |
| **Section 5 — Peta Jalan** | 4-phase roadmap: 2026, 2027-2028, 2029-2030, 2031-2045 |
| **Section 6 — Filosofi Logo** | 4 elements: Bentuk Geometris, Warna Merah, Roda Gigi, Siluet Manusia |
| **Section 7 — Sister Orgs** | 6 organizations under PRI: MURI, PERI, LBH RI, AMRI, PATRIOT RI, PERISAI RI Kristiani |
| **CTA** | "Bergabung dengan PRO RI" |
| **Images** | Hero: AI technology Unsplash image |

### Weaknesses:
- Hero image is dark and uninviting
- Timeline is very sparse (only 3 entries)
- Philosophy of logo section feels disconnected (moved to about-us)
- No team/leadership photos (only icon placeholders)
- Quotes lack photo of the speakers

---

## 4. Program (`/programs`)

| Item | Detail |
|------|--------|
| **Hero** | "Program Unggulan PRO RI" — 6 Program Unggulan |
| **Content** | 6 full detail cards with Unsplash images, feature lists, target audience, and CTA button |
| **Programs** | 1. Sekolah Robotika Rakyat, 2. Robotika Masuk Sekolah, 3. Akademi AI, 4. Kompetisi Robotika Nasional, 5. Inkubator Inovasi Teknologi, 6. Robotika untuk UMKM |
| **CTA** | "Daftar Anggota" on every program card |
| **Images** | 6 Unsplash stock photos |

### Weaknesses:
- All card CTAs lead to register — no way to learn more about each program
- No program-specific images (all stock photos)
- No social proof (testimonials, success stories)
- No clear timeline for when each program launches
- No pricing/cost information

---

## 5. Pengurus (`/pengurus`)

| Item | Detail |
|------|--------|
| **Hero** | "Susunan Pengurus PRO RI" |
| **Section 1 — DPN** | 3 cards: Ketua (Adityo Handoko), Sekretaris (Muhamad Ied), Bendahara (—) |
| **Section 2 — Struktur Organisasi** | 3 levels: DPN, DPD, DPC with visual connector |
| **CTA** | "Hubungi Kami" |
| **Images** | Hero: Team Unsplash image (dark overlay) |

### Weaknesses:
- Leadership has no photos (only icon placeholders)
- Bendahara position is empty ("(akan diumumkan)")
- No Dewan Pembina or Dewan Pengarah listed
- No detailed organizational chart
- Page feels incomplete

---

## 6. Informasi/Berita (`/news`)

| Item | Detail |
|------|--------|
| **Hero** | "Berita & Media" |
| **Content** | Grid of news cards (dinamis dari database). Has image, category badge, date, title, excerpt |
| **Detail Page** | Full article with markdown content, hero image, category badge, date, back navigation |
| **CTAs** | Click card → detail page, "Kembali ke Berita" |
| **Images** | Dynamic from Supabase storage |

### Weaknesses:
- No category filter/sorting
- No search functionality
- No "featured" or "pinned" articles
- No share functionality
- No related articles at bottom of detail page

---

## 7. Events (`/events`)

| Item | Detail |
|------|--------|
| **Hero** | "Events" — Webinar, workshop, kompetisi, pameran teknologi |
| **Content** | Card grid with event details (date, category, title) via PublicEventsClient |
| **Images** | None (icon-only cards) |

### Weaknesses:
- No calendar view
- No past/upcoming filter
- No registration CTA on list page
- Event detail pages not reviewed

---

## 8. Inovasi (`/innovations`)

| Item | Detail |
|------|--------|
| **Hero** | "Galeri Inovasi" |
| **Content** | Card grid with innovation details via PublicInnovationsClient |
| **Images** | None (icon-only cards) |

### Weaknesses:
- No category/submission filter
- No call-to-action for submitting innovations
- Detail pages not reviewed

---

## 9. Daftar Anggota (`/register`)

| Item | Detail |
|------|--------|
| **Hero** | "Daftar Anggota PRO RI" |
| **Benefits** | 5 benefit cards + 4 membership tiers |
| **Form** | Full registration form: name, email, phone, password, occupation, region (cascade dropdown: province → regency → district → village), tech interest multi-select |
| **CTA** | "Daftar Sekarang" |

### Weaknesses:
- No explanation of membership levels/dues
- No FAQ on membership
- No success stories from members
- Form is very long with 11+ fields
- No social login option

---

## 10. Masuk (`/login`)

| Item | Detail |
|------|--------|
| **Hero** | "Masuk" — login form |
| **Content** | Email + password with show/hide toggle |
| **CTA** | "Masuk", link to register |

### Weaknesses:
- No password reset/forgot flow (input exists but no link)
- No "remember me" option
- No social login
- Minimal visual design

---

## 11. Kontak (`/kontak`)

| Item | Detail |
|------|--------|
| **Hero** | "Hubungi PRO RI" |
| **Contact Info** | Email, Telepon (TBD), Alamat (TBD) |
| **Form** | Name, email, phone, message — sends placeholder (not integrated yet) |
| **FAQ** | 5 FAQ items |
| **Images** | Hero: contact Unsplash image |

### Weaknesses:
- Phone and address are empty ("data akan dilengkapi")
- Form is not connected to backend (placeholder)
- No social media links
- No map embed
- No operating hours

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Total Pages | 11 |
| Core Sections | ~45 |
| Hero Sections | 11 |
| CTA Buttons | ~25 |
| External Links | ~3 (YouTube) |
| Images (Unsplash) | ~9 |
| Images (Local) | 3 (logo) |
| YouTube Embeds | 2 |
| FAQ Items | 5 |
| Interactive Maps | 1 (Leaflet) |
