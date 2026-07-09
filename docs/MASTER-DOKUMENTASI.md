# PRO RI DIGITAL COMMAND CENTER — Dokumentasi Master

> **Pusat Robotika Rakyat Indonesia** — Platform Ekosistem Nasional Robotika, AI, IoT, Teknologi & Inovasi
> Visi: Membangun 10.000 Talenta Robotika dan AI Indonesia
> **Terakhir diperbarui:** Juli 2026

---

## Daftar Isi

1. [Ringkasan Project](#1-ringkasan-project)
2. [Tech Stack](#2-tech-stack)
3. [Struktur Project](#3-struktur-project)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Routing & Halaman](#6-routing--halaman)
7. [Fitur-Fitur Detail](#7-fitur-fitur-detail)
8. [Server Actions](#8-server-actions)
9. [Komponen Arsitektur](#9-komponen-arsitektur)
10. [Hooks & Utility](#10-hooks--utility)
11. [Design System & Animasi](#11-design-system--animasi)
12. [Arsitektur & Alur Data](#12-arsitektur--alur-data)
13. [Security](#13-security)
14. [Environment Variables](#14-environment-variables)
15. [Deployment](#15-deployment)
16. [Content Redesign (WordPress → Next.js)](#16-content-redesign-wordpress--nextjs)
17. [Prompt AI Agent (Origin Story)](#17-prompt-ai-agent-origin-story)
18. [Catatan Pengembangan](#18-catatan-pengembangan)

---

## 1. Ringkasan Project

### Vision
Membangun **10.000 Talenta Robotika dan AI Indonesia** — platform ekosistem nasional yang menjadi digital backbone PRO RI (Pusat Robotika Rakyat Indonesia), organisasi di bawah naungan PRI (Perkumpulan Robotika Indonesia).

### Core Modules
| Module | Description |
|--------|-------------|
| **Public Portal** | Landing page, about, programs, news, registration |
| **Membership Center** | Member management, digital cards, dashboard |
| **National Command Center** | National monitoring, interactive map, drill-down analytics |
| **Event Center** | Webinar, workshop, competition, digital certificates |
| **Innovation Center** | National innovation repository |
| **Academy Gateway** | Gateway to external LMS |
| **Admin System** | Full management dashboard |

### Design Philosophy
> *"National Robotics Mission Control"* — Futuristic, premium, professional, national-scale.

---

## 2. Tech Stack

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Next.js 15** (App Router) | 15.x | React framework — routing, RSC, SSR, ISR |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling dengan custom theme |
| **Shadcn/UI** (Radix UI) | Latest | Komponen UI primitif (button, card, dialog, select, dll) |
| **Framer Motion** | 12.x | Animasi halaman, counter, scroll-reveal, stagger children |
| **Lucide React** | Latest | Icon set seragam |
| **Recharts** | 3.x | Grafik area, bar, distribusi teknologi |
| **Leaflet / React-Leaflet** | 1.x / 5.x | Peta interaktif Indonesia dengan marker, popup, heatmap |
| **Zod** | 4.x | Validasi schema form (end-to-end type safety) |
| **TanStack React Query** | 5.x | Client-side data fetching & caching |
| **React Hook Form** | 7.x | Form management |
| **React Markdown** | 10.x | Render konten markdown untuk berita |

### Backend & Services
| Service | Kegunaan |
|---------|----------|
| **Supabase** | Database PostgreSQL, Authentication, Storage (file upload), Realtime subscriptions |
| **Node.js (Self-hosted)** | Deployment & hosting di VPS |

### Utility Packages
| Package | Kegunaan |
|---------|----------|
| `clsx` + `tailwind-merge` | Utility class CSS via `cn()` |
| `sonner` | Toast notifications (sukses, error, info) |
| `qrcode.react` | Generate QR code untuk member card & verifikasi |
| `html2canvas` | Screenshot DOM untuk generate PDF |
| `jspdf` | Generate PDF sertifikat & member card |
| `signature_pad` | Signature digital via canvas HTML5 |
| `@uiw/react-md-editor` | Markdown editor untuk konten berita (admin) |

---

## 3. Struktur Project

```
pro-ri-command-center/
│
├── app/                            # Next.js App Router
│   ├── (public)/                   # Public Portal (tanpa auth)
│   ├── (dashboard)/                # Member Dashboard (auth required)
│   ├── (admin)/                    # Admin Panel (admin/super_admin required)
│   ├── layout.tsx                  # Root Layout (Inter + JetBrains Mono)
│   ├── globals.css                 # Global Styles + Design Tokens + Animations
│   └── not-found.tsx               # Global 404
│
├── components/
│   ├── ui/                         # Shadcn/UI primitives
│   ├── layouts/                    # Layout components
│   ├── features/                   # Feature-specific components
│   ├── widgets/                    # Complex widgets (navbar, footer, sidebar)
│   └── providers/                  # React Context Providers
│
├── features/                       # Server Actions & Business Logic
│   ├── auth/                       # Login, register, logout, getCurrentUserRole
│   ├── admin/                      # CRUD members, events, news, innovations, certificates
│   ├── events/                     # Event registration, cancel, verification
│   ├── members/                    # Profile actions
│   ├── news/                       # Comments, views, related news
│   ├── command-center/             # Stats queries, province data, growth data
│   ├── public/                     # Public data queries, gallery, video
│   └── registration-actions.ts     # Member ID lookup + program/event registration
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   ├── server.ts               # Server Component Supabase client
│   │   ├── admin.ts                # Admin Supabase client (service_role)
│   │   └── middleware.ts           # Auth middleware (session refresh)
│   ├── types/
│   │   └── database.ts             # Generated TypeScript types
│   ├── utils.ts                    # cn(), formatNumber(), formatDate(), slugify(), dll
│   ├── constants.ts                # APP_NAME, TARGETS, ROLES, NAV, dll
│   └── storage.ts                  # File upload utilities
│
├── hooks/                          # Shared React hooks
├── supabase/                       # Database configuration
│   ├── consolidated-migration.sql  # Full schema + seed (single file)
│   ├── migrations/                 # Migration files (v1-v6 + wilayah)
│   └── fix-recalculate-counters.sql
│
├── middleware.ts                   # Next.js middleware (auth session refresh)
├── next.config.ts                  # Image remote patterns, server actions config
├── package.json
└── .env.local                      # Environment variables
```

---

## 4. Database Schema

### Entity Relationship

```
provinces 1──* regencies 1──* districts 1──* villages
                                                │
                                                └──* members
                                                     │
                                                     ├──* events (through event_registrations)
                                                     ├──* programs (through program_registrations)
                                                     ├──* innovations
                                                     ├──* certificates
                                                     ├──* activity_logs
                                                     ├──* member_designations
                                                     ├──* member_cards
                                                     ├──* news_comments
                                                     └──* contact_messages
```

### Tabel-Tabel (22 tabel total)

#### `provinces` — 38 Provinsi Indonesia
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| code | VARCHAR(2) UNIQUE | Kode provinsi (Kemendagri) |
| name | VARCHAR(100) | Nama provinsi |
| capital | VARCHAR(100) | Ibu kota |
| latitude | DECIMAL(10,8) | Koordinat geografis |
| longitude | DECIMAL(11,8) | Koordinat geografis |
| total_members | INTEGER | Counter denormalized |
| total_trainers | INTEGER | Counter denormalized |
| total_mentors | INTEGER | Counter denormalized |
| total_events | INTEGER | Counter denormalized |
| total_innovations | INTEGER | Counter denormalized |

#### `regencies` — Kabupaten/Kota
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| province_id | UUID FK → provinces | |
| code | VARCHAR(5) UNIQUE | |
| name | VARCHAR(100) | |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| total_members, total_trainers, total_events, total_innovations | INTEGER | Counter denormalized |

#### `districts` — Kecamatan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| regency_id | UUID FK → regencies | |
| code | VARCHAR(8) UNIQUE | |
| name | VARCHAR(100) | |
| total_members | INTEGER | Counter denormalized |

#### `villages` — Desa/Kelurahan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| district_id | UUID FK → districts | |
| code | VARCHAR(13) UNIQUE | |
| name | VARCHAR(100) | |

#### `roles`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| name | VARCHAR(50) UNIQUE | `guest`, `member`, `admin`, `super_admin` |
| description | TEXT | |

#### `members` — Anggota PRO RI
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| auth_id | UUID FK → auth.users | Referensi Supabase Auth |
| member_id | VARCHAR(20) UNIQUE | Format: `PRO-RI-{tahun}-{nomor_urut}` |
| full_name | VARCHAR(200) | |
| email | VARCHAR(255) UNIQUE | |
| phone | VARCHAR(20) | |
| province_id | UUID FK → provinces | |
| regency_id | UUID FK → regencies | |
| district_id | UUID FK → districts | |
| village_id | UUID FK → villages | |
| occupation | VARCHAR(100) | |
| technology_interest | TEXT[] | Array minat teknologi |
| role_id | UUID FK → roles | |
| status | VARCHAR(20) | `active`, `inactive`, `suspended` |
| photo_url | TEXT | |
| qr_code | TEXT | |
| total_events_attended | INTEGER | Counter |
| total_certificates | INTEGER | Counter |

#### `events` — Event/Kegiatan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| title | VARCHAR(200) | |
| slug | VARCHAR(200) UNIQUE | |
| description | TEXT | |
| category | VARCHAR(50) | `webinar`, `workshop`, `competition`, `exhibition` |
| type | VARCHAR(50) | `online`, `offline`, `hybrid` |
| start_date / end_date | TIMESTAMPTZ | |
| location | TEXT | |
| province_id | UUID FK → provinces | |
| max_participants | INTEGER | |
| banner_url | TEXT | |
| status | VARCHAR(20) | `draft`, `published`, `ongoing`, `completed`, `cancelled` |
| created_by | UUID FK → members | |

#### `event_registrations`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| event_id | UUID FK → events | |
| member_id | UUID FK → members | |
| status | VARCHAR(20) | `registered`, `approved`, `rejected`, `attended`, `cancelled` |
| UNIQUE(event_id, member_id) | | Mencegah duplikasi |

#### `innovations` — Inovasi Anggota
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| title | VARCHAR(200) | |
| slug | VARCHAR(200) UNIQUE | |
| description | TEXT | |
| category | VARCHAR(50) | `robotics`, `ai`, `iot`, `programming`, `research` |
| image_url | TEXT | |
| creator_id | UUID FK → members | |
| province_id | UUID FK → provinces | |
| year | INTEGER | |
| status | VARCHAR(20) | `draft`, `published`, `featured`, `archived` |

#### `certificates` — Sertifikat
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| certificate_number | VARCHAR(30) UNIQUE | |
| member_id | UUID FK → members | |
| event_id | UUID FK → events | |
| type | VARCHAR(50) | `participant`, `trainer`, `mentor`, `winner` |
| title | VARCHAR(200) | |
| issued_at | TIMESTAMPTZ | |
| verified | BOOLEAN | |
| pdf_url | TEXT | |

#### `news` — Berita & Artikel
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| title | VARCHAR(200) | |
| slug | VARCHAR(200) UNIQUE | |
| content | TEXT | Markdown |
| excerpt | TEXT | |
| image_url | TEXT | |
| author_id | UUID FK → members | |
| category | VARCHAR(50) | `article`, `announcement`, `press_release` |
| status | VARCHAR(20) | `draft`, `published` |
| published_at | TIMESTAMPTZ | |
| is_featured | BOOLEAN | |
| view_count | INTEGER | |

#### Tabel Lainnya
| Tabel | Kegunaan |
|-------|----------|
| `programs` | 6 Program Unggulan PRO RI |
| `program_registrations` | Pendaftaran program oleh anggota |
| `activity_logs` | Log aktivitas member (audit trail) |
| `contact_messages` | Pesan dari form kontak publik |
| `member_designations` | Designation trainer/mentor per member |
| `member_cards` | Data kartu anggota (nama, foto, tanda tangan, status) |
| `news_comments` | Komentar pada berita |
| `hero_gallery` | Gambar slider hero section |
| `activity_gallery` | Gallery kegiatan (foto, kategori) |
| `videos` | Video gallery (URL, poster, sort_order) |
| `system_settings` | Konfigurasi sistem (fitur toggle, maintenance, dll) |

### Indexes (51 indexes)
```sql
-- Members
idx_members_province, idx_members_status, idx_members_role, idx_members_auth
idx_members_name_search (GIN full-text search Indonesian)

-- Events
idx_events_status, idx_events_category, idx_events_start_date, idx_events_province
idx_events_title_search (GIN)

-- Innovations
idx_innovations_category, idx_innovations_province, idx_innovations_creator, idx_innovations_status

-- Certificates
idx_certificates_member, idx_certificates_event

-- News
idx_news_status, idx_news_published, idx_news_featured, idx_news_title_search (GIN)

-- Activity Logs
idx_activity_logs_member, idx_activity_logs_created (DESC)

-- Regions
idx_regencies_province, idx_districts_regency, idx_villages_district

-- Plus indexes for: hero_gallery, activity_gallery, contact_messages, videos,
-- member_designations, member_cards, programs, program_registrations, news_comments
```

### Functions (14 functions)
| Function | Kegunaan |
|----------|----------|
| `generate_member_id()` | Generate ID format `PRO-RI-2026-00001` |
| `generate_member_number()` | Generate nomor kartu `PRO-RI-000001` |
| `handle_new_user()` | Trigger: auto-create member saat signup |
| `recalculate_province_counters()` | Update semua denormalized counters |
| `recalculate_all_counters()` | Versi alternatif recalculate |
| `increment_download_count(UUID)` | Increment download counter |
| `increment_news_view(UUID)` | Increment view counter by ID |
| `increment_view_count(TEXT)` | Increment view counter by slug |
| `update_updated_at_column()` | Auto-update `updated_at` |
| `get_current_member_role()` | Helper RLS: get user role |
| `is_admin_or_super()` | Helper RLS: check admin |
| `trigger_recalculate_counters()` | Trigger: auto recalculate |
| `count_members_by_province()` | Count members per province |
| `set_member_designation(UUID, TEXT, BOOLEAN)` | Set/unset designation via RPC |
| `get_setting(TEXT)` | Get system setting value |
| `is_feature_enabled(TEXT)` | Check if feature is enabled |
| `is_maintenance_mode()` | Check maintenance mode |

### Storage Buckets (8 buckets)
| Bucket | Kegunaan | Max Size |
|--------|----------|----------|
| `news` | Gambar berita | 5 MB |
| `events` | Banner event | 5 MB |
| `innovations` | Gambar inovasi | 5 MB |
| `photos` | Foto anggota | 5 MB |
| `member-cards` | Upload kartu anggota | 10 MB |
| `hero-gallery` | Gambar slider hero | 10 MB |
| `activity-gallery` | Foto galeri kegiatan | 10 MB |
| `videos` | File video | 100 MB |

---

## 5. Authentication & Authorization

### Auth Flow
```
Browser → [Login/Register] → Supabase Auth → Session Cookie
    ↓                                                   ↑
Next.js Middleware (every request) ─────────────────────┘
    ↓
Protected Route (dashboard, admin)
    ↓
Role Check → Redirect sesuai role
```

### Mekanisme
1. **Login** (`features/auth/actions.ts` — `login()`):
   - Validasi email & password dengan Zod
   - `supabase.auth.signInWithPassword()`
   - Ambil role member via query `members` → `roles`
   - Redirect: admin → `/admin`, member → `/dashboard`

2. **Register** (`features/auth/actions.ts` — `register()`):
   - Validasi form dengan Zod (nama, email, password, wilayah, minat teknologi)
   - `supabase.auth.signUp()` — create auth user
   - Generate `member_id` format `PRO-RI-{tahun}-{nomor_urut}`
   - Insert profile ke tabel `members` (via admin client — bypass RLS)
   - Return `memberId` untuk ditampilkan ke user

3. **Session Management**:
   - `middleware.ts` → panggil `updateSession()` dari `lib/supabase/middleware.ts`
   - Refresh session cookie di setiap request

### Role-Based Access Control (RBAC)
| Role | Akses | Redirect Login |
|------|-------|----------------|
| **Guest** | Halaman public only | — |
| **Member** | Dashboard, membership, profile, events, innovations | `/dashboard` |
| **Admin** | Admin panel: member, events, certificates, news, monitoring | `/admin` |
| **Super Admin** | Full access + role management, system settings | `/admin` |

### RLS Policies
- Helper functions: `get_current_member_role()`, `is_admin_or_super()`
- Semua tabel memiliki RLS policies yang sesuai
- Admin client (service_role key) digunakan untuk bypass RLS saat register dan operasi super admin

---

## 6. Routing & Halaman

### Public Routes `/(public)` — No Auth Required (16 route files)
| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/` | Home | Hero gallery slider, featured news, trust bar, tentang, dampak nasional (animated stats), 6 program unggulan, video showcase, events terbaru, innovations, news, CTA |
| `/about` | About PRO RI | Visi, misi, struktur organisasi |
| `/programs` | Programs | 6 program unggulan dengan cards + filter |
| `/programs/[slug]` | Program Detail | Detail program + fitur + target audiens + tombol daftar |
| `/news` | News | Daftar berita dengan pagination + filter kategori |
| `/news/[slug]` | News Detail | Artikel markdown + komentar + related news |
| `/events` | Events | Daftar event dengan filter category, type, status |
| `/events/[slug]` | Event Detail | Detail event + banner + lokasi + tombol daftar |
| `/innovations` | Innovations | Gallery inovasi dengan filter kategori |
| `/innovations/[slug]` | Innovation Detail | Detail inovasi + creator + provinsi |
| `/register` | Register | Form pendaftaran anggota (region cascade + tech interest) |
| `/login` | Login | Form login email/password |
| `/gallery` | Gallery | Gallery kegiatan (filter by kategori, lightbox) |
| `/pengurus` | Pengurus | Struktur kepengurusan PRO RI |
| `/kontak` | Kontak | Form kontak + peta lokasi |
| `/national-map` | National Map | Peta interaktif Indonesia (Leaflet) |
| `/verify/[memberNumber]` | Verify Member | Verifikasi anggota via nomor kartu |
| `/verify/certificate/[id]` | Verify Certificate | Verifikasi sertifikat via QR code |

### Dashboard Routes `/(dashboard)` — Member Auth Required (14 route files)
| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/dashboard` | Dashboard | 7 KPI cards + 3 target nasional progress bar, real-time updates via Supabase Realtime |
| `/membership` | Membership | Digital member card dengan QR code |
| `/membership/certificates` | My Certificates | Daftar sertifikat yang dimiliki |
| `/membership/certificates/[id]` | Certificate Preview | Preview + download PDF sertifikat |
| `/my-member-card` | My Member Card | Form registrasi/pengajuan kartu anggota |
| `/members` | Member Directory | Direktori anggota dengan search |
| `/national-map` | National Map | Peta interaktif full version |
| `/dashboard/events` | My Events | Event yang diikuti |
| `/dashboard/innovations` | My Innovations | Inovasi milik sendiri |
| `/dashboard/innovations/new` | Submit Innovation | Form submit inovasi baru |
| `/dashboard/programs` | My Programs | Program yang diikuti |
| `/profile` | Profile | Edit profil |
| `/academy` | Academy | Redirect ke LMS eksternal |

### Admin Routes `/(admin)` — Admin/Super Admin Required (18 route files)
| Route | Halaman | Deskripsi |
|-------|---------|-----------|
| `/admin` | Admin Dashboard | Overview admin |
| `/admin/members` | Members | Tabel anggota CRUD |
| `/admin/members/[id]` | Member Detail | Detail + edit member, designation, role |
| `/admin/events` | Events | Manajemen event CRUD |
| `/admin/news` | News | Manajemen berita dengan markdown editor |
| `/admin/innovations` | Innovations | Moderasi inovasi |
| `/admin/certificates` | Certificates | Manajemen sertifikat CRUD |
| `/admin/programs` | Programs | Manajemen program unggulan CRUD |
| `/admin/gallery` | Hero Gallery | Manajemen gambar slider hero section |
| `/admin/gallery-kegiatan` | Activity Gallery | Manajemen foto kegiatan |
| `/admin/videos` | Videos | Manajemen video gallery |
| `/admin/roles` | Roles | Manajemen role (super admin only) |
| `/admin/super-admin` | Super Admin | Panel khusus super admin |
| `/admin/messages` | Messages | Inbox pesan kontak masuk |
| `/admin/monitoring` | Monitoring | National monitoring dashboard |
| `/admin/verification` | Verification | Verifikasi pendaftaran event & program |
| `/admin/member-verification` | Member Verification | Verifikasi kartu anggota |
| `/admin/activity` | Activity Logs | Log aktivitas sistem |
| `/admin/settings` | Settings | Pengaturan aplikasi |

### Layout Hierarchy
```
RootLayout (app/layout.tsx)
├── Providers (ThemeProvider + QueryClient + Toaster)
│
├── PublicLayout ((public)/layout.tsx)
│   ├── PublicNavbar
│   ├── <children>
│   └── PublicFooter
│
├── DashboardLayout ((dashboard)/layout.tsx)
│   ├── DashboardSidebar
│   ├── <children>
│   └── PublicFooter
│
└── AdminLayout ((admin)/layout.tsx)
    ├── AdminSidebar
    ├── <children>
    └── PublicFooter
```

### Error & Loading Boundaries
| Route Group | error.tsx | loading.tsx | not-found.tsx |
|-------------|-----------|-------------|---------------|
| Root | ❌ | ❌ | ✅ |
| Public | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ |

---

## 7. Fitur-Fitur Detail

### 7.1 Public Portal

#### Hero Section (`app\(public)\page.tsx`)
- **Dynamic Gallery Slider**: Slideshow dari tabel `hero_gallery`
  - Auto-slide setiap 6 detik, pause on hover
  - Navigasi panah kiri/kanan + dot indicators
  - Setiap slide: judul, deskripsi, CTA button dengan link
- **Fallback Hero**: Jika gallery kosong, tampilkan hero statis dengan logo PRO RI
- **Robot-themed Decorative Elements**:
  - Hexagon floating (3 buah dengan animasi berbeda)
  - Circuit lines dengan moving dot (3 garis)
  - Rotating gears (2 ukuran, arah berbeda)
  - Corner accents (4 sudut)
  - Scanning line animation (atas-bawah)
  - Grid + circuit pattern background
- **ISR**: `export const revalidate = 60` — di-revalidate setiap 60 detik

#### Featured News Bar
- Horizontal scroll news items dari `is_featured` news

#### National Impact Stats (`components/features/home/animated-stats.tsx`)
- 6 KPI cards: Anggota, Trainers, Provinsi, Kab/Kota, Events, Inovasi
- Framer Motion: Stagger children + fade-in animation
- Progress bar terhadap target (10k members, 500 trainers, 200 mentors)

#### 6 Program Unggulan Cards
1. **Sekolah Robotika Rakyat** — Pendidikan robotika berbasis komunitas
2. **Robotika Masuk Sekolah** — Integrasi kurikulum robotika SD-SMA
3. **Akademi AI** — Pelatihan intensif AI/ML/CV
4. **Kompetisi Robotika Nasional** — Ajang tahunan
5. **Inkubator Inovasi Teknologi** — Inkubasi startup
6. **Robotika untuk UMKM** — Otomatisasi UMKM

#### Video Showcase (`components/features/video/video-grid.tsx`)
- Grid video dari tabel `videos` (admin-managed via YouTube URL)
- **VideoWithFallback**: Jika embed gagal, tampilkan fallback UI

### 7.2 Membership System

#### Member Registration (`app\(public)\register\page.tsx`)
- **RegionSelect** (`components/features/register/region-select.tsx`):
  - 4-level cascade select: Provinsi → Kabupaten/Kota → Kecamatan → Desa
  - Data di-fetch dari Supabase secara real-time
- **TechInterestSelect** (`components/features/register/tech-interest-select.tsx`):
  - 12 pilihan minat teknologi (chip-style toggle, multi-select)
- Validasi Zod: nama min 3 karakter, password min 6, phone min 10 digit
- Generate `member_id` format `PRO-RI-{tahun}-{nomor_urut}`

#### Digital Member Card (`components/features/membership/digital-member-card.tsx`)
- Glass-morphism effect
- QR Code (qrcode.react): Link verifikasi ke `/verify/{member_id}`
- Header merah gradien PRO RI
- Info: Member ID, Nama Lengkap, Status, Provinsi

#### Member Card View & Print (`components/features/membership/member-card-view.tsx`)
- **Preview Card**: Landscape card dengan tema robotik
  - Circuit pattern background (SVG)
  - Tech corner brackets
  - Red gradient header dengan tech line overlay
  - Foto profil + QR Code + Signature
  - Tech specs bar: ID, version, verified status
- **Actions**: Download PDF (html2canvas → jsPDF), Print, Copy Link

#### Member Registration Form (`components/features/membership/member-registration-form.tsx`)
- 8 Sections: Data Pribadi, Kontak & Alamat, Pendidikan & Pekerjaan, Minat & Keahlian, Pengalaman & Motivasi, Foto Profil, Tanda Tangan Digital, Submit
- Status-aware: pending, approved, rejected

### 7.3 National Command Center

#### Monitoring Dashboard (`components/features/command-center/monitoring-dashboard.tsx`)
Komponen utama yang menyusun seluruh halaman monitoring:

1. **Header**: "National Command Center" dengan circuit border + pulse ring + status LIVE dot

2. **KPI Cards** (`components/features/command-center/kpi-tracker.tsx`):
   - 9 KPI cards: Total Members, Anggota Aktif, Trainer, Mentor, Events, Inovasi, Berita, Sertifikat, Provinsi
   - Glass-tech card dengan corner brackets + data-pulse ring effect

3. **Target Nasional**:
   - 3 target bars: 10.000 Anggota, 500 Trainer, 200 Mentor
   - Animated progress bars dengan gradient red + shimmer effect

4. **Peta Sebaran** (Leaflet — dynamic import no SSR):
   - CircleMarkers per provinsi berdasarkan koordinat real dari database
   - GeoJSON overlay (coba dari 3 CDN, fallback ke CircleMarkers saja)
   - ProvinceLabels dengan divIcon
   - Tooltip kaya data: Anggota, Trainer, Events, Inovasi
   - Drill-down: Klik provinsi → zoom ke provinsi + tampil CircleMarkers kab/kota
   - Klik kab/kota → panel samping tampil kecamatan
   - Fungsi `generateRegencyPositions()` — posisi schematic deterministik

5. **Charts** (`components/features/command-center/growth-chart.tsx`):
   - **GrowthBarChart**: Bar chart anggota baru per bulan
   - **GrowthAreaChart**: Area chart kumulatif + anggota baru
   - **TechDistributionChart**: Horizontal bar chart — top 10 minat teknologi

6. **Side Panel** (berdasarkan drill level):
   - Top 15 Provinsi List
   - ProvinceDetailPanel: Stats + daftar kab/kota
   - RegencyDetailPanel: Stats + daftar kecamatan
   - DistrictDetailPanel: Stats + daftar desa

7. **RealtimeDashboard**: Supabase Realtime subscription + polling 30 detik
8. **CSV Export**: Download data provinsi dalam format CSV

### 7.4 Event Center
- Event listing dengan filter category, type, status
- Event detail dengan banner, info, tombol daftar
- **EventRegistrationButton**: 3 states (login required → registered → not registered)
- Admin CRUD events dengan upload banner

### 7.5 Innovation Center
- Innovation gallery dengan filter kategori
- Innovation detail dengan creator, province, year
- Innovation submission form untuk member
- Admin moderation: publish, feature, archive

### 7.6 Certificate System
- CertificatePreview dengan dark theme, gradient background, red border
- Download PDF: html2canvas (scale 3) → jsPDF landscape
- Public verification page via QR code
- Types: participant, trainer, mentor, winner

### 7.7 News System
- News listing with pagination + category filter
- News detail dengan markdown renderer, komentar, related news
- **MarkdownContent**: ReactMarkdown dengan custom styling dark theme
- **NewsComments**: Form + list comments
- Admin CRUD dengan markdown editor

### 7.8 Program Unggulan
6 program dikelola via admin. Setiap program punya:
- Deskripsi, short_description, icon, image_url, features array
- Target audience, label status (dibuka/akan datang/ditutup/selesai)
- **RegistrationModal**: 4-step flow (Form → Verifying → Confirm → Done)
- Program registration via Member ID (no login required)

### 7.9 Admin System
- **Member Management**: Data table with search, filter, sort + designation manager
- **Event Management**: CRUD table + form dialog
- **News Management**: Markdown editor (`@uiw/react-md-editor`)
- **Innovation Management**: Moderation table
- **Certificate Management**: CRUD with member selection
- **Gallery Management**: Hero gallery CRUD + Activity gallery CRUD
- **Video Management**: CRUD with YouTube URL
- **Role Management**: Super admin only
- **Contact Messages**: Inbox with read/unread
- **Verification Center**: Approve/reject registrations
- **Member Card Verification**: Approve/reject with reason

### 7.10 Contact System
- **Contact Form**: name, email, phone, message → INSERT ke `contact_messages`
- **Admin Messages**: Inbox, mark read/unread, delete

### 7.11 Verification System
- **Member Verification** (public): `/verify/[memberNumber]` — verify member_cards
- **Certificate Verification** (public): `/verify/certificate/[id]`

### 7.12 Academy Gateway
- Redirect ke LMS eksternal: `https://academy.prori.id`

### 7.13 Profile Settings
- Edit profil: full_name, phone, occupation, technology_interest, photo upload
- React Hook Form + Zod validation

---

## 8. Server Actions

### Auth (`features/auth/actions.ts`)
| Action | Method | Input | Output |
|--------|--------|-------|--------|
| `login(formData)` | POST | email, password | `{ success, role }` or `{ error }` |
| `register(formData)` | POST | fullName, email, phone, password, wilayah, technologyInterest | `{ success, memberId }` or `{ error }` |
| `getCurrentUserRole()` | GET | — | `{ role }` or `{ role: null }` |
| `logout()` | POST | — | signOut + revalidate |

### Admin (`features/admin/actions.ts`)
| Action | Fungsi |
|--------|--------|
| `updateMemberStatus(id, status)` | Update status member |
| `deleteMember(id)` | Hapus member + auth user |
| `createEvent(formData)` | Buat event + upload banner |
| `updateEvent(id, formData)` | Update event |
| `deleteEvent(id)` | Hapus event |
| `createNews(formData)` | Buat berita + upload image (dengan rollback) |
| `updateNews(id, formData)` | Update berita |
| `deleteNews(id)` | Hapus berita |
| `createInnovation(formData)` | Buat inovasi |
| `updateInnovation(id, formData)` | Update inovasi (moderasi) |
| `deleteInnovation(id)` | Hapus inovasi |
| `createCertificate(formData)` | Buat sertifikat |
| `updateCertificate(id, formData)` | Update sertifikat |
| `deleteCertificate(id)` | Hapus sertifikat |
| `updateMemberRole(id, roleId)` | Update role member (super admin only) |
| `searchMembers(query)` | Search members (ilike) |
| `setMemberDesignation(id, designation, active)` | Set/unset trainer/mentor |
| `getMemberDesignations(id)` | Get designations member |
| `createHeroGalleryItem(formData)` | Tambah hero gallery |
| `updateHeroGalleryItem(id, formData)` | Update hero gallery |
| `deleteHeroGalleryItem(id)` | Hapus hero gallery |
| `createActivityGalleryItem(formData)` | Tambah activity gallery |
| `updateActivityGalleryItem(id, formData)` | Update activity gallery |
| `deleteActivityGalleryItem(id)` | Hapus activity gallery |
| `submitContactMessage(formData)` | Submit pesan kontak |
| `markMessageRead(id, isRead)` | Tandai baca/unread |
| `deleteContactMessage(id)` | Hapus pesan |

### Events (`features/events/actions.ts`)
| Action | Fungsi |
|--------|--------|
| `registerForEvent(eventId)` | Daftar event (member login) |
| `cancelRegistration(eventId)` | Batalkan pendaftaran |
| `updateEventRegistrationStatus(id, status)` | Admin update status |
| `getEventRegistrations(eventId)` | Get daftar peserta |
| `getPendingVerificationCount()` | Hitung pending verifikasi |
| `getPendingProgramRegistrations()` | Pending program registrations |
| `getPendingEventRegistrations()` | Pending event registrations |
| `getRegistrationStatus(eventId)` | Cek status registrasi member |

### Programs (`features/admin/programs-actions.ts`)
| Action | Fungsi |
|--------|--------|
| `createProgram(formData)` | Buat program |
| `updateProgram(id, formData)` | Update program |
| `deleteProgram(id)` | Hapus program |
| `registerForProgram(programId)` | Daftar program (member login) |
| `cancelProgramRegistration(programId)` | Batalkan pendaftaran |
| `getProgramRegistrationStatus(programId)` | Cek status registrasi |
| `getProgramRegistrationsCount(programId)` | Hitung pendaftar |
| `getProgramRegistrations(programId)` | Get daftar peserta |
| `updateProgramRegistrationStatus(id, status)` | Admin update status |

### Registration via Member ID (`features/registration-actions.ts`)
| Action | Fungsi |
|--------|--------|
| `lookupMemberByMemberId(memberId)` | Verifikasi member by ID |
| `registerProgramByMemberId(programId, memberId, fullName)` | Daftar program tanpa login |
| `registerEventByMemberId(eventId, memberId, fullName)` | Daftar event tanpa login |

### News (`features/news/news-actions.ts`)
| Action | Fungsi |
|--------|--------|
| `submitComment(formData)` | Submit komentar berita |
| `incrementNewsView(newsId)` | Increment view count (RPC) |
| `getNewsComments(newsId)` | Get komentar berita |
| `getRelatedNews(slug, category, limit)` | Berita terkait |
| `getMostReadNews(limit)` | Berita paling banyak dibaca |

### Members (`features/members/profile-actions.ts`)
| Action | Fungsi |
|--------|--------|
| `updateProfile(formData)` | Update profil member |
| `uploadProfilePhoto(formData)` | Upload foto profil |

### Member Cards (`features/admin/member-card-actions.ts`)
| Action | Fungsi |
|--------|--------|
| `submitMemberCard(formData)` | Submit pengajuan kartu anggota |
| `approveMemberCard(cardId)` | Admin approve kartu |
| `rejectMemberCard(cardId, reason)` | Admin reject kartu |
| `getMyMemberCardStatus()` | Get status kartu user |
| `verifyMemberByNumber(memberNumber)` | Verifikasi publik by nomor kartu |
| `incrementDownloadCount(cardId)` | Increment download counter (RPC) |

### Command Center Data (`features/command-center/data.ts`)
| Function | Fungsi |
|----------|--------|
| `getCommandCenterStats()` | All KPI stats + progress % |
| `getProvinceStats()` | Stats per provinsi (member count real-time) |
| `getMonthlyGrowth()` | Monthly members growth |
| `getAllRegencyStats()` | Stats per kabupaten |
| `getAllDistrictStats()` | Stats per kecamatan |
| `getAllVillageStats()` | Stats per desa |
| `getTechDistribution()` | Distribusi minat teknologi |

### Public Data (`features/public/data.ts`)
| Function | Fungsi |
|----------|--------|
| `getPublicStats()` | Total members, trainers, provinces, regencies, events, innovations |
| `getPublicEvents(limit)` | Published events terbaru |
| `getPublicInnovations(limit)` | Published/featured innovations |
| `getPublicEvent(slug)` | Single event by slug |
| `getPublicInnovation(slug)` | Single innovation by slug |
| `getPublicNews(limit)` | Published news terbaru |
| `getPublicNewsPaginated({page, pageSize, category})` | News dengan pagination |
| `getPublicNewsCategories()` | Unique categories dari news |
| `getPublicFeaturedNews(limit)` | Featured news |

### Storage (`features/admin/storage.ts`)
| Action | Fungsi |
|--------|--------|
| `uploadNewsImage(file, prefix)` | Upload gambar ke storage |
| `deleteNewsImage(publicUrl)` | Hapus gambar dari storage |
| `uploadSignature(file, prefix)` | Upload signature/tanda tangan |

---

## 9. Komponen Arsitektur

### UI Components (Shadcn/UI — `/components/ui/`)
| Komponen | Source | Penggunaan |
|----------|--------|------------|
| Button | shadcn/ui | default, outline, ghost, destructive, link |
| Card | shadcn/ui | Card, CardHeader, CardTitle, CardContent |
| Input | shadcn/ui | Form input |
| Select | shadcn/ui | SelectTrigger, SelectContent, SelectItem |
| Textarea | shadcn/ui | Multi-line input |
| Badge | shadcn/ui | default, success, warning, outline |
| Avatar | shadcn/ui | Avatar, AvatarImage, AvatarFallback |
| Dialog | shadcn/ui | Modal dialogs |
| Separator | shadcn/ui | Horizontal/Vertical divider |
| Label | shadcn/ui | Form label |
| Sonner (Toaster) | shadcn/ui | Toast notifications |
| DataTable | Custom | Sortable, filterable table |

### Feature Components (`/components/features/`)
| Komponen | Lokasi | Deskripsi |
|----------|--------|-----------|
| `hero-gallery.tsx` | `features/home/` | Dynamic slider gallery |
| `animated-stats.tsx` | `features/home/` | Animated KPI counters |
| `region-select.tsx` | `features/register/` | 4-level cascade select |
| `tech-interest-select.tsx` | `features/register/` | Multi-select tech interests |
| `digital-member-card.tsx` | `features/membership/` | Glass card with QR |
| `member-card-view.tsx` | `features/membership/` | Full card preview + PDF |
| `member-registration-form.tsx` | `features/membership/` | 8-section form |
| `monitoring-dashboard.tsx` | `features/command-center/` | Main monitoring layout |
| `kpi-tracker.tsx` | `features/command-center/` | KPI cards + target progress |
| `growth-chart.tsx` | `features/command-center/` | Recharts area/bar charts |
| `indonesia-map.tsx` | `features/command-center/` | Dynamic import wrapper |
| `map-view.tsx` | `features/command-center/` | Leaflet interactive map |
| `realtime-dashboard.tsx` | `features/command-center/` | Real-time stats display |
| `video-grid.tsx` | `features/video/` | Video gallery grid |
| `video-with-fallback.tsx` | `features/video/` | YouTube embed + fallback |

### Widgets (`/components/widgets/`)
| Komponen | Deskripsi |
|----------|-----------|
| `public-navbar.tsx` | Transparent → solid on scroll, link navigasi, theme toggle |
| `public-footer.tsx` | Logo, menu, sosial media, copyright |
| `dashboard-sidebar.tsx` | Nav items untuk member dashboard |
| `admin-sidebar.tsx` | Nav items untuk admin panel |

---

## 10. Hooks & Utility

### `useCounterAnimation` (`hooks/use-counter-animation.ts`)
- Animated counter menggunakan Framer Motion `useMotionValue` + `useSpring`
- Configurable: `end` value, `duration`, `enabled`

### `useDebounce` (`hooks/use-debounce.ts`)
- Generic debounce hook untuk search input

### `useMediaQuery` (`hooks/use-media-query.ts`)
- Detect responsive breakpoints

### `lib/utils.ts`
| Function | Kegunaan |
|----------|----------|
| `cn()` | Merge Tailwind classes (clsx + tailwind-merge) |
| `formatNumber(n)` | Format angka dengan separator ribuan |
| `formatDate(date)` | Format tanggal Indonesia |
| `slugify(text)` | Generate URL slug |
| `formatIndonesianDate(date)` | Format tanggal lengkap Indonesia |

### `lib/constants.ts`
| Constant | Value |
|----------|-------|
| `APP_NAME` | `"PRO RI"` |
| `APP_DESCRIPTION` | `"Pusat Robotika Rakyat Indonesia"` |
| `TARGET_MEMBERS` | `10000` |
| `TARGET_TRAINERS` | `500` |
| `TARGET_MENTORS` | `200` |
| `ROLES` | `{ guest, member, admin, super_admin }` |
| `NAV_ITEMS` | Array navigasi |

---

## 11. Design System & Animasi

### Color System (`app/globals.css`)
```css
--color-pri-red: #E31E24        /* Primary red PRO RI */
--color-pri-carbon: #0F1117     /* Dark background */
--color-pri-dark: #1B1F2A       /* Card/section background */
--color-pri-silver: #BFC5D2     /* Muted text */
--color-pri-light: #F5F6F8      /* Light accent */
--color-pri-white: #FFFFFF      /* Text utama */
```

**Light Mode** (`:root.light`):
- Background: white (#FFFFFF)
- Cards: light gray (#F9FAFB)
- Text: near-black (#111827)

### Glass Effects
| Class | Efek |
|-------|------|
| `.glass` | Background blur + border transparan |
| `.glass-card` | Glass + rounded + shadow |
| `.glass-card-hover` | Glass + hover lift + glow merah |
| `.glass-tech` | Enhanced glass dengan animated border gradient |

### Animasi Kustom (CSS Keyframes)
| Class | Animasi | Deskripsi |
|-------|---------|-----------|
| `.hero-hexagon` | `hexagonFloat` | Hexagon mengambang + rotasi |
| `.hero-circuit-line` | `circuitDot` | Titik bergerak di sepanjang garis sirkuit |
| `.hero-scan-line` | `scanMove` | Garis scan bergerak vertikal |
| `.hero-gear` | `gearSpin` | Gear berputar (2 arah berbeda) |
| `.tech-particle` | `particleFloat` | Partikel melayang naik |
| `.data-pulse-ring` | `pulseRing` | Lingkaran pulse (3 rings staggered) |
| `.scan-overlay` | `scanOverlay` | Gradient scan bergerak |
| `.status-dot` | `statusPulse` | Live indicator berkedip hijau |
| `.glow-divider` | `dividerPulse` | Separator dengan titik glow |
| `.orbit-ring` | `orbitSpin` | Lingkaran orbit berputar |
| `.progress-tech` | `progressShimmer` | Shimmer effect pada progress bar |

### Pattern Classes
| Class | Efek |
|-------|------|
| `.grid-pattern` | Grid garis halus |
| `.circuit-pattern` | Radial gradient circuit |
| `.text-gradient` | Text gradient merah |
| `.glow-red` | Box shadow glow merah |
| `.glow-red-sm` | Glow merah kecil |
| `.circuit-border` | Gradient border merah |

### Font System
- **Sans**: Inter (variable font) — body text
- **Mono**: JetBrains Mono — numbers, code, tech display

---

## 12. Arsitektur & Alur Data

### Read Operations
```
Browser Request
    → Next.js Middleware (auth/session refresh)
    → Server Component (RSC)
        → createClient() (server) → Supabase DB (RLS enforced)
        → Render HTML
```

### Write Operations (Server Actions)
```
User Action (form submit)
    → Server Action ("use server")
    → Zod Validation
    → createClient() / createAdminClient()
    → INSERT / UPDATE / DELETE (RLS enforced)
    → revalidatePath() → cache refresh
    → Response ({ success: true } or { error: message })
    → Client: toast notification + router.refresh()
```

### State Management
| State Type | Solution |
|------------|----------|
| Server state | RSC + Server Actions |
| URL state | Next.js searchParams, path params |
| Auth state | Supabase session + HTTP-only cookies |
| UI state | Local React useState |
| Form state | React Hook Form + Zod |
| Cache | Next.js revalidatePath() |
| Real-time | Supabase Realtime subscriptions |

### National Command Center Data Flow
```
/command-center
    → getCommandCenterStats() — total KPI
    → getProvinceStats() — data per provinsi
    → MonitoringDashboard
        → RealtimeDashboard (Supabase subscription + 30s polling)
        → KpiCards (9 KPI animated counters)
        → TargetProgress (3 target bars)
        → IndonesiaMap (Leaflet interactive)
            → Klik provinsi → zoom + tampil kab/kota markers
            → Klik kab/kota → panel samping kecamatan
        → GrowthAreaChart + GrowthBarChart (Recharts)
        → TechDistributionChart
        → ProvinceCsvExport
```

---

## 13. Security

### Authentication
- Supabase Auth dengan email/password
- Session HTTP-only cookies, auto-refresh via middleware
- Password minimum 6 karakter (Zod validation)

### Authorization
- **RLS** (Row Level Security) di semua 22 tabel
- **Role checking** di server actions via `getCurrentUserRole()`
- **Admin client** (service_role key) hanya untuk: register bypass, super admin ops, delete member, public verifications
- **Server-side validation**: Semua mutations divalidasi dengan Zod

### Data Protection
- SQL injection prevention (Supabase parameterized queries)
- XSS prevention (React's built-in escaping)
- Zod input validation on all forms
- File upload: type validation (JPG/PNG), size limits (5MB photo, 2MB server actions)

### Stored at `supabase/`
- `consolidated-migration.sql` — Schema + migration + seed lengkap
- `migrations/` — Migration files per versi
- `migrations/wilayah/` — Data wilayah (38 provinsi, 514 kab/kota) — dari repo cahyadsn/wilayah

---

## 14. Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME=PRO RI Digital Command Center

# Academy (redirect)
NEXT_PUBLIC_ACADEMY_URL=https://academy.prori.id
```

---

## 15. Deployment

### Build & Start
```bash
npm run build
npm start  # next start on port 3000

# PM2
pm2 start npm --name "pro-ri" -- start
```

### Database Migration (Fresh Instance)
```bash
# Full migration (recommended)
psql -h <host> -d <db> -f supabase/consolidated-migration.sql

# OR import wilayah data dari repo resmi:
curl -sL https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/archive/wilayah_level_1_2_postgresql.sql | psql -h <host> -d <db>
```

### Deployed on
- **Host**: VPS Self-hosted (Node.js)
- **Database**: Supabase (self-hosted atau cloud)

---

## 16. Content Redesign (WordPress → Next.js)

### Latar Belakang
Website PRO RI sebelumnya adalah WordPress dengan Divi Theme v5.7.4 di https://prori.vps313.com/. Dilakukan audit dan redesign konten untuk migrasi ke Next.js.

### Audit Scores (WordPress Version)
| Page | Clarity | Credibility | Conversion | Storytelling | Total |
|------|---------|-------------|------------|--------------|-------|
| Homepage | 5/10 | 3/10 | 2/10 | 4/10 | **14/40** |
| Tentang Kami | 3/10 | 4/10 | 1/10 | 2/10 | **10/40** |
| Susunan Pengurus | 1/10 | 1/10 | 1/10 | 1/10 | **4/40** |
| Blog | 5/10 | 4/10 | 2/10 | 4/10 | **15/40** |
| Daftar Anggota | 4/10 | 3/10 | 4/10 | 1/10 | **12/40** |
| Kontak | 3/10 | 2/10 | 3/10 | 1/10 | **9/40** |
| Articles (avg) | 7/10 | 6/10 | 2/10 | 5/10 | **20/40** |
| **Overall** | | | | | **12/40** |

### Key Findings (WordPress)
1. Missing H1 tags across all pages — major SEO issue
2. No primary CTA on homepage
3. Susunan Pengurus page empty with placeholder text
4. Tentang Kami relies entirely on images (vision, mission not accessible as text)
5. No contact details on Kontak page
6. Articles 2 and 3 are near-duplicates
7. No social proof anywhere
8. Only 3 blog posts
9. Daftar Anggota form has no benefit explanation

### Content Redesign Implementation
Hasil redesign konten diimplementasikan langsung di Next.js:
- Setiap halaman punya H1 tag yang jelas
- Hero section dengan CTA kuat
- Benefit cards di daftar anggota
- Kontak page dengan FAQ + info lengkap
- Tentang Kami dengan text content (tidak hanya gambar)
- Pengurus page dengan data lengkap + struktur organisasi

### Copywriting Master (Implementasi)
**Hero Homepage:**
> Headline: Mencetak Generasi Robotik Indonesia
> Subheadline: Membangun talenta teknologi, inovator, dan pemimpin masa depan menuju Indonesia Emas 2045.
> CTA: Daftar Anggota | Jelajahi Program

**SEO Titles per Page:**
| Page | SEO Title |
|------|-----------|
| Beranda | Pusat Robotika Rakyat Indonesia — PRO RI |
| Tentang | Tentang PRO RI — Pusat Robotika Rakyat Indonesia |
| Program | 6 Program Unggulan PRO RI — Robotika untuk Indonesia |
| Pengurus | Susunan Pengurus PRO RI — DPN, DPD, DPC |
| Informasi | Berita & Media — PRO RI |
| Events | Events — PRO RI |
| Inovasi | Galeri Inovasi — PRO RI |
| Daftar | Daftar Anggota PRO RI — Bergabung Sekarang |
| Kontak | Hubungi PRO RI |

---

## 17. Prompt AI Agent (Origin Story)

### 01 — Project Origin
Prompt original yang mendefinisikan visi, arsitektur, dan requirement platform PRO RI Digital Command Center.
**Isi**: Core vision, visual identity, color system, tech stack (Next.js 15, TypeScript, Tailwind, Supabase), 7-phase development, database design (11+ tables), UI requirements (National Robotics Mission Control feel).

### 02 — Architecture Switch
Instruksi untuk membatalkan migrasi dari Supabase Cloud ke PocketBase, kembali ke Supabase self-hosted di Hostinger VPS.
**Poin penting**: Batalkan migrasi PocketBase, jangan hapus Supabase, jangan rewrite aplikasi, lakukan audit dulu.

### 03 — Content Redesign
Instruksi untuk content audit dan redesign website PRO RI versi WordPress (https://prori.vps313.com/).
**Target**: Content inventory, audit scores, redesigned structure, copywriting master, image catalog, SEO guide, implementation guide.

**Catatan**: Semua 3 prompt asli dapat ditemukan di direktori `docs/prompts/` pada versi sebelumnya.

---

## 18. Catatan Pengembangan

| Aspek | Status |
|-------|--------|
| **Tahap** | Active development |
| **Testing** | Belum ada test files |
| **CI/CD** | Belum ada pipeline |
| **Docker** | Belum ada containerization |
| **Deployment** | VPS Self-hosted |
| **Database Migrations** | Consolidated + 9 migration files |
| **Seed Data** | 38 provinsi, 6 program default, default roles, hero gallery, activity gallery |
| **Linter** | `next lint` available |
| **TypeScript** | `tsc --noEmit` — 0 errors |

### Route Audit Summary
- **68 route files** across 3 route groups
- **22 database tables** (all verified)
- **0 critical issues** remaining

### Issues Found & Fixed
| # | Issue | Fix |
|---|-------|-----|
| 1 | Pexels video 403 errors | Replaced with static image cards |
| 2 | `.map()` on undefined data | Null safety in all command center components |
| 3 | Map not rendering | Added to admin monitoring page |
| 4 | Region dropdowns empty | Seed SQL files created |
| 5 | Type errors | TypeScript: 0 errors |
| 6 | Hero section overlapping | Restructured z-index layering |
| 7 | Tooltip text invisible (white on white) | Dark background CSS class |
| 8 | Legend showing 0 members | Shows actual count thresholds |
| 9 | Realtime Active Now = 0 (fake 15%) | Real query from activity_logs |

---

*Dokumentasi Master ini adalah konsolidasi dari seluruh file dokumentasi project PRO RI Digital Command Center.
Dibuat dengan menggabungkan: ARCHITECTURE.md, DOKUMENTASI.md, README.md, route-audit.md,
content-redesign/, prompts/, dan hasil audit konten WordPress.*
