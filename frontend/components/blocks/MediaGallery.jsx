'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'

// ─── Fullscreen lightbox ────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onPrev, onNext])

  const img = images[index]
  if (!img) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/95 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" onClick={onClose}>
      <button onClick={onClose} aria-label="Zatvori" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      {images.length > 1 && (
        <span className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-white/70">{index + 1} / {images.length}</span>
      )}
      <div className="relative flex h-full w-full items-center justify-center p-4 md:p-12" onClick={(e) => e.stopPropagation()}>
        <img src={img.url} alt={img.alt || ''} className="max-h-full max-w-full rounded-lg object-contain" />
        {images.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onPrev() }} aria-label="Prethodna" className="absolute left-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onNext() }} aria-label="Sledeća" className="absolute right-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-6">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Gallery grid ────────────────────────────────────────────────────────────────

export default function MediaGallery({ images = [] }) {
  const [lb, setLb] = useState(null)
  const close = useCallback(() => setLb(null), [])
  const prev = useCallback(() => setLb((i) => (i === null ? i : (i - 1 + images.length) % images.length)), [images.length])
  const next = useCallback(() => setLb((i) => (i === null ? i : (i + 1) % images.length)), [images.length])

  if (!images.length) return null

  const single = images.length === 1
  const cols = single ? '' : images.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
  const aspect = single ? 'aspect-[16/9]' : 'aspect-[4/3]'

  return (
    <section className="section-y-sm">
      <div className="container-site">
        <div className={`grid grid-cols-1 gap-5 ${cols}`}>
          {images.map((img, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <figure className="group relative">
                <button
                  type="button"
                  onClick={() => setLb(i)}
                  aria-label={img.caption || img.alt || 'Uvećaj sliku'}
                  className={`relative block w-full overflow-hidden rounded-3xl bg-gray-100 ring-1 ring-black/5 shadow-card transition-shadow duration-300 hover:shadow-card-hover ${aspect}`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt || ''}
                    fill
                    className="object-cover transition-transform duration-[900ms] ease-spring group-hover:scale-105"
                    sizes={single ? '(max-width: 1024px) 100vw, 80vw' : '(max-width: 640px) 100vw, 45vw'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* zoom hint */}
                  <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14zM11 8v6M8 11h6" /></svg>
                  </span>
                </button>
                {img.caption && <figcaption className="mt-3 px-1 text-center text-xs text-gray-400">{img.caption}</figcaption>}
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
      {lb !== null && <Lightbox images={images} index={lb} onClose={close} onPrev={prev} onNext={next} />}
    </section>
  )
}
