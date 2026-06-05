'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getMediaURL } from '@/lib/payload'

const ChevLeft  = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M12.5 5L7.5 10l5 5" /></svg>
const ChevRight = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 5L12.5 10l-5 5" /></svg>
const Expand    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8V3m0 0h5M3 3l6 6m8-6h-5m5 0v5m0-5l-6 6M3 12v5m0 0h5m-5 0l6-6m8 6l-6-6m6 6v-5m0 5h-5" /></svg>

export default function ProductGallery({ gallery = [], title = '' }) {
  const images = gallery
    .map(item => ({ url: getMediaURL(item?.image), alt: typeof item?.image === 'object' ? (item.image.alt || title) : title }))
    .filter(img => img.url)

  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  const prev = useCallback(() => setActive(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setActive(i => (i + 1) % images.length), [images.length])

  if (!images.length) {
    return (
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-6xl font-extrabold text-gray-200">{title.charAt(0)}</span>
      </div>
    )
  }

  const current = images[active]

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 group">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Nav arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-sm hover:bg-white hover:text-gray-950 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Prethodna slika"
            >
              <ChevLeft />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 shadow-sm hover:bg-white hover:text-gray-950 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Sledeća slika"
            >
              <ChevRight />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold">
            {active + 1} / {images.length}
          </div>
        )}

        {/* Brand corner accent */}
        <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand" />
          <div className="absolute top-0 left-0 w-[3px] h-full bg-brand" />
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" role="list" aria-label="Galerija slika">
          {images.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setActive(i)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
                i === active ? 'border-brand shadow-brand-sm' : 'border-transparent hover:border-gray-300',
              )}
              aria-label={`Slika ${i + 1}`}
              aria-pressed={i === active}
            >
              <Image
                src={img.url}
                alt={`${img.alt} — slika ${i + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
