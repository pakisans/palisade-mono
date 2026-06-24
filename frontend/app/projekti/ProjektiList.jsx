import { notFound } from 'next/navigation'
import { getPage, getProjects } from '@/lib/payload'
import { SITE_URL } from '@/lib/constants'
import PageHero from '@/components/sections/PageHero'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import ProjectCard from '@/components/projects/ProjectCard'
import Pagination from '@/components/ui/Pagination'

export const PAGE_SIZE = 12
const CLOSING_BLOCKS = new Set(['faq', 'cta', 'spacer'])

function ProjectsSchema({ name, projects }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: `${SITE_URL}/projekti`,
    hasPart: (projects ?? []).map((p) => ({
      '@type': 'CreativeWork',
      name: p.title,
      url: `${SITE_URL}/projekti/${p.slug}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

// Deljeni listing — koristi ga i /projekti (current=1) i /projekti/page/[n].
export default async function ProjektiList({ current = 1 }) {
  const [page, projectsRes] = await Promise.all([
    getPage('projekti').catch(() => null),
    getProjects({ page: current, limit: PAGE_SIZE }).catch(() => null),
  ])

  if (!page) notFound() // stranica je potpuno CMS-vođena

  const projects = projectsRes?.docs ?? []
  const total = projectsRes?.totalDocs ?? 0
  const totalPages = projectsRes?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE))

  const layout = Array.isArray(page.layout) ? page.layout : []
  let injectIdx = layout.findIndex((b) => CLOSING_BLOCKS.has(b?.blockType))
  if (injectIdx === -1) injectIdx = layout.length
  const beforeBlocks = layout.slice(0, injectIdx).filter((b) => b?.blockType !== 'mediaBlock')
  const afterBlocks = layout.slice(injectIdx).filter((b) => b?.blockType !== 'mediaBlock')

  const breadcrumbs = [{ label: 'Naslovna', href: '/' }, { label: page.title }]

  return (
    <>
      <ProjectsSchema name={page.title} projects={projects} />

      <PageHero hero={page.hero} title={page.title} breadcrumbs={breadcrumbs} />
      <BlockRenderer blocks={beforeBlocks} />

      {projects.length > 0 && (
        <section className="section-y-sm" aria-label={page.title}>
          <div className="container-site">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} priority={i < 3} />
              ))}
            </div>
            <Pagination basePath="/projekti" current={current} total={totalPages} />
          </div>
        </section>
      )}

      <BlockRenderer blocks={afterBlocks} />
    </>
  )
}
