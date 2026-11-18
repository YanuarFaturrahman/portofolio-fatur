import { useEffect, useRef, useState } from 'react'
import { useB } from './bahasa.jsx'

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
  const ping = () => {
    const { x, y } = ptr.current
    setRing({ x, y, id: Date.now() })
    bip()
    document.querySelectorAll('.kartu,.blb,.peti,.kepiting,.merek,h2').forEach((el) => {
      const b = el.getBoundingClientRect()
      if (b.bottom < 0 || b.top > innerHeight) return
      const d = Math.hypot(b.left + b.width / 2 - x, b.top + b.height / 2 - y)
      setTimeout(() => { el.classList.add('ping'); setTimeout(() => el.classList.remove('ping'), 900) }, d / 0.545)
    })
  }
  const ubahBadai = () => setBadai((v) => { notif(v ? tR.current.badaiOff : tR.current.badaiOn); return !v })
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
        <button data-tip={t.tipSonar} aria-label={t.sonar} onClick={ping}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="10" /></svg></button>
        <button data-tip={t.tipBadai} aria-label={t.badai} aria-pressed={badai} onClick={ubahBadai}><svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg></button>
        <button data-tip={t.tipBotol} aria-label={t.botolPesan} onClick={kirim}><svg viewBox="0 0 24 24"><path d="M9 3h6v4l3 4v10H6V11l3-4z" /></svg></button>
      </div>
      {ring && <div key={ring.id} className="sonar" style={{ left: ring.x, top: ring.y }} onAnimationEnd={() => setRing(null)} aria-hidden="true" />}
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
