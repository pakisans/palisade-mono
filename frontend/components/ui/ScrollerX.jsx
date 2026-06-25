'use client'

import { Children, cloneElement, useEffect, useRef } from 'react'

/**
 * Horizontalna „traka" sa beskonačnim auto-pomeranjem KOJA SE MOŽE i ručno
 * pomerati levo-desno (swipe na touch/trackpad-u, drag mišem, scroll).
 *
 * - Auto-scroll (rAF) — pauzira se na hover (miš) i dok korisnik pomera.
 * - Native `overflow-x` → swipe na mobilnom/trackpad-u radi besplatno.
 * - Mouse „grab & drag" preko pointer eventa.
 * - Seamless loop: children se renderuju COPIES× i pozicija se normalizuje.
 *
 * MOBILNO: hover-pauza je samo za miš (touch ne zaglavljuje pauzu); posle dodira
 * auto se nastavi tek kad momentum scroll prođe, da se ne „bije" sa njim.
 */
const COPIES = 6
const RESUME_DELAY = 1400 // ms posle touch-a pre nego što auto nastavi (momentum)

export default function ScrollerX({ children, speed = 40, className = '' }) {
  const ref = useRef(null)
  const st = useRef({
    paused: false,
    dragging: false,
    touching: false,
    resumeAt: 0,
    startX: 0,
    startScroll: 0,
    last: 0,
    inited: false,
  })

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
        } else {
          const blocked = s.paused || s.dragging || s.touching || now < s.resumeAt
          if (!blocked && !reduce) el.scrollLeft += speed * dt
        }
        // seamless loop
        if (el.scrollLeft >= one * 2) el.scrollLeft -= one
        else if (el.scrollLeft < one) el.scrollLeft += one
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Touch: pauziraj dok prst dira, nastavi tek kad momentum prođe.
    const onTouchStart = () => {
      s.touching = true
    }
    const onTouchEnd = () => {
      s.touching = false
      s.resumeAt = performance.now() + RESUME_DELAY
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    el.addEventListener('touchcancel', onTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [speed])

  // Hover-pauza SAMO za miš (na touch-u pointerType !== 'mouse', pa se ne zaglavi).
  const onPointerEnter = (e) => {
    if (e.pointerType === 'mouse') st.current.paused = true
  }
  const onPointerLeave = (e) => {
    if (e.pointerType === 'mouse') {
      st.current.paused = false
      st.current.dragging = false
    }
  }
  // Mouse „grab & drag" (touch koristi native scroll, ne diramo ga).
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return
    st.current.paused = true
    st.current.dragging = true
    st.current.startX = e.clientX
    st.current.startScroll = ref.current.scrollLeft
    ref.current.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!st.current.dragging) return
    ref.current.scrollLeft = st.current.startScroll - (e.clientX - st.current.startX)
  }
  const onPointerUp = () => {
    st.current.dragging = false
    st.current.paused = false
  }

  const base = Children.toArray(children)

  return (
    <div
      ref={ref}
      className={`flex overflow-x-auto scrollbar-hide cursor-grab select-none overscroll-x-contain active:cursor-grabbing ${className}`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
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
