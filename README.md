# 🎵 OpenMusic API v3

**OpenMusic API** adalah sebuah RESTful API untuk platform streaming musik.  
Proyek ini dibangun sebagai submission akhir untuk kelas **"Belajar Fundamental Back-End dengan JavaScript"** di Dicoding.

API ini mencakup berbagai fitur penting dari backend modern, meliputi:

- 🔐 **Autentikasi Pengguna (Registrasi & Login)** berbasis JWT.  
- 💿 **Manajemen Albums (CRUD)** dengan unggah sampul album.  
- 🎶 **Manajemen Songs (CRUD)**.  
- 🎧 **Manajemen Playlists (CRUD)** termasuk hak akses kepemilikan.  
- 🤝 **Fitur Kolaborasi Playlist** antar pengguna.  
- ❤️ **Fitur Menyukai Album (Likes)**.  
- 📤 **Fitur Ekspor Playlist Asinkron** menggunakan Message Broker (RabbitMQ).  
- ⚡ **Server-Side Caching** menggunakan Redis.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Hapi.js  
- **Database**: PostgreSQL  
- **Database Migration**: node-pg-migrate  
- **Autentikasi**: JWT (@hapi/jwt) & Hashing (bcrypt)  
- **Validasi**: Joi (@hapi/joi)  
- **Message Broker**: RabbitMQ (amqplib)  
- **Caching**: Redis (redis)  
- **File Storage**: Penyimpanan Lokal (fs & @hapi/inert)  
- **Email**: Nodemailer (digunakan oleh consumer)  
- **Linting**: ESLint (Airbnb Style Guide)

---

## 1. Persiapan Awal

Sebelum memulai, pastikan layanan (service) berikut sudah terinstal dan berjalan di sistem Anda:

- 🟢 **Node.js**: Versi 18 LTS atau lebih baru — [nodejs.org](https://nodejs.org/)  
- 🟣 **Git**: Untuk mengkloning repositori — [git-scm.com](https://git-scm.com/)  
- 🟠 **PostgreSQL**: Server database yang berjalan.  
- 🟡 **RabbitMQ**: Server message broker yang berjalan.  
- 🔴 **Redis** *(atau Memurai untuk Windows)*: Server caching yang berjalan.

---
