import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

// Preview grid of latest completed projects — all copy comes from the CMS block.
export default function ProjectsPreview({ block, projects }) {
  const limit = block?.limit || 4
  const items = (projects?.docs ?? projects ?? []).slice(0, limit)
  if (items.length === 0) return null
  const count = items.length

  // Neravnomeran (bento) raspored — premium feeling, ne „4 u gridu".
  let gridClass = 'sm:grid-cols-2 lg:grid-cols-4'
  let sizeAt = (i) => (i === 0 ? 'feature' : i === count - 1 ? 'wide' : 'default')
  if (count === 3) {
    gridClass = 'sm:grid-cols-2 lg:grid-cols-3'
    sizeAt = (i) => (i === 0 ? 'feature' : 'default')
  } else if (count === 2) {
    gridClass = 'sm:grid-cols-2'
    sizeAt = () => 'showcase'
  } else if (count === 1) {
    gridClass = ''
    sizeAt = () => 'feature'
  }

  return (
    <section className="section-y bg-white" aria-labelledby="projects-heading">
      <div className="container-site">
        <ScrollReveal className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div className="max-w-xl">
            {block?.eyebrow && <span className="eyebrow mb-4">{block.eyebrow}</span>}
            {block?.heading && (
              <h2 id="projects-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
                {block.heading}
              </h2>
            )}
            {block?.intro && <p className="text-gray-500 mt-3 text-base leading-relaxed">{block.intro}</p>}
          </div>
          <Link
            href="/projekti"
            className="btn btn-outline flex-shrink-0"
          >
            {block?.ctaLabel || 'Svi projekti'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </ScrollReveal>

        {/* ProjectCard je direktno grid-stavka da bi col/row-span (bento) radili */}
        <div className={`grid grid-cols-1 gap-5 md:gap-6 ${gridClass}`}>
          {items.map((project, i) => (
            <ProjectCard
              key={project.id || project.slug || i}
              project={project}
              size={sizeAt(i)}
              priority={i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
