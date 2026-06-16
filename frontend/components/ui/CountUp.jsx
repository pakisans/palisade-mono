'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animated number that counts up to its value when scrolled into view.
 * Accepts decorated strings like "700+", "20+", "4.9", "98%", "<24h", "4.9/5" —
 * it animates the first numeric token and keeps the surrounding text intact.
 * Respects prefers-reduced-motion (shows the final value immediately).
 */
export default function CountUp({ value = '', duration = 1400, className }) {
  const str = String(value)
  const match = str.match(/[\d]+([.,][\d]+)?/)
  const ref = useRef(null)
  const [display, setDisplay] = useState(() => str)
  const done = useRef(false)

  useEffect(() => {
    if (!match) return
    const el = ref.current
    if (!el) return

    const raw = match[0]
    const decimals = /[.,]/.test(raw) ? (raw.split(/[.,]/)[1]?.length ?? 0) : 0
    const target = parseFloat(raw.replace(',', '.'))
    const prefix = str.slice(0, match.index)
    const suffix = str.slice(match.index + raw.length)
    const sep = raw.includes(',') ? ',' : '.'
    const fmt = (n) => `${prefix}${decimals ? n.toFixed(decimals).replace('.', sep) : Math.round(n).toString()}${suffix}`

    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDisplay(str); return }

    // start hidden at 0 until in view
    setDisplay(fmt(0))

    const run = () => {
      if (done.current) return
      done.current = true
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
        setDisplay(fmt(target * eased))
        if (p < 1) requestAnimationFrame(tick)
        else setDisplay(str)
      }
      requestAnimationFrame(tick)
    }

    if (typeof IntersectionObserver === 'undefined') { run(); return }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [str]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{display}</span>
}
