# MejaServis di laptop ini

Klik dua kali **Buka MejaServis.cmd**. Tunggu sampai browser terbuka. Alamat aplikasi: http://127.0.0.1:8787.

Setelah komputer dimatikan atau dinyalakan ulang, klik file itu lagi. Menutup tab browser tidak menghapus catatan. Server berjalan di latar belakang dan hanya mendengarkan koneksi dari komputer ini.

## Mulai mencatat

1. Klik **Servis baru**.
2. Isi nama klien, laptop, keluhan, dan tanggal masuk.
3. Catat hasil diagnosis, tindakan servis, total biaya, dan DP.
4. Klik **Simpan catatan**. Buka kembali catatan melalui tombol di kanan baris untuk mengubah status atau pembayaran.

## Data lokal

Data disimpan di folder `.wrangler/state` dalam proyek ini. **Jangan hapus folder tersebut**: untuk penggunaan lokal ini folder tersebut berisi data usaha. Data lokal terpisah dari database website online dan belum disinkronkan otomatis.

Komputer ini sudah dipasangi dependensi dan build aplikasi. Penggunaan pencatatan lokal tidak memerlukan login hosting. Font online bersifat opsional dan akan memakai font cadangan jika internet tidak tersedia. Alamat localhost ini tidak dapat dibuka dari HP atau komputer lain.

## Mencadangkan data

Dari PowerShell pada folder proyek, jalankan perintah berikut dengan nama file cadangan yang berbeda setiap kali:

```powershell
node scripts/backup-local.mjs
```

Salin file `.sqlite` dari folder `backups` ke tempat cadangan yang aman. Nama file otomatis memakai waktu pencadangan. File tersebut memuat data klien dan daftar layanan.

## Daftar layanan dan rincian biaya

Buka **Daftar layanan**, lalu **Tambah layanan**. Isi nama, kategori, deskripsi, dan harga standar. Contoh layanan hanya menjadi isian awal dan belum tersimpan sampai kamu menekan **Simpan layanan**. Layanan bisa dinonaktifkan tanpa menghapus catatan servis sebelumnya.

Pada **Servis baru**, ketik kendala klien dan hasil pemeriksaan admin. Pilih satu atau beberapa layanan, atau tambahkan pekerjaan khusus/sparepart. Atur jumlah dan harga satuan; total serta sisa pembayaran dihitung otomatis. Untuk catatan lama tanpa rincian, biaya manual tetap didukung. Saat menambahkan rincian pertama pada catatan berbiaya, biaya sebelumnya dipertahankan sebagai satu baris agar tidak hilang; sesuaikan atau hapus baris tersebut jika sudah digantikan rincian baru.

## Jika gagal dibuka

Jalankan kembali **Buka MejaServis.cmd**. Jika gagal, lihat `.sites-runtime/local-server-error.log`. Versi ini merupakan website lokal, bukan aplikasi `.exe` mandiri; Node.js dan folder proyek masih diperlukan.
