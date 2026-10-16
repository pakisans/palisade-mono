/**
 * Prebaci postojeće WordPress → Next 301 redirekcije (ranije u frontend/lib/redirects.js)
 * u kolekciju `redirects`, da bi se uređivale iz admina.
 * Idempotentno: preskače svaki `from` koji već postoji.
 *
 * Usage: pnpm seed:redirects
 */

import config from '@payload-config'
import { getPayload } from 'payload'

import { LEGACY_REDIRECTS } from './data/legacy-redirects'

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'redirects',
    limit: 0,
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  const seen = new Set(existing.docs.map((d) => d.from))

  let created = 0
  let skipped = 0
  for (const { source, destination } of LEGACY_REDIRECTS) {
    const from = normalize(source)
    if (seen.has(from)) {
      skipped++
      continue
    }
    try {
      await payload.create({
        collection: 'redirects',
        data: { from, to: destination, type: '301' },
        overrideAccess: true,
      })
      seen.add(from)
      created++
    } catch (err) {
      payload.logger.error(`[seed-redirects] ${source} -> ${destination}: ${(err as Error).message}`)
    }
  }

  payload.logger.info(`[seed-redirects] created ${created}, skipped ${skipped}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
