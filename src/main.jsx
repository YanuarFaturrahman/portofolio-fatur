import React from 'react'
import { createRoot } from 'react-dom/client'

// /admin membuka panel pengelola konten; alamat lain membuka website. Gaya keduanya dipisah
// (styles.css hanya dimuat untuk website) supaya tampilan admin tidak tercampur.
const root = createRoot(document.getElementById('root'))
const admin = /^\/admin\/?$/.test(location.pathname)
const muat = admin ? [import('./Admin.jsx'), import('./admin.css')] : [import('./App.jsx'), import('./styles.css')]
Promise.all(muat).then(([m]) => root.render(<m.default />))
