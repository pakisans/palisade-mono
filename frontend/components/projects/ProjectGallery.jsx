'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'

const ChevLeft = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 5L7.5 10l5 5" />
  </svg>
)
const ChevRight = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5L12.5 10l-5 5" />
  </svg>
)
const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const ExpandIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15M3.75 20.25h4.5m-4.5 0v-4.5m0 4.5L9 15" />
  </svg>
)

// ─── Fullscreen lightbox ────────────────────────────────────────────────────

function Lightbox({ items, index, onClose, onPrev, onNext, onSelect }) {
  const thumbRefs = useRef([])

  // Keyboard navigation + body scroll lock.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onPrev, onNext])

  // Aktivni thumbnail uvek centriran u traci.
  useEffect(() => {
    const el = thumbRefs.current[index]
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  const img = items[index]
  if (!img) return null

  const many = items.length > 1

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Pregled slike"
    >
      {/* Top bar: brojač + zatvori */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <span className="text-sm font-medium tabular-nums text-white/60">
          {many ? `${index + 1} / ${items.length}` : ''}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Glavna slika — klik na prazan prostor zatvara */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16"
        onClick={onClose}
      >
        <img
          key={index}
          src={img.url}
          alt={img.alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-full max-w-full select-none rounded-lg object-contain shadow-2xl"
        />
        {many && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              aria-label="Prethodna slika"
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-5"
            >
              <ChevLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext() }}
              aria-label="Sledeća slika"
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-5"
            >
              <ChevRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Traka thumbnaila */}
      {many && (
        <div className="flex justify-start gap-2 overflow-x-auto px-4 py-4 scrollbar-hide md:justify-center md:px-6">
          {items.map((t, i) => (
            <button
              key={i}
              type="button"
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

// Hover hint shown on each thumbnail.
const ExpandHint = () => (
  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gray-950/0 opacity-0 transition-all duration-300 group-hover/img:bg-gray-950/25 group-hover/img:opacity-100">
    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg">
      <ExpandIcon />
    </span>
  </span>
)

/**
 * Project images shown below the banner. Click any image → fullscreen lightbox.
 *  - 1 image  → single framed image (clickable).
 *  - >1 image → horizontal scroll-snap carousel (swipe / arrows), each clickable.
 */
export default function ProjectGallery({ images = [], title = '' }) {
  const scroller = useRef(null)
  const [lightbox, setLightbox] = useState(null) // index | null

  const items = images
    .map((m) => ({
      url: getMediaURL(m),
      alt: (typeof m === 'object' && m?.alt) || title,
      width: (typeof m === 'object' && m?.width) || 1600,
      height: (typeof m === 'object' && m?.height) || 1200,
    }))
    .filter((x) => x.url)

  const open = useCallback((i) => setLightbox(i), [])
  const close = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox((i) => (i === null ? i : (i - 1 + items.length) % items.length)), [items.length])
  const next = useCallback(() => setLightbox((i) => (i === null ? i : (i + 1) % items.length)), [items.length])

  if (items.length === 0) return null

  const lb = lightbox !== null && (
    <Lightbox items={items} index={lightbox} onClose={close} onPrev={prev} onNext={next} onSelect={setLightbox} />
  )

  // Single image.
  if (items.length === 1) {
    const img = items[0]
    return (
      <>
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => open(0)}
            aria-label="Otvori sliku preko celog ekrana"
            className="group/img relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-card ring-1 ring-black/5"
          >
            <Image src={img.url} alt={img.alt} fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
            <ExpandHint />
          </button>
        </div>
        {lb}
      </>
    )
  }

  const scrollByDir = (dir) => {
    const el = scroller.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className="group relative">
      <div
        ref={scroller}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
        role="list"
        aria-label="Galerija slika projekta"
      >
        {items.map((img, i) => (
          <figure key={i} role="listitem" className="w-[88%] shrink-0 snap-center sm:w-[70%] lg:w-[58%]">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Otvori sliku ${i + 1} preko celog ekrana`}
              className="group/img relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-card ring-1 ring-black/5"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 58vw"
              />
              <ExpandHint />
            </button>
          </figure>
        ))}
      </div>

      {/* Scroll controls */}
      <button
        type="button"
        onClick={() => scrollByDir(-1)}
        aria-label="Prethodna slika"
        className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-card backdrop-blur-sm transition hover:bg-white hover:text-gray-950"
      >
        <ChevLeft />
      </button>
      <button
        type="button"
        onClick={() => scrollByDir(1)}
        aria-label="Sledeća slika"
        className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-card backdrop-blur-sm transition hover:bg-white hover:text-gray-950"
      >
        <ChevRight />
      </button>

      {lb}
    </div>
  )
}
