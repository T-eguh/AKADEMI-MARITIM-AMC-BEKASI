# Akademi Maritim AMC Bekasi - Arsitektur Profesional Full-Stack

Aplikasi web ini telah direfaktor menjadi arsitektur profesional dengan pemisahan Frontend (React + Vite + TypeScript + TailwindCSS) dan Backend (Node.js + Express.js + TypeScript). 

Proyek ini menggunakan **Express + Vite Hybrid Middleware** untuk pengembangan lokal di Google AI Studio (port 3000), namun didesain agar sangat mudah dipisahkan menjadi proyek standalone saat dideploy ke VPS, Railway, Render, atau platform cloud lainnya.

---

## Struktur Folder Proyek

```text
├── .env.example             # Contoh konfigurasi environment variable
├── server.ts                # Entrypoint server Express full-stack
├── package.json             # Dependensi dan script build/start
├── public/                  # Static assets dan database fallback (amc_backup.json)
├── server/                  # SOURCE CODE BACKEND
│   ├── config/              # Konfigurasi Database (MySQL) & Cloudinary
│   ├── controllers/         # Logika Controller API
│   ├── routes/              # Routing REST API
│   ├── middlewares/         # Middleware Auth JWT, Multer, Error handler
│   ├── services/            # Bisnis logika aplikasi
│   ├── repositories/        # Lapisan Abstraksi Database (MySQL & JSON file fallback)
│   ├── types/               # Type-safety interface
│   ├── validators/          # Validasi skema request body
│   ├── uploads/             # Penyimpanan sementara file upload
│   ├── migrations/          # File schema database SQL (.sql)
│   └── seeders/             # File seed data awal (.sql)
└── src/                     # SOURCE CODE FRONTEND (React App)
    ├── components/          # Komponen UI modular
    ├── services/            # Axios API Service (/src/services/api.ts)
    ├── pages/               # Halaman utama aplikasi
    ├── types.ts             # Tipe data TypeScript frontend
    └── ...
```

---

## 1. Konfigurasi Environment Variable (.env)

Buat file `.env` di root direktori proyek (salin dari `.env.example`):

```env
# URL base API untuk Frontend (Secara default /api untuk hybrid mode)
VITE_API_URL="/api"

# Konfigurasi Server Backend
PORT=3000
JWT_SECRET="masukkankuncirahasiajwt"
JWT_REFRESH_SECRET="masukkankuncirahasiarefreshjwt"

# Konfigurasi Database (MySQL atau PostgreSQL)
# Kosongkan bagian ini untuk mengaktifkan fallback otomatis ke file lokal JSON (amc_backup.json)
DB_HOST="localhost"
DB_USER="root"
DB_PASSWORD="yourpassword"
DB_NAME="amc_db"
DB_PORT=3306
DATABASE_URL=""

# Konfigurasi Cloudinary (Penyimpanan Gambar Otomatis)
# Kosongkan bagian ini untuk menyimpan file ke penyimpanan lokal (/public/uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

---

## 2. Cara Membuat Database (MySQL)

1. Jalankan server MySQL lokal Anda (misal via XAMPP, Docker, atau instalasi mandiri).
2. Buat database baru bernama `amc_db`:
   ```sql
   CREATE DATABASE amc_db;
   ```
3. Struktur tabel otomatis dibuat saat server backend dijalankan pertama kali (`initDB` akan mengeksekusi migrasi tabel secara otomatis).
4. Untuk mengimpor database secara manual, Anda bisa menggunakan file schema di:
   - `/server/migrations/init.sql` (Skema Tabel)
   - `/server/seeders/seed.sql` (Data Awal / Admin default)

---

## 3. Cara Menjalankan Project secara Lokal

### Langkah 1: Instalasi Dependensi
Instal semua dependensi NPM yang diperlukan:
```bash
npm install
```

### Langkah 2: Jalankan dalam Mode Pengembangan (Dev)
Gunakan script dev terpadu untuk menjalankan server hybrid Express + Vite secara real-time:
```bash
npm run dev
```
Aplikasi akan dapat diakses di `http://localhost:3000`.

---

## 4. Cara Deploy ke Production

### Build & Start Produksi
Gunakan perintah build terpadu yang akan menghasilkan bundel statis React di `/dist` dan membundel backend TypeScript ke file `/dist/server.cjs` yang dioptimalkan menggunakan `esbuild`:

```bash
# Build Frontend dan Backend
npm run build

# Jalankan server produksi
npm run start
```

---

## 5. Cara Menghubungkan Frontend Standalone dengan Backend Standalone

Jika di masa mendatang Anda memutuskan untuk memisahkan proyek ini menjadi dua repositori terpisah:

### Di Sisi Frontend (`amc-frontend/`):
1. Pindahkan folder `/src`, `index.html`, `vite.config.ts`, `tsconfig.json` ke folder baru `amc-frontend/`.
2. Edit file `.env` di frontend Anda dan ganti nilai `VITE_API_URL` ke domain backend produksi Anda:
   ```env
   VITE_API_URL="https://api.amcbekasi.ac.id"
   ```
3. Jalankan build frontend:
   ```bash
   npm run build
   ```

### Di Sisi Backend (`amc-backend/`):
1. Pindahkan folder `/server`, `server.ts` ke folder baru `amc-backend/`.
2. Edit file `/server.ts` untuk menghapus baris pemuatan Vite middleware (hanya sisakan routing API `/api`).
3. Deploy folder backend ke layanan server Node seperti Railway, Render, VPS, Heroku, atau CPanel Node.

---

## 6. Fitur Keamanan dan Optimasi yang Diterapkan

* **JWT & Refresh Token**: Login aman dengan token akses (durasi 1 jam) dan token penyegar (durasi 7 hari) yang terenkripsi aman menggunakan `bcryptjs`.
* **Abstraksi Database (Repository Pattern)**: Bisnis logika tidak terikat langsung ke database. Jika MySQL mati atau belum dikonfigurasi, backend secara cerdas akan menggunakan data file-based JSON sebagai cadangan sehingga website tidak pernah mengalami downtime atau error 500 saat dikunjungi.
* **Helmet & CORS Security**: Proteksi XSS, Clickjacking, MIME-Sniffing, dan konfigurasi origin aman.
* **Optimasi Gambar Otomatis (Multer + Cloudinary)**: Gambar otomatis di-resize dan dikompres sebelum di-upload untuk menjaga efisiensi bandwidth penyimpanan cloud.
