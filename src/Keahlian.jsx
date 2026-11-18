import { useState } from 'react'
import { useB } from './bahasa.jsx'
import Muncul from './Muncul.jsx'

const HUE = [170, 200, 265, 310]

// Penampang samudra: tiap zona punya rel kedalaman dan gelembung berbingkai cincin penguasaan.
// Di samping, jendela kapal selam (porthole) terisi air setinggi tingkat penguasaan keahlian yang dipilih.
export default function Keahlian({ buka }) {
  const { t, d } = useB(), { skills, proyek, zona } = d, LABEL = t.level
  const [selI, setSelI] = useState(0)
  const sel = skills[selI] || skills[0]
  const setSel = (s) => setSelI(skills.indexOf(s))
  if (!sel) return null // belum ada keahlian di database
  const zi = Math.max(0, zona.findIndex((z) => z.id === sel.z))
  const zs = zona[zi]
  return (
    <div className="samudra-skill">
      <div className="peta" role="group" aria-label={t.peta}>
        <div className="salju" aria-hidden="true" />
        {zona.map((z, zi) => (
          <div className="zona" key={z.id} style={{ '--wz': HUE[zi % HUE.length] }}>
            <div className="rel"><span className="dalam">{z.dalam}</span><b>{z.nama}</b><em>{z.ket}</em></div>
            <div className="kolam-zona">
              {skills.filter((s) => s.z === z.id).map((s) => {
                const i = skills.indexOf(s)
                return (
                  <Muncul key={s.id ?? s.n} jenis="pop" delay={i * 80}>
                    <button className={'blb' + (sel === s ? ' pilih' : '')} aria-pressed={sel === s}
                      style={{ '--d': 78 + s.lv * 8 + 'px', '--lv': s.lv, animationDelay: -i * 0.7 + 's' }}
                      onClick={() => { setSel(s); navigator.vibrate?.(10) }}>{s.n}</button>
                  </Muncul>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <Muncul jenis="kanan" className="lekat ">
        <aside className="instrumen" aria-live="polite" style={{ '--wz': HUE[zi % HUE.length] }}>
          <div className="ganti" key={sel.n}>
            <div className="kaca" style={{ '--lv': sel.lv }} role="img" aria-label={t.penguasaan(LABEL[sel.lv], sel.lv)}>
              <div className="air">
                <svg className="ombak" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 10 Q50 0 100 10 T200 10 T300 10 T400 10 V20 H0Z" />
                </svg>
                <svg className="ombak dua" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 10 Q50 20 100 10 T200 10 T300 10 T400 10 V20 H0Z" />
                </svg>
                {[0, 1, 2, 3, 4].map((k) => <i key={k} className="gelembung" style={{ '--x': 14 + k * 17 + '%', '--s': 6 + (k % 3) * 3 + 'px', '--t': 3 + k * 0.6 + 's', '--dl': -k * 0.8 + 's' }} />)}
              </div>
              <b>{sel.lv}<small>/5</small></b>
            </div>
            <span className="lencana">{zs.nama} · {zs.dalam}</span>
            <h3>{sel.n}</h3>
            <div className="skor">
              {[1, 2, 3, 4, 5].map((k) => <i key={k} className={k <= sel.lv ? 'on' : ''} style={{ '--k': k }} />)}
              <span>{LABEL[sel.lv]}</span>
            </div>
          </div>
        </aside>
      </Muncul>
    </div>
  )
}
