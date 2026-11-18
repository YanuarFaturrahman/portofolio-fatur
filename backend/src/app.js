import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cors from 'cors'
import express from 'express'
import { masuk, wajibLogin } from './auth.js'
import { buatCrud } from './crud.js'
import { pastikanTabel } from './db.js'
import { BATAS_MB, UPLOAD_DIR, unggah } from './upload.js'

// Aplikasi Express saja, tanpa app.listen. Dipakai oleh server.js (lokal / server sendiri)
// dan api/index.js (Vercel).
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false)
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim()) : false }))
app.use(express.json({ limit: '200kb' }))

// Pemeriksaan sebelum rute API: isian environment lengkap dan tabel database siap.
const WAJIB_ENV = ['DATABASE_URL', 'ADMIN_PASSWORD', 'JWT_SECRET']
app.use('/api', (req, res, next) => {
  const kurang = WAJIB_ENV.filter((k) => !process.env[k])
  if (kurang.length) return res.status(500).json({ error: `Environment variable belum diisi: ${kurang.join(', ')}` })
  pastikanTabel().then(() => next(), next)
})

app.post('/api/login', masuk)

app.use('/api/proyek', buatCrud('proyek', {
  teks: ['nama_id', 'nama_en', 'tek', 'ket_id', 'ket_en'],
  url: ['demo', 'kode'],
  larik: ['foto'],
  pilihan: { kat: ['Web', 'Alat'] },
  wajib: ['nama_id'],
}))

app.use('/api/penghargaan', buatCrud('penghargaan', {
  teks: ['judul_id', 'judul_en', 'peringkat_id', 'peringkat_en', 'pemberi_id', 'pemberi_en', 'tahun', 'ket_id', 'ket_en'],
  url: ['tautan'],
  pilihan: { medali: ['emas', 'perak', 'perunggu', 'mutiara'] },
  wajib: ['judul_id', 'tahun'],
}))

app.use('/api/keahlian', buatCrud('keahlian', {
  teks: ['nama'],
  pilihan: { zona: ['cahaya', 'senja', 'tengah', 'abisal'] },
  angka: { level: [1, 5] },
  wajib: ['nama'],
}))

app.use('/api/pengalaman', buatCrud('pengalaman', {
  teks: ['peran_id', 'peran_en', 'tempat_id', 'tempat_en', 'lokasi_id', 'lokasi_en', 'mulai_id', 'mulai_en', 'selesai_id', 'selesai_en'],
  larik: ['foto'],
  daftar: ['poin_id', 'poin_en', 'tek'],
  wajib: ['peran_id', 'tempat_id'],
}))

app.post('/api/upload', wajibLogin, ...unggah)
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '7d' }))
app.use('/api', (req, res) => res.status(404).json({ error: 'Rute tidak ditemukan' }))

// Kalau website sudah di-build (npm run build di folder utama), backend ikut menyajikannya
// sehingga satu server cukup untuk website, /admin, dan API.
const DIST = path.resolve(__dirname, '../../dist')
if (fs.existsSync(path.join(DIST, 'index.html'))) {
  app.use(express.static(DIST))
  app.get('*', (req, res, next) => (req.path.startsWith('/uploads/') ? next() : res.sendFile(path.join(DIST, 'index.html'))))
}

app.use((err, req, res, next) => {
  if (err.name === 'MulterError') {
    const pesan = err.code === 'LIMIT_FILE_SIZE' ? `Ukuran gambar maksimal ${BATAS_MB} MB` : 'Unggahan tidak valid'
    return res.status(400).json({ error: pesan })
  }
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Format data tidak valid' })
  if (!err.status) console.error(err)
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Terjadi kesalahan di server' })
})

export default app
