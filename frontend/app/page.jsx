import { getPage, getCategories, getProjects } from '@/lib/payload'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { extractText } from '@/components/ui/RichText'

import Hero from '@/components/sections/Hero'
import HomeSections from '@/components/sections/HomeSections'

export const revalidate = 3600

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata() {
  const page = await getPage('home').catch(() => null)
  const meta = page?.meta

  return {
    title: meta?.title || `Kapije i ograde po meri Beograd | ${SITE_NAME}`,
    description: meta?.description || 'Palisade d.o.o. — izrada i montaža kapija i ograda u Beogradu i celoj Srbiji.',
    alternates: { canonical: '/' },
    openGraph: {
      title: meta?.title || `Kapije i ograde | ${SITE_NAME}`,
      description: meta?.description || '',
      url: SITE_URL,
      images: meta?.image ? [{ url: meta.image?.url || '' }] : [],
    },
  }
}

// ─── Structured data ──────────────────────────────────────────────────────────

function WebsiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          inLanguage: 'sr-RS',
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/proizvodi?pretraga={search_term_string}` },
            'query-input': 'required name=search_term_string',
          },
        }),
      }}
    />
  )
}

function FAQSchema({ faqBlock }) {
  if (!faqBlock?.items?.length) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqBlock.items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: typeof item.answer === 'string' ? item.answer : extractText(item.answer),
            },
          })),
        }),
      }}
    />
  )
}

// ─── Page — Hero + CMS layout blocks rendered in order ──────────────────────────

export default async function HomePage() {
  const [page, categoriesData, projectsData] = await Promise.all([
    getPage('home').catch(() => null),
    getCategories().catch(() => null),
    getProjects({ limit: 8 }).catch(() => null),
  ])

  const layout = page?.layout ?? []
  const faqBlock = layout.find((b) => b?.blockType === 'faq')

  return (
    <>
      <WebsiteSchema />
      <FAQSchema faqBlock={faqBlock} />

      <Hero hero={page?.hero} />
      <HomeSections blocks={layout} categories={categoriesData} projects={projectsData} />
    </>
  )
}
