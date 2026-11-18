import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DATA, kontak } from './data.js'
import { BahasaCtx, STR } from './bahasa.jsx'
import Loader from './Loader.jsx'
import Ikan from './Ikan.jsx'
import Huruf from './Huruf.jsx'
import Muncul from './Muncul.jsx'
import Satwa from './Satwa.jsx'
import Rak, { Galeri } from './Rak.jsx'
import Alat from './Alat.jsx'
import Potret from './Potret.jsx'
import Keahlian from './Keahlian.jsx'
import Penghargaan from './Penghargaan.jsx'
import Pelayaran from './Pelayaran.jsx'
import Terumbu from './Terumbu.jsx'
import DasarLaut from './DasarLaut.jsx'
import { usePerangkat, useSimpan } from './hooks.js'
import { ambilKonten, keBahasa } from './api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const bagian = ['tentang', 'keahlian', 'proyek', 'pengalaman', 'pendidikan', 'penghargaan', 'kontak']
const zonaIdx = (d) => (d < 40 ? 0 : d < 110 ? 1 : d < 170 ? 2 : 3)
const PATH = 'M0 60 Q150 10 300 60 T600 60 T900 60 T1200 60 T1500 60 T1800 60 T2100 60 T2400 60 V120 H0Z'

const IK = {
  pengalaman: 'M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 7v14M7 11h10M4 15c0 3.5 3.6 6 8 6s8-2.5 8-6M4 15l2 1M20 15l-2 1',
  pendidikan: 'M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 9v6',
  penghargaan: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3',
  tentang: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  keahlian: 'M8 17a4 4 0 100-8 4 4 0 000 8zM17 9a3 3 0 100-6 3 3 0 000 6zM17 20a2 2 0 100-4 2 2 0 000 4z',
  proyek: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  kontak: 'M3 6h18v12H3zM3 7l9 7 9-7',
  senter: 'M9 3h6l-1 5h-4zM10 8l-2 13h8l-2-13',
  bahasa: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z',
}
const Ikon = ({ n }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={IK[n]} /></svg>
)

function Hero({ hp, siap, profil }) {
  const [m, setM] = useState({ x: 0, y: 0 })
  const [r, setR] = useState([])
  const gelembung = useMemo(() => Array.from({ length: 24 }, () => ({
    l: Math.random() * 100, s: 6 + Math.random() * 22, d: 8 + Math.random() * 12, w: -Math.random() * 14,
  })), [])
  const pos = (e) => { const b = e.currentTarget.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top, b } }
  return (
    <section className={'hero' + (siap ? ' siap' : '')} onPointerMove={(e) => { const { x, y, b } = pos(e); setM({ x: x / b.width - 0.5, y: y / b.height - 0.5 }) }}
      onClick={(e) => { const { x, y } = pos(e); setR((a) => [...a, { id: Math.random(), x, y }]) }}>
      <div className="sinar" aria-hidden="true" />
      <div className="bulan" aria-hidden="true" style={{ transform: `translate(${m.x * 50}px, ${m.y * 36}px)` }} />
      <div className="gel" aria-hidden="true">
        {gelembung.map((g, i) => <i key={i} style={{ left: g.l + '%', width: g.s, height: g.s, animationDuration: g.d + 's', animationDelay: g.w + 's' }} />)}
      </div>
      {r.map((o) => <span key={o.id} className="riak" style={{ left: o.x, top: o.y }} onAnimationEnd={() => setR((a) => a.filter((q) => q.id !== o.id))} />)}
      <div className="hero-isi" style={{ transform: `translate(${m.x * -24}px, ${m.y * -16}px)` }}>
        <Huruf tag="h1" teks={profil.nama + '.'} radius={280} muncul siap={siap} />
        <p>{profil.peran}</p>
      </div>
      <div className="mercu" aria-hidden="true">
        <i className="sinar-mercu" />
        <svg viewBox="0 0 40 110"><path d="M12 108 L16 30 H24 L28 108Z" /><path d="M13 30 h14 l-2 -10 h-10z" /><rect x="15" y="12" width="10" height="8" /><path d="M13 12 L20 4 L27 12Z" /></svg>
      </div>
      {[0.14, 0.22, 0.34].map((o, i) => (
        <div className="ombak" key={i} style={{ transform: `translateX(${m.x * (i + 1) * -30}px)`, bottom: i * 10 }} aria-hidden="true">
          <svg viewBox="0 0 2400 120" preserveAspectRatio="none" style={{ animationDuration: 14 - i * 3 + 's' }}><path d={PATH} fill={`rgba(232,251,255,${o})`} /></svg>
        </div>
      ))}
    </section>
  )
}

export default function App() {
  const [lang, setLang] = useSimpan('samudra-bahasa', 'id')
  // Proyek dan penghargaan diambil dari backend. null = masih memuat, 'gagal' = backend tidak terjangkau
  // (website tetap tampil memakai isi cadangan di src/data.js).
  const [konten, setKonten] = useState(null)
  useEffect(() => { ambilKonten().then(setKonten).catch(() => setKonten('gagal')) }, [])
  const ctx = useMemo(() => {
    const d = konten && konten !== 'gagal' ? { ...DATA[lang], ...keBahasa(konten, lang) } : DATA[lang]
    return { lang, setLang, t: STR[lang], d }
  }, [lang, konten])
  if (konten === null) return null
  return <BahasaCtx.Provider value={ctx}><Isi /></BahasaCtx.Provider>
}

function Isi() {
  const { lang, setLang, t, d } = useContext(BahasaCtx)
  const { profil, proyek } = d
  const tR = useRef(t); tR.current = t
  const dev = usePerangkat()
  const hp = dev === 'hp'
  const [muat, setMuat] = useState(true)
  const [depth, setDepth] = useState(0)
  const [aktif, setAktif] = useState('tentang')
  const [senter, setSenter] = useSimpan('samudra-senter', false)
  const [paus, setPaus] = useState(false)
  const [menu, setMenu] = useState(false) // menu hamburger (khusus HP)
  const [toast, setToast] = useState('')
  const [kat, setKat] = useState('Semua')
  const [cari, setCari] = useState('')
  const [bukaI, setBukaI] = useState(null)
  const [surel, setSurel] = useState('')
  const [pesan, setPesan] = useState('')
  const [status, setStatus] = useState('diam') // diam | kirim | ok
  const tutup = useRef(null), sudahPaus = useRef(false), swipe = useRef(0), tt = useRef(0)

  const notif = (t) => { setToast(t); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(''), 3200) }

  useEffect(() => {
    const h = document.documentElement
    const s = () => {
      const d = Math.round((h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 200)
      setDepth(d)
      if (d > 150 && !sudahPaus.current) { sudahPaus.current = true; setPaus(true); notif(tR.current.paus) }
    }
    const g = (e) => { h.style.setProperty('--mx', e.clientX + 'px'); h.style.setProperty('--my', e.clientY + 'px') }
    s(); window.addEventListener('scroll', s, { passive: true }); window.addEventListener('pointermove', g)
    return () => { window.removeEventListener('scroll', s); window.removeEventListener('pointermove', g) }
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setAktif(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    bagian.forEach((id) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])

  useEffect(() => { if (!muat) notif(hp ? t.beriMakanHp : t.beriMakanPc) }, [muat])

  useEffect(() => {
    const k = (e) => {
      if (e.target.closest?.('input,textarea') || e.metaKey || e.ctrlKey || e.altKey || document.querySelector('.modal')) return
      if (e.key === 's' || e.key === 'S') setSenter((v) => !v)
      if (e.key === 'l' || e.key === 'L') setLang((v) => (v === 'id' ? 'en' : 'id'))
      const i = Number(e.key)
      if (i >= 1 && i <= bagian.length) document.getElementById(bagian[i - 1])?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  // Menu hamburger: tutup dengan tombol Esc, dan otomatis tertutup kalau layar berubah jadi lebar (PC).
  useEffect(() => { if (!hp) setMenu(false) }, [hp])
  useEffect(() => {
    if (!menu) return
    const k = (e) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [menu])

  useEffect(() => {
    document.documentElement.lang = lang
    document.querySelector('meta[name=description]')?.setAttribute('content', lang === 'id' ? 'Portofolio Fatur, software engineer dan mahasiswa Politeknik Negeri Subang.' : 'Portfolio of Fatur, a software engineer and student at Politeknik Negeri Subang.')
  }, [lang])

  const geser = (n) => setBukaI((i) => (i + n + proyek.length) % proyek.length)
  useEffect(() => {
    if (bukaI === null) return
    tutup.current?.focus()
    const k = (e) => { if (e.key === 'Escape') setBukaI(null); if (e.key === 'ArrowRight') geser(1); if (e.key === 'ArrowLeft') geser(-1) }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [bukaI === null])

  const q = cari.trim().toLowerCase()
  const daftar = proyek.filter((p) => (kat === 'Semua' || p.kat === kat) && (!q || (p.nama + p.tek + p.ket).toLowerCase().includes(q)))
  const buka = bukaI === null ? null : proyek[bukaI]
  // Kirim langsung dari website lewat Web3Forms (kunci akses ada di file .env, lihat README).
  // Kalau kunci belum diisi, otomatis kembali ke cara lama: membuka aplikasi email.
  const kirim = async (e) => {
    e.preventDefault()
    if (status === 'kirim') return
    if (!EMAIL_RE.test(surel.trim())) { notif(t.emailSalah); return }
    const kunci = import.meta.env.VITE_WEB3FORMS_KEY
    if (!kunci) {
      window.location.href = `mailto:${kontak.email}?subject=${encodeURIComponent(t.subjek + surel)}&body=${encodeURIComponent(pesan)}`
      return
    }
    setStatus('kirim')
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: kunci, subject: t.subjek + surel, from_name: surel, email: surel, message: pesan, botcheck: '' }),
      })
      const j = await r.json()
      if (!j.success) throw new Error(j.message)
      setStatus('ok'); setSurel(''); setPesan(''); notif(t.suksesKirim)
      setTimeout(() => setStatus('diam'), 4000)
    } catch {
      setStatus('diam'); notif(t.gagalKirim)
    }
  }
  const salin = () => navigator.clipboard?.writeText(kontak.email).then(() => notif(t.tersalin), () => notif(t.gagalSalin))
  const selam = (e) => { const b = e.currentTarget.getBoundingClientRect(); const f = (e.clientY - b.top) / b.height; const h = document.documentElement; scrollTo({ top: f * (h.scrollHeight - h.clientHeight) }) }
  const miring = (e) => {
    if (e.pointerType !== 'mouse') return
    const b = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--ry', ((e.clientX - b.left) / b.width - 0.5) * 10 + 'deg')
    e.currentTarget.style.setProperty('--rx', ((e.clientY - b.top) / b.height - 0.5) * -10 + 'deg')
  }
  const lurus = (e) => { e.currentTarget.style.setProperty('--ry', '0deg'); e.currentTarget.style.setProperty('--rx', '0deg') }
  const tombolSenter = (
    <button className={'senter-btn' + (senter ? ' nyala' : '')} aria-pressed={senter} onClick={() => setSenter(!senter)} title={t.senterTip}>
      <Ikon n="senter" /><span>{t.senter}</span>
    </button>
  )
  const ubahBahasa = () => { const n = lang === 'id' ? 'en' : 'id'; setLang(n); notif(STR[n].bahasaToast) }
  const tombolBahasa = (
    <button className="bhs-btn" onClick={ubahBahasa} aria-label={t.gantiBahasa} title={t.gantiBahasa + ' (L)'}>
      <Ikon n="bahasa" /><span><b className={lang === 'id' ? 'on' : ''}>ID</b>·<b className={lang === 'en' ? 'on' : ''}>EN</b></span>
    </button>
  )

  return (
    <>
      {muat && <Loader nama={profil.nama} onDone={() => setMuat(false)} />}
      <div className="sorot" aria-hidden="true" />
      <div className="gelap" aria-hidden="true" style={{ opacity: senter ? Math.min(0.94, Math.max(0, (depth - 50) / 90)) : 0 }} />
      {paus && (
        <div className="paus" aria-hidden="true" onAnimationEnd={() => setPaus(false)}>
          <svg viewBox="0 0 400 140"><path d="M10 70C60 20 200 10 300 50c40 15 60-10 95-30-10 35-10 65 0 100-35-20-55-42-95-30C220 125 90 130 10 70z" /></svg>
        </div>
      )}

      <header className="nav">
        <a href="#top" className="merek">{profil.nama}.</a>
        {!hp && (
          <nav aria-label={t.menuUtama}>
            {bagian.map((id) => <a key={id} href={'#' + id} className={aktif === id ? 'aktif' : ''} aria-current={aktif === id ? 'true' : undefined}>{t.nav[id]}</a>)}
            {tombolSenter}{tombolBahasa}
          </nav>
        )}
        {hp && (
          <button type="button" className={'burger' + (menu ? ' buka' : '')} aria-label={menu ? t.tutupMenu : t.bukaMenu} aria-expanded={menu} aria-controls="menu-hp" onClick={() => { setMenu((v) => !v); navigator.vibrate?.(8) }}>
            <span /><span /><span />
          </button>
        )}
      </header>
      {hp && (
        <>
          <div className={'menu-tirai' + (menu ? ' ada' : '')} aria-hidden="true" onClick={() => setMenu(false)} />
          <nav id="menu-hp" className={'menu-hp' + (menu ? ' ada' : '')} aria-label={t.menuUtama}>
            {bagian.map((id) => (
              <a key={id} href={'#' + id} className={aktif === id ? 'aktif' : ''} aria-current={aktif === id ? 'true' : undefined} onClick={() => { setMenu(false); navigator.vibrate?.(8) }}>
                <Ikon n={id} />{t.nav[id]}
              </a>
            ))}
            <div className="menu-alat">{tombolSenter}{tombolBahasa}</div>
          </nav>
        </>
      )}
      <div className="meter" aria-hidden="true" onClick={hp ? undefined : selam} title={hp ? undefined : t.meterTip}>
        <b>{depth} m</b><span>{t.meterZona[zonaIdx(depth)]}</span><i style={{ top: (depth / 200) * 100 + '%' }} />
      </div>

      <main className="laut" id="top">
        <Ikan key={hp ? 16 : 34} jumlah={hp ? 16 : 34} />
        <Satwa key={'s' + hp} jumlah={hp ? 3 : 6} />
        <Hero hp={hp} siap={!muat} profil={profil} />

        <section id="tentang" className="bagian">
          <Huruf tag="h2" teks={t.nav.tentang} muncul />
          <div className="tentang-grid">
            <Muncul jenis="kiri"><Potret /></Muncul>
            <div>
              {profil.tentang.map((t, i) => <Muncul key={t} tag="p" className="isi-teks " delay={i * 160}>{t}</Muncul>)}
            </div>
          </div>
        </section>

        <section id="keahlian" className="bagian">
          <Huruf tag="h2" teks={t.nav.keahlian} muncul />
          <Keahlian buka={(p) => setBukaI(proyek.indexOf(p))} />
        </section>

        <section id="proyek" className="bagian">
          <Huruf tag="h2" teks={t.nav.proyek} muncul />
          <div className="alat">
            <div className="tab" role="group" aria-label={t.filter}>
              {['Semua', 'Web', 'Alat'].map((k) => <button key={k} aria-pressed={kat === k} onClick={() => setKat(k)}>{k === 'Semua' ? t.semua : t.katLabel[k]}</button>)}
            </div>
            <label className="cari"><span className="sr">{t.cariLabel}</span>
              <input type="search" placeholder={t.cariHint} value={cari} onChange={(e) => setCari(e.target.value)} />
            </label>
          </div>
          <p className="sr" aria-live="polite">{t.ditampilkan(daftar.length)}</p>
          <Rak daftar={daftar} buka={(p) => setBukaI(proyek.indexOf(p))} miring={miring} lurus={lurus} />
          {!daftar.length && <p className="kosong">{t.kosong} <button onClick={() => { setCari(''); setKat('Semua') }}>{t.hapusCari}</button></p>}
        </section>

        <section id="pengalaman" className="bagian">
          <Huruf tag="h2" teks={t.nav.pengalaman} muncul />
          <Pelayaran />
        </section>

        <section id="pendidikan" className="bagian">
          <Huruf tag="h2" teks={t.nav.pendidikan} muncul />
          <Terumbu />
        </section>

        <section id="penghargaan" className="bagian">
          <Huruf tag="h2" teks={t.nav.penghargaan} muncul />
          <Penghargaan />
        </section>

        <section id="kontak" className="bagian">
          <Huruf tag="h2" teks={t.nav.kontak} muncul />
          <form className="botol" onSubmit={kirim}>
            <Muncul jenis="kiri"><label>{t.email}<input required type="email" name="email" autoComplete="email" inputMode="email" pattern={EMAIL_RE.source} placeholder="nama@contoh.com" value={surel} title={t.emailSalah}
              onChange={(e) => { setSurel(e.target.value); e.target.setCustomValidity('') }} onInvalid={(e) => e.target.setCustomValidity(t.emailSalah)} /></label></Muncul>
            <Muncul jenis="kanan" delay={120}><label>{t.pesan}<textarea required rows="4" value={pesan} onChange={(e) => setPesan(e.target.value)} /></label></Muncul>
            <Muncul jenis="pop" delay={260} className="mb "><button type="submit" disabled={status === 'kirim'} className={status === 'ok' ? 'hanyut' : ''}>{status === 'kirim' ? t.mengirim : status === 'ok' ? t.terlempar : t.lempar}</button></Muncul>
          </form>
          <Muncul tag="p" className="link " delay={200}><a href={kontak.github}>GitHub</a><a href={kontak.wa}>WhatsApp</a><a href={'mailto:' + kontak.email}>{kontak.email}</a><button className="salin" onClick={salin}>{t.salin}</button></Muncul>
        </section>
        <footer>Fatur · {new Date().getFullYear()}</footer>
        <DasarLaut notif={notif} />
      </main>

      <Alat notif={notif} />

      <div className={'toast' + (toast ? ' ada' : '')} role="status" aria-live="polite">{toast}</div>

      {buka && (
        <div className="tirai" onClick={() => setBukaI(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label={buka.nama} onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { swipe.current = e.touches[0].clientX }}
            onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - swipe.current; if (Math.abs(dx) > 60) geser(dx < 0 ? 1 : -1) }}>
            <Galeri key={'g' + buka.nama} foto={buka.foto} nama={buka.nama} />
            <h3 key={buka.nama}>{buka.nama}</h3><p>{buka.ket}</p><small>{buka.tek}</small>
            {(buka.demo || buka.kode) && (
  <div className="tautan-proyek">
    {buka.demo && <a href={buka.demo} target="_blank" rel="noreferrer">{t.demo} ↗</a>}
    {buka.kode && <a href={buka.kode} target="_blank" rel="noreferrer">{t.kode} ↗</a>}
  </div>
)}
            <div className="aksi">
              <button className="sek" onClick={() => geser(-1)} aria-label={t.sebelumnya}>‹</button>
              <span>{bukaI + 1} / {proyek.length}</span>
              <button className="sek" onClick={() => geser(1)} aria-label={t.berikutnya}>›</button>
              <button ref={tutup} onClick={() => setBukaI(null)}>{t.tutup}</button>
            </div>
            {hp && <small className="petunjuk">{t.geserHint}</small>}
          </div>
        </div>
      )}
    </>
  )
}
