import { getPage, getCategories, getProjects, getClients } from '@/lib/payload'
import { SITE_NAME, SITE_URL } from '@/lib/constants'
import { extractText } from '@/components/ui/RichText'

import Hero from '@/components/sections/Hero'
import ClientLogos from '@/components/sections/ClientLogos'
import WhyUs from '@/components/sections/WhyUs'
import BrandStory from '@/components/sections/BrandStory'
import Services from '@/components/sections/Services'
import ProjectsPreview from '@/components/sections/ProjectsPreview'
import Stats from '@/components/sections/Stats'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import ContactCTA from '@/components/sections/ContactCTA'

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
          potentialAction: {
            '@type': 'SearchAction',
            target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/products?search={search_term_string}` },
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

// ─── Block sorter ─────────────────────────────────────────────────────────────
// Returns typed blocks from page.layout in a structured way for rendering

function sortBlocks(layout = []) {
  const result = {
    stats:       null,
    contentBlocks: [],
    brandStory:  null,
    quotes:      [],
    faq:         null,
    cta:         null,
    other:       [],
  }

  for (const block of layout) {
    switch (block.blockType) {
      case 'stats':       result.stats = block; break
      case 'content':     result.contentBlocks.push(block); break
      case 'brandStory':  result.brandStory = block; break
      case 'quote':       result.quotes.push(block); break
      case 'faq':         result.faq = block; break
      case 'cta':         result.cta = block; break
      default:            result.other.push(block)
    }
  }

  return result
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [page, categoriesData, projectsData, clientsData] = await Promise.all([
    getPage('home').catch(() => null),
    getCategories().catch(() => null),
    getProjects({ limit: 4 }).catch(() => null),
    getClients().catch(() => null),
  ])

  const blocks = sortBlocks(page?.layout ?? [])

  // Client logos from the `clients` global (falls back to text chips inside the component)
  const clientLogos = clientsData?.logos?.length ? clientsData.logos : null

  return (
    <>
      {/* JSON-LD */}
      <WebsiteSchema />
      <FAQSchema faqBlock={blocks.faq} />

      {/* 1 — Hero (light) */}
      <Hero hero={page?.hero} />

      {/* 2 — Client logos carousel */}
      <ClientLogos logos={clientLogos} title={clientsData?.heading || undefined} />

      {/* 3 — Why us */}
      <WhyUs block={blocks.whyUs} />

      {/* 4 — Company + CEO video */}
      {blocks.brandStory && <BrandStory block={blocks.brandStory} />}

      {/* 5 — Services */}
      <Services categories={categoriesData} />

      {/* 6 — Projects preview */}
      <ProjectsPreview projects={projectsData} />

      {/* 7 — Stats */}
      {blocks.stats && <Stats block={blocks.stats} />}

      {/* 8 — Testimonials */}
      {blocks.quotes.length > 0 && <Testimonials quotes={blocks.quotes} />}

      {/* 9 — FAQ */}
      {blocks.faq && <FAQ block={blocks.faq} />}

      {/* 10 — CTA */}
      {blocks.cta && <ContactCTA block={blocks.cta} />}
    </>
  )
}
