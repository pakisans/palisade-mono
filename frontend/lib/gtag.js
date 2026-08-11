// Tanak wrapper oko gtag.js. Sve je no-op ako `window.gtag` ne postoji —
// SSR, analitika isključena (ANALYTICS_ENABLED=false) ili ad-blocker.

export function pageview(url) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
