'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import ScrollReveal from '@/components/ui/ScrollReveal'

const StarIcon = () => (
  <svg className="w-4 h-4 fill-brand" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const QuoteIcon = () => (
  <svg className="w-10 h-10 text-brand/15" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
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

function TestimonialCard({ quote, active }) {
  return (
    <article
      className={cn(
        'relative flex flex-col bg-white rounded-3xl p-8 border transition-all duration-400',
        active
          ? 'border-brand/30 shadow-card-hover scale-[1.01]'
          : 'border-gray-100 shadow-card opacity-60 scale-[0.98]',
      )}
    >
      <QuoteIcon />

      <blockquote className="flex-1 mt-4">
        <p className="text-gray-700 text-base leading-relaxed font-medium italic">
          "{quote.text}"
        </p>
      </blockquote>

      <footer className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <cite className="text-sm font-bold text-gray-950 not-italic">{quote.author}</cite>
            {quote.role && (
              <p className="text-xs text-gray-400 mt-0.5">{quote.role}</p>
            )}
          </div>
          {quote.rating && <Stars rating={quote.rating} />}
        </div>
      </footer>
    </article>
  )
}

export default function Testimonials({ quotes }) {
  const [active, setActive] = useState(0)
  if (!quotes?.length) return null

  return (
    <section className="section-y bg-gray-50" aria-labelledby="testimonials-heading">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow justify-center mb-4">Klijenti o nama</span>
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
            Šta kažu naši klijenti
          </h2>
        </ScrollReveal>

        {/* Grid — up to 3 visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {quotes.slice(0, 3).map((quote, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
                <TestimonialCard quote={quote} active={active === i} />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Dot navigation for mobile */}
        {quotes.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8" role="tablist" aria-label="Izaberi recenziju">
            {quotes.slice(0, Math.min(quotes.length, 6)).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn('h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand', active === i ? 'w-6 bg-brand' : 'w-1.5 bg-gray-300 hover:bg-gray-400')}
                aria-label={`Recenzija ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Trust signal */}
        <ScrollReveal delay={200}>
          <div className="flex items-center justify-center gap-6 mt-12 pt-10 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map((n) => (
                  <div key={n} className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-white text-[9px] font-bold">{n}</div>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">700+ zadovoljnih klijenata</span>
            </div>
            <div className="h-4 w-px bg-gray-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 font-medium">
              <div className="flex"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></div>
              4.9/5 na Google-u
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
