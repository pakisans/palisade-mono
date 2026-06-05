'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

export default function ScrollReveal({ children, delay = 0, className, fade = false, threshold = 0.12 }) {
  const ref = useScrollReveal({ threshold })
  return (
    <div
      ref={ref}
      className={cn(fade ? 'reveal-fade' : 'reveal', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
