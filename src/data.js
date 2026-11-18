// Semua konten ada di sini. Ubah sesuai kebutuhan.
// Teks dua bahasa ditulis dengan bi('Indonesia', 'English'). Nilai lain dipakai apa adanya di kedua bahasa.
const bi = (id, en) => ({ _bi: [id, en] })
const pilih = (v, i) => {
  if (Array.isArray(v)) return v.map((x) => pilih(x, i))
  if (v && typeof v === 'object') return v._bi ? v._bi[i] : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pilih(x, i)]))
  return v
}

const RAW = {
  profil: {
    nama: 'fatur',
    foto: '/foto.jpg', // taruh file di public/foto.jpg
    fokus: '50% 30%', // posisi bidikan foto di dalam jendela
    peran: 'Software engineer',
    tentang: [
      bi('Saya Fatur, software engineer yang suka menyelam lebih dalam, dari antarmuka di permukaan sampai struktur basis data di dasar sistem.',
         'I’m Fatur, a software engineer who likes to dive deeper, from the interface at the surface down to the database structure at the bottom of the system.'),
      bi('Setiap proyek saya mulai dari pertanyaan sederhana, “masalah apa yang sebenarnya ingin diselesaikan?”, lalu saya bangun jawabannya selapis demi selapis.',
         'I start every project with a simple question, “what problem am I actually trying to solve?”, then build the answer layer by layer.'),
    ],
  },

  // z = zona kedalaman, lv = tingkat penguasaan 1-5, k = penjelasan singkat.
  zona: [
    { id: 'cahaya', nama: bi('Zona Cahaya', 'Sunlight Zone'), dalam: bi('0–200 m', '0–200 m'), ket: bi('Yang langsung dilihat pengguna', 'What users see right away') },
    { id: 'senja', nama: bi('Zona Senja', 'Twilight Zone'), dalam: bi('200–1.000 m', '200–1,000 m'), ket: bi('Mesin di balik layar', 'The engine behind the screen') },
    { id: 'tengah', nama: bi('Zona Tengah Malam', 'Midnight Zone'), dalam: bi('1.000–4.000 m', '1,000–4,000 m'), ket: bi('Tempat data dirancang dan disimpan', 'Where data is designed and stored') },
    { id: 'abisal', nama: bi('Zona Abisal', 'Abyssal Zone'), dalam: bi('di bawah 4.000 m', 'below 4,000 m'), ket: bi('Perangkat keras dan dokumen rekayasa', 'Hardware and engineering documents') },
  ],

  skills: [
    { n: 'React', z: 'cahaya', lv: 5, k: bi('Antarmuka berbasis komponen. Website ini dibuat dengannya.', 'Component-based interfaces. This website is built with it.') },
    { n: 'TypeScript', z: 'cahaya', lv: 4, k: bi('Antarmuka berbasis komponen. Website ini dibuat dengannya.', 'Component-based interfaces. This website is built with it.') },
    { n: 'Vue.js', z: 'cahaya', lv: 4, k: bi('Antarmuka berbasis komponen. Website ini dibuat dengannya.', 'Component-based interfaces. This website is built with it.') },
    { n: 'Laravel', z: 'senja', lv: 5, k: bi('Framework PHP untuk Nexaphone, PanenKeluarga, dan MoneyWise Bootcamp.', 'PHP framework behind Nexaphone, PanenKeluarga, and MoneyWise Bootcamp.') },
    { n: 'Livewire', z: 'senja', lv: 4, k: bi('Dipakai bersama Laravel untuk halaman yang interaktif.', 'Used with Laravel for interactive pages.') },
    { n: 'SvelteKit', z: 'cahaya', lv: 4, k: bi('Dipakai untuk portofolio full stack versi sebelumnya.', 'Used for the previous full-stack version of this portfolio.') },
    { n: 'Tailwind CSS', z: 'cahaya', lv: 4, k: bi('Styling di Exacta Academy dan Habits Track Daily.', 'Styling for Exacta Academy and Habits Track Daily.') },
    { n: 'PHP native', z: 'senja', lv: 5, k: bi('Dasar dari Exacta Academy dan Habits Track Daily.', 'The foundation of Exacta Academy and Habits Track Daily.') },
    { n: 'Go', z: 'senja', lv: 4, k: bi('Dasar dari Exacta Academy dan Habits Track Daily.', 'The foundation of Exacta Academy and Habits Track Daily.') },
    { n: 'Rust', z: 'senja', lv: 4, k: bi('Dasar dari Exacta Academy dan Habits Track Daily.', 'The foundation of Exacta Academy and Habits Track Daily.') },
    { n: 'MySQL', z: 'tengah', lv: 5, k: bi('Basis data untuk proyek-proyek web.', 'Database for the web projects.') },
    { n:  'PostgreSQL', z: 'tengah', lv: 4, k: bi('Perancangan diagram basis data untuk proyek kelas.', 'Database diagram design for class projects.') },
    { n:  'MariaDB', z: 'tengah', lv: 5, k: bi('Perancangan diagram basis data untuk proyek kelas.', 'Database diagram design for class projects.') },
    { n:  'Supabase', z: 'tengah', lv: 5, k: bi('Perancangan diagram basis data untuk proyek kelas.', 'Database diagram design for class projects.') },
    { n:  'MongoDB', z: 'tengah', lv: 4, k: bi('Perancangan diagram basis data untuk proyek kelas.', 'Database diagram design for class projects.') },
    { n:  'SQLite', z: 'tengah', lv: 5, k: bi('Perancangan diagram basis data untuk proyek kelas.', 'Database diagram design for class projects.') },
   { n: 'Arduino Uno', z: 'abisal', lv: 5, k: bi('Firmware untuk mobil robot dengan kamera FPV.', 'Firmware for a robot car with an FPV camera.') },
    { n: 'ESP32-CAM', z: 'abisal', lv: 4, k: bi('Firmware untuk mobil robot dengan kamera FPV.', 'Firmware for a robot car with an FPV camera.') },
    { n: 'SRS', z: 'abisal', lv: 4, k: bi('Dokumen kebutuhan perangkat lunak, misalnya untuk ZR Advertising.', 'Software requirements documents, for example for ZR Advertising.') },
  ],

  // Foto proyek: taruh file di public/proyek/, lalu isi kolom foto, contoh: foto: ['/proyek/exacta-1.jpg']
  // kat memakai kunci 'Web' atau 'Alat' (label tampilannya diatur di bahasa.jsx).
  proyek: [
  
 { nama: bi('KelasKu : Website Manajemen Kelas', 'KelasKu: Class Management Website'),
   kat: 'Web',
   foto: ['/proyek/kelasku.png'],
   demo: 'https://civora.site.je',
   kode: 'https://github.com/usernamekamu/exacta-academy',
   tek: 'PHP native, JavaScript, Tailwind CSS',
   ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', 
  kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'Guardian Digital: Platform Simulasi Literasi Digital untuk Siswa SMA', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },

    { nama: 'KebunGeng, Kebun Virtual Sosial', kat: 'Web',
  foto: ['/proyek/kebungeng.png'],
  demo: 'https://civora.site.je',
  kode: 'https://github.com/usernamekamu/exacta-academy',
  tek: 'PHP native, JavaScript, Tailwind CSS',
  ket: bi('Platform web untuk mengelola jadwal, agenda, tugas, materi, pengumuman, dan uang kas kelas dengan tiga peran: admin, dosen wali, dan mahasiswa.', 'A web platform for managing class schedules, agendas, assignments, materials, announcements, and class funds, with three roles: admin, class advisor, and student.') },
  ],

  // Baris contoh (contoh: true) hanya untuk tampilan. Ganti dengan pengalaman aslimu dan hapus kolom contoh.
  // Foto dokumentasi (opsional): taruh file di public/pengalaman/, lalu isi kolom foto, contoh:
  //   foto: ['/pengalaman/rs-1.jpg', { src: '/pengalaman/rs-2.jpg', ket: bi('Rapat tim', 'Team meeting') }]
  pengalaman: [
    { peran: bi('Manajer Proyek dan Progammer', 'Project Manager and Programmer'), tempat: bi('Klinik Dewi Utama Sentosa', 'Klinik Dewi Utama Sentosa'), lokasi: bi('Subang', 'Subang'), mulai: bi('Januari 2026', 'January 2026'), selesai: bi('Juni 2026', 'Juny 2026'),
      poin: [bi('Merancang dan membangun sistem informasi statistik Klinik Dewi Utama Sentosa berbasis desktop.', 'Designing and building a desktop-based statistical information system for Klinik Dewi Utama Sentosa.')], tek: ['VB.NET', 'Acces'], foto: ['/pengalaman/dewi.jpeg'], contoh: false },
    { peran: bi('Asisten Peneliti', 'Research Assistant'), tempat: bi('Bank Sampah Karya Bakti Sejahtera', 'Bank Sampah Karya Bakti Sejahtera'), lokasi: bi('Subang', 'Subang'), mulai: bi('Januari 2026', 'January 2026'), selesai: bi('Desember 2026', 'December 2026'),
      poin: [bi('Membantu dalam proses literatur, kumpulkan data, bantu olah data.', 'Assist in the literature process, collect data, assist with data processing.')], tek: ['React'], foto: ['/pengalaman/banksampah.jpeg'], contoh: false },
  ],

  // mulai dan selesai berupa angka tahun (selesai boleh 'Sekarang'/'Present'); jumlah cincin karang dihitung dari selisihnya.
  pendidikan: [
    { jenjang: bi('D3', 'D3'), institusi: 'Politeknik Negeri Subang', jurusan: bi('Sistem Informasi', 'Information System'), mulai: 2025, selesai: bi('Sekarang', 'Present'),
      ket: bi('Fokus pada rekayasa perangkat lunak dan perancangan basis data.', 'Focus on software engineering and database design'), contoh: false },
    { jenjang: bi('SMA', 'Senior High School'), institusi: bi('SMA Negeri 3 Tambun Selatan', 'Tambun Selatan 3 Public High School'), jurusan: bi('MIPA', 'Math and Science'), mulai: 2022, selesai: 2025, ket: '', contoh: false },
  ],

  // medali: 'emas' | 'perak' | 'perunggu' | 'mutiara'. Kolom tautan (opsional) untuk bukti atau sertifikat.
  penghargaan: [
  { judul: bi('Bootcamp Digital Content Creator BCTIK 2026', 'Bootcamp Digital Content Creator BCTIK 2026'),
    peringkat: bi('Peserta', 'Participant'),
    pemberi: bi('Jurusan Teknologi Informasi dan Komputer', 'Department of Information and Computer Technology'),
    tahun: '2026',
    medali: 'mutiara',
    tautan: '/sertifikat/bootcamp.jpg' },

  { judul: bi('Panitia Digital Festival 2026 dengan tema "Neonexus : Innovation Meets Imagination"', 'Digital Festival 2026 Organizing Committee, with the theme "Neonexus: Innovation Meets Imagination"'),
    peringkat: bi('Panitia', 'Committee Member'),
    pemberi: bi('Himpunan Mahasiswa Teknologi Informasi dan Komputer Politeknik Negeri Subang', 'Information and Computer Technology Student Association of Subang State Polytechnic'),
    tahun: '2026',
    medali: 'perak',
    tautan: '/sertifikat/difest.jpg' },

  { judul: bi('Peserta Kategori Web Development Dalam Ajang Tingkat Nasional "Switchfest External Competition 2026"', 'Participants in the Web Development Category at the National-Level Event "Switchfest External Competition 2026"'),
    peringkat: bi('Peserta', 'Participant'),
    pemberi: bi('Program Studi Teknologi Informasi UIN Walisongo', 'Information Technology Study Program, UIN Walisongo'),
    tahun: '2026',
    medali: 'mutiara',
    tautan: '/sertifikat/switchfest.jpg' },

  { judul: bi('Juara 3 Kategori "Inovasi Robot Senior" Dalam Lomba "IKMI Robot Competition Tingkat Nasional"', '3rd Place in the "Senior Robot Innovation" Category at the National-Level "IKMI Robot Competition"'),
    peringkat: bi('Juara 3', '3rd Place'),
    pemberi: bi('IKMI Cirebon Robotic Team STIMIK IKMI Cirebon Berkolaborasi Dengan Kopertip Indonesia', 'The IKMI Cirebon Robotic Team from STIMIK IKMI Cirebon Collaborates with Kopertip Indonesia'),
    tahun: '2026',
    medali: 'emas',
    tautan: '/sertifikat/robot.jpeg' },
],
}

// Ganti dengan kontak aslimu.
export const kontak = { email: 'yanuarrahman78@gmail.com', github: 'https://github.com/YanuarFaturrahman', wa: 'https://wa.me/6285714755458' }

export const DATA = { id: pilih(RAW, 0), en: pilih(RAW, 1) }
