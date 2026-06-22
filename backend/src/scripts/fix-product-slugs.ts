/**
 * Uskladi slugove proizvoda sa palisada.rs (WooCommerce permalink-ovi, npr. `decor-5`).
 *
 * Zašto: import-wc je slug pravio kao slugify(naziv) + redni sufiks (-2, -3…), pa se ne
 * poklapa sa palisada.rs gde WP numeriše duplikate po svojoj istoriji (decor-5). CSV nema
 * kolonu slug-a, ali ima WooCommerce `ID` — a isti taj ID vraća i palisada Store API uz
 * tačan `slug`. Most je dakle WC ID.
 *
 * Tok:
 *   1) Iz CSV-a rekonstruiši `naš_slug → WC_id` (ISTA logika kao import-wc: parents = simple|variable
 *      sa imenom, redom, slugify(name) + cnt sufiks).
 *   2) Iz palisada Store API-ja: `WC_id → palisada_slug`.
 *   3) Za svaki Payload proizvod (po trenutnom slug-u) → WC_id → palisada_slug; ako se razlikuje, ažuriraj.
 *
 * Bezbedno: DRY_RUN je default (samo ispiše plan). Primena ide u dva prolaza (temp slug → finalni)
 * da ne pukne unique-constraint kad se slugovi „prerasporede".
 *
 * Pokretanje:
 *   DRY_RUN pregled:  node_modules/.bin/tsx src/scripts/fix-product-slugs.ts /putanja/wc-export.csv
 *   Primena:          DRY_RUN=false node_modules/.bin/tsx src/scripts/fix-product-slugs.ts /putanja/wc-export.csv
 */

import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const PALISADA = (process.env.PALISADA_URL || 'https://palisada.rs').replace(/\/+$/, '')
const DRY_RUN = process.env.DRY_RUN !== 'false' // default: samo pregled

// Identičan slugify kao u import-wc.ts (mora isti da bi rekonstrukcija bila tačna).
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[šŠ]/g, 's')
    .replace(/[čČćĆ]/g, 'c')
    .replace(/[žŽ]/g, 'z')
    .replace(/[đĐ]/g, 'd')
    .replace(/[àáâä]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

// RFC-4180 CSV → niz redova ćelija (isti pristup kao import-wc parseCSV).
function parseCSVCells(content: string): string[][] {
  const out: string[][] = []
  let row: string[] = []
  let field = ''
  let q = false
  let i = 0
  const t = content.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  while (i < t.length) {
    const ch = t[i]
    if (q) {
      if (ch === '"') {
        if (t[i + 1] === '"') { field += '"'; i += 2; continue }
        q = false; i++; continue
      }
      field += ch; i++
    } else if (ch === '"') { q = true; i++ }
    else if (ch === ',') { row.push(field); field = ''; i++ }
    else if (ch === '\n') { row.push(field); field = ''; out.push(row); row = []; i++ }
    else { field += ch; i++ }
  }
  if (field.length || row.length) { row.push(field); out.push(row) }
  return out
}

async function main() {
  const csvPath = process.argv[2] || path.resolve(process.cwd(), 'wc-export.csv')
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV nije nađen: ${csvPath}`)
    process.exit(1)
  }

  // 1) CSV → parents → naš_slug → WC_id
  const cells = parseCSVCells(fs.readFileSync(csvPath, 'utf-8'))
  const header = cells[0] || []
  const iID = header.indexOf('ID')
  const iTip = header.indexOf('Tip')
  const iIme = header.indexOf('Ime')
  if (iID < 0 || iTip < 0 || iIme < 0) {
    console.error('CSV nema očekivane kolone (ID / Tip / Ime).')
    process.exit(1)
  }
  const parents = cells
    .slice(1)
    .map((r) => ({ id: r[iID]?.trim() ?? '', type: r[iTip]?.trim() ?? '', name: r[iIme]?.trim() ?? '' }))
    .filter((r) => (r.type === 'simple' || r.type === 'variable') && r.name)

  const slugCount = new Map<string, number>()
  const ourSlugToId = new Map<string, string>()
  for (const r of parents) {
    const base = slugify(r.name) || `product-${r.id}`
    const cnt = (slugCount.get(base) ?? 0) + 1
    slugCount.set(base, cnt)
    const ourSlug = cnt === 1 ? base : `${base}-${cnt}`
    ourSlugToId.set(ourSlug, r.id)
  }

  // 2) palisada Store API → WC_id → palisada_slug
  const idToPal = new Map<string, { slug: string; name: string }>()
  for (let page = 1; ; page++) {
    const res = await fetch(`${PALISADA}/wp-json/wc/store/v1/products?per_page=100&page=${page}`)
    if (!res.ok) break
    const arr = (await res.json()) as any[]
    if (!Array.isArray(arr) || arr.length === 0) break
    for (const p of arr) idToPal.set(String(p.id), { slug: p.slug, name: p.name })
    if (arr.length < 100) break
  }
  console.log(`palisada proizvoda: ${idToPal.size} | CSV parents: ${parents.length}`)

  // 3) Payload proizvodi → plan
  const payload = await getPayload({ config })
  const docs = (
    await payload.find({ collection: 'products', limit: 0, depth: 0, select: { slug: true, title: true } })
  ).docs as any[]

  const plan: { id: any; from: string; to: string; name: string }[] = []
  const unmatched: string[] = []
  for (const d of docs) {
    const wcId = ourSlugToId.get(d.slug)
    const pal = wcId ? idToPal.get(wcId) : undefined
    if (!pal || !pal.slug) { unmatched.push(`${d.slug} (${d.title})`); continue }
    if (pal.slug !== d.slug) plan.push({ id: d.id, from: d.slug, to: pal.slug, name: d.title })
  }

  console.log(`\nUkupno: ${docs.length} | za promenu: ${plan.length} | bez para: ${unmatched.length}\n`)
  for (const p of plan) console.log(`  ${p.from}  →  ${p.to}    (${p.name})`)
  if (unmatched.length) console.log(`\nBez para (ostaju nepromenjeni):\n  ${unmatched.join('\n  ')}`)

  if (DRY_RUN) {
    console.log('\n— DRY_RUN — ništa nije promenjeno. Pokreni sa DRY_RUN=false da primeniš.')
    process.exit(0)
  }

  // Two-pass: prvo temp slug (izbegava unique konflikt), pa finalni.
  for (const p of plan) {
    await payload.update({ collection: 'products', id: p.id, data: { slug: `__tmp_${p.id}` } as any, overrideAccess: true })
  }
  for (const p of plan) {
    await payload.update({ collection: 'products', id: p.id, data: { slug: p.to } as any, overrideAccess: true })
  }
  console.log(`\n✅ Ažurirano ${plan.length} slugova.`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
