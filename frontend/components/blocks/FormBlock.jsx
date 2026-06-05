import { getForm } from '@/lib/payload'
import RichText from '@/components/ui/RichText'
import FormClient from './FormClient'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default async function FormBlock({ block }) {
  const formId = typeof block?.form === 'object' ? block.form.id : block?.form
  if (!formId) return null

  const form = await getForm(formId).catch(() => null)
  if (!form) return null

  return (
    <section className="section-y-sm" id="contact-form" aria-labelledby="form-heading">
      <div className="container-site">
        <div className="max-w-2xl mx-auto">
          {block.enableIntro && block.introContent && (
            <ScrollReveal className="mb-10">
              <RichText
                content={block.introContent}
                className="[&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-extrabold [&_h2]:text-gray-950 [&_h2]:tracking-tight [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-950 [&_h3]:mb-3 [&_p]:text-gray-500 [&_p]:leading-relaxed"
              />
            </ScrollReveal>
          )}

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
        </div>
      </div>
    </section>
  )
}
