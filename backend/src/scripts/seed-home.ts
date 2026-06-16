/**
 * Rebuild the LIVE home page from the seed (home.ts) — everything through CMS blocks.
 * Downloads client logos (clientLogos block) and testimonial avatars (Frikom/Roda) into Media.
 * Reuses the existing hero image; does NOT touch the rest of the database.
 *
 * Usage: pnpm seed:home
 */

import config from '@payload-config'
import { getPayload } from 'payload'

import { homePageData } from '../endpoints/seed/home'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36'
const MEDIA = 'media'
const BASE = 'https://kapije-ograde.rs/wp-content/uploads/2026/02'

const CLIENT_LOGOS = [
  { url: `${BASE}/kisspng-lidl-logo-encapsulated-postscript-supermarket-5b07dac0df67b5.4743386415272414089151.webp`, name: 'LIDL' },
  { url: `${BASE}/Roda_Market_logo_2015-.svg.webp`, name: 'Roda' },
  { url: `${BASE}/Idea_Logo.svg.webp`, name: 'IDEA' },
  { url: `${BASE}/Frikom.webp`, name: 'Frikom' },
  { url: `${BASE}/Coca-Cola_logo.svg.webp`, name: 'Coca-Cola' },
  { url: `${BASE}/vodovod1.webp`, name: 'Vodovod' },
]
// Testimonial author → company logo
const AUTHOR_LOGO: Record<string, string> = {
  'Marko Petrović': `${BASE}/Frikom.webp`,
  'Dragan Jovanović': `${BASE}/Roda_Market_logo_2015-.svg.webp`,
}

const run = async () => {
  const payload = await getPayload({ config })

  const upload = async (url: string, alt: string): Promise<number | string | null> => {
    const filename = url.split('/').pop()?.split('?')[0]
    if (filename) {
      const ex = await payload.find({ collection: MEDIA, where: { filename: { equals: filename } }, limit: 1 })
      if (ex.docs[0]) return ex.docs[0].id
    }
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
      if (!res.ok) return null
      const data = Buffer.from(await res.arrayBuffer())
      const ext = (filename?.split('.').pop() ?? 'webp').toLowerCase()
      const mime: Record<string, string> = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
      const m = await payload.create({ collection: MEDIA, data: { alt }, file: { name: filename || `img.${ext}`, data, mimetype: mime[ext] ?? 'image/webp', size: data.byteLength } })
      return m.id
    } catch { return null }
  }

  // Reuse existing hero image (or a sensible fallback).
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  const cur = existing.docs[0]
  let heroId: any = (cur as any)?.hero?.media
  if (!heroId) {
    const pref = await payload.find({ collection: MEDIA, where: { filename: { like: 'IMG-8532' } }, limit: 1 })
    heroId = pref.docs[0]?.id ?? (await payload.find({ collection: MEDIA, where: { mimeType: { contains: 'image' } }, limit: 1 })).docs[0]?.id
  }

  const data: any = homePageData({ heroImage: heroId as any, metaImage: heroId as any })

  // Inject client logos into the clientLogos block.
  const clientLogos: any[] = []
  for (const l of CLIENT_LOGOS) { const id = await upload(l.url, `${l.name} logo`); if (id != null) clientLogos.push({ image: id, name: l.name }) }
  const clBlock = data.layout.find((b: any) => b.blockType === 'clientLogos')
  if (clBlock) clBlock.logos = clientLogos
  console.log(`  • clientLogos: ${clientLogos.length} logoa`)

  // Inject testimonial avatars (company logos) by author.
  const tBlock = data.layout.find((b: any) => b.blockType === 'testimonials')
  if (tBlock) {
    for (const item of tBlock.items) {
      const logoUrl = AUTHOR_LOGO[item.author]
      if (logoUrl) { const id = await upload(logoUrl, `${item.author} logo`); if (id != null) item.avatar = id }
    }
    console.log(`  • testimonials: ${tBlock.items.length} recenzija (${tBlock.items.filter((i: any) => i.avatar).length} sa logom)`)
  }

  // Replace the live home page.
  for (const d of existing.docs) await payload.delete({ collection: 'pages', id: d.id })
  await payload.create({ collection: 'pages', data })

  const blocks = data.layout.map((b: any) => b.blockType).join(', ')
  console.log(`\n✓ Home rekreiran iz seed-a (hero img ${heroId}). Blokovi: [${blocks}]`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
