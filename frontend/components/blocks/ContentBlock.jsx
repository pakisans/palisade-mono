import RichText from '@/components/ui/RichText'
import ScrollReveal from '@/components/ui/ScrollReveal'

const sizeClass = {
  full:      'col-span-12',
  half:      'col-span-12 md:col-span-6',
  oneThird:  'col-span-12 md:col-span-4',
  twoThirds: 'col-span-12 md:col-span-8',
}

export default function ContentBlock({ block }) {
  const columns = block?.columns ?? []
  if (!columns.length) return null

  const isSingle = columns.length === 1

  return (
    <section className="section-y-sm">
      <div className="container-site">
        <div className={`grid grid-cols-12 gap-8 md:gap-12 ${isSingle ? 'max-w-3xl' : ''}`}>
          {columns.map((col, i) => (
            <ScrollReveal
              key={i}
              delay={i * 80}
              className={sizeClass[col.size] || 'col-span-12'}
            >
              <RichText
                content={col.richText}
                className={[
                  '[&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:text-gray-950 [&_h1]:tracking-tight [&_h1]:mb-4',
                  '[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-extrabold [&_h2]:text-gray-950 [&_h2]:tracking-tight [&_h2]:mb-4',
                  '[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-950 [&_h3]:mb-3',
                  '[&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_p]:text-base',
                  '[&_ul]:space-y-2 [&_li]:flex [&_li]:items-start [&_li]:gap-2.5 [&_li]:text-gray-600',
                  '[&_strong]:font-semibold [&_strong]:text-gray-950',
                  '[&_a]:text-brand [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-brand-700',
                ].join(' ')}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
