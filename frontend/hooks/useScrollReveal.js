'use client'

import { useEffect, useRef } from 'react'

export function useScrollReveal({ threshold = 0.12, once = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('is-visible')
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return ref
}
