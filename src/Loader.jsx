import { useEffect, useRef, useState } from 'react'
import { useB } from './bahasa.jsx'

// Loading screen interaktif: logo terisi air mengikuti progres, kapal selam berlayar di bilah,
// gelembung bisa dipecahkan (+progres), tahan layar untuk menyelam lebih cepat, dan tombol Lewati.
// Progres menunggu font dan halaman benar-benar siap, jadi tidak berhenti di angka palsu.
export default function Loader({ onDone, nama }) {
  const { t, lang, setLang } = useB()
  const L = t.lk
  const [p, setP] = useState(0)
  const [naik, setNaik] = useState(false)
  const [gel, setGel] = useState([])
  const [pecah, setPecah] = useState(0)
  const [tahan, setTahan] = useState(false)
  const pronto = useRef(false), tahanR = useRef(false), uid = useRef(0)
  const kurangGerak = matchMedia('(prefers-reduced-motion: reduce)').matches
  const batas = () => (pronto.current ? 100 : 90)

  // Siap setelah font dan halaman selesai dimuat (maksimal 5 detik menunggu).
  useEffect(() => {
    const font = document.fonts?.ready ?? Promise.resolve()
    const hal = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true }))
    Promise.race([Promise.all([font, hal]), new Promise((r) => setTimeout(r, 5000))]).then(() => { pronto.current = true })
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const iv = setInterval(() => setP((v) => (v >= 100 ? v : Math.min(batas(), v + (1.2 + Math.random() * 1.8) * (tahanR.current ? 3.2 : 1)))), 70)
    const lepas = () => { tahanR.current = false; setTahan(false) }
    addEventListener('pointerup', lepas); addEventListener('pointercancel', lepas)
    return () => { clearInterval(iv); removeEventListener('pointerup', lepas); removeEventListener('pointercancel', lepas); document.body.style.overflow = '' }
  }, [])

  // Gelembung naik dari dasar layar.
  useEffect(() => {
    if (kurangGerak) return
    const buat = () => setGel((a) => (a.length >= 9 ? a : [...a, { id: ++uid.current, x: 4 + Math.random() * 90, s: 28 + Math.random() * 44, t: 5 + Math.random() * 4, dx: Math.random() * 80 - 40 }]))
    const awal = [0, 1, 2, 3].map((i) => setTimeout(buat, i * 160))
    const iv = setInterval(buat, 650)
    return () => { awal.forEach(clearTimeout); clearInterval(iv) }
  }, [])

  const lewati = () => { pronto.current = true; setP(100) }
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape' || e.key === 'Enter') lewati() }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])

  useEffect(() => {
    if (p < 100) return
    const a = setTimeout(() => setNaik(true), 600)
    const b = setTimeout(onDone, 1500)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [p >= 100])

  const pecahkan = (g) => {
    if (g.pecah) return
    setGel((a) => a.map((x) => (x.id === g.id ? { ...x, pecah: true } : x)))
    setTimeout(() => setGel((a) => a.filter((x) => x.id !== g.id)), 320)
    setPecah((n) => n + 1)
    setP((v) => (v >= 100 ? v : Math.min(batas(), v + 4)))
    navigator.vibrate?.(8)
  }
  const gerak = (e) => {
    const b = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height
    const s = e.currentTarget.style
    s.setProperty('--lx', x * 100 + '%'); s.setProperty('--ly', y * 100 + '%'); s.setProperty('--nx', (x - 0.5).toFixed(3)); s.setProperty('--ny', (y - 0.5).toFixed(3))
  }
  const turun = (e) => { if (e.target.closest('button')) return; tahanR.current = true; setTahan(true) }

  const pct = Math.floor(p), tahap = pct >= 100 ? 5 : Math.min(4, Math.floor(pct / 20))
  return (
    <div className={'loader' + (naik ? ' naik' : '') + (tahan ? ' tahan' : '')} style={{ '--p': p + '%' }} onPointerMove={gerak} onPointerDown={turun}>
      <div className="lk-sorot" aria-hidden="true" />
      {gel.map((g) => (
        <button key={g.id} tabIndex={-1} aria-hidden="true" className={'lk-gel' + (g.pecah ? ' pecah' : '')} title={L.pecahkan}
          style={{ left: g.x + '%', width: g.s, height: g.s, '--t': g.t + 's', '--dx': g.dx + 'px' }} onPointerDown={(e) => { e.stopPropagation(); pecahkan(g) }}><i /></button>
      ))}

      <button className="lk-bhs" onClick={() => setLang(lang === 'id' ? 'en' : 'id')} aria-label={t.gantiBahasa}>
        <b className={lang === 'id' ? 'on' : ''}>ID</b><span>·</span><b className={lang === 'en' ? 'on' : ''}>EN</b>
      </button>

      <div className="lk-kata" aria-hidden="true">
        <span className="lk-garis">{nama}.</span>
        <span className="lk-isi">{nama}.</span>
      </div>

      <div className="lk-info" aria-hidden="true">
        <span className="lk-pct">{pct}%</span>
        <span className="lk-dalam">{L.dalam}: {pct * 2} m</span>
      </div>

      <div className="lk-bar" aria-hidden="true">
        <i />
        <svg className="lk-kapal" viewBox="0 0 64 36">
          <path d="M44 6h6M47 6v-4h5" stroke="#e8fbff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <rect x="24" y="6" width="14" height="9" rx="3" fill="#ffd27a" />
          <ellipse cx="30" cy="22" rx="24" ry="11" fill="#ffd27a" />
          <circle cx="22" cy="22" r="3.6" fill="#03050f" /><circle cx="33" cy="22" r="3.6" fill="#03050f" /><circle cx="44" cy="22" r="3.6" fill="#03050f" />
          <path className="lk-baling" d="M54 22l8-7M54 22l8 7" stroke="#e8fbff" strokeWidth="2.6" strokeLinecap="round" />
        </svg>
      </div>

      <p className="lk-tahap" role="status" aria-live="polite">{L.tahap[tahap]}</p>
      <p className="lk-hint">{kurangGerak ? '' : L.hint}</p>
      <div className="lk-bawah">
        {!kurangGerak && <span className="lk-skor" aria-hidden="true">{L.gelPecah}: <b>{pecah}</b></span>}
        <button className="lk-skip" autoFocus onClick={lewati}>{L.lewati} ›</button>
      </div>
    </div>
  )
}
