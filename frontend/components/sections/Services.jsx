import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import ScrollReveal from '@/components/ui/ScrollReveal'

// Auto source: up to 4 service cards from product categories (prefer leaves with imagery).
function pickServices(categories) {
  const docs = categories?.docs ?? categories ?? []
  if (!Array.isArray(docs) || docs.length === 0) return []
  const withImg = docs.filter((c) => getMediaURL(c.image))
  const leaves = withImg.filter((c) => c.parent)
  const pool = leaves.length >= 4 ? leaves : withImg.length ? withImg : docs
  return pool.slice(0, 4)
}

export default function Services({ block, categories }) {
  const source = block?.source || 'auto'

  const items =
    source === 'manual' && block?.items?.length
      ? block.items.map((it) => ({ img: getMediaURL(it.image), title: it.title, href: it.href || '#', text: it.text }))
      : pickServices(categories).map((cat) => ({ img: getMediaURL(cat.image), title: cat.title, href: categoryPath(cat), text: cat.description }))

  if (items.length === 0) return null

  return (
    <section className="section-y surface-soft" aria-labelledby="services-heading">
      <div className="container-site">
        <ScrollReveal className="mx-auto mb-14 max-w-xl text-center">
          {block?.eyebrow && <span className="eyebrow justify-center mb-4">{block.eyebrow}</span>}
          {block?.heading && (
            <h2 id="services-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {block.heading}
            </h2>
          )}
          {block?.intro && <p className="mt-3 text-base leading-relaxed text-gray-500">{block.intro}</p>}
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <Link
                href={item.href}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 ease-spring hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover"
                aria-label={`Usluga: ${item.title}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  {item.img ? (
                    <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.05]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 bg-brand transition-transform duration-400 ease-spring group-hover:scale-x-100" aria-hidden="true" />
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 p-5">
                  <div>
                    <h3 className="text-[16px] font-bold leading-snug text-gray-950 transition-colors duration-200 group-hover:text-brand">{item.title}</h3>
                    {item.text && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-gray-500">{item.text}</p>}
                  </div>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-all duration-200 group-hover:bg-brand group-hover:text-white">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
