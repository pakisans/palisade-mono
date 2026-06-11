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
          ? 'inline-flex items-center gap-2 h-12 px-7 rounded-xl border-2 border-gray-200 text-gray-800 text-sm font-semibold hover:border-brand/50 hover:text-brand transition-all'
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
    <section className="relative bg-white overflow-hidden border-b border-gray-100">
      {/* Soft brand wash + dot grid backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/[0.04] to-white" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.4]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(143,198,64,0.12) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        aria-hidden="true"
      />

      <div className="container-site py-14 md:py-20">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-8" />}

        <div className={imgUrl ? 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center' : ''}>
          <div className="max-w-2xl">
            {hasRich ? (
              <RichText
                content={hero.richText}
                className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-6xl [&_h1]:font-extrabold [&_h1]:text-gray-950 [&_h1]:tracking-tight [&_h1]:leading-[1.05] [&_h1]:mb-0 [&_p]:text-lg [&_p]:text-gray-500 [&_p]:leading-relaxed [&_p]:mt-4 [&_p]:max-w-xl"
              />
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.05]">{title}</h1>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mt-8">
                {links.map((link, i) => <HeroCTA key={i} link={link} />)}
              </div>
            )}
          </div>

          {imgUrl && (
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card-hover bg-gray-100">
              <Image src={imgUrl} alt={title || ''} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute top-0 left-0 w-12 h-12" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
