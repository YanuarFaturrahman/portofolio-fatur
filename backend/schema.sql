-- Dijalankan otomatis tiap server menyala (aman diulang, tidak menghapus data).

CREATE TABLE IF NOT EXISTS proyek (
  id        SERIAL PRIMARY KEY,
  nama_id   TEXT NOT NULL,
  nama_en   TEXT NOT NULL DEFAULT '',
  kat       TEXT NOT NULL DEFAULT 'Web' CHECK (kat IN ('Web', 'Alat')),
  foto      TEXT[] NOT NULL DEFAULT '{}',
  demo      TEXT NOT NULL DEFAULT '',
  kode      TEXT NOT NULL DEFAULT '',
  tek       TEXT NOT NULL DEFAULT '',
  ket_id    TEXT NOT NULL DEFAULT '',
  ket_en    TEXT NOT NULL DEFAULT '',
  dibuat    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS penghargaan (
  id            SERIAL PRIMARY KEY,
  judul_id      TEXT NOT NULL,
  judul_en      TEXT NOT NULL DEFAULT '',
  peringkat_id  TEXT NOT NULL DEFAULT '',
  peringkat_en  TEXT NOT NULL DEFAULT '',
  pemberi_id    TEXT NOT NULL DEFAULT '',
  pemberi_en    TEXT NOT NULL DEFAULT '',
  tahun         TEXT NOT NULL,
  medali        TEXT NOT NULL DEFAULT 'mutiara' CHECK (medali IN ('emas', 'perak', 'perunggu', 'mutiara')),
  ket_id        TEXT NOT NULL DEFAULT '',
  ket_en        TEXT NOT NULL DEFAULT '',
  tautan        TEXT NOT NULL DEFAULT '',
  dibuat        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Peta keahlian. zona = id zona kedalaman (lihat `zona` di src/data.js), level = tingkat penguasaan 1-5.
CREATE TABLE IF NOT EXISTS keahlian (
  id      SERIAL PRIMARY KEY,
  nama    TEXT NOT NULL,
  zona    TEXT NOT NULL DEFAULT 'cahaya' CHECK (zona IN ('cahaya', 'senja', 'tengah', 'abisal')),
  level   INTEGER NOT NULL DEFAULT 3 CHECK (level BETWEEN 1 AND 5),
  dibuat  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pengalaman. poin_id dan poin_en dipasangkan menurut urutan (poin ke-1 Indonesia = poin ke-1 English).
CREATE TABLE IF NOT EXISTS pengalaman (
  id         SERIAL PRIMARY KEY,
  peran_id   TEXT NOT NULL,
  peran_en   TEXT NOT NULL DEFAULT '',
  tempat_id  TEXT NOT NULL,
  tempat_en  TEXT NOT NULL DEFAULT '',
  lokasi_id  TEXT NOT NULL DEFAULT '',
  lokasi_en  TEXT NOT NULL DEFAULT '',
  mulai_id   TEXT NOT NULL DEFAULT '',
  mulai_en   TEXT NOT NULL DEFAULT '',
  selesai_id TEXT NOT NULL DEFAULT '',
  selesai_en TEXT NOT NULL DEFAULT '',
  poin_id    TEXT[] NOT NULL DEFAULT '{}',
  poin_en    TEXT[] NOT NULL DEFAULT '{}',
  tek        TEXT[] NOT NULL DEFAULT '{}',
  foto       TEXT[] NOT NULL DEFAULT '{}',
  dibuat     TIMESTAMPTZ NOT NULL DEFAULT now()
);
