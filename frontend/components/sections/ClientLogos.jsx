import { Fragment } from 'react'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ScrollerX from '@/components/ui/ScrollerX'

// Highlight the number and the word PALISADA in brand color (matches reference).
function EmphHeading({ text }) {
  const parts = String(text).split(/(\d+|PALISADA)/g)
  return parts.map((p, i) =>
    /^\d+$/.test(p) || p === 'PALISADA'
      ? <span key={i} className="text-brand">{p}</span>
      : <Fragment key={i}>{p}</Fragment>,
  )
}

function LogoItem({ logo }) {
  const isObject = logo && typeof logo === 'object'
  const url = isObject ? getMediaURL(logo.image || logo) : null
  const alt = (isObject && (logo.alt || logo.name)) || 'Klijent'
  if (url) {
    return (
      <div className="flex h-16 w-44 flex-shrink-0 items-center justify-center px-2">
        <Image src={url} alt={alt} width={176} height={64} className="max-h-12 w-auto object-contain" />
      </div>
    )
  }
  return (
    <span className="flex h-16 flex-shrink-0 select-none items-center justify-center px-8 text-xl font-extrabold tracking-tight text-gray-300">
      {typeof logo === 'string' ? logo : alt}
    </span>
  )
}

export default function ClientLogos({ block }) {
  const items = block?.logos ?? []
  if (!items.length) return null
  const heading = block?.heading

  return (
    <section className="section-y-sm relative overflow-hidden bg-white border-y border-gray-100" aria-labelledby="clients-heading">
      {/* Brand ring-P watermark — large, centered, transparent middle (logos show through) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-[0.07] md:w-[440px]"
      />

      <div className="container-site relative z-10">
        {heading && (
          <ScrollReveal className="text-center mb-10">
            <h2 id="clients-heading" className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight">
              <EmphHeading text={heading} />
            </h2>
          </ScrollReveal>
        )}
      </div>

      {/* Auto-scroll + ručno (swipe/drag) — pauzira na hover, fade na ivicama */}
      <ScrollerX speed={55} className="relative z-10 mask-fade-x items-center gap-12 px-6 md:gap-16">
        {items.map((logo, i) => (
          <LogoItem key={i} logo={logo} />
        ))}
      </ScrollerX>
    </section>
  )
}
