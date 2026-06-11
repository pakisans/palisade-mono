import ScrollReveal from '@/components/ui/ScrollReveal'

// ─── Icons ──────────────────────────────────────────────────────────────────
const PhoneIcon = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
)
const ChatIcon = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
)
const MailIcon = (
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
)
const PinIcon = (
  <>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </>
)

function InfoCard({ icon, label, value, href, newTab }) {
  const inner = (
    <>
      <span className="w-14 h-14 rounded-2xl bg-brand/[0.1] text-brand flex items-center justify-center transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:scale-105">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
          {icon}
        </svg>
      </span>
      <span className="mt-4 block text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="mt-1 block text-[15px] font-semibold text-gray-950 group-hover:text-brand transition-colors break-words">
        {value}
      </span>
    </>
  )
  const cls =
    'group flex h-full flex-col items-center text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-brand/30 hover:-translate-y-1'
  return href ? (
    <a href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  )
}

export default function ContactInfoBlock({ block }) {
  if (!block) return null
  const { heading, phone, whatsapp, email, address, mapUrl } = block
  const telHref = phone ? `tel:${phone.replace(/\s/g, '')}` : null

  // Labels/values mirror the source site: Telefon · Live chat · Email · Adresa
  const cards = [
    phone && { icon: PhoneIcon, label: 'Telefon', value: phone, href: telHref },
    whatsapp && { icon: ChatIcon, label: 'Live chat', value: 'WhatsApp', href: whatsapp, newTab: true },
    email && { icon: MailIcon, label: 'Email', value: email, href: `mailto:${email}` },
    address && { icon: PinIcon, label: 'Adresa', value: address, href: mapUrl || null, newTab: true },
  ].filter(Boolean)

  if (cards.length === 0) return null

  return (
    <section className="section-y-sm" aria-labelledby="contact-info-heading">
      <div className="container-site">
        {heading && (
          <ScrollReveal className="mb-8 text-center">
            <span className="eyebrow justify-center mb-3">Dostupni smo</span>
            <h2 id="contact-info-heading" className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight mt-3">
              {heading}
            </h2>
          </ScrollReveal>
        )}
        {/* All items in a single row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {cards.map((c, i) => (
            <ScrollReveal key={i} delay={i * 70}>
              <InfoCard {...c} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
