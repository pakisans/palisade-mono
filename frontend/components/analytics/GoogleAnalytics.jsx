'use client'

import { Suspense, useEffect } from 'react'
import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { GA_MEASUREMENT_ID, ANALYTICS_ENABLED } from '@/lib/constants'
import { pageview, trackEvent } from '@/lib/gtag'

// useSearchParams() forsira CSR bailout → mora u Suspense granicu da bi se
// stranice i dalje statički prerenderovale (isti pattern kao FormClient).
export default function GoogleAnalytics() {
  if (!ANALYTICS_ENABLED) return null
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  )
}

function GoogleAnalyticsInner() {
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  // Pageview na svaku promenu rute. Skripta se u App Routeru učita jednom i
  // preživi client-side navigacije, pa `config` ima send_page_view: false a
  // page_view šaljemo ručno odavde — uključujući i prvi (mount) put.
  useEffect(() => {
    const qs = searchParams.toString()
    pageview(pathname + (qs ? `?${qs}` : ''))
  }, [pathname, searchParams])

  // Delegirani listener: tel:/mailto: linkovi postoje na 5 mesta u 4 fajla, a
  // jedan od njih je server komponenta gde onClick nije opcija. `closest` je
  // bitan — klik obično padne na <svg>/<span> unutar <a>, ne na sam <a>.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target?.closest?.('a[href^="tel:"], a[href^="mailto:"]')
      if (!a) return
      const href = a.getAttribute('href') || ''
      trackEvent('contact', {
        method: href.startsWith('tel:') ? 'phone' : 'email',
        link_url: href,
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  )
}
