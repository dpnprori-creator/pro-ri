# PRO RI DIGITAL COMMAND CENTER — Architecture Plan

> **Pusat Robotika Rakyat Indonesia** — National Robotics, AI, IoT, Technology & Innovation Ecosystem Platform

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Routing Architecture](#6-routing-architecture)
7. [Component Architecture](#7-component-architecture)
8. [Data Flow](#8-data-flow)
9. [State Management](#9-state-management)
10. [Seeding Strategy](#10-seeding-strategy)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Implementation Roadmap](#12-implementation-roadmap)
13. [Security Considerations](#13-security-considerations)
14. [Performance Strategy](#14-performance-strategy)

---

## 1. Project Overview

### Vision
Membangun 10.000 Talenta Robotika dan AI Indonesia — platform ekosistem nasional yang menjadi digital backbone PRO RI.

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
> "National Robotics Mission Control" — Futuristic, premium, professional, national-scale.

---

## 2. Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework (App Router) | 15.x |
| **TypeScript** | Type safety | 5.x |
| **Tailwind CSS** | Utility-first styling | 4.x |
| **Shadcn/UI** | Component library | Latest |
| **Framer Motion** | Animations | 11.x |
| **Lucide React** | Icons | Latest |
| **Recharts** | Charts & data visualization | 2.x |
| **Leaflet/React-Leaflet** | Interactive Indonesia map | Latest |
| **Zod** | Schema validation | Latest |

### Backend & Services
| Service | Purpose |
|---------|---------|
| **Supabase** | Database, Auth, Storage |
| **Node.js (Self-hosted)** | Deployment & hosting |

### Key Packages (npm)
```bash
next typescript tailwindcss postcss autoprefixer
@shadcn/ui framer-motion lucide-react recharts
react-leaflet leaflet @types/leaflet
zod @supabase/supabase-js @supabase/ssr
@tanstack/react-query  # For client-side data fetching
react-hook-form @hookform/resolvers  # Forms
qrcode.react  # QR codes for member cards
sonner  # Toast notifications
```

---

## 3. Project Structure

```
pro-ri-command-center/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public Portal route group
│   │   ├── page.tsx              # Home page
│   │   ├── about/
│   │   ├── programs/
│   │   ├── news/
│   │   ├── events/
│   │   ├── innovations/
│   │   ├── register/
│   │   └── login/
│   ├── (dashboard)/              # Authenticated route group
│   │   ├── dashboard/
│   │   ├── membership/
│   │   ├── national-map/
│   │   ├── members/
│   │   ├── events/
│   │   ├── innovations/
│   │   ├── academy/
│   │   └── profile/
│   ├── (admin)/                  # Admin route group
│   │   ├── admin/
│   │   │   ├── members/
│   │   │   ├── events/
│   │   │   ├── innovations/
│   │   │   ├── certificates/
│   │   │   ├── news/
│   │   │   └── monitoring/
│   ├── (command-center)/         # National Command Center
│   │   ├── command-center/
│   │   ├── province/[id]/
│   │   ├── regency/[id]/
│   │   ├── district/[id]/
│   │   └── village/[id]/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + design tokens
│
├── components/                   # Component library
│   ├── ui/                       # Shadcn/UI components (unmodified)
│   ├── primitives/               # Wrapped/customized base components
│   ├── layouts/                  # Layout components
│   │   ├── public-layout.tsx
│   │   ├── dashboard-layout.tsx
│   │   ├── admin-layout.tsx
│   │   └── command-center-layout.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── hero/
│   │   ├── national-impact/
│   │   ├── map/
│   │   ├── member-card/
│   │   ├── certificate/
│   │   ├── event-card/
│   │   └── innovation-card/
│   ├── widgets/                  # Complex widget sections
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   ├── kpi-cards/
│   │   ├── charts/
│   │   ├── data-table/
│   │   └── stat-counter/
│   ├── shared/                   # Shared UI elements
│   │   ├── icons/
│   │   ├── patterns/             # Circuit patterns, grids
│   │   └── animations/
│   └── providers/                # React context providers
│       ├── auth-provider.tsx
│       └── theme-provider.tsx
│
├── lib/                          # Core library code
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   ├── admin.ts              # Admin/Super Admin client
│   │   └── middleware.ts         # Auth middleware
│   ├── utils.ts                  # Utility functions
│   ├── constants.ts              # App constants
│   └── types/                    # TypeScript types
│       ├── database.ts           # Supabase generated types
│       ├── forms.ts              # Form types
│       └── models.ts             # Domain model types
│
├── features/                     # Feature modules (logic + hooks)
│   ├── auth/
│   │   ├── actions.ts            # Server Actions (login, register, logout)
│   │   ├── hooks.ts              # Client hooks
│   │   └── schemas.ts            # Zod schemas
│   ├── members/
│   ├── events/
│   ├── innovations/
│   ├── certificates/
│   ├── news/
│   ├── regions/                  # Province, regency, district, village
│   └── admin/
│
├── hooks/                        # Shared React hooks
│   ├── use-counter-animation.ts
│   ├── use-debounce.ts
│   └── use-media-query.ts
│
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── supabase/                     # Supabase configuration
│   ├── schema.sql                # Full database schema
│   ├── migrations/               # SQL migrations
│   ├── seed.sql                  # Seed data script
│   ├── types.ts                  # Generated TypeScript types
│   └── policies.sql              # RLS policies
│
├── .env.local                    # Environment variables
├── .env.example                  # Environment variable template
├── tailwind.config.ts            # Tailwind configuration
├── next.config.ts                # Next.js configuration
├── components.json               # Shadcn/UI configuration
└── package.json
```

### Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Feature-based structure** | Scalable for 10,000+ members and future expansion |
| **Route Groups** | Clean URL separation between public, dashboard, admin |
| **Server Actions** | Supabase mutations via Server Actions (type-safe, RSC-compatible) |
| **Zod + React Hook Form** | End-to-end type safety for all forms |
| **TanStack Query** | Client-side caching and data synchronization |
| **Shadcn/UI as source code** | Full control over component customization |

---

## 4. Database Schema

### Entity Relationship Overview

```
provinces 1──* regencies 1──* districts 1──* villages
                                                    │
                                                    └──* members
                                                         │
                                                         ├──* events (through event_registrations)
                                                         ├──* innovations
                                                         ├──* certificates
                                                         ├──* activity_logs
                                                         └──1 roles
```

### Table Definitions

#### `provinces`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| code | VARCHAR(2) UNIQUE | Indonesia province code |
| name | VARCHAR(100) | Province name |
| capital | VARCHAR(100) | Capital city |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| total_members | INTEGER | Denormalized count |
| total_trainers | INTEGER | Denormalized count |
| total_mentors | INTEGER | Denormalized count |
| total_events | INTEGER | Denormalized count |
| total_innovations | INTEGER | Denormalized count |
| created_at | TIMESTAMPTZ | |

#### `regencies`
| Column | Type |
|--------|------|
| id | UUID PK |
| province_id | UUID FK → provinces |
| code | VARCHAR(5) UNIQUE |
| name | VARCHAR(100) |
| latitude | DECIMAL(10,8) |
| longitude | DECIMAL(11,8) |
| total_members | INTEGER |
| total_trainers | INTEGER |
| total_events | INTEGER |
| total_innovations | INTEGER |

#### `districts`
| Column | Type |
|--------|------|
| id | UUID PK |
| regency_id | UUID FK → regencies |
| code | VARCHAR(8) UNIQUE |
| name | VARCHAR(100) |
| total_members | INTEGER |

#### `villages`
| Column | Type |
|--------|------|
| id | UUID PK |
| district_id | UUID FK → districts |
| code | VARCHAR(13) UNIQUE |
| name | VARCHAR(100) |

#### `roles`
| Column | Type |
|--------|------|
| id | UUID PK |
| name | VARCHAR(50) UNIQUE | guest, member, admin, super_admin |
| description | TEXT |

#### `members`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID PK | |
| auth_id | UUID FK → auth.users | Supabase Auth reference |
| member_id | VARCHAR(20) UNIQUE | PRI-2026-00001 format |
| full_name | VARCHAR(200) | |
| email | VARCHAR(255) UNIQUE | |
| phone | VARCHAR(20) | |
| province_id | UUID FK → provinces | |
| regency_id | UUID FK → regencies | |
| district_id | UUID FK → districts | |
| village_id | UUID FK → villages | |
| occupation | VARCHAR(100) | |
| technology_interest | TEXT[] | Array of interests |
| role_id | UUID FK → roles | |
| status | VARCHAR(20) | active, inactive, suspended |
| photo_url | TEXT | Supabase Storage URL |
| qr_code | TEXT | Generated QR data |
| total_events_attended | INTEGER | Denormalized |
| total_certificates | INTEGER | Denormalized |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |

#### `events`
| Column | Type |
|--------|------|
| id | UUID PK |
| title | VARCHAR(200) |
| slug | VARCHAR(200) UNIQUE |
| description | TEXT |
| category | VARCHAR(50) | webinar, workshop, competition, exhibition |
| type | VARCHAR(50) | online, offline, hybrid |
| start_date | TIMESTAMPTZ |
| end_date | TIMESTAMPTZ |
| location | TEXT |
| province_id | UUID FK → provinces |
| max_participants | INTEGER |
| banner_url | TEXT |
| status | VARCHAR(20) | draft, published, ongoing, completed, cancelled |
| created_by | UUID FK → members |
| created_at | TIMESTAMPTZ |

#### `event_registrations`
| Column | Type |
|--------|------|
| id | UUID PK |
| event_id | UUID FK → events |
| member_id | UUID FK → members |
| status | VARCHAR(20) | registered, attended, cancelled |
| attended_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |
| UNIQUE(event_id, member_id) | |

#### `innovations`
| Column | Type |
|--------|------|
| id | UUID PK |
| title | VARCHAR(200) |
| slug | VARCHAR(200) UNIQUE |
| description | TEXT |
| category | VARCHAR(50) | robotics, ai, iot, programming, research |
| image_url | TEXT |
| creator_id | UUID FK → members |
| province_id | UUID FK → provinces |
| year | INTEGER |
| status | VARCHAR(20) | draft, published, featured, archived |
| created_at | TIMESTAMPTZ |

#### `certificates`
| Column | Type |
|--------|------|
| id | UUID PK |
| certificate_number | VARCHAR(30) UNIQUE |
| member_id | UUID FK → members |
| event_id | UUID FK → events |
| type | VARCHAR(50) | participant, trainer, mentor, winner |
| title | VARCHAR(200) |
| issued_at | TIMESTAMPTZ |
| verified | BOOLEAN DEFAULT false |
| pdf_url | TEXT |
| created_at | TIMESTAMPTZ |

#### `news`
| Column | Type |
|--------|------|
| id | UUID PK |
| title | VARCHAR(200) |
| slug | VARCHAR(200) UNIQUE |
| content | TEXT |
| excerpt | TEXT |
| image_url | TEXT |
| author_id | UUID FK → members |
| category | VARCHAR(50) | article, announcement, press_release |
| status | VARCHAR(20) | draft, published |
| published_at | TIMESTAMPTZ |
| created_at | TIMESTAMPTZ |

#### `activity_logs`
| Column | Type |
|--------|------|
| id | UUID PK |
| member_id | UUID FK → members |
| action | VARCHAR(100) |
| entity_type | VARCHAR(50) |
| entity_id | UUID |
| metadata | JSONB |
| ip_address | VARCHAR(45) |
| created_at | TIMESTAMPTZ |

### Indexing Strategy
```sql
-- Performance indexes
CREATE INDEX idx_members_province ON members(province_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_role ON members(role_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_innovations_category ON innovations(category);
CREATE INDEX idx_innovations_province ON innovations(province_id);
CREATE INDEX idx_certificates_member ON certificates(member_id);
CREATE INDEX idx_activity_logs_member ON activity_logs(member_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at DESC);

-- Full text search
CREATE INDEX idx_members_name_search ON members USING gin(to_tsvector('indonesian', full_name));
CREATE INDEX idx_events_title_search ON events USING gin(to_tsvector('indonesian', title));
CREATE INDEX idx_news_title_search ON news USING gin(to_tsvector('indonesian', title));
```

---

## 5. Authentication & Authorization

### Auth Flow
```
┌─────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐
│  User   │────▶│ Supabase │────▶│ Next.js   │────▶│ Protected│
│ Browser │◀────│   Auth   │◀────│ Middleware │◀────│  Route   │
└─────────┘     └──────────┘     └───────────┘     └──────────┘
```

### Middleware Protection
```typescript
// lib/supabase/middleware.ts
// - Refresh session on every request
// - Check role-based access
// - Redirect unauthenticated users to /login
// - Redirect unauthorized users to /dashboard
```

### Role-Based Access Control (RBAC)

| Role | Access |
|------|--------|
| **Guest** | Public pages only (home, about, programs, news, register, login) |
| **Member** | Dashboard, membership, profile, events, innovations |
| **Admin** | Admin panel, member management, event management, certificate management |
| **Super Admin** | Full access, system configuration, all management features |

### RLS Policies (Supabase)
```sql
-- Members table: users can read public profiles
-- Members can update their own profile
-- Admins can read/update all members
-- Super admins have full CRUD

-- Events table: public read for published events
-- Create/update only by admins

-- Innovations table: public read for published
-- Create by members, update by owners or admins
```

---

## 6. Routing Architecture

### Route Groups

#### `(public)` — No auth required
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, impact stats, map preview, programs, innovations, news |
| `/about` | About PRO RI | Vision, mission, team, history |
| `/programs` | National Programs | Program cards and details |
| `/news` | News & Media | Article listing with pagination |
| `/news/[slug]` | News Detail | Full article |
| `/events` | Events | Event listing with filters |
| `/events/[slug]` | Event Detail | Full event info + registration |
| `/innovations` | Innovation Gallery | Innovation showcase |
| `/innovations/[slug]` | Innovation Detail | Full innovation info |
| `/register` | Registration | Member sign-up form |
| `/login` | Login | Authentication |

#### `(dashboard)` — Member auth required
| Route | Page |
|-------|------|
| `/dashboard` | Member Dashboard Overview |
| `/membership` | Membership Card & Status |
| `/national-map` | Interactive Indonesia Map |
| `/members` | Member Directory |
| `/events` | My Events |
| `/events/[id]` | Event Detail |
| `/innovations` | My Innovations |
| `/innovations/new` | Submit Innovation |
| `/academy` | Academy Gateway |
| `/profile` | Profile Settings |
| `/certificates` | My Certificates |
| `/certificates/[id]` | Certificate Preview |

#### `(admin)` — Admin/Super Admin auth required
| Route | Page |
|-------|------|
| `/admin` | Admin Dashboard |
| `/admin/members` | Member Management |
| `/admin/members/[id]` | Member Detail |
| `/admin/events` | Event Management |
| `/admin/events/new` | Create Event |
| `/admin/events/[id]/edit` | Edit Event |
| `/admin/innovations` | Innovation Management |
| `/admin/certificates` | Certificate Management |
| `/admin/certificates/issue` | Issue Certificate |
| `/admin/news` | News Management |
| `/admin/news/new` | Create News |
| `/admin/monitoring` | National Monitoring (read-only) |

#### `(command-center)` — Public + Member access
| Route | Page |
|-------|------|
| `/command-center` | National Command Center Overview |
| `/command-center/province/[id]` | Province Detail |
| `/command-center/regency/[id]` | Regency Detail |
| `/command-center/district/[id]` | District Detail |
| `/command-center/village/[id]` | Village Detail |

### API Routes (if needed for advanced features)
```typescript
// /app/api/
// ├── members/search    - Member search (full-text)
// ├── certificates/verify - Certificate QR verification
// └── regions/          - Region data for maps
```

---

## 7. Component Architecture

### Component Hierarchy

```
RootLayout
├── PublicLayout
│   ├── Navbar (transparent → solid on scroll)
│   ├── Page Content (RSC by default)
│   │   ├── HeroSection
│   │   ├── NationalImpactSection
│   │   │   └── StatCounter[] (animated)
│   │   ├── IndonesiaMapPreview
│   │   ├── ProgramCards[]
│   │   ├── InnovationShowcase[]
│   │   └── NewsSection[]
│   └── Footer
│
├── DashboardLayout
│   ├── Sidebar (nav items)
│   ├── TopBar (user menu, notifications)
│   └── Main Content Area
│       ├── KPICards[]
│       ├── Charts (Recharts)
│       └── DataTables
│
├── AdminLayout
│   ├── AdminSidebar
│   ├── TopBar
│   └── Admin Content
│
└── CommandCenterLayout
    ├── FullScreenMap
    ├── Overlay Stats Panel
    └── DrillDown Navigation
```

### Key Shared Components

| Component | Description |
|-----------|-------------|
| `StatCounter` | Animated number counter with Framer Motion |
| `KPICard` | Glass-morphism metric card |
| `GlassCard` | Reusable glass-morphism container |
| `DataTable` | Sortable, filterable, paginated table |
| `RegionHierarchy` | Indonesia → Province → Regency → District → Village |
| `IndonesiaMap` | Interactive Leaflet map with heatmap |
| `MemberCard` | Digital membership card with QR code |
| `CertificateViewer` | Certificate preview with QR verification |
| `PatternBackground` | Circuit/grid/tech pattern overlay |
| `SearchInput` | Debounced search with results |
| `StatusBadge` | Colored status indicator |

### Animation Strategy (Framer Motion)
- **Stat counters**: `useMotionValue` + `useSpring` for smooth counting
- **Card hover**: Scale + glow effect on glass cards
- **Page transitions**: Fade/slide between routes
- **Map interactions**: Smooth zoom/pan on region click
- **Chart transitions**: Recharts built-in animations
- **Scroll animations**: `useInView` for section reveals

---

## 8. Data Flow

### Read Operations
```
Browser Request
    │
    ▼
Next.js Middleware (auth check)
    │
    ▼
Server Component (RSC)
    │
    ├── Supabase Server Client
    │       │
    │       ▼
    │   Supabase DB (with RLS)
    │       │
    │       ▼
    │   Data + TypeScript Types
    │
    ├── Client Component (if interactive)
    │       │
    │       ├── TanStack Query → Supabase Client → RLS
    │       └── Realtime subscriptions (optional)
    │
    └── Render HTML
```

### Write Operations
```
User Action (form submit, button click)
    │
    ▼
Server Action (mutate)
    │
    ├── Zod Validation
    │
    ├── Supabase Server Client
    │       │
    │       ▼
    │   INSERT / UPDATE / DELETE (RLS enforced)
    │       │
    │       ▼
    │   Response + Revalidation
    │
    └── TanStack Query invalidation (client)
```

### Real-time Updates
- **Realtime**: Supabase Realtime for live stats updates
- **Polling**: Periodic refetch for non-critical data

---

## 9. State Management

### Strategy: Minimal global state, maximize URL + server state

| State Type | Solution |
|------------|----------|
| **Server state** | TanStack Query + Server Components |
| **URL state** | Next.js searchParams, path params |
| **Auth state** | Supabase session + React context |
| **UI state** | Local React state + Zustand (if needed) |
| **Form state** | React Hook Form + Zod |
| **Cache** | TanStack Query + Supabase cache |

---

## 10. Seeding Strategy

### Seed Data Sources
- **Provinces**: All 38 provinces of Indonesia with coordinates
- **Regencies**: 150+ regencies with correct province mapping
- **Districts/Villages**: Sampled districts and villages
- **Members**: 500 realistic Indonesian names + data
- **Trainers**: 50 members with trainer role
- **Mentors**: 20 members with mentor role
- **Events**: 300 events across all categories
- **Innovations**: 200 innovation projects
- **Certificates**: 100 certificates linked to events + members
- **News**: 50 articles

### Seed Script Structure
```sql
-- supabase/seed.sql
-- 1. Clear existing data (in correct order)
-- 2. Insert provinces (38 rows)
-- 3. Insert regencies (150+ rows)
-- 4. Insert districts (sampled)
-- 5. Insert villages (sampled)
-- 6. Insert roles (4 rows)
-- 7. Insert members (500+ rows with realistic data)
-- 8. Insert events (300 rows)
-- 9. Insert innovations (200 rows)
-- 10. Insert certificates (100 rows)
-- 11. Insert news (50 rows)
-- 12. Insert activity_logs (sample)
-- 13. Update denormalized counts
```

### Data Generation Tool
Use a Node.js script (`scripts/seed-generator.ts`) to:
1. Generate realistic Indonesian data
2. Output SQL insert statements
3. Handle relationships correctly
4. Output in batches to avoid timeout

---

## 11. Deployment Strategy

### Deployment Configuration
```bash
# Build
npm run build

# Start
npm start  # next start on port 3000

# Process manager (PM2)
pm2 start npm --name "pro-ri" -- start
```

### Environment Variables
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

### CI/CD Pipeline
```
Git Push → Build & Deploy
    │
    ├── Build: npm run build
    ├── Lint: npm run lint
    └── Start: pm2 restart pro-ri
```

### Supabase Project Setup
1. Create Supabase project
2. Run migrations (`supabase/schema.sql`)
3. Apply RLS policies (`supabase/policies.sql`)
4. Run seed script (`supabase/seed.sql`)
5. Generate TypeScript types
6. Configure Auth providers

---

## 12. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Initialize Next.js project
- [ ] Configure Tailwind with PRO RI design tokens
- [ ] Set up Shadcn/UI components
- [ ] Set up Supabase project + schema
- [ ] Configure environment variables
- [ ] Create Supabase clients (server + client + admin)
- [ ] Set up authentication (login, register, middleware)
- [ ] Create route groups structure

### Phase 2: Public Portal (Week 2)
- [ ] Build Navbar + Footer (responsive)
- [ ] Hero Section with CTA
- [ ] National Impact Section with animated counters
- [ ] Interactive Indonesia Map Preview
- [ ] Program Cards Section
- [ ] Innovation Showcase
- [ ] News Section
- [ ] About Page
- [ ] Programs Page
- [ ] Registration Page
- [ ] Login Page
- [ ] Responsive design pass

### Phase 3: Membership Center (Week 3)
- [ ] Member Dashboard layout + sidebar
- [ ] Overview dashboard with KPIs
- [ ] Digital Member Card with QR code
- [ ] Member Directory (search, filter)
- [ ] Profile page (edit)
- [ ] National Map (interactive full version)
- [ ] Member settings

### Phase 4: National Command Center (Week 4)
- [ ] Command Center overview page
- [ ] Indonesia Explorer (hierarchical drill-down)
- [ ] Province detail page
- [ ] Regency detail page
- [ ] District detail page
- [ ] Village detail page
- [ ] Interactive Leaflet map with heatmap
- [ ] KPI Tracker (10,000 members, 500 trainers targets)
- [ ] Growth charts per region

### Phase 5: Event Center (Week 5)
- [ ] Event listing (public + member)
- [ ] Event detail page
- [ ] Event registration flow
- [ ] Attendance tracking
- [ ] Digital Certificate viewer
- [ ] Certificate verification page (QR)
- [ ] Certificate PDF download

### Phase 6: Innovation Center (Week 6)
- [ ] Innovation gallery (public)
- [ ] Innovation detail page
- [ ] Innovation submission (member)
- [ ] Category filtering
- [ ] Search functionality

### Phase 7: Admin System (Week 7)
- [ ] Admin dashboard
- [ ] Member management (CRUD)
- [ ] Event management (CRUD)
- [ ] Innovation management (moderation)
- [ ] Certificate management
- [ ] News management
- [ ] National Monitoring overview
- [ ] Activity logs viewer

### Phase 8: Polish & Deploy (Week 8)
- [ ] Performance optimization
- [ ] SEO metadata
- [ ] Error boundaries
- [ ] Loading states + skeletons
- [ ] Responsive testing (all devices)
- [ ] Supabase seed data generation
- [x] Final deployment to VPS
- [ ] Documentation

---

## 13. Security Considerations

### Authentication
- Supabase Auth with email/password
- Session refresh via middleware
- Secure HTTP-only cookies
- Rate limiting on auth endpoints

### Authorization
- Row Level Security (RLS) on all tables
- Role-based access in middleware
- Server-side validation on all mutations
- Never trust client-side role checks alone

### Data Protection
- Input validation with Zod on all forms
- SQL injection prevention (Supabase parameterized queries)
- XSS prevention (React's built-in escaping)
- CSP headers in Next.js config
- HTTPS enforced

### File Upload
- Supabase Storage with RLS
- File type validation
- File size limits
- Virus scanning (if needed)

---

## 14. Performance Strategy

### Frontend
- **React Server Components**: Default to RSC, only use client components when needed
- **Image Optimization**: Next.js Image component with Supabase CDN
- **Code Splitting**: Dynamic imports for heavy components (map, charts)
- **Bundle Optimization**: Analyze with `@next/bundle-analyzer`
- **Font Loading**: Next.js font optimization with `next/font`
- **Lazy Loading**: Below-fold content with `Suspense`

### Data
- **Supabase Performance**: Proper indexing, denormalized counts
- **Caching**: TanStack Query cache + Supabase auto-caching
- **Pagination**: Infinite scroll / cursor-based for large lists
- **Debounced Search**: Full-text search with debounced input

### Rendering
- **Static Pages**: Home, about, programs (ISR if data changes)
- **Dynamic Pages**: Dashboard, admin (SSR + client hydration)
- **Streaming**: Suspense boundaries for slow data fetches

---

## Appendix A: Color System Implementation

### Tailwind Config
```typescript
// tailwind.config.ts
colors: {
  'pri-red': '#E31E24',
  'pri-carbon': '#0F1117',
  'pri-dark': '#1B1F2A',
  'pri-silver': '#BFC5D2',
  'pri-light': '#F5F6F8',
  'pri-white': '#FFFFFF',
}
```

### CSS Variables for Glass Effects
```css
:root {
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-blur: blur(12px);
}
```

## Appendix B: Design Patterns & Visual Elements

### Pattern Overlays
- Circuit board patterns (CSS/SVG)
- Digital grid backgrounds
- Network connection lines
- Geometric hexagonal grids
- Particle/dot matrix patterns

### Component Design Patterns
- **Glass Cards**: Semi-transparent with backdrop blur
- **Glow Effects**: Red glow on hover/active states
- **Gradient Borders**: Subtle red-to-transparent borders
- **Animated Gradients**: Moving gradient on hero section
- **Tech Typography**: Monospace for numbers/data, modern sans-serif for text

---

*Document version 1.0 — Last updated: June 20, 2026*
