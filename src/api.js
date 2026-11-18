// Penghubung ke backend. Kosongkan VITE_API_URL kalau website dan backend satu alamat
// (mode pengembangan memakai proxy di vite.config.js).
export const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

// File yang diunggah lewat admin disimpan di backend (/uploads/...), jadi alamatnya perlu diberi BASE.
export const fileUrl = (u) => (u && u.startsWith('/uploads/') ? BASE + u : u || '')

async function ambil(path) {
  const c = new AbortController()
  const t = setTimeout(() => c.abort(), 6000)
  try {
    const r = await fetch(BASE + path, { signal: c.signal })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    return await r.json()
  } finally { clearTimeout(t) }
}

const BAGIAN = ['proyek', 'penghargaan', 'keahlian', 'pengalaman']

// Tiap bagian diambil sendiri-sendiri: kalau satu gagal (misalnya backend belum dimulai ulang setelah pembaruan),
// bagian itu saja yang memakai isi cadangan di data.js. Baru kalau semuanya gagal, dianggap backend mati.
export async function ambilKonten() {
  const hasil = await Promise.allSettled(BAGIAN.map((n) => ambil('/api/' + n)))
  if (hasil.every((h) => h.status === 'rejected')) throw hasil[0].reason
  return Object.fromEntries(BAGIAN.map((n, i) => [n, hasil[i].status === 'fulfilled' ? hasil[i].value : null]))
}

// Mengubah baris database (kolom _id dan _en) menjadi bentuk yang dipakai komponen, sesuai bahasa aktif.
// Bagian yang null (gagal diambil) tidak disertakan sehingga App memakai isi cadangan.
export function keBahasa({ proyek, penghargaan, keahlian, pengalaman }, lang) {
  const p = (r, k) => (lang === 'en' && r[k + '_en']) || r[k + '_id'] || ''
  // Poin dipasangkan menurut urutan; kalau terjemahan English kurang, poin itu memakai versi Indonesia.
  const poin = (r) => (r.poin_id || []).map((x, i) => (lang === 'en' && r.poin_en?.[i]) || x)
  const o = {}
  if (proyek) o.proyek = proyek.map((r) => ({
    nama: p(r, 'nama'), kat: r.kat, foto: (r.foto || []).map(fileUrl),
    demo: r.demo || '', kode: r.kode || '', tek: r.tek || '', ket: p(r, 'ket'),
  }))
  if (penghargaan) o.penghargaan = penghargaan.map((r) => ({
    judul: p(r, 'judul'), peringkat: p(r, 'peringkat'), pemberi: p(r, 'pemberi'),
    tahun: r.tahun, medali: r.medali, ket: p(r, 'ket'), tautan: fileUrl(r.tautan), contoh: false,
  }))
  if (keahlian) o.skills = keahlian.map((r) => ({ id: r.id, n: r.nama, z: r.zona, lv: r.level }))
  if (pengalaman) o.pengalaman = pengalaman.map((r) => ({
    peran: p(r, 'peran'), tempat: p(r, 'tempat'), lokasi: p(r, 'lokasi'), mulai: p(r, 'mulai'), selesai: p(r, 'selesai'),
    poin: poin(r), tek: r.tek || [], foto: (r.foto || []).map(fileUrl), contoh: false,
  }))
  return o
}
