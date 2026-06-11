import { getForm } from '@/lib/payload'
import RichText from '@/components/ui/RichText'
import FormClient from './FormClient'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default async function FormBlock({ block }) {
  const formId = typeof block?.form === 'object' ? block.form.id : block?.form
  if (!formId) return null

  const form = await getForm(formId).catch(() => null)
  if (!form) return null

  const mapAddress = block.mapAddress?.trim()
  const mapSrc = mapAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapAddress)}&z=15&output=embed`
    : null

  const formCard = (
    <ScrollReveal delay={100}>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-8 md:p-10">
        <FormClient
          formId={form.id}
          fields={form.fields ?? []}
          submitLabel={form.submitButtonLabel || 'Pošalji'}
          confirmationType={form.confirmationType}
          confirmationMessage={form.confirmationMessage}
        />
      </div>
    </ScrollReveal>
  )

  return (
    <section className="section-y-sm" id="contact-form" aria-labelledby="form-heading">
      <div className="container-site">
        {block.enableIntro && block.introContent && (
          <ScrollReveal className={`mb-10 ${mapSrc ? 'max-w-3xl' : 'max-w-2xl mx-auto'}`}>
            <RichText
              content={block.introContent}
              className="[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-extrabold [&_h2]:text-gray-950 [&_h2]:tracking-tight [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-950 [&_h3]:mb-3 [&_p]:text-gray-500 [&_p]:leading-relaxed"
            />
          </ScrollReveal>
        )}

        {mapSrc ? (
          // Form + map side by side (matches the reference contact page)
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            {formCard}
            <ScrollReveal delay={150} className="h-full">
              <div className="h-full min-h-[420px] rounded-3xl overflow-hidden border border-gray-100 shadow-card">
                <iframe
                  src={mapSrc}
                  title={`Mapa — ${mapAddress}`}
                  className="w-full h-full min-h-[420px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </ScrollReveal>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">{formCard}</div>
        )}
      </div>
    </section>
  )
}
