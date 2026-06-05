import Link from 'next/link'
import Image from 'next/image'
import { SITE_NAME } from '@/lib/constants'
import { resolveLink, formatDate } from '@/lib/utils'
import { getMediaURL } from '@/lib/payload'
// Footer uses inline container classes for Tailwind JIT purge safety

// ─── Social icons ─────────────────────────────────────────────────────────────

const SocialIcon = ({ platform }) => {
  const paths = {
    facebook:  'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
    instagram: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
    youtube:   'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    linkedin:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    tiktok:    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
    x:         'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  }
  const d = paths[platform]
  if (!d) return null
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

// ─── Block: FooterBrand ────────────────────────────────────────────────────────

function FooterBrandBlock({ section, siteLogoUrl, siteName }) {
  const logoUrl = getMediaURL(section.logo) || siteLogoUrl
  const name    = siteName || SITE_NAME

  return (
    <div>
      <Link href="/" className="inline-flex items-center gap-2.5 mb-4" aria-label={name}>
        {logoUrl ? (
          <Image src={logoUrl} alt={name} width={130} height={36} className="h-9 w-auto object-contain brightness-0 invert" />
        ) : (
          <>
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand text-white font-bold text-lg">{name.charAt(0)}</span>
            <span className="font-display font-bold text-xl text-white">{name.toUpperCase()}<span className="text-brand">.</span></span>
          </>
        )}
      </Link>

      {section.tagline && (
        <p className="text-sm font-semibold text-slate-300 mb-2 italic">"{section.tagline}"</p>
      )}
      {section.description && (
        <p className="text-sm text-slate-400 leading-relaxed">{section.description}</p>
      )}
    </div>
  )
}

// ─── Block: FooterColumn ──────────────────────────────────────────────────────

function FooterColumnBlock({ section }) {
  return (
    <div>
      {section.title && (
        <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">{section.title}</h3>
      )}
      {section.links?.length > 0 && (
        <ul className="space-y-2.5" role="list">
          {section.links.map((item, i) => {
            const { href, label, newTab } = resolveLink(item?.link)
            return (
              <li key={i}>
                <Link
                  href={href}
                  target={newTab ? '_blank' : undefined}
                  rel={newTab ? 'noopener noreferrer' : undefined}
                  className="text-sm text-slate-400 hover:text-white hover:pl-1 transition-all duration-150 flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-brand-700 group-hover:bg-brand flex-shrink-0 transition-colors" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─── Block: FooterContact ─────────────────────────────────────────────────────

function FooterContactBlock({ section }) {
  return (
    <div>
      {section.title && (
        <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">{section.title}</h3>
      )}
      <address className="not-italic space-y-3 text-sm">
        {section.phone && (
          <a href={`tel:${section.phone.replace(/\s/g, '')}`} className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
            <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-brand transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </span>
            <div>
              <p className="text-white font-medium">{section.phone}</p>
              {section.workingHours && (
                <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-line">{section.workingHours}</p>
              )}
            </div>
          </a>
        )}

        {section.email && (
          <a href={`mailto:${section.email}`} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-brand transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            {section.email}
          </a>
        )}

        {section.address && (
          <div className="flex items-start gap-3 text-slate-400">
            <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </span>
            <span className="whitespace-pre-line leading-relaxed">{section.address}</span>
          </div>
        )}

        {section.mapLink && (
          <a
            href={section.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-brand-400 transition-colors ml-10"
          >
            Otvori u Google Maps →
          </a>
        )}
      </address>
    </div>
  )
}

// ─── Block: FooterSocial ──────────────────────────────────────────────────────

function FooterSocialBlock({ section }) {
  return (
    <div>
      {section.title && (
        <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">{section.title}</h3>
      )}
      {section.profiles?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Društvene mreže">
          {section.profiles.map((profile, i) => (
            <a
              key={i}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={profile.platform}
              className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:bg-brand hover:text-white transition-all duration-200"
            >
              <SocialIcon platform={profile.platform} />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Block: FooterText ────────────────────────────────────────────────────────

function FooterTextBlock({ section }) {
  if (!section.text) return null
  return <p className="text-sm text-slate-400 leading-relaxed col-span-full">{section.text}</p>
}

// ─── Block: FooterNewsletter ──────────────────────────────────────────────────

function FooterNewsletterBlock({ section }) {
  return (
    <div>
      {section.title && (
        <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-3">{section.title}</h3>
      )}
      {section.description && (
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{section.description}</p>
      )}
      <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
        <input
          type="email"
          placeholder="Vaša e-mail adresa"
          className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="flex-shrink-0 px-4 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          Prijavi se
        </button>
      </form>
    </div>
  )
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function FooterBlock({ section, siteLogoUrl, siteName }) {
  switch (section.blockType) {
    case 'footerBrand':      return <FooterBrandBlock section={section} siteLogoUrl={siteLogoUrl} siteName={siteName} />
    case 'footerColumn':     return <FooterColumnBlock section={section} />
    case 'footerContact':    return <FooterContactBlock section={section} />
    case 'footerSocial':     return <FooterSocialBlock section={section} />
    case 'footerText':       return <FooterTextBlock section={section} />
    case 'footerNewsletter': return <FooterNewsletterBlock section={section} />
    default:                 return null
  }
}

// ─── CTA Strip (from footerBrand.tagline as headline; uses promoBanner data) ──

function CtaStrip({ headerData }) {
  const banner = headerData?.promoBanner
  if (!banner?.enabled && !banner?.text) return null

  const cta = banner?.link ? resolveLink(banner.link) : null

  return (
    <div className="bg-brand">
      <div className="container-site">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-10">
          <div>
            <p className="text-2xl font-display font-bold text-white leading-snug">{banner.text}</p>
          </div>
          {cta?.href && (
            <Link
              href={cta.href}
              className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand font-bold text-sm hover:bg-slate-50 transition-colors shadow-lg"
            >
              {cta.label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer({ data, headerData }) {
  const year       = new Date().getFullYear()
  const sections   = data?.sections ?? []
  const navItems   = data?.navItems ?? []
  const bottomBar  = data?.bottomBar
  const siteLogoUrl = getMediaURL(data?.logo)
  const siteName   = headerData?.siteName || SITE_NAME

  // Derive columns count for grid from number of block sections
  const colCount = Math.min(Math.max(sections.length, 2), 4)

  return (
    <footer role="contentinfo" className="bg-slate-950 text-slate-400">
      <CtaStrip headerData={headerData} />

      <div className="container-site py-14 lg:py-20">
        {sections.length > 0 ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
            style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
          >
            {sections.map((section, i) => (
              <FooterBlock key={section.id || i} section={section} siteLogoUrl={siteLogoUrl} siteName={siteName} />
            ))}
          </div>
        ) : (
          /* Fallback when no CMS sections: show minimal brand */
          <div className="text-center py-8">
            <p className="text-white font-bold text-xl">{siteName.toUpperCase()}<span className="text-brand">.</span></p>
          </div>
        )}

        {/* Bottom nav links from Footer global navItems */}
        {navItems.length > 0 && (
          <nav aria-label="Footer navigacija" className="mt-12 pt-8 border-t border-slate-800">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {navItems.map((item, i) => {
                const { href, label, newTab } = resolveLink(item?.link)
                return (
                  <li key={i}>
                    <Link
                      href={href}
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noopener noreferrer' : undefined}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-site">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-slate-500">
            <p>
              {bottomBar?.copyright
                ? bottomBar.copyright.replace('{year}', year)
                : `© ${year} ${siteName}. Sva prava zadržana.`}
            </p>
            {bottomBar?.legalLinks?.length > 0 && (
              <nav aria-label="Pravne stranice" className="flex items-center gap-4">
                {bottomBar.legalLinks.map((item, i) => {
                  const { href, label } = resolveLink(item?.link)
                  return (
                    <Link key={i} href={href} className="hover:text-slate-300 transition-colors">{label}</Link>
                  )
                })}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
