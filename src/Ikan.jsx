import { useEffect, useRef } from 'react'

// Kawanan ikan: menghindari kursor/jari, mengejar makanan yang dijatuhkan lewat klik atau ketukan.
// Warna bergeser dari cyan (permukaan) ke ungu magenta menyala (laut dalam). Kursor meninggalkan jejak plankton.
export default function Ikan({ jumlah }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const diam = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let W, H, raf, ptr = { x: -999, y: -999 }, makan = [], plankton = []
    const ukur = () => { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0) }
    ukur()
    const kawan = Array.from({ length: jumlah }, () => {
      const b = (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.1)
      return { x: Math.random() * W, y: Math.random() * H, vx: b, vy: 0, b, s: 6 + Math.random() * 9, t: Math.random() * 9, o: Math.random() * 30 - 15 }
    })
    const gerak = (e) => {
      ptr = { x: e.clientX, y: e.clientY }
      if (plankton.length < 140) plankton.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, a: 1, h: 150 + Math.random() * 130 })
    }
    const lepas = () => { ptr = { x: -999, y: -999 } }
    const turun = (e) => {
      if (e.target.closest('button,a,input,textarea,label')) return
      for (let i = 0; i < 6; i++) makan.push({ x: e.clientX + (Math.random() - 0.5) * 36, y: e.clientY, a: 1 })
    }
    const gambar = () => {
      x.clearRect(0, 0, W, H)
      const h = document.documentElement
      const d = scrollY / Math.max(1, h.scrollHeight - H)
      makan = makan.filter((m) => m.a > 0)
      for (const m of makan) {
        m.y += 0.6; m.a -= 0.0018
        x.fillStyle = `rgba(255,220,160,${m.a})`; x.beginPath(); x.arc(m.x, m.y, 2.6, 0, 7); x.fill()
      }
      plankton = plankton.filter((p) => p.a > 0)
      for (const p of plankton) {
        p.x += p.vx; p.y += p.vy; p.a -= 0.014
        x.fillStyle = `hsla(${p.h},100%,72%,${p.a})`; x.shadowColor = x.fillStyle; x.shadowBlur = 8
        x.beginPath(); x.arc(p.x, p.y, 1.2 + p.a * 2, 0, 7); x.fill()
      }
      x.shadowBlur = 0
      for (const f of kawan) {
        f.t += 0.16
        let target = null, bd = 280 * 280
        for (const m of makan) { const q = (m.x - f.x) ** 2 + (m.y - f.y) ** 2; if (q < bd) { bd = q; target = m } }
        if (target) { f.vx += (target.x - f.x) * 0.0009; f.vy += (target.y - f.y) * 0.0009; if (bd < 120) target.a -= 0.3 }
        const dx = f.x - ptr.x, dy = f.y - ptr.y, q = dx * dx + dy * dy
        if (q < 150 * 150) { const r = Math.sqrt(q) || 1; f.vx += (dx / r) * 0.4; f.vy += (dy / r) * 0.4 }
        f.vx += (f.b - f.vx) * 0.012; f.vy += (Math.sin(f.t * 0.3) * 0.25 - f.vy) * 0.03
        const sp = Math.hypot(f.vx, f.vy); if (sp > 3.4) { f.vx *= 3.4 / sp; f.vy *= 3.4 / sp }
        f.x += f.vx; f.y = Math.max(24, Math.min(H - 24, f.y + f.vy))
        if (f.x > W + 40) f.x = -40; else if (f.x < -40) f.x = W + 40
        x.save(); x.translate(f.x, f.y); x.rotate(Math.atan2(f.vy, f.vx))
        const warna = `hsla(${185 + d * 140 + f.o},95%,${72 - d * 12}%,.88)`
        x.fillStyle = warna
        if (d > 0.6) { x.shadowColor = warna; x.shadowBlur = 10 }
        x.beginPath(); x.ellipse(0, 0, f.s, f.s * 0.5, 0, 0, 7); x.fill()
        const w = Math.sin(f.t) * f.s * 0.4
        x.beginPath(); x.moveTo(-f.s * 0.8, 0); x.lineTo(-f.s * 1.7, -f.s * 0.6 + w); x.lineTo(-f.s * 1.7, f.s * 0.6 + w); x.fill()
        x.restore()
      }
      if (!diam) raf = requestAnimationFrame(gambar)
    }
    gambar()
    window.addEventListener('pointermove', gerak); window.addEventListener('pointerdown', turun)
    window.addEventListener('pointerleave', lepas); window.addEventListener('resize', ukur)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', gerak); window.removeEventListener('pointerdown', turun)
      window.removeEventListener('pointerleave', lepas); window.removeEventListener('resize', ukur)
    }
  }, [jumlah])
  return <canvas ref={ref} className="ikan" aria-hidden="true" />
}
