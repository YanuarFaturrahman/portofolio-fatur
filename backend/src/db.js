import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: process.env.VERCEL ? 3 : 10, // di Vercel tiap instance cukup beberapa koneksi
})

// Membuat tabel kalau belum ada.
export async function siapkanTabel() {
  const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8')
  await pool.query(sql)
}

// Versi sekali-jalan untuk server: tabel dicek satu kali per instance, bukan tiap permintaan.
let siap
export function pastikanTabel() {
  siap ??= siapkanTabel().catch((e) => { siap = undefined; throw e })
  return siap
}
