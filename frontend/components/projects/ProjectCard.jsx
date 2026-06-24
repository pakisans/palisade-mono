import Link from 'next/link'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'
import ImageFallback from '@/components/ui/ImageFallback'

/**
 * Editorial project card. `size`:
 *   'feature'  — large hero card (spans 2 cols / 2 rows on desktop)
 *   'showcase' — veća landscape kartica (za 2-kolonski grid na početnoj)
 *   'wide'     — spans 2 cols
 *   'default'  — single cell
 */
export default function ProjectCard({ project, size = 'default', priority = false }) {
  const imgUrl = getMediaURL(project.featuredImage) || getMediaURL(project.meta?.image)
  const href = `/projekti/${project.slug}`
  // Show the project's tags but hide the redundant "Gotovi projekti" umbrella category
  const cats = (project.categories ?? [])
    .filter((c) => (typeof c === 'object' ? c.slug : c) !== 'gotovi-projekti')
    .map((c) => (typeof c === 'object' ? c.title : ''))
    .filter(Boolean)

  const big = size === 'feature' || size === 'showcase'

  const spanCls = {
    feature: 'sm:col-span-2 sm:row-span-2',
    wide: 'sm:col-span-2',
    showcase: '',
    default: '',
  }[size]

  const aspectCls = {
    feature: 'aspect-[4/3] sm:aspect-auto sm:h-full',
    wide: 'aspect-[16/9]',
    showcase: 'aspect-[16/10]',
    default: 'aspect-[4/3]',
  }[size]

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-3xl bg-gray-950 shadow-card ring-1 ring-black/5 transition-all duration-500 ease-spring hover:-translate-y-2 hover:ring-2 hover:ring-brand/60 hover:shadow-[0_30px_80px_-22px_rgba(143,198,64,0.55)] ${spanCls}`}
      aria-label={`Projekat: ${project.title}`}
    >
      {/* Image */}
      <div className={`relative w-full ${aspectCls} min-h-[240px]`}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-[850ms] ease-spring group-hover:scale-[1.08]"
            sizes={big ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, 33vw'}
          />
        ) : (
          <ImageFallback dark />
        )}

        {/* Gradient — produbljuje se na hover, sa blagim brand tonom u dnu */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/35 to-gray-950/5 transition-all duration-500 group-hover:via-gray-950/55" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

        {/* Shine sweep — premium „zasija" prelaz preko kartice na hover */}
        <span
          className="pointer-events-none absolute -left-[40%] top-0 z-[2] h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Kružno ↗ dugme — pojavljuje se na hover */}
        <span
          className="absolute right-4 top-4 flex h-11 w-11 translate-y-1 items-center justify-center rounded-full bg-white/15 text-white opacity-0 ring-1 ring-white/25 backdrop-blur-md transition-all duration-[400ms] ease-spring group-hover:translate-y-0 group-hover:bg-brand group-hover:opacity-100 group-hover:ring-brand"
          aria-hidden="true"
        >
          <svg className="h-5 w-5 -rotate-45" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        {cats.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {cats.slice(0, big ? 3 : 2).map((c, i) => (
              <span
                key={i}
                className="inline-flex h-6 items-center rounded-full bg-white/15 px-2.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
              >
                {c}
              </span>
            ))}
          </div>
        )}

        <h3
          className={`font-extrabold leading-tight tracking-tight text-white ${big ? 'text-2xl md:text-[28px]' : 'text-lg'}`}
        >
          {project.title}
        </h3>

        {big && project.excerpt && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70 line-clamp-2">
            {project.excerpt}
          </p>
        )}

        {/* CTA — sklizne gore na hover */}
        <div className="mt-3 flex translate-y-1 items-center gap-1.5 text-[13px] font-bold text-brand-300 opacity-0 transition-all duration-300 ease-spring group-hover:translate-y-0 group-hover:opacity-100">
          Pogledaj projekat
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
