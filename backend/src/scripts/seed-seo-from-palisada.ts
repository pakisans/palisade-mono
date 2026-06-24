/**
 * Povuci SEO meta (title + description) sa palisada.rs i upiši u admin SEO polja
 * (`meta.title`, `meta.description`) za KATEGORIJE, PROIZVODE, STRANICE i POSTOVE.
 *
 * Title: čist naslov sa palisade (skinut "Категорија:" prefiks i palisada brend),
 *        + " | Palisade d.o.o.".
 * Description: tačan Yoast meta description (ako postoji).
 *
 * NEDESTRUKTIVNO: dira samo `meta.title`/`meta.description` (čuva `meta.image` i sve
 * ostalo). Ako stranica ne postoji na palisadi (404) ili fetch padne — preskače.
 * Description se NE prepisuje praznim (ako palisada nema opis, naš ostaje).
 *
 * URL izvor: WooCommerce Store API `permalink` (proizvodi + kategorije), a za
 * stranice/postove `${SITE}/<slug>/`.
 *
 * Pokretanje:
 *   pregled:  node_modules/.bin/tsx src/scripts/seed-seo-from-palisada.ts
 *   primena:  DRY_RUN=false node_modules/.bin/tsx src/scripts/seed-seo-from-palisada.ts
 *   samo deo: ONLY=categories,pages node_modules/.bin/tsx src/scripts/seed-seo-from-palisada.ts
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const SITE = (process.env.PALISADA_URL || 'https://palisada.rs').replace(/\/+$/, '')
const DRY_RUN = process.env.DRY_RUN !== 'false'
const ONLY = (process.env.ONLY || 'categories,products,pages,posts')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const UA = { 'User-Agent': 'Mozilla/5.0 (PalisadeSEOSync)' }

// ─── HTML helpers ───────────────────────────────────────────────────────────────

function decodeEntities(s: string): string {
  if (!s) return s
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
}

function metaContent(html: string, key: string, attr: 'name' | 'property'): string | null {
  // oba redosleda atributa: content posle ili pre name/property
  const a = html.match(
    new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'),
  )
  if (a) return decodeEntities(a[1])
  const b = html.match(
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${key}["']`, 'i'),
  )
  return b ? decodeEntities(b[1]) : null
}

function cleanTitle(raw: string): string {
  let t = raw || ''
  // arhivski prefiksi (ćirilica/latinica)
  t = t.replace(
    /^\s*(Категорија|Категория|Kategorija|Category|Архива|Arhiva|Archive|Tag|Ознака|Oznaka)\s*:\s*/i,
    '',
  )
  // palisada site-name suffix
  t = t.replace(/\s*[-–|]\s*Ograde i kapije\s*[–-]\s*Srbija\s*$/i, '')
  t = t.replace(/\s*[-–|]\s*Ograde i kapije.*$/i, '')
  return t.trim()
}

// Placeholder opisi sa palisade ("U PRIPREMI…", prazno, sami znaci) → ne koristimo.
function usableDesc(d: string | null): string | null {
  if (!d) return null
  const t = d.trim()
  if (/^u pripremi/i.test(t)) return null
  if (t.replace(/[.…\s]/g, '').length < 10) return null
  return t
}

async function fetchSeo(url: string): Promise<{ title: string | null; desc: string | null } | null> {
  try {
    const res = await fetch(url, { headers: UA, redirect: 'follow' })
    if (!res.ok) return null
    const html = await res.text()
    const ogTitle = metaContent(html, 'og:title', 'property')
    const tagTitle = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim()
    const rawTitle = ogTitle || decodeEntities(tagTitle)
    // Čuvamo ČIST naslov (bez brenda); brend dodaje frontend iz Settings globala.
    const title = rawTitle ? cleanTitle(rawTitle) : null
    const rawDesc =
      metaContent(html, 'description', 'name') ||
      metaContent(html, 'og:description', 'property') ||
      null
    return { title, desc: usableDesc(rawDesc) }
  } catch {
    return null
  }
}

// ─── Store API → slug→permalink mape ─────────────────────────────────────────────

async function storeMap(endpoint: string): Promise<Map<string, string>> {
  const map = new Map<string, string>()
  for (let page = 1; page < 50; page++) {
    let arr: any[]
    try {
      const res = await fetch(`${SITE}/wp-json/wc/store/v1/${endpoint}?per_page=100&page=${page}`, {
        headers: UA,
      })
      if (!res.ok) break
      arr = await res.json()
    } catch {
      break
    }
    if (!Array.isArray(arr) || arr.length === 0) break
    for (const x of arr) if (x?.slug && x?.permalink) map.set(x.slug, x.permalink)
    if (arr.length < 100) break
  }
  return map
}

// ─── Update helper ────────────────────────────────────────────────────────────────

type Stat = { updated: number; skipped: number }

async function processCollection(
  payload: any,
  collection: string,
  urlFor: (doc: any) => string | null,
  stat: Stat,
  field: 'meta' | 'seo' = 'meta',
) {
  const docs = (await payload.find({ collection, limit: 0, depth: 0 })).docs as any[]
  for (const doc of docs) {
    const url = urlFor(doc)
    if (!url) {
      stat.skipped++
      continue
    }
    const seo = await fetchSeo(url)
    if (!seo?.title) {
      console.log(`  – skip ${collection}/${doc.slug}  (nema na palisadi: ${url})`)
      stat.skipped++
      continue
    }
    const newMeta: any = { ...(doc[field] || {}), title: seo.title }
    if (seo.desc) newMeta.description = seo.desc

    console.log(`  ✓ ${collection}/${doc.slug}  [${field}]`)
    console.log(`      title: ${seo.title}`)
    if (seo.desc) console.log(`      desc : ${seo.desc.slice(0, 110)}${seo.desc.length > 110 ? '…' : ''}`)

    if (!DRY_RUN) {
      await payload.update({
        collection,
        id: doc.id,
        locale: 'sr',
        // Čuvamo published status — da update na drafts-kolekcijama ne otpubliuje doc.
        data: {
          ...(doc._status === 'published' ? { _status: 'published' } : {}),
          [field]: newMeta,
        },
        overrideAccess: true,
      })
    }
    stat.updated++
  }
}

async function main() {
  const payload = await getPayload({ config })
  const stat: Stat = { updated: 0, skipped: 0 }

  if (ONLY.includes('categories')) {
    console.log('\n=== KATEGORIJE ===')
    const catUrl = await storeMap('products/categories')
    await processCollection(payload, 'categories', (d) => catUrl.get(d.slug) || null, stat, 'seo')
  }

  if (ONLY.includes('products')) {
    console.log('\n=== PROIZVODI ===')
    const prodUrl = await storeMap('products')
    await processCollection(payload, 'products', (d) => prodUrl.get(d.slug) || null, stat)
  }

  if (ONLY.includes('pages')) {
    console.log('\n=== STRANICE ===')
    await processCollection(
      payload,
      'pages',
      (d) => (d.slug === 'home' ? `${SITE}/` : `${SITE}/${d.slug}/`),
      stat,
    )
  }

  if (ONLY.includes('posts')) {
    console.log('\n=== POSTOVI ===')
    await processCollection(payload, 'posts', (d) => `${SITE}/${d.slug}/`, stat)
  }

  console.log(`\n${DRY_RUN ? 'ZA IZMENU' : 'AŽURIRANO'}: ${stat.updated} | preskočeno: ${stat.skipped}`)
  if (DRY_RUN) console.log('— DRY_RUN — ništa nije promenjeno. Pokreni sa DRY_RUN=false da primeniš.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
