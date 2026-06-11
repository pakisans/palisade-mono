import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { resolveHeroLink } from '@/lib/utils'
import RichText from '@/components/ui/RichText'

// ─── CTA Button from hero link ─────────────────────────────────────────────────

function HeroCTA({ link }) {
  if (!link) return null
  const { href, label, appearance } = link
  if (appearance === 'outline') {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 h-12 px-7 rounded-xl border-2 border-gray-200 text-gray-800 text-sm font-semibold hover:border-brand/50 hover:text-brand transition-all duration-200"
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

const HERO_STATS = [
  { value: '700+', label: 'klijenata' },
  { value: '20+',  label: 'godina iskustva' },
  { value: '4.9',  label: 'Google ocena' },
  { value: '<24h', label: 'odgovor na upit' },
]

const TRUST = ['Besplatno merenje', 'Ugradnja po Srbiji', 'Garancija na rad']

// ─── Hero (light, reference-aligned split layout) ──────────────────────────────

export default function Hero({ hero }) {
  if (!hero || hero.type === 'none') return null

  const imgUrl     = getMediaURL(hero?.media)
  const links      = (hero?.links ?? []).map(resolveHeroLink).filter(Boolean)
  const hasContent = hero?.richText?.root?.children?.length > 0

  return (
    <section className="relative bg-white overflow-hidden" aria-label="Uvod">
      {/* Soft brand wash backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/[0.04] to-white" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.4]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(143,198,64,0.12) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      <div className="container-site py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text side */}
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="w-8 h-px bg-brand" aria-hidden="true" />
              <span className="text-brand text-[11px] font-bold uppercase tracking-[0.2em]">
                Premium kapije i ograde
              </span>
            </div>

            {hasContent ? (
              <div className="animate-fade-up [animation-delay:100ms] opacity-0">
                <RichText
                  content={hero.richText}
                  className="[&_h1]:text-display-sm [&_h1]:md:text-display-md [&_h1]:text-gray-950 [&_h1]:font-extrabold [&_h1]:leading-[1.05] [&_h1]:tracking-tight [&_h1]:mb-0 [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:text-gray-950 [&_h2]:font-extrabold [&_p]:text-lg [&_p]:text-gray-500 [&_p]:leading-relaxed [&_p]:mt-5 [&_p]:font-normal"
                />
              </div>
            ) : (
              <h1 className="text-display-sm md:text-display-md text-gray-950 font-extrabold leading-[1.05] tracking-tight animate-fade-up [animation-delay:100ms] opacity-0">
                Kapije i ograde <span className="text-brand">po meri</span>
              </h1>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-8 animate-fade-up [animation-delay:250ms] opacity-0">
                {links.map((link, i) => <HeroCTA key={i} link={link} />)}
              </div>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-8 animate-fade-up [animation-delay:350ms] opacity-0">
              {TRUST.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-2 text-sm text-gray-600 font-medium">
                  <span className="w-4 h-4 rounded-full bg-brand/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Image side */}
          <div className="relative animate-fade-up [animation-delay:200ms] opacity-0">
            <div className="relative aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden shadow-card-hover bg-gray-100">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt="Palisade — kapije i ograde"
                  fill
                  priority
                  quality={90}
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-6xl font-extrabold text-gray-300">P</span>
                </div>
              )}
              {/* Brand corner accent */}
              <div className="absolute top-0 left-0 w-12 h-12" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-14 lg:mt-16 pt-10 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {HERO_STATS.map((stat, i) => (
              <div key={i} className="px-4 md:px-8 text-center first:pl-0">
                <p className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
