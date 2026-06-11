import ScrollReveal from '@/components/ui/ScrollReveal'

// "Zašto baš Palisada" — three trust/why-us cards (light tone, brand accents).
const DEFAULT_ITEMS = [
  {
    title: 'Izrada po meri',
    desc: 'Sopstvena proizvodnja u Beogradu. Svaka kapija i ograda izrađena je prema vašim tačnim merama i zahtevima.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26" />
    ),
  },
  {
    title: 'Montaža širom Srbije',
    desc: 'Iskusan tim montera profesionalno ugrađuje vaše rešenje na celoj teritoriji Srbije, uz punu garanciju na rad.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    ),
  },
  {
    title: 'Besplatno merenje',
    desc: 'Dolazimo na lice mesta, merimo prostor i savetujemo — potpuno besplatno i bez obaveze. Ponuda stiže u roku od 24h.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    ),
  },
]

export default function WhyUs({ block }) {
  const items = block?.items?.length ? block.items : DEFAULT_ITEMS
  const heading = block?.heading || 'Zašto baš Palisada'

  return (
    <section className="section-y bg-white" aria-labelledby="whyus-heading">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-xl mx-auto mb-14">
          <span className="eyebrow justify-center mb-4">Naše prednosti</span>
          <h2 id="whyus-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
            {heading}
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="group h-full flex flex-col items-start p-8 rounded-3xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover hover:border-brand/30 transition-all duration-300 ease-spring hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-brand/[0.08] flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white text-brand transition-all duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-950 mb-2.5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
