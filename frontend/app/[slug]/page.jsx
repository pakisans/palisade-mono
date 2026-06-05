import { notFound } from 'next/navigation'
import { getPage, getAllPageSlugs, getMediaURL } from '@/lib/payload'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import PageHero from '@/components/sections/PageHero'
import BlockRenderer from '@/components/blocks/BlockRenderer'

export const revalidate = 3600
export const dynamicParams = true // allow on-demand rendering for new CMS pages

// Slugs handled by their own dedicated routes — never by this catch-all
const RESERVED = new Set(['home', 'proizvodi', 'kategorije', 'blog', 'brendovi'])

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs().catch(() => [])
  return slugs
    .filter((slug) => !RESERVED.has(slug))
    .map((slug) => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (RESERVED.has(slug)) return {}

  const page = await getPage(slug).catch(() => null)
  if (!page) return {}

  const title       = page.meta?.title       || `${page.title} | ${SITE_NAME}`
  const description = page.meta?.description || ''
  const imgUrl      = getMediaURL(page.meta?.image)

  return {
    // absolute → bypass the layout's "%s | Palisade" template (CMS title already has the suffix)
    title: { absolute: title },
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${slug}`,
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DynamicPage({ params }) {
  const { slug } = await params
  if (RESERVED.has(slug)) notFound()

  const page = await getPage(slug)
  if (!page) notFound()

  const breadcrumbs = [
    { label: 'Naslovna', href: '/' },
    { label: page.title },
  ]

  return (
    <>
      <PageHero hero={page.hero} title={page.title} breadcrumbs={breadcrumbs} />
      <BlockRenderer blocks={page.layout} />
    </>
  )
}
