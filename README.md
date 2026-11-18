# Portofolio Samudra v3

Portofolio bertema laut malam bioluminesens, dibuat dengan React dan Vite.

## Menjalankan
```
npm install
npm run dev
```
Build produksi: `npm run build`. Font Recursive dimuat dari Google Fonts, jadi perlu internet saat pertama dibuka.

## Backend: CRUD proyek, penghargaan, keahlian, dan pengalaman
Proyek, penghargaan, keahlian, dan pengalaman disimpan di database PostgreSQL dan dikelola lewat halaman admin, tanpa mengedit `src/data.js`. Backend memakai Node.js + Express (folder `backend/`). Bagian lain (pendidikan, profil, zona kedalaman) masih di `src/data.js`.

**Sudah punya backend versi sebelumnya?** Hentikan backend lalu jalankan lagi `npm run dev` (tabel `keahlian` dan `pengalaman` dibuat otomatis), kemudian `npm run seed` sekali untuk mengisi dua tabel baru itu dari `data.js`. Seed hanya mengisi tabel yang masih kosong, jadi proyek dan penghargaanmu aman.

### Pasang dan jalankan
1. Buat database kosong, contoh `portofolio`, di PostgreSQL.
2. Siapkan backend:
```
cd backend
npm install
cp .env.example .env      # lalu isi DATABASE_URL, ADMIN_PASSWORD, dan JWT_SECRET
npm run seed              # opsional: memasukkan proyek dan penghargaan lama dari data.js
npm run dev               # backend jalan di http://localhost:4000
```
Tabel dibuat otomatis saat backend menyala (`backend/schema.sql`).
3. Di terminal lain, dari folder utama: `npm install` lalu `npm run dev`. Website di http://localhost:5173, panel admin di **http://localhost:5173/admin** (masuk dengan `ADMIN_PASSWORD`).

### Memakai panel admin
- Tab Proyek, Penghargaan, Keahlian, dan Pengalaman: tambah, ubah, hapus. Setiap isian ada versi Indonesia dan English (kolom English boleh kosong, otomatis memakai versi Indonesia).
- Foto proyek dan foto sertifikat diunggah langsung dari panel (JPG, PNG, WebP, GIF, maksimal 5 MB) dan disimpan di `backend/uploads/`. Folder ini ikut dicadangkan kalau kamu memindahkan server.
- Keahlian: nama, zona kedalaman (Cahaya, Senja, Tengah Malam, Abisal), dan tingkat penguasaan 1 sampai 5.
- Pengalaman: peran, tempat, lokasi, periode, uraian tugas (satu poin per baris; urutan poin Indonesia dan English harus sama), teknologi (pisahkan dengan koma), dan foto dokumentasi.
- Urutan tampil mengikuti urutan input (yang baru ada di akhir).
- Kalau backend mati atau tidak terjangkau, website tetap tampil memakai isi cadangan di `src/data.js`. Kalau tabel di database kosong, bagian itu tampil kosong; jalankan `npm run seed` untuk mengisinya.

### Endpoint API
| Metode | Alamat | Akses |
|---|---|---|
| GET | `/api/proyek`, `/api/penghargaan`, `/api/keahlian`, `/api/pengalaman`, dan `/:id` | publik |
| POST | `/api/proyek`, `/api/penghargaan`, `/api/keahlian`, `/api/pengalaman` | admin |
| PUT / DELETE | `/api/<bagian>/:id` | admin |
| POST | `/api/login` (body `{ "password": "…" }`), `/api/upload` | login / admin |

Akses admin memakai token (JWT, berlaku 12 jam) di header `Authorization: Bearer <token>`. Salah password 5 kali dari satu IP menahan login selama 5 menit.

### Hosting gratis di Vercel + Neon
Seluruh proyek (website, admin, dan API) bisa dihosting dalam satu proyek Vercel, dengan database di Neon dan foto di Vercel Blob. `api/index.js` dan `vercel.json` sudah disiapkan; `backend/src/app.js` adalah aplikasi Express yang dipakai bersama oleh server lokal (`server.js`) dan Vercel.

Environment variable di Vercel (Settings → Environment Variables):
| Nama | Isi |
|---|---|
| `DATABASE_URL` | alamat koneksi dari Neon |
| `DATABASE_SSL` | `true` |
| `ADMIN_PASSWORD` | password untuk `/admin` |
| `JWT_SECRET` | teks acak panjang (minimal 32 karakter) |
| `TRUST_PROXY` | `true` |
| `VITE_WEB3FORMS_KEY` | opsional, kunci formulir kontak |

Jangan isi `VITE_API_URL`, `CORS_ORIGIN`, dan `PORT` (website dan API satu alamat). `BLOB_READ_WRITE_TOKEN` terisi otomatis saat Blob store dihubungkan ke proyek. Di Vercel foto dikirim ke Blob dengan batas 4 MB per foto; saat lokal tetap disimpan di `backend/uploads/` (batas 5 MB).

### Hosting (satu server sendiri)
```
npm run build             # di folder utama, menghasilkan folder dist
cd backend && npm start   # menyajikan website, /admin, dan API sekaligus
```
Di hosting, isi variabel `.env` backend sebagai environment variable. Kalau database-nya layanan seperti Supabase atau Neon, set `DATABASE_SSL=true`. Kalau website dan backend dihosting di alamat berbeda: isi `VITE_API_URL` (frontend) dengan alamat backend, dan `CORS_ORIGIN` (backend) dengan alamat website.

## Formulir kontak (kirim email langsung)
Formulir di bagian Kontak mengirim pesan langsung ke emailmu tanpa membuka aplikasi email, memakai layanan gratis Web3Forms.
1. Buka https://web3forms.com, masukkan emailmu, lalu ambil *Access Key* yang dikirim ke inbox.
2. Salin `.env.example` menjadi `.env`, isi `VITE_WEB3FORMS_KEY=kunci-kamu`.
3. Jalankan ulang `npm run dev` (atau `npm run build` sebelum upload). Saat hosting, isi variabel yang sama di pengaturan environment hosting.
Kalau kunci belum diisi, tombol kembali membuka aplikasi email seperti sebelumnya.

## Mengubah konten
Teks, pendidikan, dan kontak ada di `src/data.js`. Proyek, penghargaan, keahlian, dan pengalaman dikelola lewat panel admin (lihat bagian Backend di atas); isinya di `data.js` hanya cadangan kalau backend mati.

## Yang baru di v3
- Konsep malam: bulan yang bergeser mengikuti kursor, laut gelap, ikan dan plankton menyala (cyan ke magenta).
- Font variabel Recursive. Huruf judul (`src/Huruf.jsx`) berubah bobot, kemiringan, dan gaya casual saat kursor atau jari mendekat. Nama merek, kartu, dan gelembung juga berubah saat disentuh.
- Jejak plankton menyala mengikuti kursor atau jari.
- Pintasan keyboard: `S` menyalakan senter, `1` sampai `4` pindah ke bagian.

- Animasi muncul (v4): huruf judul melompat satu per satu lalu seekor ikan lewat di bawahnya, paragraf naik dari air, gelembung keahlian membesar bergantian, kartu proyek berenang dari kiri dan kanan, kolom formulir menyelip dari samping. Bulan terbit setelah layar pembuka. Semua dimatikan bila perangkat meminta animasi dikurangi.

## Foto dokumentasi pengalaman (v12)
Tiap pengalaman bisa diberi foto dokumentasi. Taruh file di `public/pengalaman/`, lalu isi kolom `foto` pada pengalaman di `src/data.js`:
```
foto: ['/pengalaman/rs-1.jpg', { src: '/pengalaman/rs-2.jpg', ket: bi('Rapat tim', 'Team meeting') }]
```
Foto tampil sebagai gambar kecil di kartu (maksimal 4, sisanya jadi "+N"). Ketuk untuk memperbesar, lalu geser, pakai panah di layar atau keyboard (← →), `Esc` untuk menutup. Keterangan `ket` opsional dan bisa dua bahasa. Komponennya ada di `src/Dokumentasi.jsx`.

## Pengalaman dan Pendidikan (v11)
- Pengalaman: jalur pelayaran. Garis cahaya terisi dan kapal berlayar mengikuti gulir; tiap pengalaman adalah pelabuhan berjangkar yang menyala saat kapal singgah. Kartu bergantian kiri dan kanan di layar lebar, satu jalur di HP.
- Pendidikan: terumbu karang. Tiap kartu punya cincin pertumbuhan, satu cincin per tahun (dihitung dari `mulai` dan `selesai`), yang tumbuh satu per satu saat muncul.
- Isi di `src/data.js` pada daftar `pengalaman` dan `pendidikan`. Baris bertanda `contoh: true` hanya contoh tampilan; ganti dan hapus kolom itu.
- Menu sekarang ada tujuh bagian (pintasan `1` sampai `7`). Di HP, bilah bawah bisa digeser ke samping dan otomatis memusatkan bagian yang aktif.

## Penghargaan (v10)
Menu baru "Penghargaan" (di HP tombolnya bernama Piala). Tiap penghargaan berupa kerang: arahkan kursor atau ketuk, cangkangnya membuka dan memperlihatkan mutiara berwarna emas, perak, perunggu, atau mutiara biasa, lengkap dengan cerita singkat dan tautan bukti.
- Isi di `src/data.js` pada daftar `penghargaan` (judul, peringkat, pemberi, tahun, medali, ket, tautan opsional). Tiga baris awal hanya contoh: ganti isinya dan hapus kolom `contoh: true`.
- Pintasan keyboard `1` sampai `5` sekarang mencakup bagian baru ini.

## Peta keahlian (v9, dirancang ulang di v10)
Keahlian disusun menurut zona kedalaman samudra (Cahaya, Senja, Tengah Malam, Abisal). Ketuk gelembung untuk membuka layar sonar berisi tingkat penguasaan (5 gelembung), penjelasan, proyek yang memakainya, dan keahlian yang sering berpasangan. Dua yang terakhir dihitung otomatis dari kolom `tek` pada proyek.
- Ubah zona dan tingkat penguasaan di `src/data.js`: kolom `z` (id zona) dan `lv` (1 sampai 5). Nilai awal `lv` hanya perkiraan, sesuaikan dengan kemampuanmu.

## Foto profil (v8)
Di bagian Tentang ada potret dalam jendela kapal selam: cincin teks berputar, baut kuningan, cahaya air, miring 3D mengikuti kursor atau jari, dan cipratan saat diklik. Responsif: berdampingan dengan teks di layar lebar, bertumpuk di HP.
- Simpan fotomu sebagai `public/foto-saya.jpg` (atau ubah kolom `foto` di `src/data.js`). Atur bidikan lewat kolom `fokus`.
- Saat `npm run dev` ada tombol "Pratinjau foto" untuk mencoba foto tanpa menyalin file. Tombol ini tidak muncul di versi produksi.
- Tanpa foto, jendela menampilkan huruf awal namamu.

## Dermaga alat selam (v7)
Tiga tombol bulat di pojok kiri bawah, juga bisa lewat keyboard:
- Sonar (`P`): gelombang melebar dari kursor sambil berbunyi bip; kartu proyek, gelembung, dan judul berkilau saat terkena. Suara hanya keluar setelah kamu menekan tombol atau tombol P.
- Badai (`B`): hujan, langit gelap, bagian halaman bergoyang, dan kilat sesekali. Nyala sekali lagi untuk menenangkan laut.
- Botol pesan (`M`): botol hanyut melintas layar tiap sekitar 40 detik; klik untuk membaca fakta laut. Daftar pesan ada di `FAKTA` pada `src/Alat.jsx`.

## Foto proyek dan rak geser (v6)
- Proyek tampil sebagai rak yang bisa digeser ke samping: seret dengan mouse, usap dengan jari, atau pakai tombol gelembung. Penunjuk kedalaman di bawahnya menunjukkan posisi.
- Menambah foto: taruh file di `public/proyek/`, lalu isi kolom `foto` di `src/data.js`, contoh `foto: ['/proyek/exacta-1.jpg', '/proyek/exacta-2.jpg']`. Foto pertama jadi sampul kartu (dalam bingkai jendela kapal), semua foto jadi galeri geser di lembar detail.
- Proyek tanpa foto otomatis memakai sampul laut berwarna dengan huruf awal dan gelembung.

## Isi laut (v5)
- Ubur-ubur menyala (kanvas): muncul di kedalaman, mendekati kursor atau jari, menyembur menjauh saat layar diklik.
- Pari manta melintas sesekali di zona tengah.
- Mercusuar dengan sorot cahaya yang menyapu di hero.
- Dasar laut di bagian bawah: rumput laut bergoyang, karang, bintang laut, kepiting yang lari dari kursor dan bisa dicolek, serta peti harta karun yang bisa dibuka (isinya tautan WhatsApp).

## Fitur dari versi sebelumnya
- Menu menyesuaikan perangkat: bilah atas di PC, bilah tab bawah di layar sempit.
- Kawanan ikan yang menghindari kursor dan mengejar makanan saat diklik.
- Mode Senter, paus di kedalaman 150 m, ukuran kedalaman yang bisa diklik.
- Gelembung keahlian terhubung ke proyek; proyek bisa dicari, difilter, dan dibuka sebagai lembar bawah.
