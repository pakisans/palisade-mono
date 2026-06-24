/**
 * Vrati stranice na _status: 'published' (po slug-u). Koristi se za oporavak stranica
 * koje su slučajno otpublishovane.
 *
 *   SLUGS=projekti,o-nama node_modules/.bin/tsx src/scripts/republish-pages.ts
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const SLUGS = (process.env.SLUGS || 'projekti,o-nama')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

async function main() {
  const payload = await getPayload({ config })
  for (const slug of SLUGS) {
    const res = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      draft: true,
    })
    const doc = res.docs?.[0] as any
    if (!doc) {
      console.log(`  – ${slug}: nije nađen`)
      continue
    }
    await payload.update({
      collection: 'pages',
      id: doc.id,
      data: { _status: 'published' },
      overrideAccess: true,
    })
    console.log(`  ✓ ${slug}: published`)
  }
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
