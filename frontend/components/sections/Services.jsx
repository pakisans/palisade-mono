import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import ScrollReveal from '@/components/ui/ScrollReveal'

// "Naše usluge" — up to 4 service cards sourced from product categories.
// Prefers leaf categories (with a parent) that have imagery, like the reference
// (2D Panelne ograde, Pešačke kapije, Aluminijumske ograde, Klizne kapije).
function pickServices(categories) {
  const docs = categories?.docs ?? categories ?? []
  if (!Array.isArray(docs) || docs.length === 0) return []
  const withImg = docs.filter((c) => getMediaURL(c.image))
  const leaves = withImg.filter((c) => c.parent)
  const pool = leaves.length >= 4 ? leaves : withImg.length ? withImg : docs
  return pool.slice(0, 4)
}

export default function Services({ categories, heading = 'Naše usluge' }) {
  const items = pickServices(categories)
  if (items.length === 0) return null

  return (
    <section className="section-y surface-soft" aria-labelledby="services-heading">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow justify-center mb-4">Šta radimo</span>
          <h2 id="services-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
            {heading}
          </h2>
          <p className="text-gray-500 mt-3 text-base leading-relaxed">
            Kompletna rešenja za kapije i ograde — od ideje, preko izrade, do montaže.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((cat, i) => {
            const imgUrl = getMediaURL(cat.image)
            return (
              <ScrollReveal key={cat.id || i} delay={i * 80}>
                <Link
                  href={categoryPath(cat)}
                  className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-gray-100 bg-white hover:border-brand/30 hover:shadow-card-hover transition-all duration-300 ease-spring hover:-translate-y-1"
                  aria-label={`Usluga: ${cat.title}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-spring" aria-hidden="true" />
                  </div>
                  <div className="p-5 flex items-center justify-between gap-3 flex-1">
                    <div>
                      <h3 className="font-bold text-[16px] text-gray-950 leading-snug group-hover:text-brand transition-colors duration-200">
                        {cat.title}
                      </h3>
                      {cat.description && (
                        <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-snug">{cat.description}</p>
                      )}
                    </div>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-all duration-200">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
