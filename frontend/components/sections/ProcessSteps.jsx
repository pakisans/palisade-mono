import ScrollReveal from '@/components/ui/ScrollReveal'
import RichText from '@/components/ui/RichText'

// Extracts columns from a Content block
function extractColumns(block) {
  return block?.columns ?? []
}

const STEPS = [
  {
    n: '01',
    title: 'Merenje',
    desc: 'Dolazimo na lice mesta — besplatno i bez obaveze. Izmerimo prostor i damo stručnu preporuku na terenu.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Izrada',
    desc: 'Sopstvena produkcija u Beogradu. Svaki proizvod je izrađen prema vašim tačnim merama uz potpunu kontrolu kvaliteta.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Isporuka',
    desc: 'Dostavljamo na lokaciju u dogovorenom roku — 7 do 30 radnih dana. Pokrivamo celu Srbiju.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    n: '04',
    title: 'Montaža',
    desc: 'Stručni tim izvodi ugradnju profesionalno i uredno. Puna garancija na rad i materijal.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
]

export default function ProcessSteps({ block }) {
  // Uses CMS columns if available, otherwise falls back to hardcoded steps
  const cmsColumns = extractColumns(block)
  const steps = cmsColumns.length >= 4 ? cmsColumns : STEPS

  return (
    <section className="section-y bg-gray-50" aria-labelledby="process-heading">
      <div className="container-site">
        <ScrollReveal className="text-center max-w-xl mx-auto mb-16">
          <span className="eyebrow justify-center mb-4">Kako radimo</span>
          <h2 id="process-heading" className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-4">
            {block?.columns ? 'Naš proces' : 'Od ideje do ugradnje — u 4 koraka'}
          </h2>
          <p className="text-gray-500 mt-3 text-base leading-relaxed">
            Jednostavan proces koji garantuje da dobijete tačno ono što ste zamislili.
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gray-200 z-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => {
              const num   = step.n || String(i + 1).padStart(2, '0')
              const title = step.title
              const desc  = step.desc
              const icon  = step.icon

              return (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="group flex flex-col items-start">
                    {/* Step number circle */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-card group-hover:border-brand/40 group-hover:shadow-card-hover transition-all duration-300">
                        {icon ? (
                          <div className="text-brand">{icon}</div>
                        ) : (
                          <span className="text-3xl font-extrabold text-brand/20">{num}</span>
                        )}
                      </div>
                      {/* Step number */}
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow-brand-sm">
                        {num}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-950 mb-2">{title}</h3>
                    {typeof desc === 'string' ? (
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                    ) : (
                      <RichText content={desc} className="[&_p]:text-sm [&_p]:text-gray-500 [&_p]:leading-relaxed" />
                    )}
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
