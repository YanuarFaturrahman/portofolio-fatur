import { useRef, useState } from 'react'
import { useB } from './bahasa.jsx'

const BAUT = Array.from({ length: 12 }, (_, k) => k * 30)
const GEL = [
  { l: '8%', s: 10, t: 6 }, { l: '22%', s: 16, t: 8 }, { l: '78%', s: 12, t: 7 },
  { l: '90%', s: 18, t: 9 }, { l: '60%', s: 8, t: 5.5 }, { l: '40%', s: 13, t: 10 },
]

// Potret dalam jendela kapal selam: cincin teks berputar, cahaya air, miring mengikuti kursor atau jari, dan cipratan saat diklik.
export default function Potret() {
  const { t, d } = useB(), profil = d.profil
  const ref = useRef(null)
  const [rusak, setRusak] = useState(false)
  const [lokal, setLokal] = useState(null)
  const [cipta, setCipta] = useState([])
  const src = lokal || profil.foto
  const teks = `${profil.nama.toUpperCase()} • ${profil.peran.toUpperCase()} • `
  const atur = (rx, ry, gx, gy) => {
    const s = ref.current.style
    s.setProperty('--rx', rx + 'deg'); s.setProperty('--ry', ry + 'deg'); s.setProperty('--gx', gx + '%'); s.setProperty('--gy', gy + '%')
  }
  const gerak = (e) => {
    const b = ref.current.getBoundingClientRect()
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5
    atur((-y * 16).toFixed(1), (x * 16).toFixed(1), (x * 100 + 50).toFixed(0), (y * 100 + 50).toFixed(0))
  }
  const cipratan = () => {
    const id = Date.now()
    setCipta((c) => [...c.slice(-2), id])
    setTimeout(() => setCipta((c) => c.filter((i) => i !== id)), 1300)
    navigator.vibrate?.(10)
  }
  return (
    <div className="potret-wrap">
      <figure className="potret" ref={ref} onPointerMove={gerak} onPointerLeave={() => atur(0, 0, 30, 25)} onClick={cipratan}>
        <svg className="cincin-teks" viewBox="0 0 200 200" aria-hidden="true">
          <defs><path id="lingkar" d="M100 100 m-88 0 a88 88 0 1 1 176 0 a88 88 0 1 1 -176 0" /></defs>
          <text textLength="548" lengthAdjust="spacing"><textPath href="#lingkar">{teks}</textPath></text>
        </svg>
        <div className="jendela">
          {src && !rusak
            ? <img src={src} alt={t.fotoAlt(profil.nama)} style={{ objectPosition: profil.fokus || '50% 30%' }} draggable="false" onError={() => setRusak(true)} />
            : <div className="potret-kosong"><b>{profil.nama[0]}</b><small>{t.fotoKosong}</small></div>}
          <span className="kaustik" /><span className="kilau" />
        </div>
        {BAUT.map((a) => <i key={a} className="baut" style={{ '--a': a + 'deg' }} aria-hidden="true" />)}
        {GEL.map((g, k) => <i key={k} className="gel-potret" style={{ '--l': g.l, '--s': g.s + 'px', '--t': g.t + 's', animationDelay: -k * 1.3 + 's' }} aria-hidden="true" />)}
        {cipta.map((id) => <i key={id} className="cipratan" aria-hidden="true" />)}
        <figcaption>{t.kapten} {profil.nama}.</figcaption>
      </figure>
    </div>
  )
}
