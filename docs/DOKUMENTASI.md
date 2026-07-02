# PRO RI DIGITAL COMMAND CENTER — Dokumentasi Project

> **Pusat Robotika Rakyat Indonesia** — Platform Ekosistem Nasional Robotika, AI, IoT, Teknologi & Inovasi
> Visi: Membangun 10.000 Talenta Robotika dan AI Indonesia

---

## Daftar Isi

1. [Tech Stack](#1-tech-stack)
2. [Struktur Project](#2-struktur-project)
3. [Database Schema](#3-database-schema)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Sistem Flow](#5-sistem-flow)
6. [Route Groups & Halaman](#6-route-groups--halaman)
7. [Fitur-Fitur (Detail)](#7-fitur-fitur-detail)
8. [Komponen Arsitektur](#8-komponen-arsitektur)
9. [State Management](#9-state-management)
10. [Server Actions](#10-server-actions)
11. [Hooks](#11-hooks)
12. [Design System & Animations](#12-design-system--animations)
13. [Security](#13-security)
14. [Environment Variables](#14-environment-variables)

---

## 1. Tech Stack

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Next.js** (App Router) | 15.x | React framework — routing, RSC, SSR, ISR |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 4.x | Utility-first styling dengan custom theme |
| **Shadcn/UI** (Radix UI) | Latest | Komponen UI primitif (button, card, dialog, select, tabs, dll) |
| **Framer Motion** | 12.x | Animasi halaman, counter, scroll-reveal, stagger children |
| **Lucide React** | Latest | Icon set seragam |
| **Recharts** | 3.x | Grafik area, bar, distribusi teknologi |
| **Leaflet / React-Leaflet** | 1.x / 5.x | Peta interaktif Indonesia dengan marker, popup, heatmap |
| **Zod** | 4.x | Validasi schema form (end-to-end type safety) |
| **TanStack React Query** | 5.x | Client-side data fetching & caching (belum diimplementasikan penuh) |
| **React Hook Form** | 7.x | Form management |
| **React Markdown** | 10.x | Render konten markdown untuk berita |

### Backend & Services

| Service | Kegunaan |
|---------|----------|
| **Supabase** | Database PostgreSQL, Authentication, Storage (file upload), Realtime subscriptions |
| **Node.js (Self-hosted)** | Deployment & hosting |
| **Cloudflare R2** | Opsional — file storage alternatif (S3-compatible) |

### Utility & Lainnya

| Package | Kegunaan |
|---------|----------|
| `clsx` + `tailwind-merge` | Utility class CSS via `cn()` |
| `sonner` | Toast notifications (sukses, error, info) |
| `qrcode.react` | Generate QR code untuk member card & verifikasi |
| `html2canvas` | Screenshot DOM untuk generate PDF |
| `jspdf` | Generate PDF sertifikat & member card |
| `signature_pad` | Signature digital via canvas HTML5 |
| `@uiw/react-md-editor` | Markdown editor untuk konten berita (admin) |
| `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` | AWS S3 / Cloudflare R2 integration |

---

## 2. Struktur Project

```
pro-ri-command-center/
│
├── app/                            # Next.js App Router
│   ├── (public)/                   # Public Portal (tanpa auth)
│   │   ├── page.tsx                # Home page (ISR 60s)
│   │   ├── about/                  # Tentang PRO RI
│   │   ├── programs/               # 6 Program Unggulan
│   │   ├── news/                   # Berita & Artikel
│   │   ├── events/                 # Event/Kegiatan
│   │   ├── innovations/            # Gallery Inovasi
│   │   ├── register/               # Form Pendaftaran Anggota
│   │   ├── login/                  # Login Page
│   │   ├── gallery/                # Gallery Kegiatan
│   │   ├── pengurus/               # Struktur Kepengurusan
│   │   ├── kontak/                 # Form Kontak
│   │   ├── national-map/           # Peta Interaktif
│   │   └── verify/                 # Verifikasi Member & Sertifikat
│   │
│   ├── (dashboard)/                # Member Dashboard (auth required)
│   │   ├── dashboard/              # Overview KPI + Target Nasional
│   │   ├── membership/             # Digital Member Card + Sertifikat
│   │   ├── my-member-card/         # Form Registrasi Kartu Anggota
│   │   ├── members/                # Direktori Anggota
│   │   ├── profile/                # Edit Profil
│   │   ├── academy/                # Redirect ke LMS Eksternal
│   │   └── national-map/           # Peta Interaktif Full
│   │
│   ├── (admin)/                    # Admin Panel (admin/super_admin required)
│   │   ├── admin/
│   │   │   ├── page.tsx            # Admin Dashboard
│   │   │   ├── members/            # CRUD Anggota
│   │   │   ├── events/             # CRUD Event
│   │   │   ├── news/               # CRUD Berita (Markdown Editor)
│   │   │   ├── innovations/        # Moderasi Inovasi
│   │   │   ├── certificates/       # CRUD Sertifikat
│   │   │   ├── programs/           # CRUD Program
│   │   │   ├── gallery/            # Hero Gallery Management
│   │   │   ├── gallery-kegiatan/   # Activity Gallery Management
│   │   │   ├── videos/             # Video Gallery Management
│   │   │   ├── roles/              # Role Management (Super Admin Only)
│   │   │   ├── super-admin/        # Super Admin Panel
│   │   │   ├── messages/           # Inbox Pesan Kontak
│   │   │   ├── monitoring/         # National Monitoring Dashboard
│   │   │   ├── verification/       # Verifikasi Pendaftaran Event & Program
│   │   │   ├── member-verification/# Verifikasi Kartu Anggota
│   │   │   ├── activity/           # Activity Logs
│   │   │   └── settings/           # Pengaturan
│   │   │
│   │   ├── layout.tsx              # Admin Layout
│   │   ├── loading.tsx             # Loading State
│   │   ├── error.tsx               # Error Boundary
│   │   └── not-found.tsx           # 404 Admin
│   │
│   ├── layout.tsx                  # Root Layout (Inter + JetBrains Mono)
│   ├── globals.css                 # Global Styles + Design Tokens + Animations
│   └── not-found.tsx               # Global 404
│
├── components/
│   ├── ui/                         # Shadcn/UI primitives (button, card, input, dll)
│   ├── layouts/                    # Layout components
│   │   ├── public-layout.tsx       # Public layout
│   │   ├── dashboard-layout.tsx    # Member dashboard layout
│   │   ├── admin-layout.tsx        # Admin layout
│   │   └── super-admin-layout.tsx  # Super admin layout
│   │
│   ├── features/                   # Feature-specific components
│   │   ├── home/                   # HeroGallery, AnimatedStats
│   │   ├── register/               # RegionSelect, TechInterestSelect
│   │   ├── membership/             # MemberRegistrationForm, DigitalMemberCard, MemberCardView
│   │   ├── command-center/         # IndonesiaMap, MapView, KpiTracker, GrowthChart, dll
│   │   ├── events/                 # EventRegistrationButton
│   │   ├── programs/               # ProgramRegistrationButton
│   │   ├── news/                   # MarkdownContent, NewsComments, CopyLinkButton
│   │   ├── certificate/            # CertificatePDF
│   │   └── video/                  # VideoWithFallback, VideoGrid
│   │
│   ├── widgets/                    # Complex widgets
│   │   ├── navbar/                 # PublicNavbar (transparent → solid on scroll)
│   │   ├── footer/                 # PublicFooter
│   │   └── sidebar/                # DashboardSidebar, AdminSidebar
│   │
│   └── providers/                  # React Context Providers
│       └── providers.tsx           # QueryClient + ThemeProvider + Toaster
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
│   │   └── database.ts             # Generated TypeScript types (Database, Tables)
│   ├── utils.ts                    # cn(), formatNumber(), formatDate(), slugify(), dll
│   ├── constants.ts                # APP_NAME, TARGETS, ROLES, NAV, dll
│   └── storage.ts                  # File upload utilities (Supabase Storage)
│
├── hooks/                          # Shared React hooks
│   ├── use-counter-animation.ts    # Animated counter with Framer Motion
│   ├── use-debounce.ts             # Debounced value hook
│   └── use-media-query.ts          # Responsive breakpoint detection
│
├── supabase/                       # Database configuration
│   ├── schema.sql                  # Full database schema (13+ tables)
│   ├── policies.sql                # RLS policies
│   ├── seed.sql                    # Seed data script
│   └── migrations/                 # Migration files
│
├── public/
│   └── images/                     # logo-putih.jpeg, logo-hitam.jpeg, logo-persegi.jpeg
│
├── middleware.ts                   # Next.js middleware (auth session refresh)
├── next.config.ts                  # Image remote patterns, server actions config
├── tsconfig.json                   # TypeScript config
├── postcss.config.mjs              # PostCSS config
├── package.json                    # Dependencies
├── .env.local                      # Environment variables (local)
├── .env.example                    # Environment template
└── DOKUMENTASI-PROJECT.md          # Dokumentasi ini
```

---

## 3. Database Schema

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

### Tabel-Tabel

#### `provinces` — 38 Provinsi Indonesia
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| code | VARCHAR(2) UNIQUE | Kode provinsi |
| name | VARCHAR(100) | Nama provinsi |
| capital | VARCHAR(100) | Ibu kota |
| latitude, longitude | DECIMAL | Koordinat geografis |
| total_members | INTEGER | Counter denormalized anggota |
| total_trainers | INTEGER | Counter denormalized trainer |
| total_mentors | INTEGER | Counter denormalized mentor |
| total_events | INTEGER | Counter denormalized event |
| total_innovations | INTEGER | Counter denormalized inovasi |
| created_at | TIMESTAMPTZ | |

#### `regencies` — Kabupaten/Kota
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| province_id | UUID FK → provinces | |
| code | VARCHAR(5) UNIQUE | |
| name | VARCHAR(100) | |
| latitude, longitude | DECIMAL | |
| total_members, total_trainers, total_events, total_innovations | INTEGER | Counter denormalized |
| created_at | TIMESTAMPTZ | |

#### `districts` — Kecamatan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| regency_id | UUID FK → regencies | |
| code | VARCHAR(8) UNIQUE | |
| name | VARCHAR(100) | |
| total_members | INTEGER | Counter denormalized |
| created_at | TIMESTAMPTZ | |

#### `villages` — Desa/Kelurahan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| district_id | UUID FK → districts | |
| code | VARCHAR(13) UNIQUE | |
| name | VARCHAR(100) | |
| created_at | TIMESTAMPTZ | |

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
| member_id | VARCHAR(20) UNIQUE | Format: `PRI-{tahun}-{nomor_urut}` |
| full_name | VARCHAR(200) | |
| email | VARCHAR(255) UNIQUE | |
| phone | VARCHAR(20) | |
| province_id | UUID FK → provinces | |
| regency_id | UUID FK → regencies | |
| district_id | UUID FK → districts | |
| village_id | UUID FK → villages | |
| occupation | VARCHAR(100) | Pekerjaan |
| technology_interest | TEXT[] | Array minat teknologi |
| role_id | UUID FK → roles | |
| status | VARCHAR(20) | `active`, `inactive`, `suspended` |
| photo_url | TEXT | Supabase Storage |
| qr_code | TEXT | Data QR code |
| total_events_attended | INTEGER | Counter |
| total_certificates | INTEGER | Counter |
| created_at, updated_at | TIMESTAMPTZ | |

#### `events` — Event/Kegiatan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| title | VARCHAR(200) | |
| slug | VARCHAR(200) UNIQUE | |
| description | TEXT | |
| category | VARCHAR(50) | `webinar`, `workshop`, `competition`, `exhibition` |
| type | VARCHAR(50) | `online`, `offline`, `hybrid` |
| start_date, end_date | TIMESTAMPTZ | |
| location | TEXT | |
| province_id | UUID FK → provinces | |
| max_participants | INTEGER | |
| banner_url | TEXT | |
| status | VARCHAR(20) | `draft`, `published`, `ongoing`, `completed`, `cancelled` |
| created_by | UUID FK → members | |
| created_at, updated_at | TIMESTAMPTZ | |

#### `event_registrations` — Pendaftaran Event
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| event_id | UUID FK → events | |
| member_id | UUID FK → members | |
| status | VARCHAR(20) | `registered`, `attended`, `cancelled` |
| attended_at | TIMESTAMPTZ | |
| created_at | TIMESTAMPTZ | |
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
| created_at, updated_at | TIMESTAMPTZ | |

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
| created_at | TIMESTAMPTZ | |

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
| created_at, updated_at | TIMESTAMPTZ | |

#### `programs` — Program Unggulan
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID PK | |
| title | VARCHAR(200) | |
| slug | VARCHAR(200) UNIQUE | |
| description, short_description | TEXT | |
| icon | VARCHAR | Nama icon Lucide |
| image_url | TEXT | |
| features | TEXT[] | Fitur-fitur program |
| target_audience | TEXT | |
| status | VARCHAR(20) | |
| label | VARCHAR | `dibuka`, `akan datang`, `ditutup`, `selesai` |
| max_participants | INTEGER | |
| start_date, end_date | TIMESTAMPTZ | |
| location | TEXT | |
| sort_order | INTEGER | Urutan tampilan |
| created_by | UUID FK → members | |
| created_at, updated_at | TIMESTAMPTZ | |

#### Tabel Tambahan (dari fitur yang sudah dikembangkan)

| Tabel | Kegunaan |
|-------|----------|
| `program_registrations` | Pendaftaran program oleh anggota |
| `activity_logs` | Log aktivitas member (audit trail) |
| `contact_messages` | Pesan dari form kontak publik |
| `member_designations` | Designation trainer/mentor per member |
| `member_cards` | Data kartu anggota (nama, foto, tanda tangan, status verifikasi) |
| `news_comments` | Komentar pada berita |
| `hero_gallery` | Gambar slider hero section (judul, deskripsi, link) |
| `activity_gallery` | Gallery kegiatan (foto, kategori) |
| `videos` | Video gallery (URL, poster, sort_order) |

### Indexes

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
idx_news_status, idx_news_published, idx_news_title_search (GIN)

-- Activity Logs
idx_activity_logs_member, idx_activity_logs_created (DESC)

-- Regions
idx_regencies_province, idx_districts_regency, idx_villages_district
```

### Triggers
- `update_updated_at_column()` — auto-update `updated_at` on `members`, `events`, `innovations`, `news`

---

## 4. Authentication & Authorization

### Auth Flow

```
Browser → [Login/Register Form] → Supabase Auth → Session Cookie
    ↓                                                      ↑
Next.js Middleware (every request) ────────────────────────┘
    ↓
Protected Route (dashboard, admin, command-center)
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
   - Validasi form (nama, email, password, wilayah, minat teknologi) dengan Zod
   - `supabase.auth.signUp()` — create auth user
   - Generate `member_id` format `PRI-{tahun}-{nomor_urut}` (via admin client)
   - Insert profile ke tabel `members` (via admin client — bypass RLS)
   - Return `memberId` untuk ditampilkan ke user

3. **Session Management**:
   - `middleware.ts` → panggil `updateSession()` dari `lib/supabase/middleware.ts`
   - Refresh session cookie di setiap request
   - Matcher: exclude static assets (_next/static, images, favicon)

4. **Role Checking** (`features/auth/actions.ts` — `getCurrentUserRole()`):
   - 2-step lookup: by `auth_id` → fallback by `email`
   - Return role name untuk redirect decision

### Role-Based Access Control (RBAC)

| Role | Akses | Redirect Login |
|------|-------|----------------|
| **Guest** | Halaman public only | — |
| **Member** | Dashboard, membership, profile, events, innovations, national map, academy | `/dashboard` |
| **Admin** | Admin panel: member management, events, certificates, news, innovations, programs, galleries, monitoring | `/admin` |
| **Super Admin** | Full access + role management, super admin panel, system settings | `/admin` |

### Row Level Security (RLS) — `supabase/policies.sql`

Helper functions:
- `get_current_member_role()` — get role dari member yg sedang login
- `is_admin_or_super()` — cek apakah admin atau super_admin

**RLS per tabel:**

| Tabel | Public | Member | Admin | Super Admin |
|-------|--------|--------|-------|-------------|
| `members` | Read (active) | Read own, Update own | Read all, Update all | Read all, Update all, Delete |
| `events` | Read (published) | Read all | Insert, Update | Insert, Update |
| `event_registrations` | — | Read own, Insert own | — | — |
| `innovations` | Read (published/featured) | Read all, Insert own, Update own | Moderate (Update) | Moderate |
| `certificates` | Read all (verifikasi) | — | — | — |
| `news` | Read (published) | — | All CRUD | All CRUD |
| `provinces/regencies/districts/villages` | Read all | Read all | Read all | Read all |
| `activity_logs` | — | Read own | Read all | Read all |

---

## 5. Sistem Flow

### 5.1 Alur Registrasi Anggota Baru

```
User → /register → [RegionSelect] pilih provinsi → kabupaten → kecamatan → desa
                 → [TechInterestSelect] pilih minat teknologi
                 → Submit form (Zod validation)

register() Server Action:
  → createClient().auth.signUp(email, password)
  → createAdminClient().roles.select("member")
  → generateMemberId(tahun, count + 1)
  → createAdminClient().members.insert({ profile data })
  → Return success + memberId

User → Redirect ke /login
```

### 5.2 Alur Login

```
User → /login → Input email + password

login() Server Action:
  → Zod validation (email, password)
  → supabase.auth.signInWithPassword()
  → Query member role
  → Redirect: admin → /admin, member → /dashboard
```

### 5.3 Alur Read Data (Server Component)

```
Browser Request
  → Next.js Middleware (refresh session)
    → Server Component (RSC) — default untuk semua halaman
      → createClient() (server) → Supabase DB (RLS enforced)
        → Render HTML (data langsung di server)

Untuk halaman interaktif:
  → Client Component → createClient() (browser) → Supabase DB
    → TanStack Query cache (jika digunakan)
```

### 5.4 Alur Write Data (Server Action)

```
User Action (form submit / button click)
  → Server Action ("use server")
    → Zod Validation
      → createClient() (server) / createAdminClient()
        → INSERT / UPDATE / DELETE (RLS enforced)
          → revalidatePath() → Next.js cache refresh
            → Response ({ success: true } or { error: message })
              → Client: toast notification + router.refresh()
```

### 5.5 Alur National Command Center (Drill-Down)

```
/command-center
  → getCommandCenterStats() — total KPI
  → getProvinceStats() — data per provinsi (real count from members table)
  → [RealtimeDashboard] → [MonitoringDashboard]
    → [KpiCards] — 9 KPI cards (animated counters)
    → [TargetProgress] — 3 target progress bar (10k members, 500 trainers, 200 mentors)
    → [IndonesiaMap] — Leaflet interactive map
      → Klik provinsi → [ProvinceDetailPanel] — stats + daftar kabupaten
        → Klik kabupaten → [RegencyDetailPanel] — stats + daftar kecamatan
          → Klik kecamatan → [DistrictDetailPanel] — stats + daftar desa
    → [GrowthAreaChart] + [GrowthBarChart] — Recharts
    → [TechDistributionChart] — distribusi minat teknologi
    → [ProvinceCsvExport] — export data ke CSV
```

### 5.6 Alur Event Registration

```
/events → Browse events (filter by category, type, status)
  → Klik event → /events/[slug]
    → [EventRegistrationButton]
      → If not logged in: "Login untuk Mendaftar"
      → If registered: "Terdaftar" + "Batalkan Pendaftaran"
      → If not registered: "Daftar Event Ini"
        → registerForEvent(eventId) Server Action
          → Cek login
          → Dapatkan member ID dari auth user
          → Cek existing registration
          → INSERT event_registrations
          → revalidatePath
```

### 5.7 Alur Program Registration (via Member ID — No Login Required)

```
/programs/[slug]
  → [RegistrationModal] — "Daftar menggunakan Member ID"
    → Input: Member ID + Nama Lengkap
      → lookupMemberByMemberId() — verifikasi data
        → registerProgramByMemberId() — INSERT program_registrations (admin client)
          → Status: "Menunggu verifikasi admin"
```

### 5.8 Alur Member Card Registration

```
/my-member-card
  → [MemberRegistrationForm] — form lengkap:
    → Data Pribadi (nama, nickname, NIK, NPWP, agama, dll)
    → Kontak & Alamat
    → Pendidikan & Pekerjaan
    → Minat & Keahlian (multi-select chips)
    → Pengalaman & Motivasi
    → Foto Profil (upload)
    → Tanda Tangan Digital (signature_pad canvas)
    → Submit → submitMemberCard() Server Action
      → Upload photo & signature ke Supabase Storage
      → INSERT / UPDATE member_cards (status: "pending")
      → Admin verifikasi di /admin/member-verification
```

---

## 6. Route Groups & Halaman

### Public Routes `/(public)` — No Auth Required

| Route | File | Halaman | Deskripsi |
|-------|------|---------|-----------|
| `/` | `page.tsx` | Home | Hero gallery slider, featured news, trust bar, tentang, dampak nasional (animated stats), 6 program unggulan, video showcase, events terbaru, innovations, news, CTA |
| `/about` | `about/page.tsx` | About PRO RI | Visi, misi, struktur organisasi |
| `/programs` | `programs/page.tsx` | Programs | 6 program unggulan dengan cards + filter |
| `/programs/[slug]` | `programs/[slug]/page.tsx` | Program Detail | Detail program + fitur + target audiens + tombol daftar |
| `/news` | `news/page.tsx` | News | Daftar berita dengan pagination + filter kategori |
| `/news/[slug]` | `news/[slug]/page.tsx` | News Detail | Artikel markdown + komentar + related news |
| `/events` | `events/page.tsx` | Events | Daftar event dengan filter category, type, status |
| `/events/[slug]` | `events/[slug]/page.tsx` | Event Detail | Detail event + banner + lokasi + tombol daftar |
| `/innovations` | `innovations/page.tsx` | Innovations | Gallery inovasi dengan filter kategori |
| `/innovations/[slug]` | `innovations/[slug]/page.tsx` | Innovation Detail | Detail inovasi + creator + provinsi |
| `/register` | `register/page.tsx` | Register | Form pendaftaran anggota (region cascade + tech interest) |
| `/login` | `login/page.tsx` | Login | Form login email/password |
| `/gallery` | `gallery/page.tsx` | Gallery | Gallery kegiatan (filter by kategori, lightbox) |
| `/pengurus` | `pengurus/page.tsx` | Pengurus | Struktur kepengurusan PRO RI |
| `/kontak` | `kontak/page.tsx` | Kontak | Form kontak + peta lokasi |
| `/national-map` | `national-map/page.tsx` | National Map | Peta interaktif Indonesia (Leaflet) |
| `/verify/[memberNumber]` | `verify/[memberNumber]/page.tsx` | Verify Member | Verifikasi anggota via nomor kartu |
| `/verify/certificate/[id]` | `verify/certificate/[id]/page.tsx` | Verify Certificate | Verifikasi sertifikat via QR code |

### Dashboard Routes `/(dashboard)` — Member Auth Required

| Route | File | Halaman | Deskripsi |
|-------|------|---------|-----------|
| `/dashboard` | `dashboard/page.tsx` | Dashboard | 7 KPI cards + 3 target nasional progress bar, real-time updates via Supabase Realtime |
| `/membership` | `membership/page.tsx` | Membership | Digital member card dengan QR code |
| `/membership/certificates` | `membership/certificates/page.tsx` | My Certificates | Daftar sertifikat yang dimiliki |
| `/membership/certificates/[id]` | `membership/certificates/[id]/page.tsx` | Certificate Preview | Preview + download PDF sertifikat |
| `/my-member-card` | `my-member-card/page.tsx` | My Member Card | Form registrasi/pengajuan kartu anggota (data pribadi, foto, tanda tangan) |
| `/members` | `members/page.tsx` | Member Directory | Direktori anggota dengan search |
| `/national-map` | `dashboard/national-map/page.tsx` | National Map | Peta interaktif full version |
| `/dashboard/events` | `dashboard/events/page.tsx` | My Events | Event yang diikuti (client-side filter) |
| `/dashboard/innovations` | `dashboard/innovations/page.tsx` | My Innovations | Inovasi milik sendiri (client-side filter) |
| `/dashboard/innovations/new` | `dashboard/innovations/new/page.tsx` | Submit Innovation | Form submit inovasi baru |
| `/dashboard/programs` | `dashboard/programs/page.tsx` | My Programs | Program yang diikuti (client-side filter) |
| `/profile` | `profile/page.tsx` | Profile | Edit profil (form dengan React Hook Form) |
| `/academy` | `academy/page.tsx` | Academy | Redirect ke LMS eksternal (academy.prori.id) |

### Admin Routes `/(admin)` — Admin/Super Admin Auth Required

| Route | File | Halaman | Deskripsi |
|-------|------|---------|-----------|
| `/admin` | `admin/page.tsx` | Admin Dashboard | Overview admin |
| `/admin/members` | `admin/members/page.tsx` | Members | Tabel anggota (search, filter status, sort) |
| `/admin/members/[id]` | `admin/members/[id]/page.tsx` | Member Detail | Detail + edit member, designation (trainer/mentor), role |
| `/admin/events` | `admin/events/page.tsx` | Events | Manajemen event CRUD |
| `/admin/news` | `admin/news/page.tsx` | News | Manajemen berita dengan markdown editor |
| `/admin/innovations` | `admin/innovations/page.tsx` | Innovations | Moderasi inovasi (publish, feature, archive) |
| `/admin/certificates` | `admin/certificates/page.tsx` | Certificates | Manajemen sertifikat CRUD |
| `/admin/programs` | `admin/programs/page.tsx` | Programs | Manajemen program unggulan CRUD |
| `/admin/gallery` | `admin/gallery/page.tsx` | Hero Gallery | Manajemen gambar slider hero section |
| `/admin/gallery-kegiatan` | `admin/gallery-kegiatan/page.tsx` | Activity Gallery | Manajemen foto kegiatan |
| `/admin/videos` | `admin/videos/page.tsx` | Videos | Manajemen video gallery |
| `/admin/roles` | `admin/roles/page.tsx` | Roles | Manajemen role (super admin only) |
| `/admin/super-admin` | `admin/super-admin/page.tsx` | Super Admin | Panel khusus super admin |
| `/admin/messages` | `admin/messages/page.tsx` | Messages | Inbox pesan kontak masuk |
| `/admin/monitoring` | `admin/monitoring/page.tsx` | Monitoring | National monitoring dashboard (full version dengan real-time) |
| `/admin/verification` | `admin/verification/page.tsx` | Verification | Verifikasi pendaftaran event & program (pending list) |
| `/admin/member-verification` | `admin/member-verification/page.tsx` | Member Verification | Verifikasi kartu anggota (approve/reject) |
| `/admin/activity` | `admin/activity/page.tsx` | Activity Logs | Log aktivitas sistem |
| `/admin/settings` | `admin/settings/page.tsx` | Settings | Pengaturan aplikasi |

---

## 7. Fitur-Fitur (Detail)

### 7.1 Public Portal

#### Hero Section (`app\(public)\page.tsx` + `components/features/home/hero-gallery.tsx`)
- **Dynamic Gallery Slider**: Slideshow dari tabel `hero_gallery` (admin-managed)
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

#### Featured News Bar
- Horizontal scroll news items from `is_featured` news
- Glass card dengan kategori + tanggal

#### Trust Bar (3 Key Stats)
- 38 Provinsi Tersebar, 6 Program Unggulan, 2026 Tahun Berdiri

#### Sekilas PRO RI Section
- Deskripsi organisasi
- Floating particles animation (8 particle)
- CTA ke halaman about

#### National Impact Stats (`components/features/home/animated-stats.tsx`)
- 6 KPI cards: Anggota, Trainers, Provinsi, Kab/Kota, Events, Inovasi
- **Framer Motion**: Stagger children + fade-in animation
- **Progress bar**: Setiap card punya progress terhadap target (misal: target 10.000 anggota)
- **AnimatedCard, AnimatedSection, AnimatedTitle**: Reusable scroll-reveal components

#### 6 Program Unggulan Cards
- Data statis di page.tsx (6 program):
  1. **Sekolah Robotika Rakyat** — Pendidikan robotika berbasis komunitas
  2. **Robotika Masuk Sekolah** — Integrasi kurikulum robotika SD-SMA
  3. **Akademi AI** — Pelatihan intensif AI/ML/CV
  4. **Kompetisi Robotika Nasional** — Ajang tahunan
  5. **Inkubator Inovasi Teknologi** — Inkubasi startup
  6. **Robotika untuk UMKM** — Otomatisasi UMKM
- Glass card dengan icon + deskripsi + target audience

#### Video Showcase (`components/features/video/video-grid.tsx`)
- Grid video dari tabel `videos` (admin-managed via YouTube URL)
- **VideoWithFallback**: Jika embed gagal, tampilkan fallback UI

#### Latest Events Section
- 4 event cards terbaru dari database (status "published")
- AnimatedCard stagger

#### Latest Innovations Section
- 3 innovation cards terbaru (status "published" atau "featured")
- Dengan kategori + tahun

#### Latest News Section
- 3 news cards dengan image + kategori + tanggal
- Hover effect: scale image

#### CTA Section
- "Indonesia Emas 2045 Dimulai dari Sekarang"
- Orbit ring decorations
- CTA button: "Daftar Anggota Sekarang"

#### ISR (Incremental Static Regeneration)
- `export const revalidate = 60` — homepage di-revalidate setiap 60 detik

### 7.2 Membership System

#### Member Registration (`app\(public)\register\page.tsx`)
- **RegionSelect** (`components/features/register/region-select.tsx`):
  - 4-level cascade select: Provinsi → Kabupaten/Kota → Kecamatan → Desa
  - Data di-fetch dari Supabase secara real-time
  - Loading states per level
  - Semua field required kecuali Village (opsional)
- **TechInterestSelect** (`components/features/register/tech-interest-select.tsx`):
  - 12 pilihan minat teknologi (chip-style toggle)
  - Multi-select dengan visual feedback
  - Robotika, AI/ML, IoT, Programming, Computer Vision, Embedded System, Drone, 3D Printing, Cybersecurity, Cloud Computing, Data Analytics, dll
- Validasi Zod: nama min 3 karakter, password min 6, phone min 10 digit, region wajib
- Generate `member_id` format `PRI-{tahun}-{nomor_urut}`

#### Digital Member Card (`components/features/membership/digital-member-card.tsx`)
- Tampilan kartu dengan glass-morphism effect
- **QR Code** (qrcode.react): Link verifikasi ke `/verify/{member_id}`
- Header merah gradien PRO RI
- Info: Member ID, Nama Lengkap, Status, Provinsi
- QR code warna merah (#E31E24) dengan background transparan
- Bottom strip: instruksi verifikasi

#### Member Card View & Print (`components/features/membership/member-card-view.tsx`)
- **Preview Card**: Landscape card dengan tema robotik
  - Circuit pattern background (SVG)
  - Tech corner brackets
  - Red gradient header dengan tech line overlay
  - Foto profil + QR code + Signature
  - Data pribadi: nama, nickname, alamat, status, bidang minat (tech tags)
  - Tech specs bar: ID, version, verified status
- **Actions**:
  - **Download PDF**: html2canvas capture → jsPDF generate
  - **Print**: Clone DOM + inject styles → print window
  - **Copy Link**: Copy verification URL to clipboard
- **Robotik Decorative SVG Elements**:
  - Circuit trace lines dengan nodes
  - Hex dot tech pattern (right column)
  - Vertical circuit track (left side)
  - Bottom scanline glow

#### Member Registration Form (`components/features/membership/member-registration-form.tsx`)
- **8 Sections** dalam form:
  1. **Data Pribadi**: Nama lengkap, nickname, jumlah keluarga, gender, tempat/tanggal lahir, agama, NIK, NPWP
  2. **Kontak & Alamat**: No telepon, email (read-only dari auth), alamat lengkap, kode pos
  3. **Pendidikan & Pekerjaan**: Pendidikan terakhir, pekerjaan
  4. **Minat & Keahlian**: 10 interest options + 13 skill options (multi-select chips)
  5. **Pengalaman & Motivasi**: Textarea
  6. **Foto Profil**: Upload file (JPG/PNG, max 5MB) + preview
  7. **Tanda Tangan Digital**: Canvas signature_pad (simpan/clear)
  8. **Submit**: Kirim untuk verifikasi admin
- **Status-aware**: Menampilkan banner berbeda berdasarkan status (pending, approved, rejected)

#### Member Directory (`app\(dashboard)\members\member-directory-client.tsx`)
- Search-based member lookup (client-side)
- Display member info cards

### 7.3 National Command Center

#### Command Center Dashboard (`app\(admin)\admin\monitoring\page.tsx`)
- **RealtimeDashboard** (`components/features/command-center/realtime-dashboard.tsx`):
  - **Real-time connection**: Supabase Realtime subscription ke tabel `members`, `events`, `member_designations`
  - **Polling fallback**: Interval configurable (default 30 detik)
  - **Status bar**: Connected/disconnected indicator, last update time, manual refresh button
  - **Settings**: Interval dapat diubah via localStorage
  - Auto-refresh setiap interval sebagai safety net

#### Monitoring Dashboard (`components/features/command-center/monitoring-dashboard.tsx`)
Komponen utama yang menyusun seluruh halaman monitoring:

1. **Header**: "National Command Center" dengan circuit border + pulse ring + status LIVE dot

2. **KPI Cards** (`components/features/command-center/kpi-tracker.tsx` — `KpiCards`):
   - 9 KPI cards dalam grid (2-3-5 responsive):
     - Total Members, Anggota Aktif, Trainer, Mentor, Events, Inovasi, Berita, Sertifikat, Provinsi
   - Masing-masing: icon berwarna + animated counter value + label
   - Glass-tech card dengan corner brackets
   - Data-pulse ring effect

3. **Target Nasional** (`components/features/command-center/kpi-tracker.tsx` — `TargetProgress`):
   - 3 target bars:
     - Target 10.000 Anggota
     - Target 500 Trainer
     - Target 200 Mentor
   - Animated progress bars dengan gradient red + shimmer effect

4. **Peta Sebaran**:
   - **IndonesiaMap** (`components/features/command-center/indonesia-map.tsx`):
     - Dynamic import (no SSR) — Leaflet map
     - Loading skeleton dengan spinner
   - **MapView** (`components/features/command-center/map-view.tsx`):
     - Marker per provinsi berdasarkan koordinat
     - Popup dengan stats anggota
     - Selected province highlighting
     - Click handler untuk drill-down
   - **Side Panel** (tampil berdasarkan drill level):
     - **Top 15 Provinsi List**: Rank 1-3 dengan badge emas/perak/perunggu, progress bar, live dot, count kab/kec/desa aktif
     - **ProvinceDetailPanel**: Stats card (4) + daftar kab/kota (sorted by members) + click to drill
     - **RegencyDetailPanel**: Stats card (2) + daftar kecamatan (sorted by members) + progress bar
     - **DistrictDetailPanel**: Stats card (2) + daftar desa/kelurahan + member count + mini bar

5. **Charts** (`components/features/command-center/growth-chart.tsx`):
   - **GrowthBarChart**: Bar chart anggota baru per bulan (Recharts)
     - Warna merah (#E31E24), rounded top radius
   - **GrowthAreaChart**: Area chart kumulatif + anggota baru
     - Dual area: merah (anggota baru) + biru (kumulatif)
     - Gradient fill
     - Custom tooltip dengan glass style

6. **Tech Distribution**:
   - **TechDistributionChart**: Horizontal bar chart (Recharts) — top 10 minat teknologi
   - **List View**: Progress bars untuk top 10 minat

7. **CSV Export**: `ProvinceCsvExport` — download data provinsi dalam format CSV

8. **Footer**: Real-time status badge + timestamp

### 7.4 Event Center

#### Event Listing (`app\(public)\events\page.tsx`)
- Filter by category (webinar, workshop, competition, exhibition)
- Filter by type (online, offline, hybrid)
- Event cards dengan info category, title, date

#### Event Detail (`app\(public)\events\[slug]\page.tsx`)
- Banner image, title, description, date, location
- Province info (relational)
- **EventRegistrationButton** (`components/features/events/event-registration.tsx`):
  - 3 states: login required → registered + cancel → not registered + daftar
  - Loading + error states dengan toast notification
  - Alert confirm untuk cancel

#### Admin Event Management (`features/admin/actions.ts`):
- `createEvent(formData)`: Insert + upload banner image
- `updateEvent(id, formData)`: Update + optional image upload
- `deleteEvent(id)`: Delete + revalidate

### 7.5 Innovation Center

#### Innovation Gallery (`app\(public)\innovations\page.tsx`)
- Grid cards with filter by category
- Show creator name + province + year

#### Innovation Detail (`app\(public)\innovations\[slug]\page.tsx`)
- Full description, image, creator, province info
- Category badge + year

#### Innovation Submission (`app\(dashboard)\dashboard\innovations\new\page.tsx`)
- Form untuk member submit inovasi baru
- Categories: robotics, AI, IoT, programming, research

#### Admin Moderation (`features/admin/actions.ts`):
- `createInnovation(formData)` — create
- `updateInnovation(id, formData)` — update status (publish/feature/archive)
- `deleteInnovation(id)` — delete

### 7.6 Certificate System

#### Certificate Preview (`components/features/certificate/certificate-pdf.tsx`)
- **CertificatePrintView**: Tampilan sertifikat dalam dark theme:
  - Gradient background (#0F1117 → #1B1F2A)
  - Red border + top accent gradient
  - Decorative circles
  - Logo PRO RI (circular with glow)
  - Judul "Sertifikat {type}"
  - Nama penerima (large text)
  - Deskripsi partisipasi
  - Detail: nomor sertifikat, member ID, tanggal
  - Verification badge (terverifikasi/belum)
- **Download PDF**: html2canvas (scale 3) → jsPDF landscape export
- **Types**: participant, trainer, mentor, winner

#### Certificate Verification (`app\(public)\verify\certificate\[id]\page.tsx`)
- Public page untuk verifikasi sertifikat via QR code
- Menampilkan status validasi sertifikat

### 7.7 News System

#### News Listing (`app\(public)\news\page.tsx`)
- **getPublicNewsPaginated()**: Pagination dengan page/pageSize
- Filter by category (article, announcement, press_release)
- News cards dengan image, category, date, title, excerpt

#### News Detail (`app\(public)\news\[slug]\page.tsx`)
- **MarkdownContent** (`components/features/news/markdown-content.tsx`):
  - ReactMarkdown renderer dengan custom styling
  - Styled headings (h1-h3), paragraphs, links (red + underline)
  - Lists, code blocks, blockquotes, inline code, horizontal rules
  - Dark theme (prose-invert)
- **NewsComments** (`components/features/news/news-comments.tsx`):
  - Form submit comment (name, email, content)
  - List comments (auto-approve)
  - `submitComment()` Server Action
- **Related News**: sidebar dengan news kategori sama
- **Most Read News**: based on `view_count`
- **Copy Link Button**: copy URL to clipboard

#### Admin News Management (`features/admin/actions.ts`):
- `createNews(formData)`: Insert + upload image (dengan rollback jika gagal)
- `updateNews(id, formData)`: Update + optional image
- `deleteNews(id)`: Delete

### 7.8 Program Unggulan

PRO RI memiliki 6 program unggulan yang dikelola via admin:

1. **Sekolah Robotika Rakyat** — Pendidikan robotika berbasis komunitas
2. **Robotika Masuk Sekolah** — Integrasi kurikulum robotika SD-SMA
3. **Akademi AI** — Pelatihan AI: machine learning, computer vision, robotics integration
4. **Kompetisi Robotika Nasional** — Ajang tahunan berbagai kategori
5. **Inkubator Inovasi Teknologi** — Inkubasi startup dengan mentoring
6. **Robotika untuk UMKM** — Otomatisasi untuk produktivitas UMKM

#### Program Detail (`app\(public)\programs\[slug]\page.tsx`)
- Full description, short description, features list
- Target audience, icon, image
- Label status (dibuka / akan datang / ditutup / selesai)
- **ProgramRegistrationButton** — untuk member yang sudah login
- **RegistrationModal** (`components/features/registration-modal.tsx`) — untuk non-login via Member ID:
  - 4-step flow: Form → Verifying → Confirm → Done
  - Input Member ID + Nama Lengkap
  - Verifikasi data dengan `lookupMemberByMemberId()`
  - Konfirmasi pendaftaran
  - Success screen dengan ringkasan data
  - Animasi loading dengan spinner

#### Program Registration via Member ID (`features/registration-actions.ts`):
- `lookupMemberByMemberId(memberId)`: Cari member + validasi status active
- `registerProgramByMemberId(programId, memberId, fullName)`: Daftar program tanpa login
  - Validasi nama cocok (case-insensitive)
  - Cek duplikasi pendaftaran
  - INSERT via admin client (bypass RLS)

### 7.9 Admin System

#### Member Management (`app\(admin)\admin\members\`)
- **Data Table** (`members-table.tsx`): Search, filter by status, sortable columns
- **Member Actions** (`member-actions.tsx`): Update status, delete, role
- **Designation Manager** (`designation-manager.tsx`): Set trainer/mentor designation
- **Detail Page** (`[id]/page.tsx`): Full profile view + edit

#### Event Management (`app\(admin)\admin\events\`)
- **Events Manager** (`events-manager.tsx`): CRUD table + form dialog
- Form fields: title, description, category, type, date range, location, province, max participants, banner upload, status

#### News Management (`app\(admin)\admin\news\`)
- **News Manager** (`news-manager.tsx`): CRUD table + form dialog
- **Markdown Editor**: `@uiw/react-md-editor` untuk konten
- Featured toggle, category select, status (draft/published)

#### Innovation Management (`app\(admin)\admin\innovations\`)
- **Innovations Manager** (`innovations-manager.tsx`): Table + CRUD
- Moderation: publish, feature, archive

#### Certificate Management (`app\(admin)\admin\certificates\`)
- **Certificates Manager** (`certificates-manager.tsx`): Table + CRUD
- Form: member selection, type, title, verification status

#### Gallery Management
- **Hero Gallery** (`gallery-manager.tsx`): CRUD gambar slider hero
  - Title, description, link URL, sort order, active toggle
  - Upload image atau URL eksternal
- **Activity Gallery** (`gallery-kegiatan/page.tsx`): CRUD foto kegiatan
  - Title, description, category, date taken, sort order

#### Video Management (`app\(admin)\admin\videos\`)
- **Video Manager** (`video-manager.tsx`): CRUD video
  - Title, description, video URL, poster URL, sort order, active toggle

#### Role Management (`app\(admin)\admin\roles\`) — Super Admin Only
- **Role Manager** (`role-manager.tsx`): List all members + role assignment
- Proteksi: tidak bisa mengubah role super_admin terakhir
- Activity logging untuk setiap perubahan role

#### Contact Messages (`app\(admin)\admin\messages\`)
- **Messages Manager** (`messages-manager.tsx`): Inbox pesan kontak
  - Mark as read/unread
  - Delete message

#### Verification Center (`app\(admin)\admin\verification\`)
- **Verification Client** (`verification-client.tsx`): Two tabs:
  - **Program Registrations**: Pending registrations list
  - **Event Registrations**: Pending registrations list
- Actions: Approve/Reject dengan notes

#### Member Card Verification (`app\(admin)\admin\member-verification\`)
- **Verification Manager** (`verification-manager.tsx`):
  - Pending cards list dengan data lengkap
  - Approve → generate member number (via `generate_member_number` RPC)
  - Reject → with rejection reason

#### Activity Logs (`app\(admin)\admin\activity\`)
- Display all activity_logs entries
- Filterable by action type, entity type

### 7.10 Dashboard Member

#### Dashboard Home (`app\(dashboard)\dashboard\page.tsx`)
- **Real-time KPI Dashboard**:
  - 7 KPI cards: Total Members, Anggota Aktif, Trainers, Mentors, Events, Inovasi, Provinsi
  - Target progress bars (10k members, 500 trainers, 200 mentors)
  - Animated counter values (useCounterAnimation hook)
- **Supabase Realtime Subscription**: Auto-refresh ketika tabel members berubah
- **Tech Background**: Grid pattern, circuit pattern, scan overlay, floating particles, hexagons, gears, orbit rings

### 7.11 Contact System

#### Contact Form (`app\(public)\kontak\page.tsx`)
- Input: name, email, phone, message
- **submitContactMessage()** Server Action: INSERT ke `contact_messages`
- Validasi: name, email, message required

#### Admin Messages (`app\(admin)\admin\messages\`)
- Inbox untuk melihat pesan masuk
- Mark as read/unread
- Delete message

### 7.12 Verification System

#### Member Verification (Public — `/verify/[memberNumber]`)
- **verifyMemberByNumber()**: Cari member_cards by member_number + status approved
- Tampilkan info: nama, member number, status, occupation

#### Certificate Verification (Public — `/verify/certificate/[id]`)
- Verify sertifikat by ID
- Tampilkan status verified/unverified

### 7.13 Academy Gateway

#### Academy Page (`app\(dashboard)\academy\page.tsx`)
- Redirect ke LMS eksternal: `https://academy.prori.id`
- Informasi tentang program akademi PRO RI

### 7.14 Profile Settings

#### Profile Page (`app\(dashboard)\profile\`)
- **Profile Form** (`profile-form.tsx`): Edit data profil member
  - React Hook Form + Zod validation
  - Fields: full_name, phone, occupation, technology_interest, photo upload
- **uploadProfilePhoto()**: Upload foto ke Supabase Storage

---

## 8. Komponen Arsitektur

### Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── Providers (QueryClient + ThemeProvider + Toaster)
│   └── <body> dengan Inter + JetBrains Mono font
│
├── [PublicLayout] (/components/layouts/public-layout.tsx)
│   ├── PublicNavbar — transparent → solid on scroll, link navigasi, theme toggle
│   ├── Page Content (children)
│   └── PublicFooter — logo, menu, sosial media, copyright
│
├── [DashboardLayout] (/components/layouts/dashboard-layout.tsx)
│   ├── DashboardSidebar — nav items: Dashboard, Membership, Peta, Direktori, Events, Inovasi, Akademi, Profil
│   ├── TopBar — user menu, notifications, logout
│   └── Main Content Area
│
├── [AdminLayout] (/components/layouts/admin-layout.tsx)
│   ├── AdminSidebar — nav items: Dashboard, Members, Programs, Events, Inovasi, Sertifikat, Berita, Monitoring
│   ├── TopBar — user info, role badge
│   └── Admin Content
│
└── [SuperAdminLayout] (/components/layouts/super-admin-layout.tsx)
    └── Extended admin content
```

### UI Components (Shadcn/UI — `/components/ui/`)
| Komponen | Source | Kustomisasi |
|----------|--------|-------------|
| Button | shadcn/ui | Variant: default, outline, ghost, destructive, link |
| Card | shadcn/ui | Card, CardHeader, CardTitle, CardContent |
| Input | shadcn/ui | Default styling |
| Select | shadcn/ui | SelectTrigger, SelectContent, SelectItem |
| Textarea | shadcn/ui | Default styling |
| Badge | shadcn/ui | Variant: default, success, warning, outline |
| Avatar | shadcn/ui | Avatar, AvatarImage, AvatarFallback |
| Dialog | shadcn/ui | Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription |
| Separator | shadcn/ui | Horizontal/Vertical |
| Label | shadcn/ui | Default styling |
| Sonner (Toaster) | shadcn/ui | Toast notifications |
| ThemeToggle | Custom | Dark/Light mode toggle |
| DataTable | Custom | Sortable, filterable table |

---

## 9. State Management

| State Type | Solution | Implementasi |
|------------|----------|--------------|
| **Server state** | RSC (React Server Components) + Server Actions | Data fetching langsung di server component |
| **URL state** | Next.js searchParams, path params | Filter/lists via URL |
| **Auth state** | Supabase session + cookie | HTTP-only cookies, middleware refresh |
| **UI state** | Local React useState | Form, modals, toggles |
| **Form state** | React Hook Form + Zod | Registration, profile edit, admin forms |
| **Cache** | Next.js revalidatePath() + TanStack Query | Cache invalidation after mutations |
| **Real-time** | Supabase Realtime subscriptions | Dashboard, monitoring (live updates) |

---

## 10. Server Actions

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
| `updateMemberStatus(id, status)` | Update status member (active/inactive/suspended) |
| `deleteMember(id)` | Hapus member + auth user (admin client) |
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
| `updateEventRegistrationStatus(id, status)` | Admin update status registrasi |
| `getEventRegistrations(eventId)` | Get daftar peserta |
| `getPendingVerificationCount()` | Hitung pending verifikasi (program + event + card) |
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
| `cancelProgramRegistration(programId)` | Batalkan pendaftaran program |
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

### Videos (`features/admin/video-actions.ts`)
| Action | Fungsi |
|--------|--------|
| `createVideo(formData)` | Tambah video |
| `updateVideo(id, formData)` | Update video |
| `deleteVideo(id)` | Hapus video |

### Storage (`features/admin/storage.ts`)
| Action | Fungsi |
|--------|--------|
| `uploadNewsImage(file, prefix)` | Upload gambar ke storage |
| `deleteNewsImage(publicUrl)` | Hapus gambar dari storage |
| `uploadSignature(file, prefix)` | Upload signature/tanda tangan |

### Public Data Queries (`features/public/data.ts`)
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

---

## 11. Hooks

### `useCounterAnimation` (`hooks/use-counter-animation.ts`)
- Animated counter menggunakan Framer Motion `useMotionValue` + `useSpring`
- Configurable: `end` value, `duration`, `enabled`
- Smooth counting animation untuk KPI values

### `useDebounce` (`hooks/use-debounce.ts`)
- Generic debounce hook
- Return debounced value setelah delay tertentu
- Digunakan untuk search input

### `useMediaQuery` (`hooks/use-media-query.ts`)
- Detect responsive breakpoints
- Return boolean berdasarkan media query string

---

## 12. Design System & Animations

### Color System (`app/globals.css`)

**CSS Custom Properties (Dark Mode Default):**
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
- Glass: subtle dark overlay on white

### Glass Effects
| Class | Efek |
|-------|------|
| `.glass` | Background blur + border transparan |
| `.glass-card` | Glass + rounded + shadow |
| `.glass-card-hover` | Glass + hover lift + glow merah |
| `.glass-tech` | Enhanced glass dengan animated border gradient |

### Animasi Kustom

| Class | Animasi | Deskripsi |
|-------|---------|-----------|
| `.hero-hexagon` | `hexagonFloat` | Hexagon mengambang + rotasi (3 varian) |
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
- CSS Variables: `--font-sans`, `--font-mono`

### Leaflet Theming
Theme-aware Leaflet map styling:
- Dark mode: dark background, dark popup
- Light mode: light background, white popup
- CSS custom properties untuk colors

---

## 13. Security

### Authentication
- Supabase Auth dengan email/password
- Session HTTP-only cookies, auto-refresh via middleware
- Password minimum 6 karakter (Zod validation)

### Authorization
- **RLS** (Row Level Security) di semua tabel — lihat section 4
- **Role checking** di server actions via `getCurrentUserRole()`
- **Admin client** (service_role key) hanya digunakan untuk:
  - Bypass RLS saat register (user belum authenticated)
  - Super admin role changes
  - Delete member (auth.admin.deleteUser)
  - Public verifications
- **Server-side validation**: Semua mutations divalidasi dengan Zod
- **Admin action protection**: `updateMemberRole()` memverifikasi caller benar-benar super_admin

### Data Protection
- SQL injection prevention (Supabase parameterized queries)
- XSS prevention (React's built-in escaping)
- Zod input validation on all forms
- File upload: type validation (JPG/PNG), size limits (5MB photo, 2MB server actions)

### Rate Limiting
- Belum diimplementasikan (perlu Supabase RLS atau reverse proxy)

---

## 14. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=           # https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # anon key (public)
SUPABASE_SERVICE_ROLE_KEY=          # service_role key (server-only)

# App
NEXT_PUBLIC_APP_URL=                # http://localhost:3000
NEXT_PUBLIC_APP_NAME=               # PRO RI Digital Command Center

# Academy (redirect)
NEXT_PUBLIC_ACADEMY_URL=            # https://academy.prori.id

# Cloudflare R2 (optional file storage)
R2_ACCOUNT_ID=                      # Cloudflare account ID
R2_ACCESS_KEY_ID=                   # R2 API token access key
R2_SECRET_ACCESS_KEY=               # R2 API token secret
R2_BUCKET_NAME=                     # R2 bucket name
R2_PUBLIC_DOMAIN=                   # R2 custom domain
```

---

## Catatan Pengembangan

| Aspek | Status |
|-------|--------|
| **Tahap** | Active development (pre-release) |
| **Testing** | Belum ada test files |
| **CI/CD** | Belum ada pipeline |
| **Docker** | Belum ada containerization |
| **Deployment** | VPS Self-hosted |
| **Database Migrations** | 15 migration files di `supabase/migrations/` |
| **Seed Data** | Script SQL di `supabase/seed.sql` (38 provinsi, 514 kab/kota, sample data) |
| **Linter** | `next lint` available |
| **TypeScript** | `tsc --noEmit` type checking available |

### Roadmap (dari ARCHITECTURE-PLAN.md)
1. ✅ **Phase 1**: Foundation (in progress — sebagian selesai)
2. ✅ **Phase 2**: Public Portal (sebagian besar selesai)
3. 🔄 **Phase 3**: Membership Center (in progress — member card, form)
4. 🔄 **Phase 4**: National Command Center (in progress — dashboard KPI, map, charts)
5. 🔄 **Phase 5**: Event Center (in progress — listing, detail, registration)
6. 🔄 **Phase 6**: Innovation Center (sebagian selesai)
7. 🔄 **Phase 7**: Admin System (sebagian besar selesai)
8. ⬜ **Phase 8**: Polish & Deploy (belum dimulai — SEO, performance, docs)

---

*Dokumentasi ini digenerate secara otomatis dari scanning source code — 28 Juni 2026*
