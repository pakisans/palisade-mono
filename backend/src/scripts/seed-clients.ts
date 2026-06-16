/**
 * Populate the `clients` global (logo bar) with the real client logos from
 * kapije-ograde.rs — downloads each into Media and sets the heading.
 *
 * Usage: pnpm seed:clients
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36'
const MEDIA = 'media'
const BASE = 'https://kapije-ograde.rs/wp-content/uploads/2026/02'

const LOGOS: Array<{ url: string; name: string }> = [
  { url: `${BASE}/kisspng-lidl-logo-encapsulated-postscript-supermarket-5b07dac0df67b5.4743386415272414089151.webp`, name: 'LIDL' },
  { url: `${BASE}/Roda_Market_logo_2015-.svg.webp`, name: 'Roda' },
  { url: `${BASE}/Idea_Logo.svg.webp`, name: 'IDEA' },
  { url: `${BASE}/Frikom.webp`, name: 'Frikom' },
  { url: `${BASE}/Coca-Cola_logo.svg.webp`, name: 'Coca-Cola' },
  { url: `${BASE}/vodovod1.webp`, name: 'Vodovod' },
]

const run = async () => {
  const payload = await getPayload({ config })

  const upload = async (url: string, name: string): Promise<number | string | null> => {
    const filename = url.split('/').pop()?.split('?')[0]
    if (filename) {
      const ex = await payload.find({ collection: MEDIA, where: { filename: { equals: filename } }, limit: 1 })
      if (ex.docs[0]) return ex.docs[0].id
    }
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
      if (!res.ok) { console.warn(`  ⚠ ${name}: HTTP ${res.status}`); return null }
      const data = Buffer.from(await res.arrayBuffer())
      const ext = (filename?.split('.').pop() ?? 'webp').toLowerCase()
      const mime: Record<string, string> = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
      const m = await payload.create({
        collection: MEDIA,
        data: { alt: `${name} logo` },
        file: { name: filename || `${name}.webp`, data, mimetype: mime[ext] ?? 'image/webp', size: data.byteLength },
      })
      return m.id
    } catch (err: any) {
      console.warn(`  ⚠ ${name}: ${err?.message ?? err}`)
      return null
    }
  }

  const logos: any[] = []
  for (const l of LOGOS) {
    const id = await upload(l.url, l.name)
    if (id != null) { logos.push({ image: id, name: l.name }); console.log(`  ✓ ${l.name}`) }
  }

  await payload.updateGlobal({
    slug: 'clients',
    data: { heading: 'Preko 700 firmi ogradila je PALISADA', logos } as any,
  })
  console.log(`\n✓ Clients global ažuriran — ${logos.length} logoa.`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
