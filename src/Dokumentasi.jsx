import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useB } from './bahasa.jsx'

// Foto bisa ditulis '/pengalaman/a.jpg' atau { src: '/pengalaman/a.jpg', ket: bi('Keterangan', 'Caption') }.
const normal = (f) => (typeof f === 'string' ? { src: f, ket: '' } : { src: f.src, ket: f.ket || '' })
const MAKS = 4

// Deretan foto kecil di kartu; ketuk untuk membuka layar penuh.
export default function Dokumentasi({ foto = [], nama }) {
  const { t } = useB()
  const daftar = foto.map(normal).filter((f) => f.src)
  const [rusak, setRusak] = useState({})
  const [buka, setBuka] = useState(null)
  const ok = daftar.map((f, i) => ({ ...f, i })).filter((f) => !rusak[f.src])
  if (!ok.length) return null
  const tampil = ok.slice(0, MAKS), sisa = ok.length - MAKS
  return (
    <>
      <div className="dok" role="group" aria-label={t.dokumentasi}>
        {tampil.map((f, k) => (
          <button key={f.src} type="button" className="dok-foto" aria-label={t.bukaFoto(nama, k + 1)} onClick={() => setBuka(k)}>
            <img src={f.src} alt={f.ket || t.fotoKe(nama, k + 1)} loading="lazy" decoding="async" draggable="false" onError={() => setRusak((r) => ({ ...r, [f.src]: 1 }))} />
            {sisa > 0 && k === MAKS - 1 && <span className="dok-sisa">+{sisa + 1}</span>}
          </button>
        ))}
      </div>
      {buka !== null && <Layar daftar={ok} mulai={buka} nama={nama} tutup={() => setBuka(null)} />}
    </>
  )
}

// Penampil foto layar penuh: panah, Esc, usap dengan jari. Dirender di body supaya tidak terpengaruh animasi kartu.
function Layar({ daftar, mulai, nama, tutup }) {
  const { t } = useB()
  const [i, setI] = useState(mulai)
  const x0 = useRef(0), btn = useRef(null)
  const n = daftar.length
  const geser = useCallback((d) => setI((v) => (v + d + n) % n), [n])
  useEffect(() => {
    const pra = document.activeElement
    btn.current?.focus()
    const key = (e) => {
      if (e.key === 'Escape') tutup()
      else if (e.key === 'ArrowLeft' && n > 1) geser(-1)
      else if (e.key === 'ArrowRight' && n > 1) geser(1)
      else return
      e.preventDefault(); e.stopPropagation()
    }
    addEventListener('keydown', key, true)
    const lama = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { removeEventListener('keydown', key, true); document.body.style.overflow = lama; pra?.focus?.() }
  }, [tutup, geser, n])
  const f = daftar[i]
  return createPortal(
    <div className="dok-tirai" onClick={tutup} role="dialog" aria-modal="true" aria-label={t.dokumentasi + ' · ' + nama}
      onTouchStart={(e) => { x0.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - x0.current; if (n > 1 && Math.abs(dx) > 50) geser(dx < 0 ? 1 : -1) }}>
      <figure onClick={(e) => e.stopPropagation()}>
        <img key={f.src} src={f.src} alt={f.ket || t.fotoKe(nama, i + 1)} draggable="false" />
        <figcaption>{f.ket && <span>{f.ket}</span>}<small>{i + 1} / {n}</small></figcaption>
      </figure>
      {n > 1 && <button type="button" className="dok-nav kiri" aria-label={t.kiri} onClick={(e) => { e.stopPropagation(); geser(-1) }}>‹</button>}
      {n > 1 && <button type="button" className="dok-nav kanan" aria-label={t.kanan} onClick={(e) => { e.stopPropagation(); geser(1) }}>›</button>}
      <button type="button" ref={btn} className="dok-tutup" aria-label={t.tutup} onClick={tutup}>✕</button>
    </div>,
    document.body
  )
}
