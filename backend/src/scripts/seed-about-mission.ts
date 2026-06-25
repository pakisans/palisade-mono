/**
 * Dodaje „aboutMission" blok (video + Naša misija kartica, bez statistike) na vrh
 * layout-a stranice „o-nama". NEDESTRUKTIVNO: čuva ostatak stranice i published status,
 * idempotentno (zamenjuje svoj prethodni blok po blockName). Video URL povlači sa home
 * stranice ako postoji, inače ostaje prazan (dodaš ga u CMS-u).
 *
 *   pregled:  node_modules/.bin/tsx src/scripts/seed-about-mission.ts
 *   primena:  DRY_RUN=false node_modules/.bin/tsx src/scripts/seed-about-mission.ts
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const DRY_RUN = process.env.DRY_RUN !== 'false'
const BLOCK_NAME = 'about-mission-seed'

async function findHomeVideo(payload: any): Promise<string> {
  const home = (
    await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  ).docs[0]
  for (const b of home?.layout ?? []) {
    if (typeof b?.videoUrl === 'string' && b.videoUrl) return b.videoUrl
    if (b?.blockType === 'video' && typeof b?.url === 'string' && b.url) return b.url
  }
  return ''
}

async function main() {
  const payload = await getPayload({ config })

  const page = (
    await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'o-nama' } },
      limit: 1,
      depth: 0,
      draft: true,
    })
  ).docs[0] as any
  if (!page) {
    console.error('Nema „o-nama" stranice. Prvo je napravi/seed-uj.')
    process.exit(1)
  }

  const existing = (Array.isArray(page.layout) ? page.layout : []).find(
    (b: any) => b?.blockName === BLOCK_NAME,
  )
  // Sačuvaj postojeći video (iz CMS-a) ako VIDEO_URL nije zadat.
  const videoUrl = process.env.VIDEO_URL || existing?.videoUrl || (await findHomeVideo(payload))

  const block = {
    blockType: 'aboutMission',
    blockName: BLOCK_NAME,
    mediaSide: 'left',
    videoCover: true,
    eyebrow: 'Upoznajte Palisadu',
    heading: 'Vodeća firma za kapije i ograde u Beogradu i Srbiji',
    headingAccent: 'Beogradu i Srbiji',
    videoUrl,
    cardTitle: 'Naša misija',
    statement:
      'Palisada d.o.o. osnovana je sa jasnom misijom – pružiti svakom domu i poslovnom objektu u Srbiji kapije i ograde koje kombinuju sigurnost, trajnost i estetiku. Verujemo da kvalitetna ograda nije samo fizička barijera, već prvi utisak koji vaš objekat ostavlja na svakog posetioca.',
    bullets: [
      { text: 'Individualan pristup svakom projektu' },
      { text: 'Besplatno merenje i savetovanje' },
      { text: 'Proizvodnja kapija i ograda u sopstvenom pogonu' },
    ],
    cta: { label: 'Kontakt i informacije', url: '/kontakt' },
  }

  const layout = Array.isArray(page.layout) ? page.layout : []
  const without = layout.filter((b: any) => b?.blockName !== BLOCK_NAME)
  const newLayout = [block, ...without] // na vrh content-a (posle hero-a)

  console.log(
    `o-nama layout: ${layout.length} → ${newLayout.length} | video: ${videoUrl || '(prazno — dodaj YouTube URL u CMS-u)'}`,
  )

  if (!DRY_RUN) {
    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'sr',
      data: {
        ...(page._status === 'published' ? { _status: 'published' } : {}),
        layout: newLayout,
      },
      overrideAccess: true,
    })
  }

  console.log(DRY_RUN ? '\n— DRY_RUN — ništa nije promenjeno.' : '\n✓ aboutMission dodat na o-nama')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
