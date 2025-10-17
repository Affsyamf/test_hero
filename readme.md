Project Task Management adalah aplikasi manajer tugas sederhana yang dirancang untuk membantu seorang Project Manager memantau tugas-tugas yang sedang dikerjakan oleh anggota tim. Aplikasi ini memungkinkan pencatatan tugas, pembaruan status, dan pelacakan riwayat aktivitas untuk setiap tugas.



Fitur Utama
1. Manajemen Tugas (CRUD): Buat, baca, perbarui, dan hapus tugas.

2. Pelacakan Status: Setiap tugas memiliki status (Belum Dimulai, Sedang Dikerjakan, Selesai).

3. Riwayat Aktivitas: Semua perubahan penting pada tugas dicatat dalam log riwayat.

4. Dashboard Statistik: Menampilkan ringkasan jumlah tugas berdasarkan status dalam bentuk grafik.

5. Otentikasi Pengguna: Sistem login sederhana untuk membatasi akses.

6. Paginasi: Paginasi untuk daftar tugas dan log aktivitas agar tampilan lebih rapi.

Teknologi yang Digunakan
1. Frontend:

- React (dengan Vite)

-Tailwind CSS

- Recharts untuk grafik

- Axios untuk permintaan API

2. Backend:

- Node.js

- Express.js

- PostgreSQL sebagai database

- JWT (JSON Web Tokens) for otentikasi


Persyaratan
Sebelum memulai, pastikan Anda sudah menginstal perangkat lunak berikut di komputer lokal Anda:

- Node.js (versi 18.x atau lebih baru)

- npm (biasanya sudah terinstal bersama Node.js)

- PostgreSQL

Instalasi dan Menjalankan Proyek di Lokal
Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal.

1. Clone Repository
git clone [https://github.com/Affsyamf/test_hero.git](https://github.com/Affsyamf/test_hero.git)
cd test_hero

2. Konfigurasi Backend (BE)
Masuk ke direktori backend dan instal dependensi:

cd BE
npm install

Siapkan Database PostgreSQL:

Masuk ke psql.

Buat database dan pengguna baru (ganti password baru):
import dari .sql yang sudah tertera

Hubungkan ke database baru (\c hero_test) dan jalankan skrip SQL yang ada di file hero_test.sql (di root proyek) untuk membuat semua tabel.

Buat file .env:

Buat file baru bernama .env di dalam folder BE.

Salin konten di bawah ini dan sesuaikan dengan konfigurasi database Anda.

DB_HOST=localhost
DB_PORT=5432
DB_USER=hero_user
DB_PASSWORD=password_baru
DB_NAME=hero_test
PORT=5001
JWT_SECRET=kunci_baru

Jalankan server backend:

node index.js

Server backend sekarang berjalan di http://localhost:5001.

3. Tech Stack folder BE
npm install express pg cors axios jsonwebtoken bcrypt
npm init -y

3.1 Tech Stack folder FE 
npm install axios recharts
npm install tailwindcss @radix-ui/react-icons class-variance-authority clsx
npx shadcn@latest init


4. Konfigurasi Frontend (FE)
Buka terminal baru, lalu masuk ke direktori frontend dan instal dependensi:

cd FE
npm install

Catatan: Anda tidak perlu membuat file .env di frontend untuk pengembangan lokal karena vite.config.js sudah dikonfigurasi untuk menggunakan proxy.

Jalankan server pengembangan frontend:

npm run dev

Aplikasi frontend sekarang dapat diakses di http://localhost:5173 (atau port lain yang ditampilkan di terminal).