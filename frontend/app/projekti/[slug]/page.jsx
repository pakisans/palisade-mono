import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getProject, getProjects, getAdjacentProjects, getMediaURL } from '@/lib/payload'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { formatDate } from '@/lib/utils'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import RichText from '@/components/ui/RichText'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectGallery from '@/components/projects/ProjectGallery'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const revalidate = 3600

export async function generateStaticParams() {
  const data = await getProjects({ limit: 48 }).catch(() => null)
  return (data?.docs ?? []).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const project   = await getProject(slug).catch(() => null)
  if (!project) return {}
  const title       = project.meta?.title       || `${project.title} | Gotovi projekti`
  const description = project.meta?.description || project.excerpt || `Realizovan projekat — ${project.title}. Palisade d.o.o.`
  const imgUrl      = getMediaURL(project.meta?.image) || getMediaURL(project.featuredImage)
  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: { canonical: `/projekti/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/projekti/${slug}`, type: 'article', ...(imgUrl ? { images: [{ url: imgUrl }] } : {}) },
  }
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const project   = await getProject(slug)
  if (!project) notFound()

  const imgUrl   = getMediaURL(project.featuredImage)
  const cats     = (project.categories ?? []).map((c) => (typeof c === 'object' ? c : null)).filter(Boolean)

  // Project images: featured + any media blocks added in the CMS layout (deduped).
  // The media blocks are pulled into the gallery, so they're not also stacked below.
  const layoutBlocks = Array.isArray(project.layout) ? project.layout : []
  const otherBlocks  = layoutBlocks.filter((b) => b?.blockType !== 'mediaBlock')
  const seenImg = new Set()
  const galleryImages = [project.featuredImage, ...layoutBlocks.filter((b) => b?.blockType === 'mediaBlock').map((b) => b?.media)]
    .filter((m) => {
      const id = typeof m === 'object' ? m?.id : m
      if (id == null || seenImg.has(id)) return false
      seenImg.add(id)
      return true
    })

  const hasContent = !!project.content?.root?.children?.length

  // Adjacent navigation: previous + next project (in the /projekti listing order)
  const { prev, next } = await getAdjacentProjects(slug).catch(() => ({ prev: null, next: null }))
  const adjacent = [
    prev && { label: 'Prethodni projekat', project: prev, isPrev: true },
    next && { label: 'Sledeći projekat', project: next, isPrev: false },
  ].filter(Boolean)

  const breadcrumbs = [
    { label: 'Naslovna', href: '/' },
    { label: 'Projekti', href: '/projekti' },
    { label: project.title },
  ]

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.excerpt || '',
    url: `${SITE_URL}/projekti/${slug}`,
    ...(imgUrl ? { image: imgUrl } : {}),
    ...(project.publishedOn ? { dateCreated: project.publishedOn } : {}),
    creator: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* ─── Hero / banner (zadržava sliku u pozadini) ────────── */}
      <section className="relative surface-dark overflow-hidden noise-overlay" style={{ minHeight: '440px' }}>
        {imgUrl ? (
          <>
            <Image src={imgUrl} alt={project.title} fill priority className="object-cover opacity-40" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/30" />
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage:
                'linear-gradient(rgba(143,198,64,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(143,198,64,0.5) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        )}
        <div className="absolute left-0 inset-y-0 w-1 bg-brand" aria-hidden="true" />
        <div className="relative z-10 container-site py-14 md:py-20 flex flex-col justify-end" style={{ minHeight: '440px' }}>
          <Breadcrumbs items={breadcrumbs} className="mb-7" />
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {cats.map((c) => (
                <Link key={c.id} href={`/kategorije/${c.slug}`} className="inline-flex items-center h-7 px-3 rounded-full bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold uppercase tracking-wider hover:bg-brand transition-colors">
                  {c.title}
                </Link>
              ))}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05] max-w-3xl">
            {project.title}
          </h1>
          {project.excerpt && (
            <p className="text-gray-300 text-base md:text-lg mt-5 max-w-2xl leading-relaxed">{project.excerpt}</p>
          )}
          {project.publishedOn && (
            <p className="text-gray-500 text-xs mt-5 uppercase tracking-wider">{formatDate(project.publishedOn)}</p>
          )}
        </div>
      </section>

      {/* ─── Slike projekta: puna slika; horizontalni scroll ako ih je više ── */}
      {galleryImages.length > 0 && (
        <section className="section-y-sm">
          <div className="container-site">
            <ScrollReveal>
              <ProjectGallery images={galleryImages} title={project.title} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ─── Telo: opis projekta + bočni panel ────────────────── */}
      {hasContent && (
        <section className="section-y-sm">
          <div className="container-site">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
              {/* Opis */}
              <ScrollReveal className="min-w-0">
                <RichText
                  content={project.content}
                  className="prose-lg max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-950 prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-[1.85] prose-a:font-semibold prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-strong:text-gray-950 prose-ul:my-6 prose-ul:space-y-2 prose-li:text-gray-700 prose-li:marker:text-brand prose-blockquote:border-l-4 prose-blockquote:border-brand prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-gray-800 [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-relaxed [&>p:first-of-type]:text-gray-900"
                />
              </ScrollReveal>

              {/* Bočni panel — detalji + CTA (sticky) */}
              <aside>
                <div className="space-y-4 lg:sticky lg:top-24">
                  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
                    <h2 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Detalji projekta</h2>
                    <dl className="space-y-4 text-sm">
                      {cats.length > 0 && (
                        <div>
                          <dt className="mb-2 text-xs font-semibold text-gray-400">Kategorija</dt>
                          <dd className="flex flex-wrap gap-1.5">
                            {cats.map((c) => (
                              <Link key={c.id} href={`/kategorije/${c.slug}`} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-700 transition-colors hover:bg-brand hover:text-white">
                                {c.title}
                              </Link>
                            ))}
                          </dd>
                        </div>
                      )}
                      {project.publishedOn && (
                        <div className="flex items-center justify-between border-t border-gray-100 pt-3.5">
                          <dt className="text-xs font-semibold text-gray-400">Datum</dt>
                          <dd className="font-semibold text-gray-700">{formatDate(project.publishedOn)}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="rounded-2xl bg-gray-950 p-6 text-white">
                    <p className="text-base font-extrabold">Želite sličan projekat?</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-400">Besplatno izlazimo na merenje i šaljemo ponudu u roku od 24h.</p>
                    <Link href="/kontakt" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-600">
                      Zatražite ponudu
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" /></svg>
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* ─── Video itd. (slike idu u galeriju gore) — puna širina ── */}
      {otherBlocks.length > 0 && <BlockRenderer blocks={otherBlocks} />}

      {/* ─── Drugi projekti: prethodni / sledeći ──────────────── */}
      {adjacent.length > 0 && (
        <section className="section-y-sm bg-gray-50 border-t border-gray-100" aria-labelledby="related-projects">
          <div className="container-site">
            <ScrollReveal className="flex items-end justify-between mb-8">
              <h2 id="related-projects" className="text-2xl font-extrabold text-gray-950 tracking-tight">Drugi projekti</h2>
              <Link href="/projekti" className="text-sm font-semibold text-brand hover:text-brand-700 transition-colors">Svi projekti →</Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {adjacent.map(({ label, project: p, isPrev }, i) => (
                <ScrollReveal key={p.id} delay={i * 80}>
                  <p className={`mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${isPrev ? '' : 'sm:justify-end'}`}>
                    {isPrev && <span aria-hidden="true">←</span>}
                    {label}
                    {!isPrev && <span aria-hidden="true">→</span>}
                  </p>
                  <ProjectCard project={p} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-gray-100">
        <div className="container-site py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-extrabold text-xl text-gray-950">Želite sličan projekat?</p>
              <p className="text-gray-500 text-sm mt-1">Dolazimo na merenje besplatno i šaljemo ponudu u roku od 24h.</p>
            </div>
            <Link href="/kontakt" className="flex-shrink-0 inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-600 transition-colors shadow-brand-sm">
              Zatražite ponudu
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
