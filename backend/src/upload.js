import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Dua cara menyimpan foto:
//  - Lokal / server sendiri : disimpan di folder backend/uploads (alamat /uploads/xxx.jpg).
//  - Vercel                 : disk Vercel tidak permanen, jadi foto dikirim ke Vercel Blob
//                             (alamat penuh https://...). Aktif otomatis di Vercel.
const PAKAI_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL)

// Vercel membatasi isi permintaan ke fungsi maksimal 4,5 MB, jadi di sana batasnya 4 MB per foto.
export const BATAS_MB = PAKAI_BLOB ? 4 : 5

export const UPLOAD_DIR = process.env.UPLOAD_DIR ? path.resolve(process.env.UPLOAD_DIR) : path.resolve(__dirname, '../uploads')
if (!PAKAI_BLOB) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const EKSTENSI = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }
const namaAcak = (mime) => crypto.randomBytes(12).toString('hex') + EKSTENSI[mime]

const multerGambar = multer({
  storage: PAKAI_BLOB
    ? multer.memoryStorage()
    : multer.diskStorage({ destination: UPLOAD_DIR, filename: (req, file, cb) => cb(null, namaAcak(file.mimetype)) }),
  limits: { fileSize: BATAS_MB * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) =>
    EKSTENSI[file.mimetype] ? cb(null, true) : cb(Object.assign(new Error('Hanya gambar JPG, PNG, WebP, atau GIF'), { status: 400 })),
})

// Pakai: app.post('/api/upload', wajibLogin, ...unggah). Mengembalikan { urls: [...] }.
export const unggah = [
  multerGambar.array('files', 10),
  async (req, res, next) => {
    try {
      if (!req.files?.length) return res.status(400).json({ error: 'Pilih minimal satu gambar' })
      if (!PAKAI_BLOB) return res.json({ urls: req.files.map((f) => '/uploads/' + f.filename) })
      const { put } = await import('@vercel/blob') // hanya dimuat di Vercel
      const urls = await Promise.all(req.files.map(async (f) => (
        await put('uploads/' + namaAcak(f.mimetype), f.buffer, { access: 'public', contentType: f.mimetype, addRandomSuffix: false })
      ).url))
      res.json({ urls })
    } catch (e) { next(e) }
  },
]
