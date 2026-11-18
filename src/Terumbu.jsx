import { useB } from './bahasa.jsx'
import Muncul from './Muncul.jsx'

const HUE = [330, 15, 190, 280, 150]

// Terumbu pendidikan: setiap cincin pada karang mewakili satu tahun belajar, tumbuh satu per satu saat muncul di layar.
export default function Terumbu() {
  const { t, d } = useB(), pendidikan = d.pendidikan
  const sekarang = new Date().getFullYear()
  const contoh = pendidikan.some((p) => p.contoh)
  return (
    <>
      {contoh && <p className="catatan-contoh">{t.catatan(t.bagPendidikan)}</p>}
      <div className="terumbu">
        {pendidikan.map((e, i) => {
          const th = Math.max(1, (typeof e.selesai === 'number' ? e.selesai : sekarang) - e.mulai)
          return (
            <Muncul key={e.institusi + i} jenis="naik" delay={i * 130}>
              <article className="edu" style={{ '--h': HUE[i % HUE.length] }}>
                {e.contoh && <span className="pita">{t.contoh}</span>}
                <div className="tumbuh" role="img" aria-label={t.tahunAria(th)}>
                  <svg viewBox="0 0 100 100" aria-hidden="true">{Array.from({ length: Math.min(th, 8) }, (_, k) => <circle key={k} cx="50" cy="50" r={11 + k * 5} style={{ '--k': k }} />)}</svg>
                  <b>{th}<small>{t.tahun(th)}</small></b>
                </div>
                <div className="edu-isi">
                  <span className="jenjang">{e.jenjang}</span>
                  <h3>{e.institusi}</h3>
                  {e.jurusan && <p className="jurusan">{e.jurusan}</p>}
                  <small>{e.mulai} – {e.selesai}</small>
                  {e.ket && <p>{e.ket}</p>}
                </div>
              </article>
            </Muncul>
          )
        })}
      </div>
    </>
  )
}
