/**
 * Rewrite absolute palisada.rs links embedded in CMS content (posts/pages/categories)
 * to internal relative links — so we don't leak SEO/users to the old domain.
 *   https://palisada.rs/proizvodi/x  →  /proizvodi/x
 *   https://www.palisada.rs/         →  /
 *
 * Usage: pnpm fix:content-links   (DRY_RUN=true to preview)
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const DRY_RUN = process.env.DRY_RUN === 'true'
const RE = /https?:\/\/(www\.)?palisada\.rs/gi

function deepFix(val: any): { val: any; changed: boolean } {
  let changed = false
  if (typeof val === 'string') {
    if (RE.test(val)) {
      changed = true
      let s = val.replace(RE, '')
      if (s === '') s = '/'
      return { val: s, changed }
    }
    return { val, changed }
  }
  if (Array.isArray(val)) {
    const out = val.map((v) => { const r = deepFix(v); if (r.changed) changed = true; return r.val })
    return { val: out, changed }
  }
  if (val && typeof val === 'object') {
    const out: any = {}
    for (const [k, v] of Object.entries(val)) { const r = deepFix(v); if (r.changed) changed = true; out[k] = r.val }
    return { val: out, changed }
  }
  return { val, changed }
}

const run = async () => {
  const payload = await getPayload({ config })
  let total = 0
  for (const collection of ['posts', 'pages', 'categories'] as const) {
    const res = await payload.find({ collection, limit: 1000, depth: 0 })
    for (const doc of res.docs) {
      const { val, changed } = deepFix(doc)
      if (!changed) continue
      total++
      if (DRY_RUN) { console.log(`  [dry] ${collection}/${(doc as any).slug || doc.id}`); continue }
      const { id, createdAt, updatedAt, ...data } = val as any
      await payload.update({ collection, id: doc.id, data, context: { disableRevalidate: true } as any })
      console.log(`  ✓ ${collection}/${(doc as any).slug || doc.id}`)
    }
  }
  console.log(`\nGotovo. Dokumenata sa ispravljenim linkovima: ${total}${DRY_RUN ? ' (DRY_RUN)' : ''}`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
