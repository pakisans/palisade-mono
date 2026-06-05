import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { resolveHeroLink } from '@/lib/utils'
import RichText from '@/components/ui/RichText'
import Breadcrumbs from '@/components/ui/Breadcrumbs'

function HeroCTA({ link }) {
  if (!link) return null
  const isOutline = link.appearance === 'outline'
  return (
    <Link
      href={link.href}
      className={
        isOutline
          ? 'inline-flex items-center gap-2 h-12 px-7 rounded-xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/40 transition-all'
          : 'inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-600 transition-all shadow-brand-sm hover:shadow-brand'
      }
    >
      {link.label}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </Link>
  )
}

/**
 * Hero for generic CMS pages (o-nama, kontakt, etc.).
 * Renders the page's `hero` group: type, richText (h1 + intro), links, media.
 */
export default function PageHero({ hero, title, breadcrumbs }) {
  const type     = hero?.type
  const imgUrl   = getMediaURL(hero?.media)
  const links    = (hero?.links ?? []).map(resolveHeroLink).filter(Boolean)
  const hasRich  = hero?.richText?.root?.children?.some(
    (n) => n.children?.some((c) => c.text) || n.type === 'heading',
  )

  // type === 'none' → render a minimal breadcrumb-only strip so the page still has an H1
  if (type === 'none' || !hero) {
    return (
      <section className="bg-white border-b border-gray-100">
        <div className="container-site py-10 md:py-14">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-6" />}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight">{title}</h1>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-gray-950 overflow-hidden noise-overlay" style={{ minHeight: '360px' }}>
      {/* Background image */}
      {imgUrl && (
        <>
          <Image src={imgUrl} alt={title || ''} fill className="object-cover object-center opacity-35" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-gray-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent" />
        </>
      )}
      {!imgUrl && (
        <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true" style={{ backgroundImage: 'linear-gradient(rgba(143,198,64,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(143,198,64,0.5) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      )}

      {/* Brand left line */}
      <div className="absolute left-0 inset-y-0 w-1 bg-brand" aria-hidden="true" />

      <div className="relative z-10 container-site py-16 md:py-24 flex flex-col justify-center" style={{ minHeight: '360px' }}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-8" />}

        <div className="max-w-2xl">
          {hasRich ? (
            <RichText
              content={hero.richText}
              className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-extrabold [&_h1]:text-white [&_h1]:tracking-tight [&_h1]:leading-none [&_h1]:mb-0 [&_p]:text-lg [&_p]:text-gray-300 [&_p]:leading-relaxed [&_p]:mt-4 [&_p]:max-w-xl"
            />
          ) : (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">{title}</h1>
          )}

          {links.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-8">
              {links.map((link, i) => <HeroCTA key={i} link={link} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
