# PRD — Aplikasi Web Pengelolaan Keuangan Pribadi
Versi 1.0 · Disiapkan untuk handoff ke AI coding agent (Claude Opus di Google Antigravity)

---

## 1. Ringkasan Produk

Aplikasi web pengelolaan keuangan pribadi untuk pengguna Gen Z (18–27 tahun), dengan login akun Google, pencatatan transaksi otomatis tersimpan per akun pengguna, dukungan multi-mata-uang, multi-bahasa, dan pengalaman visual yang modern/animatif. Target deploy: Vercel, dengan repository di GitHub.

**Sumber desain visual:** file HTML/CSS hasil generate Google Stitch (lihat folder `/design-reference`). File ini adalah **referensi tampilan saja**, bukan source code final aplikasi.

---

## 2. Batasan Penting — Wajib Dibaca Sebelum Coding

Ini bagian yang paling sering diabaikan dan menyebabkan proyek mandek di tengah jalan:

| Yang terlihat di desain Stitch | Kenyataan teknis |
|---|---|
| Tombol "Login dengan Google" | Hanya elemen visual. Perlu implementasi OAuth 2.0 sungguhan (client ID, client secret, redirect URI terdaftar di Google Cloud Console). |
| Riwayat transaksi "tersimpan otomatis" | Perlu database sungguhan + API endpoint untuk create/read/update/delete. Tidak ada penyimpanan permanen di HTML statis. |
| Dropdown ganti mata uang | Perlu sumber data kurs (API eksternal) + logika konversi & format angka per locale. |
| Dropdown ganti bahasa | Perlu sistem i18n (kamus terjemahan per string UI), bukan cuma ganti label satu tombol. |
| File `.html` tunggal di-deploy ke Vercel | Tidak bisa menyimpan *secret* (client secret Google, connection string database) dengan aman di sisi klien. Vercel juga sudah tidak menyediakan produk "Vercel Postgres" mandiri — database sekarang lewat Vercel Marketplace (Neon/Supabase/dll), yang butuh environment variable di server. |

**Keputusan arsitektur:** Proyek perlu direstrukturisasi dari HTML statis menjadi aplikasi **Next.js** (App Router) sebelum implementasi fitur fungsional dimulai. Desain dari Stitch dipakai sebagai acuan visual/komponen, bukan di-deploy apa adanya.

---

## 3. Target Pengguna

**Persona utama:** Mahasiswa/pekerja muda urban, 18–27 tahun, mobile-first, terbiasa dengan aplikasi fintech modern (Jenius, Flip, GoPay, dsb), menghargai desain cepat & menarik, tapi tetap sensitif soal keamanan data finansial mereka sendiri.

**Implikasi desain:** UI harus terasa ringan dan cepat (bukan berat/lambat karena kebanyakan animasi), tapi tetap memberi sinyal kepercayaan (branding rapi, konfirmasi jelas sebelum aksi destruktif, transparansi soal data).

---

## 4. Tujuan & Non-Tujuan

**Tujuan (in-scope):**
- Login via Google OAuth, satu akun = satu ruang data pribadi.
- Pencatatan transaksi (pemasukan/pengeluaran) tersimpan permanen per akun.
- Dashboard ringkasan + laporan visual.
- Pengaturan: mata uang, bahasa, tema (terang/gelap), notifikasi, keamanan, ekspor data.
- Deploy otomatis dari GitHub ke Vercel.

**Non-tujuan (out-of-scope untuk versi pertama):**
- Integrasi langsung ke rekening bank/e-wallet (open banking).
- Fitur kolaborasi multi-user dalam satu akun (misal keuangan keluarga bersama).
- Aplikasi native mobile (fokus web responsif dulu).

---

## 5. Peta Halaman (Sitemap)

```
/ (splash/redirect)
/login
/onboarding (khusus first-time user)
/dashboard
/transactions
/transactions/new
/transactions/[id]/edit
/budgets
/reports
/settings
  /settings/currency
  /settings/language
  /settings/appearance
  /settings/notifications
  /settings/security
  /settings/export
  /settings/profile
```

---

## 6. Rincian Fitur

### 6.1 Autentikasi
- Login satu klik via akun Google (OAuth 2.0 / OpenID Connect).
- Scope Google diminta seminimal mungkin: hanya profil dasar (nama, email, foto) — **tidak** meminta akses Gmail/Drive dsb kecuali benar-benar dipakai.
- Sesi disimpan aman (HTTP-only cookie / JWT), auto-logout setelah periode tidak aktif (dikonfigurasi di Keamanan).
- Setiap akun Google baru otomatis membuat satu ruang data pribadi (user record) saat login pertama kali — inilah yang dimaksud "riwayat tersimpan otomatis sesuai akun".

**Acceptance criteria:**
- [ ] User baru login Google → otomatis terbuat akun & diarahkan ke onboarding.
- [ ] User lama login Google → langsung ke dashboard dengan data sebelumnya utuh.
- [ ] Logout menghapus sesi, tidak menghapus data.

### 6.2 Dashboard
- Kartu saldo total (agregat semua transaksi).
- Grafik ringkas pemasukan vs pengeluaran bulan berjalan.
- 5 transaksi terbaru.
- Tombol tambah transaksi cepat (floating action button).

### 6.3 Manajemen Transaksi
- CRUD transaksi: nominal, jenis (income/expense), kategori, tanggal, catatan, akun/dompet terkait.
- List dengan filter (kategori, rentang tanggal, jenis) dan pencarian teks.
- Pengelompokan tampilan per hari/minggu/bulan.

### 6.4 Anggaran & Target
- Set budget bulanan per kategori, tampilkan progress (terpakai vs batas).
- Target tabungan sederhana (nominal target + tenggat, progress bar).

### 6.5 Laporan & Analitik
- Grafik tren pengeluaran/pemasukan (line/bar chart) per rentang waktu.
- Breakdown pengeluaran per kategori (pie/donut chart).

### 6.6 Pengaturan
| Sub-menu | Detail |
|---|---|
| Ganti Mata Uang | Pilih mata uang utama dari daftar (IDR, USD, EUR, dst). Semua nominal ditampilkan ulang sesuai kurs terkini. |
| Ganti Bahasa | Minimal Indonesia & Inggris. Semua string UI diterjemahkan (bukan cuma judul halaman). |
| Tampilan | Terang / Gelap / Ikuti Sistem. |
| Notifikasi | Pengingat catat transaksi harian, peringatan mendekati batas budget. |
| Keamanan | Lihat sesi aktif, aktifkan kunci aplikasi (PIN/biometrik jika di-support browser), logout dari semua perangkat. |
| Ekspor Data | Unduh riwayat transaksi sebagai CSV/PDF. |
| Profil | Nama & foto dari Google (read-only), hapus akun (dengan konfirmasi eksplisit + penjelasan konsekuensi). |

**Catatan:** "Hapus akun" harus menghapus data pengguna secara nyata dari database, bukan sekadar menyembunyikan dari UI — ini bagian dari ekspektasi privasi dasar pengguna.

---

## 7. Model Data (skema ringkas)

```
User
  id, google_id, email, name, avatar_url, default_currency,
  language, theme, created_at

Account (dompet/rekening dalam aplikasi, bukan akun Google)
  id, user_id, name, type (cash/bank/e-wallet), balance_cache

Transaction
  id, user_id, account_id, category_id, type (income/expense),
  amount, currency, note, occurred_at, created_at

Category
  id, user_id (null jika kategori bawaan sistem), name, icon, type

Budget
  id, user_id, category_id, month, limit_amount

Setting
  user_id (PK), currency, language, theme, notifications_enabled
```

---

## 8. Kebutuhan UI/UX & Animasi

**Prinsip desain untuk Gen Z:**
- Bold typography untuk angka/saldo, warna aksen gradient, rounded corners konsisten di semua komponen.
- Card-based layout, banyak white space, tidak padat.
- Dark mode wajib, bukan opsional tambahan.

**Animasi & micro-interaction (spesifik, bukan generik):**
- Transisi antar halaman: fade + slide halus, durasi 150–250ms, easing `ease-out`. Jangan lebih dari itu — animasi lambat terasa "berat" bukan "premium".
- Skeleton loading saat data transaksi/grafik sedang dimuat (bukan spinner polos).
- Konfirmasi visual saat transaksi berhasil ditambahkan (micro-animation checkmark/toast), bukan cuma redirect diam-diam.
- Toggle dark/light mode dengan transisi warna smooth, bukan flash langsung ganti.
- Empty state dengan ilustrasi ringan + call-to-action jelas ("Belum ada transaksi, yuk catat yang pertama").
- Angka pada kartu saldo animasi count-up saat pertama render (bukan langsung muncul statis).
- Pull-to-refresh pada list transaksi di tampilan mobile.

**Aksesibilitas minimum:**
- Kontras warna teks vs background memenuhi WCAG AA.
- Target sentuh (tap target) minimal 44x44px.
- Semua elemen interaktif bisa dinavigasi keyboard (untuk versi desktop).

**Responsif:** mobile-first (bottom navigation), beralih ke sidebar navigation di layar ≥1024px.

---

## 9. Kebutuhan Non-Fungsional

**Keamanan:**
- Google OAuth scope minimal (profil dasar saja).
- Semua traffic HTTPS (default di Vercel).
- Secret (client secret, database connection string) hanya di environment variable server-side, tidak pernah ter-bundle ke kode klien.
- Password/PIN kunci aplikasi (jika diimplementasi) di-hash, bukan disimpan plain text.

**Performa:**
- Lazy load chart & halaman berat (reports, settings sub-pages).
- Optimasi gambar/ilustrasi (format modern, ukuran sesuai viewport).

**Privasi:**
- Kumpulkan data sesedikit mungkin (data minimization).
- Sediakan cara pengguna mengekspor dan menghapus datanya sendiri (lihat 6.6).
- *(Catatan: ini prinsip umum praktik baik, bukan nasihat hukum kepatuhan spesifik suatu negara — cek regulasi yang relevan dengan basis penggunamu sebelum rilis publik.)*

**Skalabilitas:** skema data (Section 7) sudah mendukung banyak akun/dompet per user dan banyak kategori kustom, jadi tidak perlu migrasi besar saat fitur bertambah.

---

## 10. Arsitektur Teknis untuk Deploy Vercel + GitHub

| Layer | Rekomendasi | Alasan singkat |
|---|---|---|
| Framework | Next.js (App Router) | Native di Vercel, mendukung API routes/server actions untuk logika backend, bukan cuma HTML statis. |
| Autentikasi | Auth.js (NextAuth) dengan Google Provider | Library standar, terintegrasi rapi dengan Next.js, sudah menangani sesi & callback OAuth. |
| Database | Neon Postgres atau Supabase, dipasang lewat **Vercel Marketplace** (`vercel install neon` atau lewat dashboard) | **[Pasti]** Vercel tidak lagi punya produk "Vercel Postgres" mandiri — sekarang lewat Marketplace, credential otomatis masuk sebagai environment variable. Pilih Supabase kalau ingin auth+storage sekalian dalam satu layanan; pilih Neon kalau cukup butuh Postgres murni dengan database branching per preview deployment. |
| ORM | Prisma atau Drizzle | Memudahkan agent coding menulis query terhadap skema di Section 7. |
| Konversi mata uang | API kurs eksternal (mis. Frankfurter, exchangerate.host, atau provider lain) — **[Kemungkinan Besar]** ketersediaan/limit gratisnya bisa berubah, cek dokumentasi terkininya saat implementasi. Simpan hasil kurs dengan cache (misal update tiap beberapa jam), jangan panggil API tiap kali halaman dibuka. |
| Internasionalisasi | `next-intl` atau `react-i18next` | Standar untuk multi-bahasa di Next.js, mendukung pemisahan file terjemahan per bahasa. |
| Secrets | Environment Variables di dashboard Vercel (bukan di kode) | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `DATABASE_URL`, `NEXTAUTH_SECRET`, dsb. |
| CI/CD | GitHub → Vercel (auto-deploy tiap push, preview deployment per pull request) | Sudah sesuai rencana kamu; tinggal hubungkan repo di dashboard Vercel. |

**Struktur folder repo yang disarankan:**
```
/app                 → route Next.js (App Router)
/components           → komponen UI reusable
/lib                  → helper (auth, db client, currency, i18n)
/prisma (atau /drizzle) → skema database
/design-reference      → file HTML/CSS asli hasil Stitch (arsip, bukan dipakai langsung)
/public
PRD_Aplikasi_Keuangan_Pribadi.md   → dokumen ini
```

---

## 11. Rencana Kerja untuk AI Coding Agent (Claude Opus @ Antigravity)

Antigravity punya Manager view yang bisa menjalankan beberapa agent paralel dan fitur verifikasi otomatis lewat browser bawaan — manfaatkan itu untuk memecah fase berikut, bukan mengerjakan semua sekaligus dalam satu sesi panjang:

1. **Fase 0 — Setup proyek:** Inisialisasi Next.js, hubungkan ke GitHub, deploy "hello world" ke Vercel dulu untuk memastikan pipeline jalan sebelum menambah fitur.
2. **Fase 1 — Auth & database:** Implementasi Google OAuth (Auth.js) + provisioning database (Neon/Supabase) + skema dari Section 7. Verifikasi: login sungguhan berhasil membuat user record di database.
3. **Fase 2 — Fitur inti:** CRUD transaksi, dashboard, kategori, budget — pakai komponen visual dari `/design-reference` sebagai acuan tampilan, tulis ulang sebagai komponen React fungsional.
4. **Fase 3 — Pengaturan fungsional:** mata uang (integrasi API kurs), bahasa (i18n), tema, ekspor data, hapus akun.
5. **Fase 4 — Polish UI/UX:** animasi & micro-interaction sesuai Section 8, uji di berbagai ukuran layar.
6. **Fase 5 — QA & deploy final:** cek acceptance criteria tiap fitur (lihat Section 12), verifikasi environment variable production di Vercel sudah lengkap, uji alur end-to-end sebagai user baru.

---

## 12. Kriteria Penerimaan Utama

- [ ] Login Google sungguhan berfungsi di production (bukan cuma tombol dekoratif).
- [ ] Transaksi yang ditambahkan tetap ada setelah logout–login ulang.
- [ ] Ganti mata uang mengubah tampilan nominal di seluruh aplikasi secara konsisten.
- [ ] Ganti bahasa mengubah seluruh teks UI, bukan sebagian.
- [ ] Dark mode konsisten di semua halaman, termasuk grafik.
- [ ] Watermark "Didesain oleh Teguh Imam Subarkah" tampil di footer, tidak mengganggu keterbacaan konten.
- [ ] Tidak ada secret (API key, client secret, DB connection string) yang muncul di kode sisi klien / repo publik.

---

## 13. Risiko & Pertanyaan Terbuka

- Belum ditentukan: mata uang & bahasa default untuk user baru (asumsi sementara: IDR & Indonesia, sesuaikan jika targetnya bukan hanya pengguna Indonesia).
- Belum ditentukan: apakah data finansial perlu enkripsi tambahan di level database (di luar enkripsi standar provider), tergantung sensitivitas yang diinginkan.
- Batas rate/biaya API kurs mata uang pihak ketiga perlu dicek ulang saat implementasi karena bisa berubah.
- Kuota penggunaan model Claude Opus di Antigravity (preview) bisa terbatas untuk sesi panjang — pertimbangkan memecah pekerjaan sesuai fase di Section 11 agar tidak terhenti di tengah jalan.

---

## 14. Lampiran — Branding

- Watermark: teks kecil "Didesain oleh Teguh Imam Subarkah", posisi footer, warna abu-abu netral, tidak mengganggu hierarki visual utama.
