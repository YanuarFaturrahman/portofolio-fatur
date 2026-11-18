import { useEffect, useRef, useState } from 'react'
import { BASE, fileUrl } from './api.js'

const KUNCI = 'admin-token'

// Satu fungsi untuk semua permintaan ke backend.
async function minta(path, { method = 'GET', body, form, token } = {}) {
  const headers = {}
  if (token) headers.Authorization = 'Bearer ' + token
  if (body) headers['Content-Type'] = 'application/json'
  const r = await fetch(BASE + path, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) })
  const j = r.status === 204 ? null : await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(j?.error || (r.status === 413 ? 'Ukuran gambar terlalu besar. Kecilkan dulu (maksimal 4 MB).' : `Terjadi kesalahan (${r.status})`)), { status: r.status })
  return j
}

const ZONA = { cahaya: 'Zona Cahaya (tampilan)', senja: 'Zona Senja (mesin di balik layar)', tengah: 'Zona Tengah Malam (basis data)', abisal: 'Zona Abisal (perangkat keras & dokumen)' }
const TINGKAT = ['', 'Baru kenal', 'Sedang belajar', 'Cukup mahir', 'Mahir', 'Andalan']

// Definisi formulir. k = nama kolom di database.
const TABEL = {
  proyek: {
    nama: 'Proyek', judul: (r) => r.nama_id, sub: (r) => `${r.kat}${r.tek ? ' · ' + r.tek : ''}`,
    gambar: (r) => r.foto?.[0],
    kosong: { nama_id: '', nama_en: '', kat: 'Web', tek: '', demo: '', kode: '', ket_id: '', ket_en: '', foto: [] },
    bidang: [
      { k: 'nama_id', l: 'Nama proyek (Indonesia)', wajib: true },
      { k: 'nama_en', l: 'Nama proyek (English)', bantu: 'Kosongkan bila sama dengan bahasa Indonesia.' },
      { k: 'kat', l: 'Kategori', tipe: 'pilih', opsi: [['Web', 'Web'], ['Alat', 'Alat']] },
      { k: 'tek', l: 'Teknologi', bantu: 'Pisahkan dengan koma. Dipakai untuk menghubungkan proyek ke peta keahlian, contoh: PHP native, JavaScript' },
      { k: 'demo', l: 'Tautan demo', ph: 'https://…' },
      { k: 'kode', l: 'Tautan kode', ph: 'https://github.com/…' },
      { k: 'ket_id', l: 'Deskripsi (Indonesia)', tipe: 'area' },
      { k: 'ket_en', l: 'Deskripsi (English)', tipe: 'area' },
      { k: 'foto', l: 'Foto proyek', tipe: 'foto', bantu: 'Foto pertama menjadi sampul kartu.' },
    ],
  },
  penghargaan: {
    nama: 'Penghargaan', judul: (r) => r.judul_id, sub: (r) => `${r.peringkat_id ? r.peringkat_id + ' · ' : ''}${r.tahun} · ${r.medali}`,
    gambar: (r) => (/\.(jpe?g|png|webp|gif|avif)$/i.test(r.tautan || '') ? r.tautan : ''),
    kosong: { judul_id: '', judul_en: '', peringkat_id: '', peringkat_en: '', pemberi_id: '', pemberi_en: '', tahun: String(new Date().getFullYear()), medali: 'mutiara', ket_id: '', ket_en: '', tautan: '' },
    bidang: [
      { k: 'judul_id', l: 'Judul penghargaan (Indonesia)', wajib: true },
      { k: 'judul_en', l: 'Judul penghargaan (English)' },
      { k: 'peringkat_id', l: 'Peringkat (Indonesia)', ph: 'Juara 1, Peserta, Panitia…' },
      { k: 'peringkat_en', l: 'Peringkat (English)', ph: '1st Place, Participant…' },
      { k: 'pemberi_id', l: 'Pemberi / penyelenggara (Indonesia)' },
      { k: 'pemberi_en', l: 'Pemberi / penyelenggara (English)' },
      { k: 'tahun', l: 'Tahun', wajib: true },
      { k: 'medali', l: 'Mutiara', tipe: 'pilih', opsi: [['emas', 'Emas'], ['perak', 'Perak'], ['perunggu', 'Perunggu'], ['mutiara', 'Mutiara biasa']] },
      { k: 'ket_id', l: 'Cerita singkat (Indonesia)', tipe: 'area' },
      { k: 'ket_en', l: 'Cerita singkat (English)', tipe: 'area' },
      { k: 'tautan', l: 'Foto sertifikat atau tautan bukti', tipe: 'tautan', bantu: 'Unggah foto sertifikat, atau isi tautan https://… sebagai bukti.' },
    ],
  },
  keahlian: {
    nama: 'Keahlian', judul: (r) => r.nama, sub: (r) => `${ZONA[r.zona] || r.zona} · ${r.level}/5 ${TINGKAT[r.level] || ''}`,
    gambar: () => '',
    kosong: { nama: '', zona: 'cahaya', level: '3' },
    bidang: [
      { k: 'nama', l: 'Nama keahlian', wajib: true, ph: 'React, Laravel, PostgreSQL…' },
      { k: 'zona', l: 'Zona kedalaman', tipe: 'pilih', opsi: Object.entries(ZONA), bantu: 'Menentukan di bagian peta mana gelembung keahlian ini muncul.' },
      { k: 'level', l: 'Tingkat penguasaan', tipe: 'pilih', opsi: [1, 2, 3, 4, 5].map((n) => [String(n), `${n} · ${TINGKAT[n]}`]), bantu: 'Menentukan ukuran gelembung dan tinggi air di jendela kapal selam.' },
    ],
  },
  pengalaman: {
    nama: 'Pengalaman', judul: (r) => r.peran_id, sub: (r) => `${r.tempat_id}${r.mulai_id || r.selesai_id ? ' · ' + r.mulai_id + ' – ' + r.selesai_id : ''}`,
    gambar: (r) => r.foto?.[0],
    kosong: { peran_id: '', peran_en: '', tempat_id: '', tempat_en: '', lokasi_id: '', lokasi_en: '', mulai_id: '', mulai_en: '', selesai_id: '', selesai_en: '', poin_id: [], poin_en: [], tek: [], foto: [] },
    bidang: [
      { k: 'peran_id', l: 'Peran / jabatan (Indonesia)', wajib: true, ph: 'Asisten Peneliti' },
      { k: 'peran_en', l: 'Peran / jabatan (English)', ph: 'Research Assistant' },
      { k: 'tempat_id', l: 'Tempat / instansi (Indonesia)', wajib: true },
      { k: 'tempat_en', l: 'Tempat / instansi (English)', bantu: 'Kosongkan bila sama dengan bahasa Indonesia.' },
      { k: 'lokasi_id', l: 'Lokasi (Indonesia)', ph: 'Subang' },
      { k: 'lokasi_en', l: 'Lokasi (English)' },
      { k: 'mulai_id', l: 'Mulai (Indonesia)', ph: 'Januari 2026' },
      { k: 'mulai_en', l: 'Mulai (English)', ph: 'January 2026' },
      { k: 'selesai_id', l: 'Selesai (Indonesia)', ph: 'Desember 2026 atau Sekarang' },
      { k: 'selesai_en', l: 'Selesai (English)', ph: 'December 2026 or Present' },
      { k: 'poin_id', l: 'Uraian tugas (Indonesia)', tipe: 'baris', bantu: 'Satu poin per baris.' },
      { k: 'poin_en', l: 'Uraian tugas (English)', tipe: 'baris', bantu: 'Satu poin per baris, urutannya sama dengan versi Indonesia. Poin yang belum diterjemahkan memakai versi Indonesia.' },
      { k: 'tek', l: 'Teknologi', tipe: 'koma', ph: 'React, Laravel, PostgreSQL', bantu: 'Pisahkan dengan koma.' },
      { k: 'foto', l: 'Foto dokumentasi', tipe: 'foto', bantu: 'Tampil maksimal 4 foto kecil di kartu; sisanya jadi “+N”.' },
    ],
  },
}

// Satu permintaan per foto: hosting seperti Vercel membatasi isi satu permintaan (sekitar 4,5 MB).
async function unggah(files, token) {
  const urls = []
  for (const f of files) {
    const form = new FormData()
    form.append('files', f)
    urls.push(...(await minta('/api/upload', { method: 'POST', form, token })).urls)
  }
  return urls
}

function Foto({ nilai, ubah, token, lapor }) {
  const [sibuk, setSibuk] = useState(false)
  const tambah = async (e) => {
    const files = [...e.target.files]; e.target.value = ''
    if (!files.length) return
    setSibuk(true)
    try { ubah([...nilai, ...(await unggah(files, token))]) } catch (er) { lapor(er) } finally { setSibuk(false) }
  }
  return (
    <div className="foto-edit">
      {nilai.map((u, i) => (
        <figure key={u + i}>
          <img src={fileUrl(u)} alt="" />
          <button type="button" onClick={() => ubah(nilai.filter((_, j) => j !== i))} aria-label="Hapus foto">×</button>
        </figure>
      ))}
      <label className="tambah-foto">{sibuk ? 'Mengunggah…' : '+ Foto'}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={tambah} disabled={sibuk} />
      </label>
    </div>
  )
}

// Isian daftar teks. `pisah` = pemisah antaritem: baris baru (area) atau koma.
// Teks mentah disimpan di sini supaya koma dan Enter yang baru diketik tidak langsung hilang.
function Larik({ id, nilai, ubah, pisah, area, ph }) {
  const [teks, setTeks] = useState(() => (nilai || []).join(pisah === ',' ? ', ' : '\n'))
  const ganti = (e) => { setTeks(e.target.value); ubah(e.target.value.split(pisah).map((x) => x.trim()).filter(Boolean)) }
  return area
    ? <textarea id={id} rows="4" value={teks} onChange={ganti} placeholder={ph} />
    : <input id={id} value={teks} onChange={ganti} placeholder={ph} />
}

function Tautan({ nilai, ubah, token, lapor }) {
  const [sibuk, setSibuk] = useState(false)
  const pilih = async (e) => {
    const f = e.target.files[0]; e.target.value = ''
    if (!f) return
    setSibuk(true)
    try { ubah((await unggah([f], token))[0]) } catch (er) { lapor(er) } finally { setSibuk(false) }
  }
  return (
    <div className="tautan-edit">
      <input value={nilai} onChange={(e) => ubah(e.target.value)} placeholder="https://… atau unggah gambar" />
      <label className="tombol-sek">{sibuk ? 'Mengunggah…' : 'Unggah gambar'}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pilih} disabled={sibuk} />
      </label>
      {nilai && /\.(jpe?g|png|webp|gif|avif)$/i.test(nilai) && <img className="pratinjau" src={fileUrl(nilai)} alt="" />}
    </div>
  )
}

function Formulir({ jenis, awal, token, selesai, batal, lapor }) {
  const cfg = TABEL[jenis]
  const [v, setV] = useState(() => ({ ...cfg.kosong, ...awal }))
  const [simpan, setSimpan] = useState(false)
  const set = (k) => (x) => setV((a) => ({ ...a, [k]: x }))
  const kirim = async (e) => {
    e.preventDefault()
    setSimpan(true)
    try {
      const body = Object.fromEntries(Object.keys(cfg.kosong).map((k) => [k, v[k]]))
      await minta(`/api/${jenis}` + (awal?.id ? '/' + awal.id : ''), { method: awal?.id ? 'PUT' : 'POST', body, token })
      selesai(awal?.id ? 'Perubahan disimpan' : cfg.nama + ' ditambahkan')
    } catch (er) { lapor(er); setSimpan(false) }
  }
  return (
    <form className="form" onSubmit={kirim}>
      <h2>{awal?.id ? 'Ubah' : 'Tambah'} {cfg.nama.toLowerCase()}</h2>
      {cfg.bidang.map((b) => (
        <div className="bidang" key={b.k}>
          <label htmlFor={'f-' + b.k}>{b.l}{b.wajib && <span aria-hidden="true"> *</span>}</label>
          {b.tipe === 'area' ? <textarea id={'f-' + b.k} rows="3" value={v[b.k]} onChange={(e) => set(b.k)(e.target.value)} />
            : b.tipe === 'pilih' ? <select id={'f-' + b.k} value={v[b.k]} onChange={(e) => set(b.k)(e.target.value)}>{b.opsi.map(([a, l]) => <option key={a} value={a}>{l}</option>)}</select>
            : b.tipe === 'baris' ? <Larik id={'f-' + b.k} nilai={v[b.k]} ubah={set(b.k)} pisah={'\n'} area ph={b.ph} />
            : b.tipe === 'koma' ? <Larik id={'f-' + b.k} nilai={v[b.k]} ubah={set(b.k)} pisah="," ph={b.ph} />
            : b.tipe === 'foto' ? <Foto nilai={v[b.k]} ubah={set(b.k)} token={token} lapor={lapor} />
            : b.tipe === 'tautan' ? <Tautan nilai={v[b.k]} ubah={set(b.k)} token={token} lapor={lapor} />
            : <input id={'f-' + b.k} value={v[b.k]} required={b.wajib} placeholder={b.ph} onChange={(e) => set(b.k)(e.target.value)} />}
          {b.bantu && <small>{b.bantu}</small>}
        </div>
      ))}
      <div className="aksi-form">
        <button className="utama" disabled={simpan}>{simpan ? 'Menyimpan…' : 'Simpan'}</button>
        <button type="button" className="tombol-sek" onClick={batal}>Batal</button>
      </div>
    </form>
  )
}

function Daftar({ jenis, token, keluar, kabar }) {
  const cfg = TABEL[jenis]
  const [data, setData] = useState(null)
  const [edit, setEdit] = useState(null) // null = daftar, {} = tambah, {id,…} = ubah
  const [galat, setGalat] = useState('')

  const lapor = (er) => { if (er.status === 401) keluar(); else kabar(er.message, true) }
  // Komponen ini di-remount (key={tab}) tiap ganti tab, jadi state selalu segar. `hidup` mencegah
  // respons lambat dari tab sebelumnya menimpa data tab yang sekarang.
  const hidup = useRef(true)
  useEffect(() => () => { hidup.current = false }, [])
  const muat = () => minta(`/api/${jenis}`)
    .then((d) => { if (hidup.current) { setData(d); setGalat('') } })
    .catch((e) => { if (hidup.current) setGalat(e.message) })
  useEffect(() => { muat() }, [])

  const hapus = async (r) => {
    if (!confirm(`Hapus "${cfg.judul(r)}"? Tindakan ini tidak bisa dibatalkan.`)) return
    try { await minta(`/api/${jenis}/${r.id}`, { method: 'DELETE', token }); kabar('Data dihapus'); muat() } catch (er) { lapor(er) }
  }

  if (edit) return <Formulir jenis={jenis} awal={edit} token={token} lapor={lapor} batal={() => setEdit(null)} selesai={(m) => { kabar(m); setEdit(null); muat() }} />
  return (
    <>
      <div className="bar"><h2>{cfg.nama} {data && <span className="jml">{data.length}</span>}</h2><button className="utama" onClick={() => setEdit({})}>+ Tambah</button></div>
      {galat && <p className="galat">Gagal memuat: {galat}</p>}
      {!data && !galat && <p className="info">Memuat…</p>}
      {data && !data.length && <p className="info">Belum ada data. Klik “Tambah” untuk membuat yang pertama.</p>}
      <ul className="daftar">
        {data?.map((r) => (
          <li key={r.id}>
            {cfg.gambar(r) ? <img src={fileUrl(cfg.gambar(r))} alt="" /> : <span className="tanpa-gambar" aria-hidden="true">{(cfg.judul(r) || '?').slice(0, 1)}</span>}
            <div><strong>{cfg.judul(r)}</strong><small>{cfg.sub(r)}</small></div>
            <button className="tombol-sek" onClick={() => setEdit(r)}>Ubah</button>
            <button className="bahaya" onClick={() => hapus(r)}>Hapus</button>
          </li>
        ))}
      </ul>
    </>
  )
}

function Masuk({ onMasuk }) {
  const [pw, setPw] = useState('')
  const [pesan, setPesan] = useState('')
  const [sibuk, setSibuk] = useState(false)
  const kirim = async (e) => {
    e.preventDefault(); setSibuk(true); setPesan('')
    try { onMasuk((await minta('/api/login', { method: 'POST', body: { password: pw } })).token) } catch (er) { setPesan(er.message); setSibuk(false) }
  }
  return (
    <form className="masuk" onSubmit={kirim}>
      <h1>Admin</h1>
      <label htmlFor="pw">Password</label>
      <input id="pw" type="password" autoFocus autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
      {pesan && <p className="galat" role="alert">{pesan}</p>}
      <button className="utama" disabled={sibuk || !pw}>{sibuk ? 'Memeriksa…' : 'Masuk'}</button>
      <a href="/">← Kembali ke website</a>
    </form>
  )
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(KUNCI) || '')
  const [tab, setTab] = useState('proyek')
  const [toast, setToast] = useState(null)
  const timer = useRef(0)
  useEffect(() => { document.title = 'Admin · Portofolio' }, [])

  const kabar = (teks, galat = false) => { setToast({ teks, galat }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 3500) }
  const masuk = (t) => { localStorage.setItem(KUNCI, t); setToken(t) }
  const keluar = () => { localStorage.removeItem(KUNCI); setToken('') }

  return (
    <div className="adm">
      {!token ? <Masuk onMasuk={masuk} /> : (
        <>
          <header>
            <strong>Panel Admin</strong>
            <nav>
              {Object.entries(TABEL).map(([k, c]) => <button key={k} className={tab === k ? 'aktif' : ''} onClick={() => setTab(k)}>{c.nama}</button>)}
            </nav>
            <a href="/">Lihat website</a>
            <button className="tombol-sek" onClick={keluar}>Keluar</button>
          </header>
          <main><Daftar key={tab} jenis={tab} token={token} keluar={keluar} kabar={kabar} /></main>
        </>
      )}
      {toast && <div className={'toast' + (toast.galat ? ' salah' : '')} role="status">{toast.teks}</div>}
    </div>
  )
}
