import { Montserrat } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getHeader, getFooter, getCategories } from '@/lib/payload'
import { SITE_NAME, SITE_URL, INDEXABLE } from '@/lib/constants'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  preload: true,
})

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `Kapije i ograde po meri | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  openGraph: { type: 'website', locale: 'sr_RS', siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
  // Dok nismo na pravom domenu (INDEXABLE=false) → noindex,nofollow na CELOM sajtu.
  // Nasleđuju ga sve podstranice jer nijedna ne override-uje `robots`.
  robots: INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
      },
  alternates: { canonical: '/', languages: { 'sr-RS': '/' } },
}

function buildOrgSchema(headerData, footerData) {
  const contact = footerData?.sections?.find((s) => s.blockType === 'footerContact')
  const social   = footerData?.sections?.find((s) => s.blockType === 'footerSocial')
  const brand    = footerData?.sections?.find((s) => s.blockType === 'footerBrand')
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: headerData?.siteName || SITE_NAME,
    description: brand?.description || '',
    url: SITE_URL,
    ...(contact?.phone  ? { telephone: contact.phone }  : {}),
    ...(contact?.email  ? { email:     contact.email }  : {}),
    ...(contact?.address ? { address: { '@type': 'PostalAddress', streetAddress: contact.address.split('\n')[0], addressLocality: 'Beograd', addressCountry: 'RS' } } : {}),
    ...(social?.profiles?.length ? { sameAs: social.profiles.map((p) => p.url).filter(Boolean) } : {}),
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '16:00' },
    ],
  }
}

export default async function RootLayout({ children }) {
  const [headerData, footerData, categoriesData] = await Promise.all([
    getHeader().catch(() => null),
    getFooter().catch(() => null),
    getCategories().catch(() => null),
  ])

  return (
    <html lang="sr" className={montserrat.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrgSchema(headerData, footerData)) }} />
      </head>
      <body className="font-sans antialiased bg-white text-gray-950">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-brand">
          Preskoči na sadržaj
        </a>
        <Header data={headerData} categories={categoriesData} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer data={footerData} headerData={headerData} categories={categoriesData} />
      </body>
    </html>
  )
}
