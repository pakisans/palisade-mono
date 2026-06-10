import Link from 'next/link'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'

/**
 * Editorial project card. `size`:
 *   'feature' — large hero card (spans 2 cols / 2 rows on desktop)
 *   'wide'    — spans 2 cols
 *   'default' — single cell
 */
export default function ProjectCard({ project, size = 'default', priority = false }) {
  const imgUrl = getMediaURL(project.featuredImage) || getMediaURL(project.meta?.image)
  const href   = `/projekti/${project.slug}`
  // Show the project's tags but hide the redundant "Gotovi projekti" umbrella category
  const cats   = (project.categories ?? [])
    .filter((c) => (typeof c === 'object' ? c.slug : c) !== 'gotovi-projekti')
    .map((c) => (typeof c === 'object' ? c.title : ''))
    .filter(Boolean)

  const isFeature = size === 'feature'

  const spanCls = {
    feature: 'sm:col-span-2 sm:row-span-2',
    wide:    'sm:col-span-2',
    default: '',
  }[size]

  const aspectCls = {
    feature: 'aspect-[4/3] sm:aspect-auto sm:h-full',
    wide:    'aspect-[16/9]',
    default: 'aspect-[4/3]',
  }[size]

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-2xl bg-gray-950 ${spanCls}`}
      aria-label={`Projekat: ${project.title}`}
    >
      {/* Image */}
      <div className={`relative w-full ${aspectCls} min-h-[220px]`}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.06]"
            sizes={isFeature ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center">
            <span className="text-5xl font-extrabold text-white/10">{project.title.charAt(0)}</span>
          </div>
        )}

        {/* Gradient overlay — always present, deepens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-400" />

        {/* Brand corner accent */}
        <div className="absolute top-0 left-0 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-brand" />
          <div className="absolute top-0 left-0 w-[3px] h-full bg-brand" />
        </div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        {/* Category tags */}
        {cats.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {cats.slice(0, isFeature ? 3 : 2).map((c, i) => (
              <span key={i} className="inline-flex items-center h-6 px-2.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
                {c}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className={`font-extrabold text-white leading-tight tracking-tight ${isFeature ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
          {project.title}
        </h3>

        {/* Excerpt — only on feature */}
        {isFeature && project.excerpt && (
          <p className="text-white/70 text-sm mt-2 leading-relaxed line-clamp-2 max-w-md">
            {project.excerpt}
          </p>
        )}

        {/* CTA — slides up on hover */}
        <div className="flex items-center gap-1.5 mt-3 text-brand-300 text-[13px] font-bold translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-spring">
          Pogledaj projekat
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
