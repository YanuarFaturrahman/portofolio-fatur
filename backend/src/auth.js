import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

const hash = (s) => crypto.createHash('sha256').update(String(s)).digest()
const sama = (a, b) => crypto.timingSafeEqual(hash(a), hash(b))

// Batasi tebak password: 5 kali salah dari satu IP = ditahan 5 menit.
const percobaan = new Map()

export function masuk(req, res) {
  const sekarang = Date.now()
  const c = percobaan.get(req.ip) || { n: 0, sampai: 0 }
  if (c.sampai > sekarang) return res.status(429).json({ error: 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.' })

  if (!sama(req.body?.password ?? '', process.env.ADMIN_PASSWORD)) {
    c.n += 1
    if (c.n >= 5) { c.n = 0; c.sampai = sekarang + 5 * 60 * 1000 }
    percobaan.set(req.ip, c)
    return res.status(401).json({ error: 'Password salah' })
  }
  percobaan.delete(req.ip)
  res.json({ token: jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '12h' }) })
}

// Pasang di rute yang hanya boleh diakses admin.
export function wajibLogin(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '')
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Sesi habis, silakan login lagi' })
  }
}
