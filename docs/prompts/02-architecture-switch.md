# Prompt Perubahan Arsitektur

> Sumber: `promptbaru.md` (root) — dipindahkan ke sini untuk konsolidasi dokumentasi

---

## Konteks

Prompt ini adalah instruksi untuk membatalkan migrasi dari Supabase Cloud ke PocketBase, dan mengubah arsitektur final menjadi:

**Hostinger VPS + Self-hosted Supabase**

## Poin Penting

1. **Batalkan migrasi PocketBase** — jangan lanjutkan
2. **Jangan hapus Supabase** — tetap gunakan Supabase
3. **Jangan rewrite aplikasi** — lakukan audit dulu
4. **Recovery plan**: audit → restore SDK → restore auth → restore storage → testing
5. **Output**: laporan audit + recovery plan (tanpa modifikasi kode tanpa approval)

Untuk konten lengkap, lihat file asli.
