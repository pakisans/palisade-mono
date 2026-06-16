/** Set the homepage hero image to a premium project photo. Usage: pnpm tsx ... set-hero-image.ts [mediaId] */
import config from '@payload-config'
import { getPayload } from 'payload'

const run = async () => {
  const payload = await getPayload({ config })
  const id = Number(process.argv[2]) || 2182 // IMG-8532 — Tivoli louver gate
  const home = (await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })).docs[0]
  if (!home) { console.error('home nije nađen'); process.exit(1) }
  const hero = { ...((home as any).hero || {}), media: id }
  await payload.update({ collection: 'pages', id: home.id, data: { hero } as any })
  console.log(`✓ home hero.media = ${id}`)
  process.exit(0)
}
run().catch((e) => { console.error(e); process.exit(1) })
