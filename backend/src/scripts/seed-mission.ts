/**
 * Replace the messy "Naša misija" content block on the o-nama page with a clean,
 * premium `mission` block (statement + value pillars). Updates the LIVE page.
 * Seed (about.ts) carries the same for fresh installs.
 *
 * Usage: pnpm seed:mission   (requires the `mission` block schema — restart backend first)
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const MISSION: any = {
  blockType: 'mission',
  eyebrow: 'Naša misija',
  heading: 'Kvalitetna ograda je prvi utisak vašeg objekta',
  statement:
    'Palisada d.o.o. osnovana je sa jasnom misijom – pružiti svakom domu i poslovnom objektu u Srbiji kapije i ograde koje kombinuju sigurnost, trajnost i estetiku. Verujemo da kvalitetna ograda nije samo fizička barijera, već prvi utisak koji vaš objekat ostavlja na svakog posetioca.',
  values: [
    { icon: 'shield', title: 'Sigurnost', text: 'Robusni materijali i precizna ugradnja za maksimalnu zaštitu doma i poslovnog objekta.' },
    { icon: 'clock', title: 'Trajnost', text: 'Toplo cinkovanje i plastifikacija — otpornost na koroziju i lep izgled decenijama.' },
    { icon: 'sparkles', title: 'Estetika', text: 'Dizajn po meri koji se uklapa u arhitekturu i podiže vrednost vašeg objekta.' },
    { icon: 'wrench', title: 'Kompletna usluga', text: 'Od besplatnog merenja i izrade do montaže i automatizacije — sve na jednom mestu.' },
  ],
}

const isMissionContent = (b: any): boolean => {
  if (b?.blockType !== 'content') return false
  const json = JSON.stringify(b)
  return /Naša misija|jasnom misijom/i.test(json)
}

const run = async () => {
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'pages', where: { slug: { equals: 'o-nama' } }, limit: 1, depth: 0 })
  const page = res.docs[0]
  if (!page) { console.error('o-nama nije nađena.'); process.exit(1) }

  const layout: any[] = Array.isArray((page as any).layout) ? (page as any).layout : []
  let replaced = false
  const newLayout = layout.map((b) => {
    if (!replaced && isMissionContent(b)) { replaced = true; return MISSION }
    return b
  })
  // If no matching content block, insert mission after the first block (brandStory).
  if (!replaced) { newLayout.splice(1, 0, MISSION); console.log('  (nije nađen content „misija" — ubacujem novi blok)') }

  await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout } as any })
  console.log(`✓ o-nama ažuriran — Mission blok ${replaced ? 'zamenio content „misija"' : 'dodat'}.`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
