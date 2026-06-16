import ScrollReveal from '@/components/ui/ScrollReveal'

// Icon set — keyed by the block's `icon` select value.
const ICONS = {
  shield: 'M12 2l7 3v6c0 4.97-3.13 8.43-7 9.5C8.13 19.43 5 15.97 5 11V5l7-3z',
  sparkles: 'M12 3l1.9 4.6L18.5 9l-4.6 1.9L12 15.5l-1.9-4.6L5.5 9l4.6-1.4L12 3z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  wrench: 'M14.7 6.3a4 4 0 01-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 015.4-5.4l-2.9 2.9-2-2 2.9-2.9z',
  award: 'M12 15a6 6 0 100-12 6 6 0 000 12zM8.2 13.5L7 22l5-2.5L17 22l-1.2-8.5',
  users: 'M16 18v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 8a3 3 0 100-6 3 3 0 000 6zM22 18v-2a4 4 0 00-3-3.87M16 2.13A4 4 0 0116 9.87',
  check: 'M20 6L9 17l-5-5',
}

function ValueIcon({ icon }) {
  return (
    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICONS[icon] || ICONS.check} />
      </svg>
    </span>
  )
}

export default function MissionBlock({ block }) {
  if (!block) return null
  const { eyebrow, heading, statement } = block
  const values = block.values ?? []

  return (
    <section className="section-y relative overflow-hidden bg-white" aria-labelledby="mission-heading">
      {/* faint brand watermark */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand-mark.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 z-0 hidden w-80 opacity-[0.05] lg:block"
      />

      <div className="container-site relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Mission statement */}
          <div className="lg:col-span-5">
            {eyebrow && (
              <ScrollReveal>
                <span className="eyebrow mb-5">{eyebrow}</span>
              </ScrollReveal>
            )}
            {heading && (
              <ScrollReveal delay={80}>
                <h2 id="mission-heading" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
              </ScrollReveal>
            )}
            {statement && (
              <ScrollReveal delay={160}>
                <div className="mt-7 border-l-2 border-brand pl-6">
                  <p className="text-lg leading-relaxed text-gray-600 md:text-xl">{statement}</p>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Value pillars */}
          {values.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {values.map((v, i) => (
                <ScrollReveal key={i} delay={i * 90} className="h-full">
                  <div className="group flex h-full flex-col rounded-3xl p-7 card card-hover">
                    <ValueIcon icon={v.icon} />
                    <h3 className="mt-5 text-lg font-bold tracking-tight text-gray-950">{v.title}</h3>
                    {v.text && <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{v.text}</p>}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
