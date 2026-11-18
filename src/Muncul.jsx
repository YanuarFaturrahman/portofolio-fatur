import { useEffect, useRef, useState } from 'react'

// Membungkus elemen agar "muncul" saat masuk layar: naik dari air, berenang dari kiri/kanan, atau membesar seperti gelembung.
export default function Muncul({ tag: Tag = 'div', jenis = 'naik', delay = 0, className = '', children }) {
  const ref = useRef(null)
  const [ada, setAda] = useState(false)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return setAda(true)
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAda(true); io.disconnect() } }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <Tag ref={ref} className={`m m-${jenis} ${className}${ada ? ' ada' : ''}`} style={{ '--d': delay + 'ms' }}>{children}</Tag>
}
