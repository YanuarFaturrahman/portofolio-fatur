import { useEffect, useRef } from 'react'

// Makhluk laut dalam: ubur-ubur yang mendekati kursor lalu menyembur menjauh saat diklik, dan pari manta yang sesekali melintas.
// Mereka baru terlihat setelah halaman cukup dalam digulir.
export default function Satwa({ jumlah }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d')
    const diam = matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let W, H, raf, ptr = { x: -999, y: -999 }
    const ukur = () => { W = innerWidth; H = innerHeight; c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0) }
    ukur()
    const ub = Array.from({ length: jumlah }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, r: 16 + Math.random() * 16, t: Math.random() * 6, h: 285 + Math.random() * 60 }))
    const manta = { on: false, x: 0, y: 0, dir: 1, t: 0, next: performance.now() + 2500 }
    const gerak = (e) => { ptr = { x: e.clientX, y: e.clientY } }
    const turun = (e) => {
      for (const u of ub) {
        const dx = u.x - e.clientX, dy = u.y - e.clientY, q = Math.hypot(dx, dy)
        if (q < 260) { const k = 7 * (1 - q / 260); u.vx += (dx / (q || 1)) * k; u.vy += (dy / (q || 1)) * k }
      }
    }
    const gambar = () => {
      x.clearRect(0, 0, W, H)
      const d = scrollY / Math.max(1, document.documentElement.scrollHeight - H)
      const a = Math.max(0, Math.min(1, (d - 0.12) / 0.25))
      if (a > 0) for (const u of ub) {
        u.t += 0.04
        const p = Math.sin(u.t)
        u.vy += -Math.max(0, p) * 0.05 + 0.012
        const dx = ptr.x - u.x, dy = ptr.y - u.y, q = Math.hypot(dx, dy)
        if (q < 420 && q > 40) { u.vx += (dx / q) * 0.012; u.vy += (dy / q) * 0.006 }
        u.vx *= 0.985; u.vy *= 0.985; u.x += u.vx + Math.sin(u.t * 0.5) * 0.3; u.y += u.vy
        if (u.y < -80) u.y = H + 80
        if (u.y > H + 80) u.y = -80
        if (u.x < -60) u.x = W + 60
        if (u.x > W + 60) u.x = -60
        const r = u.r * (1 + 0.14 * p), col = `hsla(${u.h},100%,72%,`
        x.save(); x.translate(u.x, u.y); x.globalAlpha = a
        x.shadowColor = col + '.9)'; x.shadowBlur = 22
        x.fillStyle = col + '.28)'; x.strokeStyle = col + '.8)'; x.lineWidth = 1.5
        x.beginPath(); x.moveTo(-r, 0); x.bezierCurveTo(-r, -r * 1.3, r, -r * 1.3, r, 0); x.quadraticCurveTo(0, r * 0.45, -r, 0); x.fill(); x.stroke()
        x.shadowBlur = 0
        for (let k = 0; k < 5; k++) {
          const bx = -r * 0.7 + k * r * 0.35
          x.beginPath(); x.moveTo(bx, r * 0.1)
          for (let s = 1; s <= 5; s++) x.lineTo(bx + Math.sin(u.t * 2 + k + s * 0.9) * r * 0.07 * s, r * 0.1 + s * r * 0.42)
          x.stroke()
        }
        x.restore()
      }
      const now = performance.now()
      if (!manta.on && d > 0.25 && d < 0.8 && now > manta.next) {
        manta.on = true; manta.dir = Math.random() < 0.5 ? 1 : -1; manta.x = manta.dir > 0 ? -160 : W + 160; manta.y = H * (0.2 + Math.random() * 0.5); manta.t = 0
      }
      if (manta.on) {
        manta.t += 0.05; manta.x += manta.dir * 1.5
        const y = manta.y + Math.sin(manta.t * 0.6) * 30, f = Math.sin(manta.t * 1.2)
        x.save(); x.translate(manta.x, y); x.scale(manta.dir, 1)
        x.fillStyle = 'rgba(150,175,255,.2)'; x.strokeStyle = 'rgba(190,205,255,.6)'; x.lineWidth = 1.5
        x.beginPath(); x.moveTo(60, 0); x.quadraticCurveTo(20, -30, -20, -85 + f * 28); x.quadraticCurveTo(-30, -30, -45, 0)
        x.quadraticCurveTo(-30, 30, -20, 85 - f * 28); x.quadraticCurveTo(20, 30, 60, 0); x.fill(); x.stroke()
        x.beginPath(); x.moveTo(-45, 0); x.quadraticCurveTo(-90, Math.sin(manta.t) * 10, -140, Math.sin(manta.t) * 18); x.stroke()
        x.restore()
        if ((manta.dir > 0 && manta.x > W + 200) || (manta.dir < 0 && manta.x < -200)) { manta.on = false; manta.next = now + 9000 + Math.random() * 9000 }
      }
      if (!diam) raf = requestAnimationFrame(gambar)
    }
    gambar()
    window.addEventListener('pointermove', gerak); window.addEventListener('pointerdown', turun); window.addEventListener('resize', ukur)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', gerak); window.removeEventListener('pointerdown', turun); window.removeEventListener('resize', ukur)
    }
  }, [jumlah])
  return <canvas ref={ref} className="ikan" aria-hidden="true" />
}
