'use client'

import { useEffect, useRef } from 'react'

// threshold 0 + a bottom rootMargin → reveals as soon as the element's top enters
// the lower part of the viewport. Crucially this works for elements TALLER than the
// viewport (long articles): a ratio-based threshold like 0.12 can never be reached on
// a very tall element, leaving it stuck at opacity:0.
export function useScrollReveal({ threshold = 0, once = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    // Safety net: if already in view on mount (or IO unsupported), reveal immediately.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          if (once) observer.unobserve(el)
        } else if (!once) {
          el.classList.remove('is-visible')
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return ref
}
