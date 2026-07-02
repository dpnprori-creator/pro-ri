# PRO RI Digital Command Center — Dokumentasi

> **Pusat Robotika Rakyat Indonesia** — Platform Ekosistem Nasional Robotika, AI, IoT, Teknologi & Inovasi

---

## Struktur Dokumentasi

```
docs/
├── README.md                    ← Indeks ini
├── ARCHITECTURE.md              ← Arsitektur teknis & database plan
├── DOKUMENTASI.md               ← Dokumentasi project lengkap (auto-scanned)
├── prompts/                     ← Prompt AI Agent yang membangun project ini
│   ├── 01-project-origin.md     ← Prompt original: PRO RI Digital Command Center
│   ├── 02-architecture-switch.md ← Prompt perubahan arsitektur (PocketBase → Supabase)
│   └── 03-content-redesign.md   ← Prompt redesign konten website
└── content-redesign/            ← Hasil audit & redesign konten dari website lama (WordPress)
    ├── 00-inventory.md          ← Inventory & audit seluruh konten website lama
    ├── 01-content-inventory.md
    ├── 02-content-audit.md
    ├── 03-sitemap.md
    ├── 04-copywriting-master.md
    ├── 05-image-asset-catalog.md
    ├── 06-seo-content-guide.md
    ├── 07-content-redesign.md
    ├── 08-implementation-guide.md
    └── redesign-detail/         ← Detail per-section redesign
        ├── 02-information-architecture.md
        ├── 03-copywriting-master.md
        ├── 04-image-catalog.md
        ├── 05-seo-content-guide.md
        └── 06-implementation-guide.md
```

## Ringkasan Dokumen

| Dokumen | Deskripsi |
|---------|-----------|
| `ARCHITECTURE.md` | Arsitektur teknis: tech stack, database schema, routing, component architecture, deployment |
| `DOKUMENTASI.md` | Dokumentasi lengkap: semua fitur, server actions, hooks, design system — auto-scanned dari source code |
| `prompts/01-project-origin.md` | Prompt original yang mendefinisikan visi, arsitektur, dan requirement platform |
| `prompts/02-architecture-switch.md` | Prompt perubahan dari Supabase Cloud → PocketBase → batal, kembali ke Supabase self-hosted |
| `prompts/03-content-redesign.md` | Prompt untuk content audit & redesign website lama (WordPress → Next.js) |
| `content-redesign/` | Hasil audit dan redesign konten dari website PRO RI versi WordPress |

## Tech Stack Final

| Service | Purpose |
|---------|---------|
| **Next.js 15** | Frontend framework (App Router) |
| **Supabase** | Database PostgreSQL, Auth, Storage |
| **Node.js** | Self-hosted di VPS |
| **Tailwind CSS 4** | Styling |
| **TypeScript** | Type safety |

---
*Last updated: June 28, 2026*
