import { useEffect, useRef, useState } from 'react'
import { useB } from './bahasa.jsx'

const WARNA = [190, 215, 260, 290, 170, 320, 200]

// Sampul kartu: foto pertama proyek, atau gambar laut otomatis (huruf awal + gelembung) bila belum ada foto.
export function Sampul({ p, i }) {
  const { t } = useB()
  const [rusak, setRusak] = useState(false)
  const f = p.foto?.[0]
  return (
    <div className="sampul">
      {f && !rusak
        ? <img src={f} alt={t.tampilan(p.nama)} loading="lazy" decoding="async" draggable="false" onError={() => setRusak(true)} />
        : <div className="sampul-kosong" style={{ '--h': WARNA[i % WARNA.length] }} aria-hidden="true"><b>{p.nama[0]}</b><i /><i /><i /></div>}
      {p.foto?.length > 1 && <span className="jml">{t.jmlFoto(p.foto.length)}</span>}
    </div>
  )
}

// Galeri foto di lembar detail: geser ke samping atau pakai titik.
export function Galeri({ foto = [], nama }) {
  const { t } = useB()
  const ref = useRef(null)
  const [i, setI] = useState(0)
  if (!foto.length) return null
  const ke = (n) => ref.current.scrollTo({ left: n * ref.current.clientWidth, behavior: 'smooth' })
  return (
    <div className="galeri-wrap" onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
      <div className="galeri" ref={ref} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {foto.map((f, k) => <img key={f} src={f} alt={t.fotoKe(nama, k + 1)} loading="lazy" draggable="false" />)}
      </div>
      {foto.length > 1 && <div className="titik">{foto.map((_, k) => <button key={k} aria-label={t.fotoNo(k + 1)} className={k === i ? 'on' : ''} onClick={() => ke(k)} />)}</div>}
    </div>
  )
}

// Rak proyek: satu proyek besar per layar. Geser ke samping (seret mouse, usap jari, touchpad, tombol, atau panah keyboard): sekali geser = satu proyek.
export default function Rak({ daftar, buka }) {
  const { t } = useB()
  const ref = useRef(null)
  const drag = useRef({ on: false, x: 0, s: 0, dx: 0, geser: false })
  const [idx, setIdx] = useState(0)
  const n = daftar.length
  const lebar = () => ref.current.clientWidth || 1
  const ke = (k) => ref.current.scrollTo({ left: Math.max(0, Math.min(n - 1, k)) * lebar(), behavior: 'smooth' })
  useEffect(() => {
    const el = ref.current
    el.scrollLeft = 0; setIdx(0)
    const cek = () => setIdx(Math.round(el.scrollLeft / (el.clientWidth || 1)))
    el.addEventListener('scroll', cek, { passive: true }); addEventListener('resize', cek)
    return () => { el.removeEventListener('scroll', cek); removeEventListener('resize', cek) }
  }, [n])
  const turun = (e) => { if (e.pointerType === 'mouse' && e.button === 0) drag.current = { on: true, x: e.clientX, s: ref.current.scrollLeft, dx: 0, geser: false } }
  const gerak = (e) => {
    const d = drag.current
    if (!d.on) return
    d.dx = e.clientX - d.x
    if (!d.geser && Math.abs(d.dx) > 6) { d.geser = true; ref.current.classList.add('seret') }
    if (d.geser) ref.current.scrollLeft = d.s - d.dx
  }
  const lepas = () => {
    const d = drag.current
    if (!d.on) return
    d.on = false
    ref.current.classList.remove('seret')
    if (d.geser) ke(Math.round(d.s / lebar()) + (d.dx > lebar() * 0.1 ? -1 : d.dx < -lebar() * 0.1 ? 1 : 0))
  }
  const tombol = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); ke(idx + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ke(idx - 1) }
  }
  return (
    <>
      <div className="rak" ref={ref} role="region" aria-label={t.rak} tabIndex={0} onKeyDown={tombol}
        onPointerDown={turun} onPointerMove={gerak} onPointerUp={lepas} onPointerLeave={lepas} onPointerCancel={lepas}
        onClickCapture={(e) => { if (drag.current.geser) { e.stopPropagation(); e.preventDefault(); drag.current.geser = false } }}>
        {daftar.map((p, i) => (
          <div className="sl" key={p.nama} aria-hidden={i !== idx}>
            <article className="besar">
              <button type="button" className="besar-gambar" onClick={() => buka(p)} aria-label={t.tampilan(p.nama)} tabIndex={i === idx ? 0 : -1}>
                <Sampul p={p} i={i} />
              </button>
              <div className="besar-teks">
                <small className="besar-no">{String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</small>
                <h3>{p.nama}</h3>
                {p.ket && <p>{p.ket}</p>}
                {p.tek && <div className="chip-tek">{p.tek.split(',').map((x) => x.trim()).filter(Boolean).map((x) => <span key={x}>{x}</span>)}</div>}
                <div className="tautan-proyek">
                  <button type="button" onClick={() => buka(p)} tabIndex={i === idx ? 0 : -1}>{t.detail}</button>
                  {p.demo && <a href={p.demo} target="_blank" rel="noreferrer" tabIndex={i === idx ? 0 : -1}>{t.demo} ↗</a>}
                  {p.kode && <a href={p.kode} target="_blank" rel="noreferrer" tabIndex={i === idx ? 0 : -1}>{t.kode} ↗</a>}
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="rak-kendali">
          <button className="gel-btn" onClick={() => ke(idx - 1)} disabled={idx <= 0} aria-label={t.kiri}>‹</button>
          <div className="titik rak-titik">{daftar.map((p, k) => <button key={p.nama} aria-label={t.fotoNo(k + 1)} className={k === idx ? 'on' : ''} onClick={() => ke(k)} />)}</div>
          <button className="gel-btn" onClick={() => ke(idx + 1)} disabled={idx >= n - 1} aria-label={t.kanan}>›</button>
        </div>
      )}
    </>
  )
}
