import { useEffect, useRef, useState } from 'react'
import { useB } from './bahasa.jsx'

// Gelombang sonar digambar di kanvas seukuran layar (bukan elemen 2400px) supaya ringan dan tidak membuat layar HP jadi hitam.
function Gelombang({ x, y, selesai }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = window.innerWidth, H = window.innerHeight
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr)
    c.style.width = W + 'px'; c.style.height = H + 'px'
    ctx.scale(dpr, dpr)
    const DURASI = 2200, KECEPATAN = 0.545 // px per ms, sama dengan waktu kilau benda di ping()
    let t0, raf
    const gambar = (now) => {
      t0 ??= now
      const waktu = now - t0, p = Math.min(1, waktu / DURASI), r = KECEPATAN * waktu, a = 0.95 * (1 - p)
      ctx.clearRect(0, 0, W, H)
      if (r > 0) {
        const g = ctx.createRadialGradient(x, y, Math.max(0, r - 60), x, y, r)
        g.addColorStop(0, 'rgba(109,255,214,0)'); g.addColorStop(1, `rgba(109,255,214,${(0.25 * a).toFixed(3)})`)
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
        ctx.lineWidth = 3; ctx.strokeStyle = `rgba(109,255,214,${a.toFixed(3)})`
        ctx.shadowColor = `rgba(109,255,214,${a.toFixed(3)})`; ctx.shadowBlur = 16
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); ctx.shadowBlur = 0
      }
      if (p < 1) raf = requestAnimationFrame(gambar); else selesai()
    }
    raf = requestAnimationFrame(gambar)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="sonar" aria-hidden="true" />
}

// Dermaga alat selam: sonar (P), badai (B), botol pesan (M).
export default function Alat({ notif }) {
  const { t } = useB()
  const tR = useRef(t); tR.current = t // dipakai di handler yang didaftarkan sekali
  const [ring, setRing] = useState(null)
  const [badai, setBadai] = useState(false)
  const [kilat, setKilat] = useState(false)
  const [botol, setBotol] = useState(null)
  const [suratI, setSuratI] = useState(null)
  const ptr = useRef({ x: innerWidth / 2, y: innerHeight / 2 })
  const ac = useRef(null)
  const fi = useRef(0)
  const diam = matchMedia('(prefers-reduced-motion: reduce)').matches

  const bip = () => {
    try {
      const a = (ac.current ||= new (window.AudioContext || window.webkitAudioContext)())
      const o = a.createOscillator(), g = a.createGain(), t = a.currentTime
      o.type = 'sine'; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(420, t + 1.2)
      g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
      o.connect(g).connect(a.destination); o.start(); o.stop(t + 1.5)
    } catch { /* suara tidak tersedia */ }
  }
  // Sonar: gelombang melebar dari kursor; setiap benda yang terkena berkilau sesuai jaraknya.
  // asal = titik awal gelombang. Lewat tombol: tengah tombol (di HP tidak ada kursor). Lewat tombol P: posisi kursor.
  const ping = (asal) => {
    const { x, y } = asal || ptr.current
    if (!diam) setRing({ x, y, id: Date.now() })
    bip()
    document.querySelectorAll('.kartu,.blb,.peti,.kepiting,.merek,h2').forEach((el) => {
      const b = el.getBoundingClientRect()
      if (b.bottom < 0 || b.top > innerHeight) return
      const d = Math.hypot(b.left + b.width / 2 - x, b.top + b.height / 2 - y)
      setTimeout(() => { el.classList.add('ping'); setTimeout(() => el.classList.remove('ping'), 900) }, d / 0.545)
    })
  }
  const pingTombol = (e) => { const b = e.currentTarget.getBoundingClientRect(); ping({ x: b.left + b.width / 2, y: b.top + b.height / 2 }) }
  const badaiR = useRef(false); badaiR.current = badai // handler tombol keyboard didaftarkan sekali, jadi baca lewat ref
  const ubahBadai = () => { notif(badaiR.current ? tR.current.badaiOff : tR.current.badaiOn); setBadai(!badaiR.current) }
  const kirim = () => setBotol((b) => b || { id: Date.now(), y: 12 + Math.random() * 60, dur: 20 + Math.random() * 8, kanan: Math.random() < 0.5 })
  const bukaBotol = () => { setSuratI(fi.current++ % tR.current.fakta.length); setBotol(null) }

  useEffect(() => {
    const gerak = (e) => { ptr.current = { x: e.clientX, y: e.clientY } }
    const k = (e) => {
      if (e.target.closest?.('input,textarea') || e.metaKey || e.ctrlKey || e.altKey || document.querySelector('.modal')) return
      const t = e.key.toLowerCase()
      if (t === 'p') ping(); else if (t === 'b') ubahBadai(); else if (t === 'm') kirim()
    }
    window.addEventListener('pointermove', gerak); window.addEventListener('keydown', k)
    let iv; const t0 = diam ? 0 : setTimeout(() => { kirim(); iv = setInterval(kirim, 40000) }, 12000)
    return () => { window.removeEventListener('pointermove', gerak); window.removeEventListener('keydown', k); clearTimeout(t0); clearInterval(iv) }
  }, [])
  useEffect(() => {
    document.body.classList.toggle('badai', badai)
    if (!badai || diam) return
    let t
    const lagi = () => { t = setTimeout(() => { setKilat(true); setTimeout(() => setKilat(false), 380); lagi() }, 2500 + Math.random() * 4500) }
    lagi()
    return () => clearTimeout(t)
  }, [badai])

  return (
    <>
      <div className="dermaga" role="toolbar" aria-label={t.alatSelam}>
        <button data-tip={t.tipSonar} aria-label={t.sonar} onClick={pingTombol}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="10" /></svg></button>
        <button data-tip={t.tipBadai} aria-label={t.badai} aria-pressed={badai} onClick={ubahBadai}><svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg></button>
        <button data-tip={t.tipBotol} aria-label={t.botolPesan} onClick={kirim}><svg viewBox="0 0 24 24"><path d="M9 3h6v4l3 4v10H6V11l3-4z" /></svg></button>
      </div>
      {ring && <Gelombang key={ring.id} x={ring.x} y={ring.y} selesai={() => setRing(null)} />}
      <div className={'badai-lapis' + (badai ? ' on' : '')} aria-hidden="true" />
      <div className={'kilat' + (kilat ? ' on' : '')} aria-hidden="true" />
      {botol && (
        <button key={botol.id} className={'botol-laut ' + (botol.kanan ? 'ke-kanan' : 'ke-kiri')} style={{ top: botol.y + '%', animationDuration: botol.dur + 's' }}
          onClick={bukaBotol} onAnimationEnd={() => setBotol(null)} aria-label={t.botolAria}>
          <svg viewBox="0 0 24 24"><path d="M9 3h6v4l3 4v10H6V11l3-4z" /><path d="M9 14h6M9 17h6" /></svg>
        </button>
      )}
      {suratI !== null && (
        <div className="surat" role="dialog" aria-label={t.suratJudul}>
          <strong>{t.suratJudul}</strong>
          <p>{t.fakta[suratI % t.fakta.length]}</p>
          <button onClick={() => setSuratI(null)}>{t.tutup}</button>
        </div>
      )}
    </>
  )
}
