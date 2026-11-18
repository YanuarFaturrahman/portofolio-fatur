import 'dotenv/config' // harus paling atas supaya .env terbaca sebelum file lain dipakai
import app from './app.js'
import { pastikanTabel, pool } from './db.js'

for (const k of ['DATABASE_URL', 'ADMIN_PASSWORD', 'JWT_SECRET']) {
  if (!process.env[k]) { console.error(`File .env belum lengkap: ${k} kosong. Salin .env.example menjadi .env lalu isi.`); process.exit(1) }
}

const port = Number(process.env.PORT) || 4000
pastikanTabel()
  .then(() => app.listen(port, () => console.log(`Backend siap di http://localhost:${port}`)))
  .catch((e) => { console.error('Gagal terhubung ke database:', e.message); process.exit(1) })

process.on('SIGTERM', () => pool.end().finally(() => process.exit(0)))
