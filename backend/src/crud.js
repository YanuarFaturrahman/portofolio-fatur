import { Router } from 'express'
import { pool } from './db.js'
import { wajibLogin } from './auth.js'

const bungkus = (fn) => (req, res, next) => fn(req, res, next).catch(next)
const salah = (pesan, status = 400) => Object.assign(new Error(pesan), { status })
const URL_OK = /^(\/|https?:\/\/)/i // hanya alamat web atau file di server ini

// Membuat rute CRUD untuk satu tabel.
//   teks    : kolom teks biasa
//   url     : kolom berisi alamat (harus diawali / atau http)
//   larik   : kolom daftar alamat (TEXT[]), contoh foto
//   daftar  : kolom daftar teks biasa (TEXT[]), contoh poin dan teknologi
//   angka   : kolom angka bulat dengan batas, { kolom: [min, maks] }
//   pilihan : kolom yang nilainya dibatasi, { kolom: [nilai, ...] }
//   wajib   : kolom yang tidak boleh kosong
// Nama tabel dan kolom hanya dari konfigurasi di server.js, tidak pernah dari pengguna.
export function buatCrud(tabel, { teks = [], url = [], larik = [], daftar = [], angka = {}, pilihan = {}, wajib = [] }) {
  const router = Router()

  function bersihkan(body) {
    const d = {}
    for (const k of teks) d[k] = String(body?.[k] ?? '').trim().slice(0, 2000)
    for (const k of url) {
      d[k] = String(body?.[k] ?? '').trim().slice(0, 500)
      if (d[k] && !URL_OK.test(d[k])) throw salah(`Alamat pada kolom "${k}" harus diawali http:// atau https://`)
    }
    for (const k of larik) {
      const v = body?.[k] ?? []
      if (!Array.isArray(v) || v.length > 20 || v.some((x) => typeof x !== 'string')) throw salah(`Kolom "${k}" harus berupa daftar alamat`)
      d[k] = v.map((x) => x.trim()).filter(Boolean)
      if (d[k].some((x) => !URL_OK.test(x))) throw salah(`Alamat pada kolom "${k}" tidak valid`)
    }
    for (const k of daftar) {
      const v = body?.[k] ?? []
      if (!Array.isArray(v) || v.length > 30 || v.some((x) => typeof x !== 'string')) throw salah(`Kolom "${k}" harus berupa daftar teks`)
      d[k] = v.map((x) => x.trim().slice(0, 1000)).filter(Boolean)
    }
    for (const [k, [min, maks]] of Object.entries(angka)) {
      const n = Number(body?.[k])
      if (!Number.isInteger(n) || n < min || n > maks) throw salah(`Kolom "${k}" harus angka bulat ${min} sampai ${maks}`)
      d[k] = n
    }
    for (const [k, ops] of Object.entries(pilihan)) {
      d[k] = String(body?.[k] ?? '')
      if (!ops.includes(d[k])) throw salah(`Kolom "${k}" harus salah satu dari: ${ops.join(', ')}`)
    }
    for (const k of wajib) if (!d[k] || (Array.isArray(d[k]) && !d[k].length)) throw salah(`Kolom "${k}" wajib diisi`)
    return d
  }

  const ambilId = (req) => {
    if (!/^\d+$/.test(req.params.id)) throw salah('ID tidak valid')
    return Number(req.params.id)
  }

  // Publik: dipakai website untuk menampilkan data.
  router.get('/', bungkus(async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM ${tabel} ORDER BY id`)
    res.json(rows)
  }))

  router.get('/:id', bungkus(async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM ${tabel} WHERE id = $1`, [ambilId(req)])
    if (!rows.length) throw salah('Data tidak ditemukan', 404)
    res.json(rows[0])
  }))

  // Khusus admin.
  router.post('/', wajibLogin, bungkus(async (req, res) => {
    const d = bersihkan(req.body)
    const kolom = Object.keys(d)
    const { rows } = await pool.query(
      `INSERT INTO ${tabel} (${kolom.join(', ')}) VALUES (${kolom.map((_, i) => '$' + (i + 1)).join(', ')}) RETURNING *`,
      kolom.map((k) => d[k]),
    )
    res.status(201).json(rows[0])
  }))

  router.put('/:id', wajibLogin, bungkus(async (req, res) => {
    const id = ambilId(req)
    const d = bersihkan(req.body)
    const kolom = Object.keys(d)
    const { rows } = await pool.query(
      `UPDATE ${tabel} SET ${kolom.map((k, i) => `${k} = $${i + 1}`).join(', ')} WHERE id = $${kolom.length + 1} RETURNING *`,
      [...kolom.map((k) => d[k]), id],
    )
    if (!rows.length) throw salah('Data tidak ditemukan', 404)
    res.json(rows[0])
  }))

  router.delete('/:id', wajibLogin, bungkus(async (req, res) => {
    const { rowCount } = await pool.query(`DELETE FROM ${tabel} WHERE id = $1`, [ambilId(req)])
    if (!rowCount) throw salah('Data tidak ditemukan', 404)
    res.status(204).end()
  }))

  return router
}
