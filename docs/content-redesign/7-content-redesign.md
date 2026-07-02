# Content Redesign Document — PRO RI Website

> Complete content structure redesign preserving existing theme and visual identity

---

## Phase 1: New Information Architecture

### PAGE: BERANDA (`/`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ REDESIGN | Headline: "Mencetak Generasi Robotik Indonesia" — Subheadline: "Membangun talenta teknologi, inovator, dan pemimpin masa depan menuju Indonesia Emas 2045." — CTA: "Daftar Anggota" & "Jelajahi Program" | Add stronger headline with "Generasi Robotik" framing |
| **2. Apa Itu PRO RI** | ✅ KEEP | Current "Sekilas PRO RI" section — keep content, improve CTA | Minor copy updates |
| **3. Mengapa Robotika Penting** | ⚠️ NEW SECTION | Add new section explaining importance of AI, Robotics, IoT, Automation, Industry 4.0 for Indonesia | **New content** |
| **4. Program Unggulan** | ✅ KEEP | 6 program cards with icons — keep current design | Minor copy refinement |
| **5. Dampak Nasional** | ✅ KEEP | Stats section — keep current design | Update stat animations |
| **6. Roadmap Indonesia Emas** | ⚠️ MOVE from /about | Move roadmap section to homepage for visibility | **Relocate content** |
| **7. Informasi Terkini** | ✅ KEEP | News section — keep current | Add "Lihat Semua" CTA |
| **8. Mitra Strategis** | ⚠️ NEW SECTION | Add partner/collaborator showcase | **New content** |
| **9. CTA Gabung** | ✅ KEEP | Strong closing CTA — keep current | Minor copy refinement |

### PAGE: TENTANG KAMI (`/about`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ KEEP | Keep current — clear and professional | Add hero image alt text |
| **2. Sejarah Organisasi** | ✅ KEEP | Keep quotes + timeline | Expand timeline with more milestones |
| **3. Visi & Misi** | ✅ KEEP | Keep 4 cards layout | Minor copy refinement |
| **4. Tujuan Organisasi** | ✅ KEEP | Keep 5 numbered items | Connect each goal to specific program |
| **5. Peta Jalan** | ⚠️ SHORTEN | Move full roadmap to homepage, keep summary here | **Trim content** |
| **6. Filosofi Logo** | ✅ KEEP | Keep as-is — adds character | No changes |
| **7. Sister Orgs** | ✅ KEEP | Keep as-is — shows ecosystem strength | Add links to sister org websites if available |

### PAGE: PROGRAM (`/programs`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ KEEP | "Program Unggulan PRO RI" — keep | Minor copy refinement |
| **2. Program Cards** | ✅ KEEP | 6 full detail cards | Add "Pelajari Detail" link per program (future: individual program pages) |
| **CTA** | ✅ KEEP | "Daftar Anggota" per card | Add testimonial/social proof |

### PAGE: PENGURUS (`/pengurus`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ KEEP | Keep current | Add leadership photos (placeholder → real photos) |
| **2. DPN Leadership** | ⚠️ EXPAND | Add Dewan Pembina and Dewan Pengarah sections | **Add missing roles** |
| **3. Struktur Organisasi** | ✅ KEEP | DPN/DPD/DPC hierarchy | Add visual org chart |
| **CTA** | ✅ KEEP | "Hubungi Kami" | Add specific contact for organizational inquiries |

### PAGE: INFORMASI (`/news`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ KEEP | Keep current | Add category filter below hero |
| **2. News Grid** | ✅ KEEP | Keep card layout | Add featured/pinned article, add search, add category filter |
| **Detail Page** | ✅ KEEP | Keep current design | Add share buttons, related articles |

### PAGE: DAFTAR ANGGOTA (`/register`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ KEEP | "Daftar Anggota PRO RI" | Add member count social proof ("Bergabung dengan X anggota lainnya") |
| **2. Benefits** | ✅ KEEP | 5 benefit cards + 4 membership tiers | Reorder: show benefits FIRST, then form |
| **3. Registration Form** | ⚠️ SIMPLIFY | Current form has 11+ fields | Consider progressive form (step 1: basic info, step 2: details) |
| **4. FAQ** | ⚠️ NEW | Add FAQ section on membership | **New content** |

### PAGE: KONTAK (`/kontak`)

| Section | Status | Content | Key Changes |
|---------|--------|---------|-------------|
| **1. Hero** | ✅ KEEP | Keep current | Add social media links |
| **2. Contact Info** | ⚠️ COMPLETE | Fill in phone & address data | **Critical — complete missing data** |
| **3. Contact Form** | ⚠️ INTEGRATE | Connect to Supabase or email service | **Critical — backend integration** |
| **4. FAQ** | ✅ KEEP | Keep current FAQ | Add more FAQ items |
| **5. Map** | ⚠️ NEW | Add Google Maps/Leaflet embed for office location | **New content** |

---

## Phase 2: Content to Remove

| Page | Content to Remove | Reason |
|------|-------------------|--------|
| Beranda | None | All sections relevant |
| Tentang | None | All sections relevant |
| Pengurus | None | All sections relevant, just incomplete |
| Kontak | "data akan dilengkapi" placeholders | Replace with actual data |

## Phase 3: Content to Rewrite

| Page | Section | Current Issue | Rewrite Direction |
|------|---------|---------------|-------------------|
| Beranda | Hero Headline | "Gerakan Robotika untuk Kedaulatan Teknologi Indonesia" | "Mencetak Generasi Robotik Indonesia" — lebih personal dan visioner |
| Beranda | Hero Subheadline | Too generic | More specific about talenta, inovator, pemimpin masa depan |
| Semua | Alt text | All images missing alt text | Add descriptive alt text to every image |

## Phase 4: Content to Keep

| Page | Section | Why Keep |
|------|---------|----------|
| Beranda | Program Unggulan | Strong section with clear value |
| Beranda | Dampak Nasional | Data-driven credibility |
| Beranda | CTA Section | Strong closing messaging |
| Tentang | All | Comprehensive and well-structured |
| Program | All | Detailed and informative |
| Daftar | Benefit & Tier | Shows clear membership value |
