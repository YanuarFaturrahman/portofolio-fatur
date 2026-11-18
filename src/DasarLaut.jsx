import { useEffect, useRef, useState } from 'react'
import { kontak } from './data.js'
import { useB } from './bahasa.jsx'

const RUMPUT = [60, 150, 300, 520, 760, 930, 1080, 1150]
const BINTANG = Array.from({ length: 10 }, (_, i) => {
  const a = ((-90 + i * 36) * Math.PI) / 180, r = i % 2 ? 7 : 17
  return `${(460 + Math.cos(a) * r).toFixed(1)},${(148 + Math.sin(a) * r).toFixed(1)}`
}).join(' ')

// Dasar laut: rumput laut bergoyang, karang, bintang laut, kepiting yang lari dari kursor, dan peti harta karun yang bisa dibuka.
export default function DasarLaut({ notif }) {
  const { t } = useB()
  const ref = useRef(null)
  const [buka, setBuka] = useState(false)
  const [kx, setKx] = useState(30)
  const [cepit, setCepit] = useState(false)
  useEffect(() => {
    const el = ref.current
    const gerak = (e) => {
      const b = el.getBoundingClientRect()
      if (e.clientY < b.top - 80 || e.clientY > b.bottom + 40) return
      const px = ((e.clientX - b.left) / b.width) * 100
      setKx((k) => (Math.abs(px - k) < 12 ? Math.max(8, Math.min(88, k + (px < k ? 1 : -1) * (18 + Math.random() * 12))) : k))
    }
    window.addEventListener('pointermove', gerak)
    return () => window.removeEventListener('pointermove', gerak)
  }, [])
  const petik = () => { if (!buka) notif(t.petiBuka); setBuka(!buka); navigator.vibrate?.(12) }
  return (
    <div className="dasar" ref={ref}>
      <svg viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path className="pasir" d="M0 150 Q200 120 400 145 T800 140 T1200 135 V200 H0Z" />
        {RUMPUT.map((x, i) => <path key={x} className="rumput" style={{ animationDelay: -i * 0.6 + 's' }} d={`M${x} 160 q-14 -30 0 -55 q14 -25 0 -50`} />)}
        <g className="karang" stroke="#ff5fb2"><path d="M330 160 v-40 M330 130 l-22 -26 M330 120 l20 -30" /></g>
        <g className="karang" stroke="#ff9a5c"><path d="M640 158 v-50 M640 132 l-24 -22 M640 118 l24 -28 M616 110 l-8 -16" /></g>
        <g className="karang" stroke="#b58cff"><path d="M900 158 v-34 M900 138 l-18 -20 M900 130 l18 -22" /></g>
        <polygon className="bintang" points={BINTANG} />
      </svg>
      <button className={'kepiting' + (cepit ? ' cepit' : '')} style={{ left: kx + '%' }} aria-label={t.kepiting}
        onClick={() => { notif(t.cepit); setCepit(true); setTimeout(() => setCepit(false), 500) }}>
        <svg viewBox="0 0 60 40"><ellipse cx="30" cy="24" rx="16" ry="10" /><path className="kaki" d="M16 26 l-9 8 M18 30 l-7 8 M44 26 l9 8 M42 30 l7 8 M20 14 v-6 M40 14 v-6" /><circle className="capit" cx="8" cy="14" r="6" /><circle className="capit" cx="52" cy="14" r="6" /></svg>
      </button>
      <button className={'peti' + (buka ? ' buka' : '')} aria-pressed={buka} aria-label={t.peti} onClick={petik}>
        <svg viewBox="0 0 80 60"><rect x="6" y="26" width="68" height="30" rx="4" /><g className="tutup"><path d="M6 26 q0-22 34-22 t34 22z" /></g><circle cx="40" cy="30" r="4" /></svg>
        {buka && <span className="peti-gel" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} style={{ left: 10 + i * 8 + '%', animationDelay: i * 0.12 + 's' }} />)}</span>}
      </button>
      {buka && <p className="harta">{t.harta}<a href={kontak.wa}>{t.hartaWa}</a></p>}
    </div>
  )
}
