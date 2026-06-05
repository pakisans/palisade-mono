import Link from 'next/link'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'
import ScrollReveal from '@/components/ui/ScrollReveal'

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)

function CategoryCard({ category, large = false }) {
  const imgUrl = getMediaURL(category.media || category.image)
  const href   = `/kategorije/${category.slug}`

  return (
    <Link href={href} className={`category-card group ${large ? 'min-h-[380px] md:min-h-[480px]' : 'min-h-[280px] md:min-h-[320px]'}`} aria-label={`Kategorija: ${category.title}`}>
      {/* Image */}
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={category.title}
          fill
          className="category-card-img"
          sizes={large ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 768px) 100vw, 40vw'}
        />
      ) : (
        /* Fallback: branded gradient */
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/10 transition-colors duration-500 z-10" />

      {/* Green accent line at bottom — reveals on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-spring z-20" />

      {/* Content */}
      <div className="category-card-label z-20">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand/80 mb-2">
            {category.parent?.title || 'Kategorija'}
          </p>
          <h3 className={`font-extrabold text-white leading-tight tracking-tight ${large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
            {category.title}
          </h3>
          {category.description && (
            <p className="text-sm text-white/60 mt-2 leading-relaxed line-clamp-2">{category.description}</p>
          )}
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand group-hover:gap-3 transition-all duration-200">
            Pogledaj proizvode <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Categories({ categories }) {
  if (!categories?.docs?.length && !categories?.length) return null
  const docs = categories?.docs ?? categories ?? []
  if (!docs.length) return null

  // Separate root categories (no parent) and show them
  const rootCats = docs.filter((c) => !c.parent)
  const display  = rootCats.length ? rootCats : docs.slice(0, 6)

  // Layout: first item large, rest in grid
  const [first, ...rest] = display

  return (
    <section className="section-y" aria-labelledby="categories-heading">
      <div className="container-site">
        {/* Header */}
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow mb-4">Kategorije</span>
            <h2 id="categories-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight mt-4">
              Kapije i ograde <br className="hidden md:block" />
              za svaki objekat
            </h2>
          </div>
          <Link
            href="/proizvodi"
            className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-700 transition-colors flex-shrink-0"
          >
            Svi proizvodi <ArrowRight />
          </Link>
        </ScrollReveal>

        {/* Asymmetric grid */}
        {display.length === 1 ? (
          <ScrollReveal>
            <CategoryCard category={first} large />
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Large card */}
            <ScrollReveal className="md:col-span-3">
              <CategoryCard category={first} large />
            </ScrollReveal>

            {/* Smaller cards */}
            <div className="md:col-span-2 grid grid-cols-1 gap-4">
              {rest.slice(0, 3).map((cat, i) => (
                <ScrollReveal key={cat.id || i} delay={i * 80}>
                  <CategoryCard category={cat} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row for more categories */}
        {display.length > 4 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {display.slice(4).map((cat, i) => (
              <ScrollReveal key={cat.id || i} delay={i * 80}>
                <CategoryCard category={cat} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
