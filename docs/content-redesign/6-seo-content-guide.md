# SEO Content Guide — PRO RI Website

> SEO optimization recommendations for content, metadata, and technical SEO

---

## 1. Keyword Strategy

### Primary Keywords
| Keyword | Volume Indicator | Target Page |
|---------|-----------------|-------------|
| robotika Indonesia | High | Beranda |
| pusat robotika rakyat | Medium | Beranda |
| pelatihan robotika | Medium | Program |
| belajar AI Indonesia | Medium | Program → Akademi AI |
| komunitas robotika | Medium | Tentang |
| anggota PRO RI | Low | Daftar |
| robotika untuk pemula | Medium | Program |

### Secondary Keywords
- "kursus robotika online", "robotika untuk pelajar"
- "Indonesia Emas 2045 teknologi"
- "kompetisi robotika nasional"
- "inkubator startup robotika"
- "otomatisasi UMKM"

### Long-tail Keywords
- "cara belajar robotika untuk pemula di Indonesia"
- "program pelatihan AI gratis Indonesia 2026"
- "komunitas robotika terdekat di provinsi saya"
- "daftar anggota organisasi robotika nasional"

---

## 2. On-Page SEO for Each Page

### Beranda (`/`)
| Element | Recommendation |
|---------|---------------|
| **Title** | ✅ "Pusat Robotika Rakyat Indonesia — PRO RI" (45 chars — good) |
| **Description** | ✅ 155 chars — good. Include "Daftar anggota" early. |
| **H1** | "Gerakan Robotika untuk Kedaulatan Teknologi Indonesia" — good, but consider "Pusat Robotika Rakyat Indonesia — Gerakan Robotika Nasional" |
| **Content** | Good use of H2, H3 hierarchy. Add more internal links. |
| **Images** | Add alt text to ALL images. Currently missing on hero image. |
| **URL** | `/` — ✅ |

### Tentang (`/about`)
| Element | Recommendation |
|---------|---------------|
| **Title** | ✅ "Tentang PRO RI" — but could be "Tentang PRO RI — Pusat Robotika Rakyat Indonesia" |
| **Description** | ✅ Good — 155 chars |
| **Images** | Hero image missing alt text |
| **Structure** | ✅ Good H2/H3 hierarchy |

### Program (`/programs`)
| Element | Recommendation |
|---------|---------------|
| **Title** | ✅ "6 Program Unggulan PRO RI" |
| **Description** | ✅ Lists all 6 programs — excellent for SEO |
| **Images** | All 6 program images MISSING alt text — CRITICAL FIX |
| **Internal Links** | Add links from program cards to register page |

### Daftar (`/register`)
| Element | Recommendation |
|---------|---------------|
| **Title** | ✅ "Daftar Anggota PRO RI" |
| **Description** | ✅ Good |
| **Form** | Add microdata for registration form |
| **Internal Links** | ✅ Has link to login page |

---

## 3. Technical SEO

### Schema Markup (Recommended)
| Schema Type | Page | Implementation |
|-------------|------|----------------|
| Organization | All pages | ✅ Should add JSON-LD for PRO RI |
| WebSite | All pages | SearchAction for site search |
| BreadcrumbList | All pages | ✅ Would help navigation |
| Event | /events | Structured data for each event |
| Article | /news/[slug] | ✅ Already structured as articles |

### Organization JSON-LD (Recommended)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pusat Robotika Rakyat Indonesia (PRO RI)",
  "alternateName": "PRO RI",
  "url": "https://prori.vps313.com",
  "email": "info@prori.id",
  "description": "Gerakan nasional robotika untuk kedaulatan teknologi Indonesia",
  "foundingDate": "2026-06-06",
  "parentOrganization": {
    "@type": "Organization",
    "name": "Perkumpulan Robotika Indonesia (PRI)"
  }
}
```

### Performance SEO
| Factor | Status | Action |
|--------|--------|--------|
| **Core Web Vitals** | ❓ Unknown | Run Lighthouse audit |
| **Image Optimization** | ⚠️ Unsplash images | Download locally, convert to WebP |
| **Mobile Responsive** | ✅ Tailwind responsive | Good |
| **Font Loading** | ✅ Inter + JetBrains Mono | swap display, good |
| **Lazy Loading** | ✅ Next/Image | Good |
| **Caching** | ❓ Unknown | Add Cache-Control headers |
| **Sitemap.xml** | ❌ Missing | Generate dynamic sitemap |

---

## 4. Content Recommendations

### Blog Content Strategy
| Content Type | Frequency | Topic Ideas |
|-------------|-----------|-------------|
| Article | 2x/week | Robotika, AI, IoT, teknologi Indonesia |
| Press Release | As needed | Milestones, events, partnerships |
| Tutorial | 1x/week | Panduan robotika untuk pemula |
| Case Study | 1x/month | Success stories anggota/UMKM |

### Internal Linking Strategy
- Each article should link to 2-3 related programs
- Program pages should link to registration
- About page should link to program pages
- News articles should link to related events

---

## 5. Social Media Meta

### Open Graph (Current)
- ✅ og:type set to "website"
- ✅ og:locale "id_ID"
- ✅ og:site_name set
- ⚠️ og:image missing on most pages — ADD
- ⚠️ og:url missing — ADD

### Twitter Cards
- ❌ Not implemented — ADD twitter:card, twitter:site, twitter:title, twitter:description, twitter:image
