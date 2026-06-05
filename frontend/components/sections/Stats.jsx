import ScrollReveal from '@/components/ui/ScrollReveal'

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
              <div className="bg-white px-8 py-8 text-center">
                <p className="text-4xl md:text-5xl font-extrabold text-brand tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 mt-2 font-medium leading-snug">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
