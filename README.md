# E-commerce Node.js dengan MySQL

Proyek ini adalah aplikasi web e-commerce sederhana yang dibangun menggunakan Node.js, Express, Sequelize, dan MySQL. Aplikasi ini memungkinkan pengguna untuk melihat produk, menambah produk ke keranjang belanja, dan melakukan checkout.

## Fitur

- Menampilkan daftar produk
- Menambahkan produk ke keranjang belanja
- Menghapus produk dari keranjang belanja
- Melakukan checkout dan membuat pesanan
- Halaman admin untuk mengatur produk dan pesanan

## Instalasi

Ikuti langkah-langkah di bawah ini untuk menginstal dan menjalankan aplikasi di mesin lokal Anda:

1. **Clone repositori ini:**

    ```bash
    git clone https://github.com/fajarjulyana/e-commerce-nodejs-mysql-bootstraps.git
    cd e-commerce-nodejs-mysql-bootstraps
    ```

2. **Instal dependensi:**

    Pastikan Anda berada di direktori proyek, lalu jalankan perintah berikut:

    ```bash
    npm install
    ```

3. **Konfigurasi Database:**

    Buat database MySQL baru (misalnya, `ecommerce_db`) dan perbarui konfigurasi database di file `config/config.js`:

    ```javascript
    const sequelize = new Sequelize('ecommerce_db', 'root', 'password', {
      host: 'localhost',
      dialect: 'mysql'
    });
    ```

4. **Jalankan migrasi database dan seed data (opsional):**

    Jika Anda memiliki migrasi dan seed data, jalankan perintah berikut:

    ```bash
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```

5. **Jalankan aplikasi:**

    Mulai server aplikasi dengan perintah berikut:

    ```bash
    npm start
    ```

6. **Akses aplikasi:**

    Buka browser Anda dan kunjungi `http://localhost:3000`.

## Struktur Proyek

Berikut adalah struktur direktori utama dari proyek ini:
```
/e-commerce-nodejs-mysql
│
├── /config/              # Konfigurasi database
├── /models/              # Model Sequelize untuk tabel database
├── /routes/              # Rute aplikasi (misalnya, admin, produk)
├── /views/               # Template EJS untuk antarmuka pengguna
├── /public/              # File statis (CSS, JS, gambar)
├── server.js             # File server utama
├── package.json          # Konfigurasi npm dan dependensi proyek
└── README.md             # Dokumentasi proyek
```
## Penggunaan

### Menambahkan Produk Baru (Admin)

1. Masuk ke halaman admin dengan mengunjungi `http://localhost:3000/admin`.
2. Klik "Add Product" untuk menambah produk baru.
3. Isi informasi produk dan klik "Submit" untuk menambahkannya ke database.

### Melihat dan Mengelola Keranjang Belanja

1. Buka halaman utama (`http://localhost:3000`) untuk melihat daftar produk.
2. Klik tombol "Add to Cart" di samping produk yang ingin Anda tambahkan ke keranjang belanja.
3. Kunjungi `http://localhost:3000/cart` untuk melihat keranjang belanja Anda.
4. Anda dapat menghapus item dari keranjang atau melakukan checkout untuk menyelesaikan pesanan.

## Kontribusi

Kontribusi sangat diterima! Silakan buat _pull request_ untuk perubahan besar atau buka _issue_ untuk laporan bug dan saran.

## Lisensi

Proyek ini dilisensikan di bawah lisensi MIT. Silakan lihat file `LICENSE` untuk detail lebih lanjut.

## Kontak

Jika Anda memiliki pertanyaan atau membutuhkan bantuan lebih lanjut, jangan ragu untuk menghubungi kami di [fajarjulyana1@gmail.com].

