import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPage, getProjects, getMediaURL } from '@/lib/payload'
import { SITE_URL } from '@/lib/constants'
import PageHero from '@/components/sections/PageHero'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import ProjectCardClassic from '@/components/projects/ProjectCardClassic'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const revalidate = 3600

// Projects per listing page (matches the original kapije-ograde.rs paginated grid).
const PAGE_SIZE = 12

// Closing CMS sections — the dynamic project grid is injected right before these.
const CLOSING_BLOCKS = new Set(['faq', 'cta', 'spacer'])

// ─── Metadata — entirely from the CMS `projekti` page ─────────────────────────

export async function generateMetadata() {
  const page = await getPage('projekti').catch(() => null)
  if (!page) return {}
  const { title, description, image } = page.meta ?? {}
  const imgUrl = getMediaURL(image)
  return {
    title: title ? { absolute: title } : undefined,
    description: description || undefined,
    alternates: { canonical: '/projekti' },
    openGraph: {
      title: title || page.title,
      description: description || undefined,
      url: `${SITE_URL}/projekti`,
      type: 'website',
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  }
}

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

export default async function ProjektiPage({ searchParams }) {
  const sp = await searchParams
  const current = Math.max(1, parseInt(sp?.page ?? '1', 10) || 1)

  // CMS page (all sections/text) + dynamic project cards from gotovi-projekti.
  const [page, projectsRes] = await Promise.all([
    getPage('projekti').catch(() => null),
    getProjects({ page: current, limit: PAGE_SIZE }).catch(() => null),
  ])

  // The page is fully CMS-driven — without the CMS page there is nothing to show.
  if (!page) notFound()

  const projects = projectsRes?.docs ?? []
  const total = projectsRes?.totalDocs ?? 0
  const totalPages = projectsRes?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE))

  // Render CMS blocks, dropping any leftover static gallery images, and inject
  // the live grid just before the closing sections (spacer / FAQ / CTA).
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

      {/* Dynamic project grid (replaces the static CMS gallery) */}
      {projects.length > 0 && (
        <section className="section-y-sm" aria-label={page.title}>
          <div className="container-site">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {projects.map((project, i) => (
                <ScrollReveal key={project.id} delay={Math.min(i % 3, 2) * 80} className="h-full">
                  <div className="h-full">
                    <ProjectCardClassic project={project} priority={i < 3} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <Pagination current={current} totalPages={totalPages} />
          </div>
        </section>
      )}

      <BlockRenderer blocks={afterBlocks} />
    </>
  )
}

// ─── Numbered pagination (mirrors the original /projekti/page/N grid) ─────────

function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  let prev = 0
  for (const p of sorted) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

function Pagination({ current, totalPages }) {
  if (totalPages <= 1) return null
  const href = (p) => (p === 1 ? '/projekti' : `/projekti?page=${p}`)
  const items = pageWindow(current, totalPages)

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Stranice">
      <PageLink href={href(current - 1)} disabled={current <= 1}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 12L3 8l4-4" />
        </svg>
      </PageLink>

      {items.map((it, i) =>
        it === '…' ? (
          <span key={`e${i}`} className="px-2 text-sm text-gray-400" aria-hidden="true">
            …
          </span>
        ) : (
          <Link
            key={it}
            href={href(it)}
            aria-current={it === current ? 'page' : undefined}
            className={
              it === current
                ? 'inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-brand px-3 text-sm font-bold text-white'
                : 'inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand'
            }
          >
            {it}
          </Link>
        ),
      )}

      <PageLink href={href(current + 1)} disabled={current >= totalPages}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </PageLink>
    </nav>
  )
}

function PageLink({ href, disabled, children }) {
  if (disabled) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 text-gray-300" aria-disabled="true">
        {children}
      </span>
    )
  }
  return (
    <Link href={href} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:border-brand hover:text-brand">
      {children}
    </Link>
  )
}
