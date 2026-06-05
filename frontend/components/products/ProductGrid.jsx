import ProductCard from './ProductCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function ProductGrid({ products, priority = false }) {
  const docs = products?.docs ?? products ?? []

  if (!docs.length) {
    return (
      <div className="text-center py-24 px-4">
        <p className="text-5xl mb-4" aria-hidden="true">🔍</p>
        <h3 className="text-lg font-bold text-gray-950 mb-2">Nema pronađenih proizvoda</h3>
        <p className="text-sm text-gray-500">Pokušajte s drugom kategorijom ili nas kontaktirajte.</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      role="list"
      aria-label="Lista proizvoda"
    >
      {docs.map((product, i) => (
        <ScrollReveal key={product.id || i} delay={Math.min(i % 4, 3) * 60}>
          <div role="listitem">
            <ProductCard product={product} priority={priority && i < 4} />
          </div>
        </ScrollReveal>
      ))}
    </div>
  )
}
