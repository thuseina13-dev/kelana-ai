# 🌏 Kelana AI - Perencana Liburan Impian Berbasis AI

**Kelana AI** adalah aplikasi cerdas yang membantu pengguna merencanakan liburan impian secara otomatis, terstruktur, dan personal menggunakan kekuatan *Artificial Intelligence* (AI). Pengguna cukup memasukkan parameter dasar seperti destinasi, durasi, anggaran, dan gaya perjalanan, lalu sistem akan menyusun itinerary harian lengkap beserta estimasi biaya dan rekomendasi wisata.

---

## 🚀 Fitur Utama

- 🧭 **AI Itinerary Generator**: Menyusun jadwal rencana perjalanan hari ke hari yang optimal dan terstruktur berdasarkan destinasi, jumlah hari, dan *travel style* (Solo, Pasangan, Keluarga).
- 💰 **Budget Breakdown & Estimasi Biaya**: Perhitungan anggaran harian dan kategori pengeluaran yang transparan.
- 💬 **Kelana AI Chat**: Fitur percakapan interaktif untuk berkonsultasi seputar destinasi, tips wisata, kuliner, dan rencana perjalanan.
- ❓ **Tanya AI (Knowledge Base / RAG)**: Tanya jawab langsung menggunakan basis pengetahuan cerdas seputar pariwisata.
- 📜 **Riwayat Perjalanan (Trip History)**: Menyimpan, mencari, menyortir, dan melihat kembali seluruh rencana perjalanan yang telah dibuat.
- 🔒 **Autentikasi Aman**: Registrasi dan Login akun berbasis JWT (JSON Web Token) dengan keamanan enkripsi kata sandi.
- 📱 **Desain Responsif & Modern**: Tampilan antarmuka yang elegan menggunakan Next.js, TailwindCSS, dan ikon visual kustom.

---

## 🛠️ Arsitektur & Teknologi

### **Frontend**
- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Library**: React 19, TypeScript
- **Styling**: TailwindCSS
- **Markdown Renderer**: `react-markdown`

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Database ORM**: SQLAlchemy & PostgreSQL (`psycopg2-binary`)
- **AI Integration**: AWS Bedrock (Claude / Titan LLM) & Knowledge Base (RAG) via `boto3`
- **Keamanan & Autentikasi**: `python-jose` (JWT), `bcrypt`
- **Server**: `uvicorn`

---

## 📂 Struktur Direktori Proyek

```text
kelana-ai/
├── backend/                  # REST API Backend (FastAPI)
│   ├── models/               # Model SQLAlchemy & Skema Pydantic (User, Trip, Chat)
│   ├── services/             # Integrasi AWS Bedrock, KB RAG, Auth, Trip Logic
│   ├── migrations/           # Skrip migrasi database
│   ├── database.py           # Konfigurasi koneksi database
│   ├── main.py               # Entrypoint & Routing API FastAPI
│   └── requirements.txt      # Dependensi Python
├── frontend/                 # Aplikasi Web Frontend (Next.js)
│   ├── app/                  # Next.js App Router (Pages, Layout, Error, Loading)
│   │   ├── about/            # Halaman Tentang Kelana AI
│   │   ├── ask/              # Halaman Tanya AI (Knowledge Base)
│   │   ├── chat/             # Halaman Chat AI Interaktif
│   │   ├── login/            # Halaman Masuk
│   │   ├── profile/          # Halaman Profil Pengguna
│   │   ├── register/         # Halaman Registrasi
│   │   ├── trips/            # Halaman Riwayat & Detail Itinerary
│   │   ├── error.tsx         # Halaman Error 500
│   │   ├── not-found.tsx     # Halaman Error 404
│   │   ├── loading.tsx       # Loading Screen Komponen
│   │   └── icon.svg          # Favicon & Logo Aplikasi
│   ├── componets/            # Reusable UI Components (Header, Logo, TripDetail, LoadingScreen)
│   ├── services/             # API client services (Auth, Trip, Chat, Knowledge Base)
│   └── package.json          # Dependensi Node.js
└── README.md                 # Dokumentasi Proyek
```

---

## ⚙️ Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat Sistem
- **Node.js** (versi 18.x atau lebih baru) & **npm**
- **Python** (versi 3.10 atau lebih baru)
- **PostgreSQL Database**
- Akun / Kredensial **AWS** dengan akses Bedrock (opsional jika menggunakan AI mock/live)

---

### 2. Menjalankan Backend (FastAPI)

1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Buat dan aktifkan *Virtual Environment*:
   ```bash
   # Windows (PowerShell)
   python -m venv .venv
   .venv\Scripts\activate

   # Linux/macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install dependensi Python:
   ```bash
   pip install -r requirements.txt
   ```
4. Siapkan file `.env` di dalam folder `backend/`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/kelana_ai_db
   SECRET_KEY=your_super_secret_jwt_key
   ALGORITHM=HS256
   FRONTEND_URL=http://localhost:3000
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   KNOWLEDGE_BASE_ID=your_kb_id
   MODEL_ARN=your_bedrock_model_arn
   ```
5. Jalankan server backend:
   ```bash
   uvicorn main.py --reload --port 8000
   ```
   API Backend akan berjalan di `http://localhost:8000` (Dokumentasi Swagger di `http://localhost:8000/docs`).

---

### 3. Menjalankan Frontend (Next.js)

1. Buka terminal baru dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependensi Node.js:
   ```bash
   npm install
   ```
3. Pastikan konfigurasi `.env` di dalam folder `frontend/`:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses aplikasi di:
   ```text
   http://localhost:3000
   ```

---

## 📜 Lisensi & Hak Cipta

© 2026 **Kelana AI**. Seluruh hak cipta dilindungi undang-undang.
