import { createContext, useContext } from 'react'

// Konteks bahasa: lang ('id' | 'en'), t = teks antarmuka, d = konten dari data.js, setLang.
export const BahasaCtx = createContext(null)
export const useB = () => useContext(BahasaCtx)

export const STR = {
  id: {
    nav: { tentang: 'Tentang', keahlian: 'Keahlian', proyek: 'Proyek', pengalaman: 'Pengalaman', pendidikan: 'Pendidikan', penghargaan: 'Penghargaan', kontak: 'Kontak' },
    navSingkat: { penghargaan: 'Piala' },
    menuUtama: 'Menu utama', senter: 'Senter', senterTip: 'Lampu selam: laut dalam jadi gelap, kursor jadi senter',
    gantiBahasa: 'Ganti ke bahasa Inggris', bahasaToast: 'Bahasa: Indonesia',
    meterZona: ['Permukaan', 'Zona cahaya', 'Zona senja', 'Laut dalam'], meterTip: 'Klik untuk menyelam ke kedalaman itu',
    paus: 'Seekor paus lewat di kedalaman 150 m', beriMakanHp: 'Ketuk layar untuk memberi makan ikan', beriMakanPc: 'Klik di mana saja untuk memberi makan ikan',
    filter: 'Filter proyek', semua: 'Semua', katLabel: { Web: 'Web', Alat: 'Alat' },
    cariLabel: 'Cari proyek', cariHint: 'Cari proyek atau teknologi', ditampilkan: (n) => `${n} proyek ditampilkan`,
    kosong: 'Tidak ada proyek yang cocok.', hapusCari: 'Hapus pencarian',
    email: 'Email', emailSalah: 'Masukkan alamat email yang valid, contoh: nama@contoh.com', pesan: 'Pesan', lempar: 'Lempar botol', terlempar: 'Botol dilempar', mengirim: 'Mengirim…', suksesKirim: 'Pesan terkirim! Terima kasih, botolmu sudah sampai.', gagalKirim: 'Pesan gagal terkirim. Coba lagi atau hubungi lewat WhatsApp.', subjek: 'Pesan dari ',
    salin: 'Salin email', tersalin: 'Email disalin', gagalSalin: 'Gagal menyalin, salin manual dari tautan',
    sebelumnya: 'Proyek sebelumnya', berikutnya: 'Proyek berikutnya', tutup: 'Tutup', demo: 'Lihat demo', kode: 'Lihat kode', geserHint: 'Geser ke samping untuk berpindah proyek.',
    // Potret
    kapten: 'Kapten', fotoAlt: (n) => `Foto ${n}`, fotoKosong: 'Taruh foto di public/foto.jpg',
    // Rak & Galeri
    rak: 'Daftar proyek, geser ke samping', tampilan: (n) => `Tampilan ${n}`, jmlFoto: (n) => `${n} foto`, fotoKe: (n, k) => `${n}, foto ${k}`, fotoNo: (k) => `Foto ${k}`, dokumentasi: 'Foto dokumentasi', detail: 'Lihat detail', bukaFoto: (n, k) => `Perbesar foto ${k} dari ${n}`, kiri: 'Geser ke kiri', kanan: 'Geser ke kanan',
    // Keahlian
    level: ['', 'Baru kenal', 'Sedang belajar', 'Cukup mahir', 'Mahir', 'Andalan'], peta: 'Peta keahlian menurut kedalaman',
    penguasaan: (l, n) => `Penguasaan ${l}, ${n} dari 5`,
    // Penghargaan / Pelayaran / Terumbu
    mutiara: (n) => `${n} mutiara terkumpul. Arahkan kursor atau ketuk kerang untuk membukanya.`, bukaP: (j) => `Buka penghargaan ${j}`, bukti: 'Lihat bukti', contoh: 'Contoh',
    catatan: (bag) => `Ini baru contoh tampilan. Ganti isinya di src/data.js (bagian ${bag}).`, bagPenghargaan: 'penghargaan', bagPengalaman: 'pengalaman', bagPendidikan: 'pendidikan',
    layar: 'Gulir untuk berlayar. Kapal singgah di setiap pelabuhan pengalaman.',
    karang: 'Seperti karang yang menambah satu cincin tiap tahun, setiap cincin di bawah mewakili satu tahun belajar.', tahun: (n) => 'tahun', tahunAria: (n) => `${n} tahun`,
    // Alat & dasar laut
    alatSelam: 'Alat selam', sonar: 'Sonar', badai: 'Badai', botolPesan: 'Botol pesan', tipSonar: 'Sonar (P)', tipBadai: 'Badai (B)', tipBotol: 'Botol pesan (M)',
    badaiOn: 'Badai datang! Pegangan yang kuat', badaiOff: 'Laut kembali tenang', botolAria: 'Botol pesan hanyut, klik untuk membuka', suratJudul: 'Pesan dalam botol',
    fakta: [
      'Lebih dari 80% dasar laut dunia belum pernah dipetakan atau dijelajahi manusia.',
      'Palung Mariana sedalam sekitar 11 km. Gunung Everest pun akan tenggelam di dalamnya.',
      'Ubur-ubur sudah ada sejak ratusan juta tahun lalu, jauh sebelum dinosaurus.',
      'Sekitar separuh oksigen di Bumi berasal dari plankton dan tumbuhan laut.',
      'Gurita punya tiga jantung dan darah berwarna biru.',
      'Cahaya matahari hanya menembus sekitar 200 m. Di bawahnya gelap, dan banyak makhluk membuat cahayanya sendiri.',
      'Indonesia negara kepulauan dengan belasan ribu pulau, dan lautnya lebih luas daripada daratannya.',
      'Pesan dari Fatur: kalau butuh website atau alat buatan sendiri, lempar botol balasan lewat bagian Kontak.',
    ],
    petiBuka: 'Peti terbuka! Ada harta karun di dalamnya', kepiting: 'Kepiting', cepit: 'Cepit!', peti: 'Peti harta karun',
    harta: 'Harta karunnya: ide yang siap dibangun. ', hartaWa: 'Ajak bicara lewat WhatsApp',
    // Loader
    lk: {
      menyelam: 'Menyelam…', lewati: 'Lewati', gelPecah: 'Gelembung pecah', dalam: 'Kedalaman',
      hint: 'Pecahkan gelembung atau tahan layar untuk menyelam lebih cepat',
      tahap: ['Mengisi tabung oksigen…', 'Menyalakan lampu selam…', 'Memeriksa tekanan air…', 'Memetakan dasar laut…', 'Hampir sampai di dasar…', 'Siap! Selamat datang di bawah laut'],
      pecahkan: 'Pecahkan gelembung',
    },
  },
  en: {
    nav: { tentang: 'About', keahlian: 'Skills', proyek: 'Projects', pengalaman: 'Experience', pendidikan: 'Education', penghargaan: 'Awards', kontak: 'Contact' },
    navSingkat: {},
    menuUtama: 'Main menu', senter: 'Flashlight', senterTip: 'Dive light: the deep sea goes dark and your cursor becomes a flashlight',
    gantiBahasa: 'Switch to Indonesian', bahasaToast: 'Language: English',
    meterZona: ['Surface', 'Sunlight zone', 'Twilight zone', 'Deep sea'], meterTip: 'Click to dive to that depth',
    paus: 'A whale swam by at 150 m depth', beriMakanHp: 'Tap the screen to feed the fish', beriMakanPc: 'Click anywhere to feed the fish',
    filter: 'Project filter', semua: 'All', katLabel: { Web: 'Web', Alat: 'Hardware' },
    cariLabel: 'Search projects', cariHint: 'Search projects or technology', ditampilkan: (n) => `${n} ${n === 1 ? 'project' : 'projects'} shown`,
    kosong: 'No matching projects.', hapusCari: 'Clear search',
    email: 'Email', emailSalah: 'Enter a valid email address, e.g. name@example.com', pesan: 'Message', lempar: 'Throw the bottle', terlempar: 'Bottle thrown', mengirim: 'Sending…', suksesKirim: 'Message sent! Thank you, your bottle has arrived.', gagalKirim: 'Message failed to send. Try again or reach me on WhatsApp.', subjek: 'Message from ',
    salin: 'Copy email', tersalin: 'Email copied', gagalSalin: 'Copy failed, copy it manually from the link',
    sebelumnya: 'Previous project', berikutnya: 'Next project', tutup: 'Close', demo: 'View demo', kode: 'View code', geserHint: 'Swipe sideways to switch projects.',
    kapten: 'Captain', fotoAlt: (n) => `Photo of ${n}`, fotoKosong: 'Put your photo at public/foto.jpg',
    rak: 'Project list, scroll sideways', tampilan: (n) => `Preview of ${n}`, jmlFoto: (n) => `${n} photos`, fotoKe: (n, k) => `${n}, photo ${k}`, fotoNo: (k) => `Photo ${k}`, dokumentasi: 'Documentation photos', detail: 'View details', bukaFoto: (n, k) => `Enlarge photo ${k} of ${n}`, kiri: 'Scroll left', kanan: 'Scroll right',
    level: ['', 'Just getting started', 'Learning', 'Competent', 'Proficient', 'Core strength'], peta: 'Skill map by depth',
    penguasaan: (l, n) => `Proficiency: ${l}, ${n} of 5`,
    mutiara: (n) => `${n} ${n === 1 ? 'pearl' : 'pearls'} collected. Hover or tap a shell to open it.`, bukaP: (j) => `Open award ${j}`, bukti: 'View proof', contoh: 'Sample',
    catatan: (bag) => `This is only a sample layout. Replace the content in src/data.js (${bag} section).`, bagPenghargaan: 'awards', bagPengalaman: 'experience', bagPendidikan: 'education',
    layar: 'Scroll to set sail. The ship stops at every port of experience.',
    karang: 'Like coral adding one ring each year, every ring below represents one year of study.', tahun: (n) => (n === 1 ? 'year' : 'years'), tahunAria: (n) => `${n} ${n === 1 ? 'year' : 'years'}`,
    alatSelam: 'Diving tools', sonar: 'Sonar', badai: 'Storm', botolPesan: 'Message bottle', tipSonar: 'Sonar (P)', tipBadai: 'Storm (B)', tipBotol: 'Message bottle (M)',
    badaiOn: 'A storm is coming! Hold on tight', badaiOff: 'The sea is calm again', botolAria: 'A message bottle is drifting by, click to open', suratJudul: 'Message in a bottle',
    fakta: [
      'More than 80% of the world’s seafloor has never been mapped or explored by humans.',
      'The Mariana Trench is about 11 km deep. Even Mount Everest would sink inside it.',
      'Jellyfish have existed for hundreds of millions of years, long before the dinosaurs.',
      'About half of Earth’s oxygen comes from plankton and marine plants.',
      'An octopus has three hearts and blue blood.',
      'Sunlight only reaches about 200 m down. Below that it is dark, and many creatures make their own light.',
      'Indonesia is an archipelago of more than ten thousand islands, and its seas cover more area than its land.',
      'A note from Fatur: if you need a website or a custom-built tool, send a bottle back through the Contact section.',
    ],
    petiBuka: 'The chest is open! There is treasure inside', kepiting: 'Crab', cepit: 'Snap!', peti: 'Treasure chest',
    harta: 'The treasure: ideas ready to be built. ', hartaWa: 'Start a chat on WhatsApp',
    lk: {
      menyelam: 'Diving…', lewati: 'Skip', gelPecah: 'Bubbles popped', dalam: 'Depth',
      hint: 'Pop the bubbles or press and hold the screen to dive faster',
      tahap: ['Filling the oxygen tank…', 'Switching on the dive light…', 'Checking the water pressure…', 'Mapping the seabed…', 'Almost at the bottom…', 'Ready! Welcome to the deep'],
      pecahkan: 'Pop the bubble',
    },
  },
}
