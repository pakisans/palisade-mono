/**
 * Pomera `formBlock` na 3. poziciju (index 2) u layout-u "kontakt" stranice,
 * da kontakt forma bude odmah vidljiva, a ne na dnu.
 *
 * IDEMPOTENTNO: ako je formBlock već 3. blok, ništa ne menja.
 *
 * Usage:  pnpm reorder:contact-form
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const TARGET_INDEX = 2 // 3. blok (0-based)

const run = async () => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'kontakt' } },
    depth: 0, // relacije kao id-evi, ne objekti
    limit: 1,
    draft: false,
  })

  const page = docs[0]
  if (!page) {
    payload.logger.error('Stranica "kontakt" nije pronađena.')
    process.exit(1)
  }

  const layout = Array.isArray(page.layout) ? [...page.layout] : []
  const formIdx = layout.findIndex((b: any) => b?.blockType === 'formBlock')

  if (formIdx === -1) {
    payload.logger.error('formBlock ne postoji u layout-u "kontakt" stranice.')
    process.exit(1)
  }

  const before = layout.map((b: any) => b?.blockType).join(',')

  // 1) formBlock → 3. pozicija (index 2)
  if (formIdx !== TARGET_INDEX) {
    const [formBlock] = layout.splice(formIdx, 1)
    layout.splice(Math.min(TARGET_INDEX, layout.length), 0, formBlock)
  }

  // 2) divider/spacer treba odmah iza forme (kao u seed-u), a ne da visi na dnu stranice
  const spacerIdx = layout.findIndex((b: any) => b?.blockType === 'spacer')
  const formIdxNow = layout.findIndex((b: any) => b?.blockType === 'formBlock')
  if (spacerIdx !== -1 && spacerIdx !== formIdxNow + 1) {
    const [spacer] = layout.splice(spacerIdx, 1)
    const insertAt = layout.findIndex((b: any) => b?.blockType === 'formBlock') + 1
    layout.splice(insertAt, 0, spacer)
  }

  if (layout.map((b: any) => b?.blockType).join(',') === before) {
    payload.logger.info('Redosled je već ispravan. Ništa ne menjam.')
    process.exit(0)
  }

  await payload.update({
    collection: 'pages',
    id: page.id,
    data: { layout: layout as any, _status: 'published' },
  })

  payload.logger.info(
    `Novi redosled blokova: ${layout.map((b: any, i) => `${i + 1}.${b.blockType}`).join(' → ')}`,
  )
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
