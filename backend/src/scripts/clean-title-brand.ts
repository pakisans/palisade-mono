/**
 * Skida zalepljeni brend sufiks iz meta/seo naslova (npr. "… | Palisade d.o.o.",
 * "… | Palisada d.o.o.", "… - Ograde i kapije – Srbija"). Brend sada dodaje frontend
 * preko title.template iz Settings globala, pa naslovi u CMS-u treba da budu ČISTI.
 *
 * Hvata stranice/postove/proizvode (`meta.title`) i kategorije (`seo.title`) — korisno
 * za zapise koje SEO seed nije dotakao (jer ne postoje na palisadi).
 *
 *   pregled:  node_modules/.bin/tsx src/scripts/clean-title-brand.ts
 *   primena:  DRY_RUN=false node_modules/.bin/tsx src/scripts/clean-title-brand.ts
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const DRY_RUN = process.env.DRY_RUN !== 'false'
const SUFFIX = /\s*[|–—-]\s*(Palisad[ae][^|]*|Ograde i kapije.*)\s*$/i

function strip(t: string): string {
  if (!t) return t
  let p = t
  while (SUFFIX.test(p)) p = p.replace(SUFFIX, '').trim()
  return p
}

async function run(payload: any, collection: string, field: 'meta' | 'seo') {
  const docs = (await payload.find({ collection, limit: 0, depth: 0 })).docs as any[]
  let changed = 0
  for (const doc of docs) {
    const grp = doc[field] || {}
    const t = grp.title
    if (!t) continue
    const cleaned = strip(t)
    if (cleaned === t) continue
    console.log(`  ✓ ${collection}/${doc.slug}: "${t}"\n      → "${cleaned}"`)
    changed++
    if (!DRY_RUN) {
      await payload.update({
        collection,
        id: doc.id,
        locale: 'sr',
        // Čuvamo published status — da update ne otpubliuje doc.
        data: {
          ...(doc._status === 'published' ? { _status: 'published' } : {}),
          [field]: { ...grp, title: cleaned },
        },
        overrideAccess: true,
      })
    }
  }
  return changed
}

async function main() {
  const payload = await getPayload({ config })
  let total = 0
  for (const c of ['pages', 'posts', 'products'] as const) total += await run(payload, c, 'meta')
  total += await run(payload, 'categories', 'seo')
  console.log(`\n${DRY_RUN ? 'ZA IZMENU' : 'OČIŠĆENO'}: ${total}`)
  if (DRY_RUN) console.log('— DRY_RUN — pokreni sa DRY_RUN=false da primeniš.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
