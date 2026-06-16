/**
 * Rebuild ONLY the o-nama page from the seed (about.ts) — to preview how the
 * seed composes the page. Reuses an existing Media as hero/meta image.
 * Does NOT touch the rest of the database.
 *
 * Usage: pnpm seed:about
 */

import config from '@payload-config'
import { getPayload } from 'payload'

import { aboutPageData } from '../endpoints/seed/about'

const run = async () => {
  const payload = await getPayload({ config })

  // Pick a landscape-ish image for hero/meta (fallback: first image media).
  const pref = await payload.find({
    collection: 'media',
    where: { filename: { like: 'panel' } },
    limit: 1,
  })
  const any = pref.docs[0]
    ? pref
    : await payload.find({ collection: 'media', where: { mimeType: { contains: 'image' } }, limit: 1 })
  const media = any.docs[0]
  if (!media) { console.error('Nema nijedne slike u Media.'); process.exit(1) }
  console.log(`  koristim sliku: ${(media as any).filename}`)

  const data: any = { ...aboutPageData({ heroImage: media as any, metaImage: media as any }), _status: 'published' }

  // Remove existing o-nama page(s) and recreate from seed.
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'o-nama' } }, limit: 10, depth: 0 })
  for (const d of existing.docs) await payload.delete({ collection: 'pages', id: d.id })
  console.log(`  obrisano postojećih o-nama: ${existing.docs.length}`)

  await payload.create({ collection: 'pages', data })
  const blocks = (data.layout ?? []).map((b: any) => b.blockType).join(', ')
  console.log(`\n✓ o-nama rekreiran iz seed-a. Blokovi: [${blocks}]`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
