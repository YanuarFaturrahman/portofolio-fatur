import { useEffect, useRef } from 'react'
import { useB } from './bahasa.jsx'
import Muncul from './Muncul.jsx'
import Dokumentasi from './Dokumentasi.jsx'

// Jalur pelayaran: kapal berlayar menyusuri garis mengikuti gulir halaman dan singgah di setiap pelabuhan (pengalaman).
export default function Pelayaran() {
  const { t, d } = useB(), pengalaman = d.pengalaman
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    let raf = 0
    const hitung = () => {
      raf = 0
      const r = el.getBoundingClientRect(), y = innerHeight * 0.55
      el.style.setProperty('--p', Math.max(0, Math.min(1, (y - r.top) / r.height)).toFixed(4))
      el.querySelectorAll('.kartu-pelayaran').forEach((n) => n.classList.toggle('singgah', n.getBoundingClientRect().top + 40 < y))
    }
    const jadwal = () => { if (!raf) raf = requestAnimationFrame(hitung) }
    hitung()
    addEventListener('scroll', jadwal, { passive: true }); addEventListener('resize', jadwal)
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', jadwal); removeEventListener('resize', jadwal) }
  }, [])
  const contoh = pengalaman.some((p) => p.contoh)
  return (
    <>
      {contoh && <p className="catatan-contoh">{t.catatan(t.bagPengalaman)}</p>}
      <div className="rute" ref={ref}>
        <div className="garis" aria-hidden="true">
          <i className="isi-garis" />
          <svg className="kapal" viewBox="0 0 44 52"><path d="M22 4v34" /><path className="layar" d="M22 6l14 26H22z" /><path className="layar" d="M20 12 8 32h12z" /><path className="lambung" d="M4 40h36l-6 8H10z" /></svg>
        </div>
        {pengalaman.map((e, i) => (
          <Muncul key={e.peran + i} jenis={i % 2 ? 'kanan' : 'kiri'} className={'pelabuhan ' + (i % 2 ? 'sisi-kanan ' : 'sisi-kiri ')}>
            <article className="kartu-pelayaran">
              <span className="jangkar" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 7v14M7 11h10M4 15c0 3.5 3.6 6 8 6s8-2.5 8-6M4 15l2 1M20 15l-2 1" /></svg></span>
              {e.contoh && <span className="pita">{t.contoh}</span>}
              <span className="periode">{e.mulai} – {e.selesai}</span>
              <h3>{e.peran}</h3>
              <p className="tempat">{e.tempat}{e.lokasi ? ' · ' + e.lokasi : ''}</p>
              {e.poin?.length > 0 && <ul className="poin">{e.poin.map((t) => <li key={t}>{t}</li>)}</ul>}
              <Dokumentasi foto={e.foto} nama={e.peran} />
              {e.tek?.length > 0 && <div className="chip-tek">{e.tek.map((t) => <span key={t}>{t}</span>)}</div>}
            </article>
          </Muncul>
        ))}
      </div>
    </>
  )
}
