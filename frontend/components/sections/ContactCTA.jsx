import Link from 'next/link';
import { resolveLink } from '@/lib/utils';
import RichText from '@/components/ui/RichText';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FormClient from '@/components/blocks/FormClient';

const TRUST = [
  'Besplatno merenje',
  'Ugradnja po celoj Srbiji',
  'Garancija na rad',
  'Odgovor u 24h',
];

// Forme iz form buildera nemaju placeholder polje, pa ga izvodimo iz tipa/labele.
function placeholderFor(field) {
  const label = (field.label || '').toLowerCase();
  switch (field.blockType) {
    case 'email':
      return 'Unesite vašu email adresu';
    case 'textarea':
      return 'Opišite vaš projekat, dimenzije, željeni tip ograde ili kapije, lokaciju i sve ostale važne detalje...';
    case 'text':
    case 'number':
      if (/ime/.test(label)) return 'Unesite vaše ime i prezime';
      if (/telefon/.test(label)) return 'Unesite broj telefona';
      return label ? `Unesite ${label}` : undefined;
    default:
      return undefined;
  }
}

function PhoneCard({ phone }) {
  return (
    <a
      href={phone.href}
      className="group flex items-center gap-5 rounded-2xl bg-black/20 px-6 py-5 text-white hover:bg-black/25 transition-colors"
    >
      <span className="flex h-14 w-14 md:h-16 md:w-16 flex-shrink-0 items-center justify-center rounded-full bg-white/90 text-brand">
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] opacity-90">
          Kliknite da biste pozvali
        </span>
        <span className="block text-2xl md:text-3xl font-extrabold leading-tight mt-0.5">
          {phone.label}
        </span>
      </span>
      <svg
        className="w-6 h-6 flex-shrink-0 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </a>
  );
}

function CtaLinks({ links, centered }) {
  if (!links.length) return null;
  return (
    <div className={`flex flex-wrap items-center gap-3 mt-10 ${centered ? 'justify-center' : ''}`}>
      {links.map((link, i) => {
        const isPrimary = link.appearance === 'default' || !link.appearance || i === 0;
        return isPrimary ? (
          <Link key={i} href={link.href} className="btn btn-lg btn-white">
            {link.label}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        ) : (
          <Link
            key={i}
            href={link.href}
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border border-white/40 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/70 transition-all duration-200"
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

// Na pocetnoj tekst dolazi iz CMS bloka (block.richText); na drugim stranicama
// (kategorije) bez bloka se prosledjuju `heading` i `text`.
export default function ContactCTA({ block = null, form, phone, heading, text }) {
  if (!block && !heading) return null;
  block = block ?? {};
  const links = (block.links ?? []).map((item) => ({
    ...resolveLink(item?.link),
    appearance: item?.link?.appearance,
  }));
  const hasForm = !!form?.id;

  return (
    <section
      id="kontakt-forma"
      className="section-y bg-brand overflow-hidden relative scroll-mt-[calc(var(--header-height)+3rem)]"
      aria-labelledby="cta-heading"
    >
      {/* Dekorativni prstenovi */}
      <div
        className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full border-[64px] border-white/10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-48 -left-48 w-[460px] h-[460px] rounded-full border-[64px] border-white/10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container-site relative z-10">
        <div
          className={
            hasForm
              ? 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'
              : 'max-w-2xl mx-auto text-center'
          }
        >
          {/* Leva kolona: tekst, telefon, trust signali */}
          <div>
            {block.richText ? (
              <ScrollReveal delay={80}>
                <RichText
                  content={block.richText}
                  className="[&_h2]:text-4xl [&_h2]:md:text-5xl [&_h2]:lg:text-6xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:tracking-tight [&_h2]:leading-[1.05] [&_p]:text-white/90 [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed [&_p]:mt-5 [&_p]:max-w-xl"
                />
              </ScrollReveal>
            ) : (
              heading && (
                <ScrollReveal delay={80}>
                  <h2
                    id="cta-heading"
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]"
                  >
                    {heading}
                  </h2>
                  {text && (
                    <p className="text-white/90 text-base md:text-lg leading-relaxed mt-5 max-w-xl">
                      {text}
                    </p>
                  )}
                </ScrollReveal>
              )
            )}

            {hasForm && phone?.href && (
              <ScrollReveal delay={160}>
                <div className="mt-8">
                  <PhoneCard phone={phone} />
                </div>
              </ScrollReveal>
            )}

            {!hasForm && (
              <ScrollReveal delay={200}>
                <CtaLinks links={links} centered />
              </ScrollReveal>
            )}

            <ScrollReveal delay={240}>
              <ul
                className={
                  hasForm
                    ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-10 pt-8 border-t border-white/20'
                    : 'flex flex-wrap items-center justify-center gap-6 mt-12 pt-10 border-t border-white/20'
                }
              >
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-xs md:text-sm text-white/90 font-semibold uppercase tracking-[0.14em]"
                  >
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-white/80 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          {/* Desna kolona: forma */}
          {hasForm && (
            <ScrollReveal delay={120}>
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10">
                <FormClient
                  formId={form.id}
                  fields={form.fields ?? []}
                  submitLabel={form.submitButtonLabel || 'Pošalji upit'}
                  confirmationType={form.confirmationType}
                  confirmationMessage={form.confirmationMessage}
                  placeholders={Object.fromEntries(
                    (form.fields ?? [])
                      .filter((f) => f?.name)
                      .map((f) => [f.name, placeholderFor(f)]),
                  )}
                  privacyNote="Vaši podaci su sigurni i koriste se isključivo za pripremu ponude."
                />
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </section>
  );
}
