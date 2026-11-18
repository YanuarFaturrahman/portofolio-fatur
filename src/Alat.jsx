import { useEffect, useRef, useState } from 'react'
import { useB } from './bahasa.jsx'

// Dermaga alat selam: badai dan botol pesan.
export default function Alat({ notif }) {
  const { t } = useB()
  const tR = useRef(t); tR.current = t // dipakai di handler yang didaftarkan sekali
  const [badai, setBadai] = useState(false)
  const [kilat, setKilat] = useState(false)
  const [botol, setBotol] = useState(null)
  const [suratI, setSuratI] = useState(null)
  const fi = useRef(0)
  const diam = matchMedia('(prefers-reduced-motion: reduce)').matches

  const badaiR = useRef(false); badaiR.current = badai // handler keyboard didaftarkan sekali, jadi baca lewat ref
  // Satu tombol: klik sekali menyalakan badai, klik lagi mematikannya.
  const ubahBadai = () => { const nyala = !badaiR.current; badaiR.current = nyala; setBadai(nyala); notif(nyala ? tR.current.badaiOn : tR.current.badaiOff) }
  // Botol pesan: klik sekali = hidup (botol hanyut melintas dan datang lagi tiap beberapa detik), klik lagi = mati (botol hilang).
  const [botolOn, setBotolOn] = useState(false)
  const botolOnR = useRef(false); botolOnR.current = botolOn
  const botolR = useRef(null); botolR.current = botol
  const kirim = () => {
    if (botolR.current) return
    const b = { id: Date.now(), y: 15 + Math.random() * 55, dur: 14 + Math.random() * 6, kanan: Math.random() < 0.5 }
    botolR.current = b; setBotol(b)
  }
  const ubahBotol = () => {
    const nyala = !botolOnR.current; botolOnR.current = nyala; setBotolOn(nyala)
    if (nyala) { kirim(); notif(tR.current.botolOn) } else { botolR.current = null; setBotol(null); notif(tR.current.botolOff) }
  }
  const bukaBotol = () => { setSuratI(fi.current++ % tR.current.fakta.length); botolR.current = null; setBotol(null) }

  useEffect(() => {
    const k = (e) => {
      if (e.target.closest?.('input,textarea') || e.metaKey || e.ctrlKey || e.altKey || document.querySelector('.modal')) return
      const t = e.key.toLowerCase()
      if (t === 'b') ubahBadai(); else if (t === 'm') ubahBotol()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    if (!botolOn) return
    const iv = setInterval(kirim, 8000) // kirim() tidak melakukan apa-apa selama botol sebelumnya masih ada
    return () => clearInterval(iv)
  }, [botolOn])
  useEffect(() => {
    document.body.classList.toggle('badai', badai)
    setKilat(false)
    if (!badai || diam) return
    let t, t2
    const lagi = () => { t = setTimeout(() => { setKilat(true); t2 = setTimeout(() => setKilat(false), 380); lagi() }, 2500 + Math.random() * 4500) }
    lagi()
    return () => { clearTimeout(t); clearTimeout(t2); setKilat(false) }
  }, [badai])

  return (
    <>
      <div className="dermaga" role="toolbar" aria-label={t.alatSelam}>
        <button aria-label={t.badai} aria-pressed={badai} onClick={ubahBadai}><svg viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg></button>
        <button aria-label={t.botolPesan} aria-pressed={botolOn} onClick={ubahBotol}><svg viewBox="0 0 24 24"><path d="M9 3h6v4l3 4v10H6V11l3-4z" /></svg></button>
      </div>
      <div className={'badai-lapis' + (badai ? ' on' : '')} aria-hidden="true" />
      <div className={'kilat' + (kilat ? ' on' : '')} aria-hidden="true" />
      {botol && (
        <button key={botol.id} className={'botol-laut ' + (botol.kanan ? 'ke-kanan' : 'ke-kiri')} style={{ top: botol.y + '%', animationDuration: botol.dur + 's' }}
          onClick={bukaBotol} onAnimationEnd={() => { botolR.current = null; setBotol(null) }} aria-label={t.botolAria}>
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
