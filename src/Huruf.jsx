import { useEffect, useRef, useState } from 'react'

// Teks yang hurufnya berubah bentuk saat kursor atau jari mendekat.
// Memakai font variabel Recursive: bobot (wght), miring (slnt), dan gaya casual (CASL).
export default function Huruf({ teks, tag: Tag = 'span', radius = 170, className = '', muncul = false, siap = true }) {
  const ref = useRef(null)
  const [ada, setAda] = useState(!muncul)
  useEffect(() => {
    if (!muncul || !siap) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setAda(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAda(true); io.disconnect() } }, { threshold: 0.4 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [muncul, siap])
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hs = [...ref.current.querySelectorAll('[data-h]')]
    let px = -999, py = -999, raf = 0
    const ubah = () => {
      raf = 0
      for (const h of hs) {
        const b = h.getBoundingClientRect()
        const d = Math.hypot(px - (b.left + b.width / 2), py - (b.top + b.height / 2))
        const k = Math.max(0, 1 - d / radius)
        h.style.fontVariationSettings = k > 0
          ? `'wght' ${Math.round(500 + k * 500)}, 'slnt' ${(-k * 15).toFixed(1)}, 'CASL' ${k.toFixed(2)}`
          : ''
      }
    }
    const jadwal = () => { if (!raf) raf = requestAnimationFrame(ubah) }
    const gerak = (e) => { px = e.clientX; py = e.clientY; jadwal() }
    const pergi = () => { px = py = -999; jadwal() }
    window.addEventListener('pointermove', gerak)
    window.addEventListener('pointerup', pergi)
    document.addEventListener('pointerleave', pergi)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', gerak)
      window.removeEventListener('pointerup', pergi)
      document.removeEventListener('pointerleave', pergi)
    }
  }, [teks, radius])
  let n = 0
  return (
    <Tag ref={ref} className={className + (muncul ? ' hm' : '') + (muncul && ada ? ' ada' : '')} aria-label={teks}>
      {teks.split(' ').map((w, i) => (
        <span key={i}>
          <span className="kt" aria-hidden="true">{[...w].map((c, j) => <span key={j} data-h style={{ '--i': n++ }}>{c}</span>)}</span>{' '}
        </span>
      ))}
    </Tag>
  )
}
