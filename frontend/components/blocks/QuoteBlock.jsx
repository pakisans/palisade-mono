import ScrollReveal from '@/components/ui/ScrollReveal'

const Star = () => (
  <svg className="w-4 h-4 fill-brand" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

export default function QuoteBlock({ block }) {
  if (!block?.text) return null

  const rating = parseInt(block.rating) || 5

  return (
    <ScrollReveal>
      <section className="section-y-sm bg-gray-50 border-y border-gray-100">
        <div className="container-narrow">
          <figure className="text-center">
            {/* Big quote mark */}
            <div className="flex justify-center mb-6" aria-hidden="true">
              <svg className="w-12 h-12 text-brand/20" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5C7.5 11.52 8.99 9.5 11 8.5L10 8zm15 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5C22.5 11.52 23.99 9.5 26 8.5L25 8z" />
              </svg>
            </div>

            <blockquote>
              <p className="text-xl md:text-2xl text-gray-800 font-medium italic leading-relaxed text-balance">
                "{block.text}"
              </p>
            </blockquote>

            <figcaption className="mt-8">
              {/* Stars */}
              <div className="flex items-center justify-center gap-1 mb-4" aria-label={`Ocena: ${rating} od 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < rating ? '' : 'opacity-20'}><Star /></span>
                ))}
              </div>

              {block.author && (
                <div>
                  <cite className="text-sm font-bold text-gray-950 not-italic">{block.author}</cite>
                  {block.role && (
                    <p className="text-xs text-gray-400 mt-0.5">{block.role}</p>
                  )}
                </div>
              )}
            </figcaption>
          </figure>
        </div>
      </section>
    </ScrollReveal>
  )
}
