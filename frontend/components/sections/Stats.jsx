import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'

export default function Stats({ block }) {
  if (!block?.items?.length) return null
  return (
    <section className="py-14 md:py-20 border-y border-gray-100" aria-label="Ključni podaci">
      <div className="container-site">
        {block.heading && (
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-10">
            {block.heading}
          </p>
        )}
        <div className={`grid gap-px bg-gray-100 rounded-2xl overflow-hidden ${block.items.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'}`}>
          {block.items.map((stat, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="bg-white px-4 py-6 text-center sm:px-8 sm:py-8">
                <p className="text-3xl font-extrabold text-brand tracking-tight leading-none sm:text-4xl md:text-5xl">
                  <CountUp value={stat.value} />
                </p>
                <p className="text-[13px] text-gray-500 mt-2 font-medium leading-snug sm:text-sm">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
