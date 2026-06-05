import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { resolveLink, resolveHeroLink } from '@/lib/utils'
import RichText, { extractText } from '@/components/ui/RichText'

// ─── Animated floating badge ──────────────────────────────────────────────────

function TrustBadge({ children, delay = 0 }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs text-white/80 font-medium"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─── CTA Button from hero link ─────────────────────────────────────────────────

function HeroCTA({ link }) {
  if (!link) return null
  const { href, label, appearance } = link
  if (appearance === 'outline') {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 h-12 px-7 rounded-xl border-2 border-white/30 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-200"
      >
        {label}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </Link>
    )
  }
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-600 transition-all duration-200 shadow-brand hover:shadow-brand-lg"
    >
      {label}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  )
}

// ─── Stats strip ──────────────────────────────────────────────────────────────

const HERO_STATS = [
  { value: '700+', label: 'klijenata' },
  { value: '20+',  label: 'godina iskustva' },
  { value: '4.9',  label: 'Google ocena' },
  { value: '<24h', label: 'odgovor na upit' },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero({ hero }) {
  const type    = hero?.type
  const imgUrl  = getMediaURL(hero?.media)
  const links   = (hero?.links ?? []).map(resolveHeroLink).filter(Boolean)

  // Extract headline text from richText for SEO
  const headingNodes = hero?.richText?.root?.children?.filter((n) => n.type === 'heading') ?? []
  const hasContent   = hero?.richText?.root?.children?.length > 0

  if (type === 'none' || !hero) return null

  // ── High Impact Hero ──────────────────────────────────────────────────────

  if (type === 'highImpact') {
    return (
      <section
        className="relative min-h-[92vh] flex flex-col surface-dark overflow-hidden noise-overlay"
        aria-label="Uvod"
      >
        {/* Background image with overlay */}
        {imgUrl && (
          <>
            <Image
              src={imgUrl}
              alt="Palisade — kapije i ograde"
              fill
              className="object-cover object-center"
              priority
              quality={90}
              sizes="100vw"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
          </>
        )}
        {!imgUrl && (
          /* Geometric pattern fallback */
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(143,198,64,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(143,198,64,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </div>
        )}

        {/* Brand accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />

        {/* Content */}
        <div className="relative z-10 container-site flex flex-col justify-center flex-1 py-24 md:py-32">
          <div className="max-w-2xl xl:max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="w-8 h-px bg-brand" />
              <span className="text-brand text-[11px] font-bold uppercase tracking-[0.2em]">
                Premium kapije i ograde
              </span>
            </div>

            {/* Headline — from CMS richText or fallback */}
            {hasContent ? (
              <div className="hero-richtext mb-6 animate-fade-up [animation-delay:100ms] opacity-0">
                <RichText
                  content={hero.richText}
                  className="[&_h1]:text-display-lg [&_h1]:text-white [&_h1]:font-extrabold [&_h1]:leading-none [&_h1]:tracking-[-0.04em] [&_h1]:mb-0 [&_h2]:text-display-md [&_h2]:text-white [&_h2]:font-extrabold [&_p]:text-lg [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mt-4 [&_p]:font-normal"
                />
              </div>
            ) : (
              <h1 className="text-display-lg text-white font-extrabold leading-none mb-4 animate-fade-up [animation-delay:100ms] opacity-0">
                Kapije i ograde <br />
                <span className="text-brand">po meri.</span>
              </h1>
            )}

            {/* CTA buttons */}
            {links.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-8 animate-fade-up [animation-delay:250ms] opacity-0">
                {links.map((link, i) => <HeroCTA key={i} link={link} />)}
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-8 animate-fade-up [animation-delay:350ms] opacity-0">
              <TrustBadge>
                <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                Besplatno merenje
              </TrustBadge>
              <TrustBadge>
                <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                Ugradnja po Srbiji
              </TrustBadge>
              <TrustBadge>
                <span className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                Garancija na rad
              </TrustBadge>
            </div>
          </div>
        </div>

        {/* Stats strip at bottom */}
        <div className="relative z-10 border-t border-white/10">
          <div className="container-site">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {HERO_STATS.map((stat, i) => (
                <div key={i} className="py-6 px-4 md:px-8 text-center first:pl-0 last:pr-0">
                  <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── Medium / Low Impact ────────────────────────────────────────────────────

  return (
    <section className="surface-dark py-20 md:py-28 noise-overlay" aria-label="Uvod">
      <div className="absolute inset-x-0 top-0 h-px bg-white/5" />
      <div className="container-site relative">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-6 h-px bg-brand" />
            <span className="text-brand text-[11px] font-bold uppercase tracking-[0.18em]">Palisade d.o.o.</span>
          </div>
          {hasContent ? (
            <RichText
              content={hero.richText}
              className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:text-white [&_h1]:font-extrabold [&_h1]:tracking-tight [&_p]:text-gray-300 [&_p]:text-lg [&_p]:mt-3"
            />
          ) : null}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-8">
              {links.map((link, i) => <HeroCTA key={i} link={link} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
