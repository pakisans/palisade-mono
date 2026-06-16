import ScrollReveal from '@/components/ui/ScrollReveal'

// Icon set keyed by the block's `icon` select value (stroke paths).
const ICONS = {
  check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  shield: 'M12 2.5l7 3v6c0 4.6-3 7.8-7 9-4-1.2-7-4.4-7-9v-6l7-3z',
  ruler: 'M3 17.25 17.25 3 21 6.75 6.75 21 3 17.25zM8 12l2 2M12 8l2 2',
  truck: 'M3 7.5h10.5v9H3zM13.5 10.5H18l3 3v3h-7.5M7 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  wrench: 'M14.7 6.3a4 4 0 01-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 015.4-5.4l-2.9 2.9-2-2 2.9-2.9z',
  award: 'M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.5 7 22l5-2.5L17 22l-1.2-8.5',
  clock: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  sparkles: 'M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4L12 3z',
  users: 'M16 18v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 8a3 3 0 100-6 3 3 0 000 6zM22 18v-2a4 4 0 00-3-3.87M16 2.13A4 4 0 0116 9.87',
}

export default function WhyUs({ block }) {
  const items = block?.items ?? []
  if (!items.length) return null
  const cols = items.length === 4 ? 'lg:grid-cols-4' : 'md:grid-cols-3'

  return (
    <section className="section-y bg-white" aria-labelledby="whyus-heading">
      <div className="container-site">
        <ScrollReveal className="mx-auto mb-14 max-w-xl text-center">
          {block?.eyebrow && <span className="eyebrow justify-center mb-4">{block.eyebrow}</span>}
          {block?.heading && (
            <h2 id="whyus-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {block.heading}
            </h2>
          )}
        </ScrollReveal>

        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${cols}`}>
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 90}>
              <div className="group flex h-full flex-col items-start rounded-3xl p-8 card card-hover">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/[0.08] text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={ICONS[item.icon] || ICONS.check} />
                  </svg>
                </div>
                <h3 className="mb-2.5 text-xl font-bold text-gray-950">{item.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{item.text || item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
