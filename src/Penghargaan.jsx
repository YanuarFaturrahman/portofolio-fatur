import { useState } from 'react'
import { useB } from './bahasa.jsx'
import Muncul from './Muncul.jsx'
import Dokumentasi from './Dokumentasi.jsx'

const GAMBAR = /\.(jpe?g|png|webp|gif|avif)$/i

const MT = { emas: '#ffd27a', perak: '#dfe8ff', perunggu: '#e8995e', mutiara: '#6dffd6' }

// Setiap penghargaan adalah kerang: cangkangnya membuka dan memperlihatkan mutiara beserta ceritanya.
// Di layar sentuh, ketuk kerang untuk membuka. Dengan mouse, cukup arahkan kursor.
function Kerang({ p, i }) {
  const { t } = useB()
  const [buka, setBuka] = useState(false)
  const mouse = (e) => e.pointerType === 'mouse'
  // Foto sertifikat langsung tampil: dari kolom foto, atau dari tautan bila tautan itu gambar.
  const gambar = p.foto?.length ? p.foto : GAMBAR.test(p.tautan || '') ? [p.tautan] : []
  const tautanBiasa = p.tautan && !(gambar.length && gambar[0] === p.tautan)
  return (
    <Muncul jenis="pop" delay={i * 110}>
      <div className={'kerang' + (buka ? ' buka' : '')} style={{ '--mt': MT[p.medali] || MT.mutiara }}
        onPointerEnter={(e) => mouse(e) && setBuka(true)} onPointerLeave={(e) => mouse(e) && setBuka(false)}>
        {p.contoh && <span className="pita">{t.contoh}</span>}
        <button className="cangkang" aria-expanded={buka} aria-label={t.bukaP(p.judul)}
          onClick={(e) => { if (e.nativeEvent.pointerType !== 'mouse') { setBuka((b) => !b); navigator.vibrate?.(10) } }}>
          <svg viewBox="0 0 140 100" aria-hidden="true">
            <path className="bawah" d="M10 50 Q70 120 130 50 Z" />
            <g className="atas"><path d="M10 50 Q70 -26 130 50 Z" /><path className="rusuk" d="M70 50 V-2 M44 50 L36 8 M96 50 L104 8 M24 50 L16 20 M116 50 L124 20" /></g>
          </svg>
          <i className="mutiara" />
        </button>
        <em className="peringkat">{p.peringkat}</em>
        <strong>{p.judul}</strong>
        <small>{p.pemberi} · {p.tahun}</small>
        <span className="ket">{p.ket}{tautanBiasa && <> <a href={p.tautan} target="_blank" rel="noreferrer">{t.bukti}</a></>}</span>
        <Dokumentasi foto={gambar} nama={p.judul} />
      </div>
    </Muncul>
  )
}

export default function Penghargaan() {
  const { t, d } = useB(), penghargaan = d.penghargaan
  const contoh = penghargaan.some((p) => p.contoh)
  return (
    <>
      {contoh && <p className="catatan-contoh">{t.catatan(t.bagPenghargaan)}</p>}
      <div className="rak-mutiara">{penghargaan.map((p, i) => <Kerang key={p.judul + i} p={p} i={i} />)}</div>
    </>
  )
}
