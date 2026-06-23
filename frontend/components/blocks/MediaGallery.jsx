'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'

// ─── Fullscreen lightbox (velika slika + traka thumbnaila) ───────────────────────

function Lightbox({ images, index, onClose, onPrev, onNext, onSelect }) {
  const thumbRefs = useRef([])

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

  // Aktivni thumbnail uvek centriran u traci
  useEffect(() => {
    const el = thumbRefs.current[index]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  const img = images[index]
  if (!img) return null

  const many = images.length > 1

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <span className="text-sm font-medium tabular-nums text-white/60">
          {many ? `${index + 1} / ${images.length}` : ''}
        </span>
        <button
          onClick={onClose}
          aria-label="Zatvori"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Glavna slika — klik na prazan prostor zatvara */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16"
        onClick={onClose}
      >
        <img
          src={img.url}
          alt={img.alt || ''}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
        />
        {many && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              aria-label="Prethodna"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:left-5"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext() }}
              aria-label="Sledeća"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 md:right-5"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Caption */}
      {img.caption && (
        <p className="px-6 pt-3 text-center text-sm text-white/60">{img.caption}</p>
      )}

      {/* Traka thumbnaila */}
      {many && (
        <div className="flex justify-start gap-2 overflow-x-auto px-4 py-4 scrollbar-hide md:justify-center md:px-6">
          {images.map((t, i) => (
            <button
              key={i}
              ref={(el) => { thumbRefs.current[i] = el }}
              onClick={() => onSelect(i)}
              aria-label={`Slika ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
              className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 md:h-16 md:w-24 ${
                i === index
                  ? 'opacity-100 ring-2 ring-brand'
                  : 'opacity-45 ring-1 ring-white/15 hover:opacity-90'
              }`}
            >
              <img src={t.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
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
            <ScrollReveal key={i}>
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
      {lb !== null && (
        <Lightbox images={images} index={lb} onClose={close} onPrev={prev} onNext={next} onSelect={setLb} />
      )}
    </section>
  )
}
