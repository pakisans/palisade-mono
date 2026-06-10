'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'

const ChevLeft = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 5L7.5 10l5 5" />
  </svg>
)
const ChevRight = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5L12.5 10l-5 5" />
  </svg>
)

/**
 * Project images shown below the banner.
 *  - 1 image  → shown in full (natural ratio, uncropped).
 *  - >1 image → horizontal scroll-snap carousel (swipe / arrows, left↔right).
 */
export default function ProjectGallery({ images = [], title = '' }) {
  const scroller = useRef(null)

  const items = images
    .map((m) => ({
      url: getMediaURL(m),
      alt: (typeof m === 'object' && m?.alt) || title,
      width: (typeof m === 'object' && m?.width) || 1600,
      height: (typeof m === 'object' && m?.height) || 1200,
    }))
    .filter((x) => x.url)

  if (items.length === 0) return null

  // Single image — capped width + consistent 4:3 frame (same as the carousel
  // slides), so it stays a sensible size and looks identical for every user.
  if (items.length === 1) {
    const img = items[0]
    return (
      <div className="mx-auto max-w-3xl">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-card ring-1 ring-black/5">
          <Image
            src={img.url}
            alt={img.alt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      </div>
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
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-card ring-1 ring-black/5">
              <Image
                src={img.url}
                alt={img.alt}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 70vw, 58vw"
              />
            </div>
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
    </div>
  )
}
