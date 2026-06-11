import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

// "Naši projekti" — preview grid of latest completed projects on the homepage.
export default function ProjectsPreview({ projects, heading = 'Naši projekti' }) {
  const items = (projects?.docs ?? projects ?? []).slice(0, 4)
  if (items.length === 0) return null

  return (
    <section className="section-y bg-white" aria-labelledby="projects-heading">
      <div className="container-site">
        <ScrollReveal className="flex items-end justify-between gap-6 mb-12 flex-wrap">
          <div className="max-w-xl">
            <span className="eyebrow mb-4">Realizovano</span>
            <h2 id="projects-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
              {heading}
            </h2>
            <p className="text-gray-500 mt-3 text-base leading-relaxed">
              Pogledajte deo realizovanih kapija i ograda širom Srbije.
            </p>
          </div>
          <Link
            href="/projekti"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-brand/40 hover:text-brand transition-colors flex-shrink-0"
          >
            Svi projekti
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((project, i) => (
            <ScrollReveal key={project.id || project.slug || i} delay={i * 80}>
              <ProjectCard project={project} priority={i < 2} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
