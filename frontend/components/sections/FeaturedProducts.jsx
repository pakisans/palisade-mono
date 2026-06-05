import Link from 'next/link'
import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'
import { formatPrice } from '@/lib/utils'
import ScrollReveal from '@/components/ui/ScrollReveal'

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)

function ProductCard({ product }) {
  const gallery = product.gallery ?? []
  const imgUrl  = getMediaURL(gallery[0]?.image) || null
  const href    = `/proizvodi/${product.slug}`
  const price   = product.price

  const categories = product.categories
    ?.map((c) => (typeof c === 'object' ? c.title : ''))
    .filter(Boolean)
    .slice(0, 1) ?? []

  return (
    <article className="product-card">
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-brand">{product.title.charAt(0)}</span>
              </div>
            </div>
          )}
          {/* Category badge */}
          {categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-gray-700">
                {categories[0]}
              </span>
            </div>
          )}
          {/* Green line reveal */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-spring" />
        </div>
      </Link>

      <div className="p-5">
        <Link href={href} className="block">
          <h3 className="font-bold text-gray-950 leading-snug group-hover:text-brand transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="mt-4 flex items-center justify-between">
          <div>
            {price > 0 ? (
              <p className="text-brand font-bold text-lg">{formatPrice(price)}</p>
            ) : (
              <p className="text-sm font-semibold text-gray-400">Cena na upit</p>
            )}
          </div>
          <Link
            href={href}
            className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-700 transition-colors"
            aria-label={`Pogledaj ${product.title}`}
          >
            Detalji <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedProducts({ products }) {
  const docs = products?.docs ?? []
  if (!docs.length) return null

  return (
    <section className="section-y" aria-labelledby="featured-products-heading">
      <div className="container-site">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="eyebrow mb-4">Naši proizvodi</span>
            <h2 id="featured-products-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
              Izdvojeni proizvodi
            </h2>
          </div>
          <Link href="/proizvodi" className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-700 transition-colors flex-shrink-0">
            Svi proizvodi <ArrowRight />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {docs.slice(0, 8).map((product, i) => (
            <ScrollReveal key={product.id || i} delay={i * 60}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
