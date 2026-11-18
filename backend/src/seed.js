// Mengisi database dengan konten yang sebelumnya ada di src/data.js.
// Hanya berjalan kalau tabelnya masih kosong, jadi aman dijalankan ulang.
// Pakai: npm run seed
import 'dotenv/config'
import { pool, siapkanTabel } from './db.js'

const KET_WEB_ID = 'Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.'
const KET_WEB_EN = 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.'
const umum = { kat: 'Web', demo: 'https://civora.site.je', kode: 'https://github.com/usernamekamu/exacta-academy', tek: 'PHP native, JavaScript, Tailwind CSS', ket_id: KET_WEB_ID, ket_en: KET_WEB_EN }

const proyek = [
  { ...umum, nama_id: 'KelasKu : Website Manajemen Kelas', nama_en: 'KelasKu: Class Management Website', foto: ['/proyek/kelasku.png'] },
  { ...umum, nama_id: 'KebunGeng, Kebun Virtual Sosial', nama_en: 'KebunGeng, Kebun Virtual Sosial', foto: ['/proyek/kebungeng.png'] },
  { ...umum, nama_id: 'Guardian Digital: Platform Simulasi Literasi Digital untuk Siswa SMA', nama_en: 'Guardian Digital: Platform Simulasi Literasi Digital untuk Siswa SMA', foto: ['/proyek/kebungeng.png'] },
]

const penghargaan = [
  { judul_id: 'Bootcamp Digital Content Creator BCTIK 2026', judul_en: 'Bootcamp Digital Content Creator BCTIK 2026', peringkat_id: 'Peserta', peringkat_en: 'Participant',
    pemberi_id: 'Jurusan Teknologi Informasi dan Komputer', pemberi_en: 'Department of Information and Computer Technology', tahun: '2026', medali: 'mutiara', tautan: '/sertifikat/bootcamp.jpg' },
  { judul_id: 'Panitia Digital Festival 2026 dengan tema "Neonexus : Innovation Meets Imagination"', judul_en: 'Digital Festival 2026 Organizing Committee, with the theme "Neonexus: Innovation Meets Imagination"', peringkat_id: 'Panitia', peringkat_en: 'Committee Member',
    pemberi_id: 'Himpunan Mahasiswa Teknologi Informasi dan Komputer Politeknik Negeri Subang', pemberi_en: 'Information and Computer Technology Student Association of Subang State Polytechnic', tahun: '2026', medali: 'perak', tautan: '/sertifikat/difest.jpg' },
  { judul_id: 'Peserta Kategori Web Development Dalam Ajang Tingkat Nasional "Switchfest External Competition 2026"', judul_en: 'Participants in the Web Development Category at the National-Level Event "Switchfest External Competition 2026"', peringkat_id: 'Peserta', peringkat_en: 'Participant',
    pemberi_id: 'Program Studi Teknologi Informasi UIN Walisongo', pemberi_en: 'Information Technology Study Program, UIN Walisongo', tahun: '2026', medali: 'mutiara', tautan: '/sertifikat/switchfest.jpg' },
  { judul_id: 'Juara 3 Kategori "Inovasi Robot Senior" Dalam Lomba "IKMI Robot Competition Tingkat Nasional"', judul_en: '3rd Place in the "Senior Robot Innovation" Category at the National-Level "IKMI Robot Competition"', peringkat_id: 'Juara 3', peringkat_en: '3rd Place',
    pemberi_id: 'IKMI Cirebon Robotic Team STIMIK IKMI Cirebon Berkolaborasi Dengan Kopertip Indonesia', pemberi_en: 'The IKMI Cirebon Robotic Team from STIMIK IKMI Cirebon Collaborates with Kopertip Indonesia', tahun: '2026', medali: 'emas', tautan: '/sertifikat/robot.jpeg' },
]

const keahlian = [
  ['React', 'cahaya', 5], ['TypeScript', 'cahaya', 4], ['Vue.js', 'cahaya', 4], ['SvelteKit', 'cahaya', 4], ['Tailwind CSS', 'cahaya', 4],
  ['Laravel', 'senja', 5], ['Livewire', 'senja', 4], ['PHP native', 'senja', 5], ['Go', 'senja', 4], ['Rust', 'senja', 4],
  ['MySQL', 'tengah', 5], ['PostgreSQL', 'tengah', 4], ['MariaDB', 'tengah', 5], ['Supabase', 'tengah', 5], ['MongoDB', 'tengah', 4], ['SQLite', 'tengah', 5],
  ['Arduino Uno', 'abisal', 5], ['ESP32-CAM', 'abisal', 4], ['SRS', 'abisal', 4],
].map(([nama, zona, level]) => ({ nama, zona, level }))

const pengalaman = [
  { peran_id: 'Manajer Proyek dan Progammer', peran_en: 'Project Manager and Programmer', tempat_id: 'Klinik Dewi Utama Sentosa', tempat_en: 'Klinik Dewi Utama Sentosa',
    lokasi_id: 'Subang', lokasi_en: 'Subang', mulai_id: 'Januari 2026', mulai_en: 'January 2026', selesai_id: 'Juni 2026', selesai_en: 'June 2026',
    poin_id: ['Merancang dan membangun sistem informasi statistik Klinik Dewi Utama Sentosa berbasis desktop.'],
    poin_en: ['Designing and building a desktop-based statistical information system for Klinik Dewi Utama Sentosa.'],
    tek: ['VB.NET', 'Access'], foto: ['/pengalaman/dewi.jpeg'] },
  { peran_id: 'Asisten Peneliti', peran_en: 'Research Assistant', tempat_id: 'Bank Sampah Karya Bakti Sejahtera', tempat_en: 'Bank Sampah Karya Bakti Sejahtera',
    lokasi_id: 'Subang', lokasi_en: 'Subang', mulai_id: 'Januari 2026', mulai_en: 'January 2026', selesai_id: 'Desember 2026', selesai_en: 'December 2026',
    poin_id: ['Membantu dalam proses literatur, kumpulkan data, bantu olah data.'],
    poin_en: ['Assist in the literature process, collect data, assist with data processing.'],
    tek: ['React'], foto: ['/pengalaman/banksampah.jpeg'] },
]

async function isi(tabel, baris) {
  const { rows } = await pool.query(`SELECT count(*)::int AS n FROM ${tabel}`)
  if (rows[0].n > 0) return console.log(`${tabel}: sudah berisi ${rows[0].n} data, dilewati.`)
  for (const b of baris) {
    const kolom = Object.keys(b)
    await pool.query(`INSERT INTO ${tabel} (${kolom.join(', ')}) VALUES (${kolom.map((_, i) => '$' + (i + 1)).join(', ')})`, kolom.map((k) => b[k]))
  }
  console.log(`${tabel}: ${baris.length} data dimasukkan.`)
}

try {
  await siapkanTabel()
  await isi('proyek', proyek)
  await isi('penghargaan', penghargaan)
  await isi('keahlian', keahlian)
  await isi('pengalaman', pengalaman)
} catch (e) {
  console.error('Seed gagal:', e.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
