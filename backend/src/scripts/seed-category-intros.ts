/**
 * Povuci uvodne paragrafe kategorija sa palisada.rs (WooCommerce category description)
 * i dodaj ih kao Content blok u `category.content` na POSTOJEĆIM kategorijama (po slug-u).
 *
 * NEDESTRUKTIVNO: dira samo `category.content` — i to tako što ZADRŽAVA postojeće blokove,
 * a uvodni blok (blockName: "palisada-intro") prepend-uje na vrh. Idempotentno: pri ponovnom
 * pokretanju zameni stari uvodni blok novim (ne duplira), ostali blokovi ostaju netaknuti.
 * Ne menja proizvode, podkategorije, slike, description, ništa drugo.
 *
 * Izvor: https://palisada.rs/wp-json/wc/store/v1/products/categories (javni Store API).
 *
 * Pokretanje:
 *   pregled:  node_modules/.bin/tsx src/scripts/seed-category-intros.ts
 *   primena:  DRY_RUN=false node_modules/.bin/tsx src/scripts/seed-category-intros.ts
 */

import config from '@payload-config'
import { getPayload } from 'payload'
import { paragraph, heading, contentColumnsBlock } from '../endpoints/seed/richText'

const SITE = (process.env.PALISADA_URL || 'https://palisada.rs').replace(/\/+$/, '')
const DRY_RUN = process.env.DRY_RUN !== 'false'
const INTRO_NAME = 'palisada-intro'

function clean(text: string): string {
  return (text || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Tekst (paragrafi razdvojeni praznim redom) → Content blok (heading + paragrafi).
function buildIntroBlock(intro: string): any | null {
  const lines = intro.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean)
  if (!lines.length) return null
  const [first, ...rest] = lines
  const nodes: any[] = []
  // Kratak prvi red = naslov sekcije; inače je i on paragraf.
  if (rest.length > 0 && first.length <= 90) {
    nodes.push(heading(first, 'h2'))
    rest.forEach((p) => nodes.push(paragraph(p)))
  } else {
    lines.forEach((p) => nodes.push(paragraph(p)))
  }
  const block = contentColumnsBlock([{ size: 'full', texts: nodes }]) as any
  block.blockName = INTRO_NAME
  return block
}

async function main() {
  // 1) palisada kategorije → slug → uvodni tekst
  const bySlug = new Map<string, string>()
  for (let page = 1; ; page++) {
    const res = await fetch(`${SITE}/wp-json/wc/store/v1/products/categories?per_page=100&page=${page}`)
    if (!res.ok) break
    const arr = (await res.json()) as any[]
    if (!Array.isArray(arr) || arr.length === 0) break
    for (const c of arr) {
      const desc = clean(c.description || '')
      if (desc) bySlug.set(c.slug, desc)
    }
    if (arr.length < 100) break
  }

  // 2) naše kategorije → dodaj/zameni uvodni Content blok
  const payload = await getPayload({ config })
  const ours = (await payload.find({ collection: 'categories', limit: 0, depth: 0 })).docs as any[]

  const plan: string[] = []
  const skipped: string[] = []
  for (const cat of ours) {
    const intro = bySlug.get(cat.slug)
    if (!intro) { skipped.push(cat.slug); continue }
    const introBlock = buildIntroBlock(intro)
    if (!introBlock) { skipped.push(cat.slug); continue }

    const existing = Array.isArray(cat.content) ? cat.content : []
    const withoutIntro = existing.filter((b: any) => b?.blockName !== INTRO_NAME)
    const newContent = [introBlock, ...withoutIntro]

    plan.push(`${cat.slug} (+${withoutIntro.length} postojećih blokova zadržano)`)
    if (!DRY_RUN) {
      await payload.update({
        collection: 'categories',
        id: cat.id,
        data: { content: newContent },
        overrideAccess: true,
      })
    }
  }

  console.log(
    `\npalisada kat. sa uvodom: ${bySlug.size} | naših: ${ours.length} | ${DRY_RUN ? 'za izmenu' : 'ažurirano'}: ${plan.length}\n`,
  )
  for (const p of plan) console.log(`  ✓ ${p}`)
  if (skipped.length) console.log(`\n  bez para na palisadi (ostaju): ${skipped.join(', ')}`)
  if (DRY_RUN) console.log('\n— DRY_RUN — ništa nije promenjeno. Pokreni sa DRY_RUN=false da primeniš.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
