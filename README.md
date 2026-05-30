# Topup-game
# 🎮 Sistem Top Up Game Otomatis (Next.js)

Website top-up game dinamis dan modern yang dibangun menggunakan **Next.js (App Router)**. Proyek ini dilengkapi dengan sistem pembayaran QRIS otomatis dan pemrosesan pesanan *real-time* melalui integrasi API H2H.

## ✨ Fitur Utama

* **Tampilan Modern & Responsif:** UI/UX mulus menggunakan Tailwind CSS.
* **Pembayaran Instan (QRIS):** Integrasi Payment Gateway (Tripay/Midtrans/dll) untuk menghasilkan QRIS dinamis.
* **Proses Otomatis (H2H):** Terhubung dengan API Orderkuota untuk mengirimkan diamond/item game langsung ke akun pembeli setelah pembayaran berhasil.
* **Webhook Cepat:** Pembaruan status transaksi secara *real-time* di latar belakang.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **HTTP Client:** [Axios](https://axios-http.com/)
* **Backend:** Next.js Route Handlers (`app/api/...`)

## 📂 Struktur Repositori

```text
topup-game/
├── app/                  # File sumber utama (Frontend & Backend API)
│   ├── api/              # Endpoint API (Create Invoice & Webhook)
│   ├── globals.css       # File CSS utama & Tailwind
│   ├── layout.js         # Layout pembungkus aplikasi
│   └── page.js           # Halaman utama frontend (UI)
├── public/               # Aset statis (Gambar, Logo, Favicon)
├── .env.local            # Variabel lingkungan (API Keys) - JANGAN DI-COMMIT
├── next.config.js        # Konfigurasi Next.js
├── tailwind.config.js    # Konfigurasi Tailwind CSS
├── package.json          # Dependensi proyek
└── README.md             # Dokumentasi proyek (File ini)
