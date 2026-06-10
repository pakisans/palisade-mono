import Link from 'next/link'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'

/**
 * Project card that mirrors the original kapije-ograde.rs `ee-post` loop item
 * 1:1 in structure: image on top (4:3) → h4 title → excerpt → secondary "Više"
 * button. Used by the /projekti listing grid (the detail page's "related"
 * section keeps its own editorial ProjectCard).
 */
export default function ProjectCardClassic({ project, priority = false }) {
  const imgUrl = getMediaURL(project.featuredImage) || getMediaURL(project.meta?.image)
  const href = `/projekti/${project.slug}`

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-card transition-shadow duration-300">
      {/* Image — 4:3, on top */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={project.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 ease-spring group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-5xl font-extrabold text-gray-300">{project.title?.charAt(0)}</span>
          </div>
        )}
      </Link>

      {/* Wrap — title, excerpt, button */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h4 className="text-lg font-bold leading-snug tracking-tight text-gray-950">
          <Link href={href} className="transition-colors hover:text-brand">
            {project.title}
          </Link>
        </h4>

        {project.excerpt && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">{project.excerpt}</p>
        )}

        <Link
          href={href}
          className="mt-5 inline-flex h-9 w-fit items-center gap-1.5 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-800 transition-colors hover:border-brand hover:text-brand"
          aria-label={`Više o projektu: ${project.title}`}
        >
          Više
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
