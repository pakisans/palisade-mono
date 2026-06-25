'use client'

import { Children, cloneElement, useEffect, useRef } from 'react'

/**
 * Horizontalna traka sa beskonačnim auto-pomeranjem + ručnim (drag/swipe).
 * Koristi `transform: translate3d` (GPU) — glatko na mobilnom, bez „zakucavanja".
 * NEMA pauze na hover; pauzira se samo dok korisnik vuče.
 */
const COPIES = 4

export default function ScrollerX({ children, speed = 40, className = '', wrapClassName = '' }) {
  const trackRef = useRef(null)
  const st = useRef({ offset: 0, oneSet: 0, dragging: false, lastX: 0, last: 0 })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const s = st.current
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const measure = () => {
      s.oneSet = track.scrollWidth / COPIES
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    let raf
    const tick = (now) => {
      const dt = s.last ? Math.min((now - s.last) / 1000, 0.05) : 0
      s.last = now
      if (s.oneSet > 0) {
        if (!s.dragging && !reduce) s.offset += speed * dt
        // beskonačna petlja — drži offset u [0, oneSet)
        s.offset = ((s.offset % s.oneSet) + s.oneSet) % s.oneSet
        track.style.transform = `translate3d(${-s.offset}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [speed])

  const onPointerDown = (e) => {
    st.current.dragging = true
    st.current.lastX = e.clientX
    try {
      trackRef.current?.setPointerCapture?.(e.pointerId)
    } catch {
      /* noop */
    }
  }
  const onPointerMove = (e) => {
    if (!st.current.dragging) return
    const dx = e.clientX - st.current.lastX
    st.current.lastX = e.clientX
    st.current.offset -= dx
  }
  const onPointerUp = () => {
    st.current.dragging = false
  }

  const base = Children.toArray(children)

  return (
    <div className={`relative overflow-hidden mask-fade-x ${wrapClassName}`}>
      <div
        ref={trackRef}
        className={`flex w-max cursor-grab touch-pan-y select-none [will-change:transform] active:cursor-grabbing ${className}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {Array.from({ length: COPIES }).map((_, c) =>
          base.map((el, i) => cloneElement(el, { key: `${c}-${i}` })),
        )}
      </div>
    </div>
  )
}
