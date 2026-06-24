import { getSettings } from './payload'
import { SITE_NAME, SITE_URL } from './constants'

/**
 * Rešava meta naslov iz CMS-a uz interpolaciju tokena i pametan default za brend.
 * Brend (siteName) i URL dolaze iz Settings globala (fallback na konstante).
 *
 * Pravila:
 *  - "Kapije"                     → "Kapije | Palisada d.o.o."   (auto-dodat brend)
 *  - "Kapije | ${siteName}"       → "Kapije | Palisada d.o.o."   (brend gde ga staviš, bez dupliranja)
 *  - "Specijalna ${noBrand}"      → "Specijalna"                 (BEZ brenda na toj stranici)
 *  - prazno + fallback "Saveti"   → "Saveti | Palisada d.o.o."
 *
 * Vraća čist string (stranica ga stavlja u `title: { absolute }` i `openGraph.title`).
 */
export async function metaTitle(cmsTitle, fallbackTitle = '') {
  const s = await getSettings().catch(() => null)
  const siteName = s?.siteName || SITE_NAME
  const siteUrl = (s?.siteUrl || SITE_URL).replace(/\/+$/, '')

  const raw = (cmsTitle && String(cmsTitle).trim()) || fallbackTitle || siteName
  const hasNoBrand = /\$\{\s*noBrand\s*\}/.test(raw)
  const hasSite = /\$\{\s*siteName\s*\}/.test(raw)

  let out = raw
    .replace(/\$\{\s*siteName\s*\}/g, siteName)
    .replace(/\$\{\s*siteUrl\s*\}/g, siteUrl)
    .replace(/\$\{\s*noBrand\s*\}/g, '')
    .replace(/\s*[|–-]\s*$/, '')
    .replace(/^\s*[|–-]\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (!hasNoBrand && !hasSite && out && out !== siteName) {
    out = `${out} | ${siteName}`
  }
  return out
}
