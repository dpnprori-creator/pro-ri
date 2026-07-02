# Final Implementation Guide — PRO RI Content Redesign

> Step-by-step instructions for implementing the content redesign

---

## Priority Matrix

| Priority | Action | Page | Effort | Impact |
|----------|--------|------|--------|--------|
| 🔴 P1 | Complete kontak data (phone, address) | Kontak | Low | High |
| 🔴 P1 | Integrasi form kontak ke backend | Kontak | Medium | High |
| 🔴 P1 | Integrasi form kontak ke backend | Kontak | Medium | High |
| 🔴 P1 | Add alt text ke semua gambar | All pages | Medium | High (SEO) |
| 🟡 P2 | Rewrite hero headline & subheadline | Beranda | Low | Medium |
| 🟡 P2 | Add "Mengapa Robotika Penting" section | Beranda | Medium | Medium |
| 🟡 P2 | Move roadmap from /about to / | Beranda | Medium | Medium |
| 🟡 P2 | Add partner showcase section | Beranda | Medium | Medium |
| 🟡 P2 | Fill in leadership data + add photos | Pengurus | Medium | High |
| 🟡 P2 | Add Dewan Pembina & Dewan Pengarah | Pengurus | Medium | High |
| 🟢 P3 | Add category filter + search to news | Informasi | Medium | Medium |
| 🟢 P3 | Share buttons on article detail | Berita/[slug] | Low | Medium |
| 🟢 P3 | Related articles on detail page | Berita/[slug] | Medium | Medium |
| 🟢 P3 | Progressive/simplified registration form | Daftar | High | Medium |
| 🟢 P3 | FAQ section on register page | Daftar | Low | Medium |
| 🟢 P3 | Add schema.org JSON-LD | All pages | Medium | Medium |

---

## Step-by-Step Implementation

### Phase 1: Quick Wins (P1) — Estimated: 2-3 hours

#### 1.1 Complete Contact Data
```diff
- Telepon: (data akan dilengkapi)
+ Telepon: +62 [nomor]
- Alamat: (data akan dilengkapi)
+ Alamat: [alamat lengkap]
```
**File:** `app/(public)/kontak/page.tsx`

#### 1.2 Add Alt Text to All Images
For each `<Image>` component, add a descriptive `alt` attribute. Key files:
- `app/(public)/page.tsx` — Hero image
- `app/(public)/about/page.tsx` — Hero image
- `app/(public)/programs/page.tsx` — 6 program images + hero
- `app/(public)/pengurus/page.tsx` — Hero image
- `app/(public)/kontak/page.tsx` — Hero image
- `app/(public)/news/page.tsx` — News card images (dynamic)
- `components/widgets/navbar/public-navbar.tsx` — Logo

#### 1.3 Add JSON-LD Schema
**New file:** `app/layout.tsx` — Add Organization schema JSON-LD in metadata.

---

### Phase 2: Content Restructuring (P2) — Estimated: 4-6 hours

#### 2.1 Rewrite Homepage Hero
**File:** `app/(public)/page.tsx`
- Change headline to "Mencetak Generasi Robotik Indonesia"
- Refine subheadline for stronger messaging
- Add "Mengapa Robotika Penting" section (new)

#### 2.2 Add "Mengapa Robotika Penting" Section
**File:** `app/(public)/page.tsx` — Add after "Sekilas PRO RI":

```jsx
<section>
  <h2>Mengapa Robotika Penting?</h2>
  <p>Revolusi industri 4.0 dan kecerdasan buatan mengubah wajah dunia...</p>
  {/* Cards: AI, Robotics, IoT, Automation, Industry 4.0 */}
</section>
```

#### 2.3 Enhance Leadership Page
**File:** `app/(public)/pengurus/page.tsx`
- Add Dewan Pembina section
- Add Dewan Pengarah section
- Replace placeholder icons with actual photos
- Use `avatar` component from `/components/ui/avatar.tsx`

**Structure addition:**
```jsx
<section>
  <h2>Dewan Pembina</h2>
  {/* Grid of pembina cards with photos */}
</section>
<section>
  <h2>Dewan Pengarah</h2>
  {/* Grid of pengarah cards */}
</section>
```

#### 2.4 Move Roadmap to Homepage
**File:** `app/(public)/page.tsx` — Add roadmap section after "Dampak Nasional"
**File:** `app/(public)/about/page.tsx` — Keep summary version, link to full roadmap

---

### Phase 3: Enhancement (P3) — Estimated: 6-8 hours

#### 3.1 News Filters & Search
**File:** `app/(public)/news/page.tsx`
- Add category filter tabs
- Add search input
- Add "featured" / pinned article

#### 3.2 Article Detail Enhancements
**File:** `app/(public)/news/[slug]/page.tsx`
- Add share buttons (Twitter, Facebook, LinkedIn, WhatsApp)
- Add "related articles" at bottom

#### 3.3 Registration Form Enhancement
**File:** `app/(public)/register/page.tsx`
- Consider multi-step form (Step 1: Info, Step 2: Region, Step 3: Interests)
- Add loading state improvements
- Add member count social proof

#### 3.4 Contact Form Integration
**File:** `app/(public)/kontak/page.tsx`
- Connect form submission to Supabase or email service (Resend, SendGrid, etc.)
- Add Google Maps embed

---

## Files to Create

| File | Purpose |
|------|---------|
| `assets/images/home/hero-generasi-robotik.webp` | Homepage hero image (local) |
| `assets/images/about/hero-about-pro-ri.webp` | About page hero image (local) |
| `assets/images/programs/program-*.webp` | 6 program images (local) |

## Files to Modify

| File | Change |
|------|--------|
| `app/(public)/page.tsx` | Rewrite hero, add Mengapa Robotika Penting, move roadmap here |
| `app/(public)/about/page.tsx` | Keep summary, link to homepage for full roadmap |
| `app/(public)/pengurus/page.tsx` | Add Dewan Pembina/Pengarah, add photos |
| `app/(public)/kontak/page.tsx` | Complete contact data, integrate form |
| `app/(public)/news/page.tsx` | Add filters, search |
| `app/(public)/news/[slug]/page.tsx` | Share buttons, related articles |
| `app/(public)/register/page.tsx` | Add FAQ, progressive form |
| `app/layout.tsx` | Add Organization schema JSON-LD |

---

## Do NOT Change

- ✅ Theme/colors/typography
- ✅ Layout structure (sections, cards, glass effects)
- ✅ Authentication system
- ✅ Database schema / Supabase queries
- ✅ Admin panel
- ✅ Dashboard
- ✅ Existing API routes
- ✅ Existing components that work correctly

---

## Image Download Commands (Reference)

```bash
# Create directory structure
mkdir -p public/assets/images/{home,about,programs,pengurus,membership,contact}

# Download current hero images
curl -o public/assets/images/home/hero-generasi-robotik.webp \
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80"

curl -o public/assets/images/about/hero-about-pro-ri.webp \
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80"
# ... continue for all images
```

---

## Testing Checklist

After implementation, verify:
- [ ] Homepage hero renders correctly with new copy
- [ ] All images load and have alt text
- [ ] Contact form submits and stores data
- [ ] News filters work correctly
- [ ] Share buttons open correct URLs
- [ ] Mobile responsive — all new sections
- [ ] Light/dark mode — all new sections compatible
- [ ] Lighthouse SEO score improved
- [ ] No broken links
- [ ] All existing features still work
