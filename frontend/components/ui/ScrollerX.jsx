'use client'

import { Children, cloneElement, useEffect, useRef } from 'react'

/**
 * Horizontalna „traka" sa beskonačnim auto-pomeranjem KOJA SE MOŽE i ručno
 * pomerati levo-desno (swipe na touch/trackpad-u, drag mišem, scroll).
 *
 * - Auto-scroll (rAF) — pauzira se na hover i dok korisnik pomera.
 * - Native `overflow-x` → swipe na mobilnom/trackpad-u radi besplatno.
 * - Mouse „grab & drag" preko pointer eventa.
 * - Seamless loop: children se renderuju 3×, pozicija se normalizuje na srednju kopiju.
 *
 * Prima `children` (jedan set elemenata) — utrostručuje ih interno radi petlje.
 */
// Broj kopija sadržaja. Veći broj = robusnija petlja i kad je jedna kopija uža
// od ekrana (npr. logoi) — native scroll ne „zapne" na kraju.
const COPIES = 6

export default function ScrollerX({ children, speed = 40, className = '' }) {
  const ref = useRef(null)
  const st = useRef({ paused: false, dragging: false, startX: 0, startScroll: 0, last: 0, inited: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const s = st.current
    s.inited = false

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let raf
    const tick = (now) => {
      const dt = s.last ? Math.min((now - s.last) / 1000, 0.05) : 0
      s.last = now
      const one = el.scrollWidth / COPIES
      if (one > 0) {
        if (!s.inited) {
          el.scrollLeft = one
          s.inited = true
        } else if (!s.paused && !s.dragging && !reduce) {
          el.scrollLeft += speed * dt
        }
        if (el.scrollLeft >= one * 2) el.scrollLeft -= one
        else if (el.scrollLeft < one) el.scrollLeft += one
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [speed])

  const pause = () => { st.current.paused = true }
  const resume = () => { st.current.paused = false; st.current.dragging = false }

  const onPointerDown = (e) => {
    st.current.paused = true
    if (e.pointerType === 'mouse') {
      st.current.dragging = true
      st.current.startX = e.clientX
      st.current.startScroll = ref.current.scrollLeft
      ref.current.setPointerCapture?.(e.pointerId)
    }
  }
  const onPointerMove = (e) => {
    if (!st.current.dragging) return
    ref.current.scrollLeft = st.current.startScroll - (e.clientX - st.current.startX)
  }
  const onPointerUp = () => { st.current.dragging = false; st.current.paused = false }

  const base = Children.toArray(children)

  return (
    <div
      ref={ref}
      className={`flex overflow-x-auto scrollbar-hide cursor-grab select-none overscroll-x-contain active:cursor-grabbing ${className}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {Array.from({ length: COPIES }).map((_, c) =>
        base.map((el, i) => cloneElement(el, { key: `${c}-${i}` })),
      )}
    </div>
  )
}
