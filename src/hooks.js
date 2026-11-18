import { useEffect, useState } from 'react'

// 'hp' = layar sempit (Android/iPhone), 'pc' = laptop/desktop. Menu dirender berbeda per perangkat.
export function usePerangkat() {
  const q = '(max-width:760px)'
  const [hp, setHp] = useState(() => matchMedia(q).matches)
  useEffect(() => {
    const m = matchMedia(q), f = () => setHp(m.matches)
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return hp ? 'hp' : 'pc'
}

export function useSimpan(kunci, awal) {
  const [v, setV] = useState(() => { try { const s = localStorage.getItem(kunci); return s === null ? awal : JSON.parse(s) } catch { return awal } })
  useEffect(() => { try { localStorage.setItem(kunci, JSON.stringify(v)) } catch {} }, [kunci, v])
  return [v, setV]
}
