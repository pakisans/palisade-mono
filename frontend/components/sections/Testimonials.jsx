import ScrollReveal from '@/components/ui/ScrollReveal'
import ScrollerX from '@/components/ui/ScrollerX'
import { getMediaURL } from '@/lib/payload'

const StarIcon = () => (
  <svg className="w-4 h-4 fill-brand" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const QuoteIcon = () => (
  <svg className="w-9 h-9 text-brand/15" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
    <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7.5C7.5 11.52 8.99 9.5 11 8.5L10 8zm15 0c-3.314 0-6 2.686-6 6v10h10V14h-6.5C22.5 11.52 23.99 9.5 26 8.5L25 8z" />
  </svg>
)

function Stars({ rating }) {
  const count = parseInt(rating) || 5
  return (
    <div className="flex items-center gap-0.5" aria-label={`Ocena: ${count} od 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? '' : 'opacity-20'}><StarIcon /></span>
      ))}
    </div>
  )
}

function TestimonialCard({ quote }) {
  const logo = getMediaURL(quote.avatar)
  return (
    <article className="flex h-full w-[300px] flex-shrink-0 flex-col rounded-3xl bg-white p-7 card sm:w-[380px]">
      <div className="flex items-start justify-between">
        <QuoteIcon />
        {quote.rating && <Stars rating={quote.rating} />}
      </div>

      <blockquote className="mt-3 flex-1">
        <p className="text-[15px] leading-relaxed text-gray-700">{quote.text}</p>
      </blockquote>

      <footer className="mt-6 flex items-center gap-4 border-t border-gray-100 pt-5">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={quote.author} className="h-9 w-auto max-w-[120px] object-contain" loading="lazy" />
        ) : (
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-base font-extrabold text-brand">
            {quote.author?.charAt(0) || 'P'}
          </span>
        )}
        <div className="min-w-0">
          <cite className="block text-sm font-bold not-italic text-gray-950">{quote.author}</cite>
          {quote.role && <p className="mt-0.5 text-xs text-gray-400">{quote.role}</p>}
        </div>
      </footer>
    </article>
  )
}

export default function Testimonials({ block, quotes }) {
  const items = block?.items?.length ? block.items : quotes ?? []
  if (!items.length) return null

  return (
    <section className="section-y bg-gray-50 overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="container-site">
        <ScrollReveal className="mx-auto mb-12 max-w-xl text-center">
          {block?.eyebrow && <span className="eyebrow justify-center mb-4">{block.eyebrow}</span>}
          {block?.heading && (
            <h2 id="testimonials-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {block.heading}
            </h2>
          )}
          {block?.intro && <p className="mt-4 text-gray-500">{block.intro}</p>}
        </ScrollReveal>
      </div>

      {/* Auto-scroll + ručno (swipe/drag) — pauzira na hover, fade na ivicama */}
      <ScrollerX speed={40} className="gap-6 px-6">
        {items.map((quote, i) => (
          <TestimonialCard key={i} quote={quote} />
        ))}
      </ScrollerX>
    </section>
  )
}
