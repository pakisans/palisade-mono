'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import RichText from '@/components/ui/RichText'
import ScrollReveal from '@/components/ui/ScrollReveal'

function FAQItem({ question, answer, isOpen, onToggle, index }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-6 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className={cn('text-base font-semibold leading-snug transition-colors duration-200', isOpen ? 'text-brand' : 'text-gray-950 hover:text-brand')}>
          {question}
        </span>
        <span
          className={cn(
            'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300',
            isOpen ? 'bg-brand text-white rotate-45' : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
          )}
          aria-hidden="true"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 1v12M1 7h12" />
          </svg>
        </span>
      </button>

      <div
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-spring',
          isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0',
        )}
      >
        {typeof answer === 'string' ? (
          <p className="text-gray-500 text-sm leading-relaxed pr-12">{answer}</p>
        ) : (
          <RichText content={answer} className="[&_p]:text-sm [&_p]:text-gray-500 [&_p]:leading-relaxed [&_p]:mb-2 pr-12" />
        )}
      </div>
    </div>
  )
}

export default function FAQ({ block }) {
  const [open, setOpen] = useState(0)
  if (!block?.items?.length) return null

  const toggle = (i) => setOpen((cur) => (cur === i ? null : i))

  return (
    <section className="section-y" aria-labelledby="faq-heading">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left — heading */}
          <ScrollReveal className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow mb-5">Česta pitanja</span>
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight mt-4">
              {block.heading || 'Imate pitanja? Mi imamo odgovore.'}
            </h2>
            <p className="text-gray-500 mt-4 text-base leading-relaxed">
              Ako ne nađete odgovor koji tražite, slobodno nas kontaktirajte.
            </p>
            <a
              href="/kontakt"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-brand hover:text-brand-700 transition-colors"
            >
              Pošaljite upit
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </ScrollReveal>

          {/* Right — FAQ items */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <div role="list" aria-label="Česta pitanja">
                {block.items.map((item, i) => (
                  <FAQItem
                    key={i}
                    question={item.question}
                    answer={item.answer}
                    isOpen={open === i}
                    onToggle={() => toggle(i)}
                    index={i}
                  />
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
