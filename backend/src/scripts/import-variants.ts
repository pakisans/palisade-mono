/**
 * Build product VARIANTS for variable products from the WooCommerce CSV.
 *
 * The original import created variantTypes + variantOptions and set enableVariants,
 * but the concrete `variants` (option combinations + price) ended up empty. This script
 * (re)creates them so variable products actually offer selectable variations.
 *
 * NON-DESTRUCTIVE by default (skips products that already have variants).
 *
 * Usage:
 *   pnpm import:variants [path/to/export.csv]
 *   DRY_RUN=true pnpm import:variants
 *   RESEED=true pnpm import:variants     # delete + rebuild variants for each variable product
 */

import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

const DRY_RUN = process.env.DRY_RUN === 'true'
const RESEED = process.env.RESEED === 'true'

type WCRow = Record<string, string>

// ─── CSV (robust quoted parser) + helpers (copied from import-wc.ts) ────────────

function parseCSV(content: string): WCRow[] {
  const lines: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  const text = content.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  while (i < text.length) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue }
        inQuotes = false; i++; continue
      }
      field += ch; i++
    } else {
      if (ch === '"') { inQuotes = true; i++ }
      else if (ch === ',') { row.push(field); field = ''; i++ }
      else if (ch === '\n') { row.push(field); field = ''; lines.push(row); row = []; i++ }
      else { field += ch; i++ }
    }
  }
  if (field || row.length > 0) { row.push(field); lines.push(row) }
  if (lines.length < 2) return []

  const headers = lines[0]
  const headerMap: Record<string, string> = {
    ID: 'id', Tip: 'type', Ime: 'name', 'Redovna cena': 'regularPrice', 'Cena na sniženju': 'salePrice',
    Roditelj: 'parent', 'Na zalihama?': 'inStock', Zalihe: 'stock',
    'Ime 1 atributa': 'attr1Name', 'Atribut 1 vrednost(i)': 'attr1Values',
    'Ime 2 atributa': 'attr2Name', 'Atribut 2 vrednost(i)': 'attr2Values',
    'Ime 3 atributa': 'attr3Name', 'Atribut 3 vrednost(i)': 'attr3Values',
    'Ime 4 atributa': 'attr4Name', 'Atribut 4 vrednost(i)': 'attr4Values',
  }
  const rows: WCRow[] = []
  for (let r = 1; r < lines.length; r++) {
    const cols = lines[r]
    if (cols.length === 1 && cols[0] === '') continue
    const obj: any = {}
    for (let c = 0; c < headers.length; c++) {
      const key = headerMap[headers[c]] ?? headers[c]
      obj[key] = (cols[c] ?? '').trim()
    }
    rows.push(obj as WCRow)
  }
  return rows
}

function slugify(t: string): string {
  return t.toLowerCase()
    .replace(/[šŠ]/g, 's').replace(/[čČćĆ]/g, 'c').replace(/[žŽ]/g, 'z').replace(/[đĐ]/g, 'd')
    .replace(/[àáâä]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96)
}
function parsePrice(raw: string): number {
  if (!raw?.trim()) return 0
  const num = parseFloat(raw.replace(/[^0-9,.]/g, '').replace(',', '.'))
  return isNaN(num) ? 0 : Math.round(num)
}
function getAttributes(row: WCRow): { name: string; values: string[] }[] {
  const out: { name: string; values: string[] }[] = []
  for (let n = 1; n <= 4; n++) {
    const name = row[`attr${n}Name`]?.trim()
    const raw = row[`attr${n}Values`]?.trim()
    if (!name || !raw) continue
    const values = raw.split(',').map((v) => v.trim()).filter(Boolean)
    if (values.length) out.push({ name, values })
  }
  return out
}

// ─── Main ───────────────────────────────────────────────────────────────────

const run = async () => {
  const csvPath = process.argv[2] || path.resolve(process.cwd(), '../wc-product-export-3-6-2026-1780486976613.csv')
  if (!fs.existsSync(csvPath)) { console.error(`CSV nije nađen: ${csvPath}`); process.exit(1) }

  const payload = await getPayload({ config })
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf-8'))

  const variableRows = rows.filter((r) => r.type === 'variable')
  const variationRows = rows.filter((r) => r.type === 'variation')

  // WC parent id → variations
  const byParent = new Map<string, WCRow[]>()
  for (const v of variationRows) {
    const pid = (v.parent || '').replace('id:', '').trim()
    if (!pid) continue
    if (!byParent.has(pid)) byParent.set(pid, [])
    byParent.get(pid)!.push(v)
  }

  // variantType label → id ; (typeId|label) → optionId (lazy create on miss)
  const vtypes = await payload.find({ collection: 'variantTypes', limit: 500, depth: 0 })
  const typeByLabel = new Map<string, number>()
  for (const t of vtypes.docs) typeByLabel.set((t as any).label, t.id as number)

  const voptions = await payload.find({ collection: 'variantOptions', limit: 1000, depth: 0 })
  const optByKey = new Map<string, number>()
  for (const o of voptions.docs) optByKey.set(`${(o as any).variantType}|${(o as any).label}`, o.id as number)

  const resolveOption = async (typeLabel: string, value: string): Promise<number | null> => {
    const typeId = typeByLabel.get(typeLabel)
    if (!typeId) return null
    const key = `${typeId}|${value}`
    if (optByKey.has(key)) return optByKey.get(key)!
    if (DRY_RUN) return -1
    const created = await payload.create({
      collection: 'variantOptions',
      data: { label: value, value: slugify(`${typeLabel}-${value}`), variantType: typeId } as any,
    })
    optByKey.set(key, created.id as number)
    return created.id as number
  }

  console.log(`CSV: ${variableRows.length} variable, ${variationRows.length} variation rows.`)

  let totalVariants = 0
  let productsDone = 0

  for (const vrow of variableRows) {
    const slug = slugify(vrow.name || '')
    const found = await payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const product = found.docs[0]
    if (!product) { console.warn(`  ⚠ proizvod za "${vrow.name}" (slug ${slug}) nije nađen — preskačem`); continue }

    const variations = byParent.get(vrow.id) ?? []
    if (!variations.length) {
      // Variable in WC but no variation rows → treat as a simple product.
      if (!DRY_RUN) await payload.update({ collection: 'products', id: product.id, data: { enableVariants: false } as any }).catch(() => {})
      console.log(`  – ${slug}: nema varijacija → enableVariants=false (simple)`)
      continue
    }

    // Each variation as a name→value map.
    const varMaps = variations.map((vr) => {
      const m = new Map<string, string>()
      for (const a of getAttributes(vr)) m.set(a.name, a.values[0])
      return { vr, m }
    })

    // Variant dimensions = attribute types present in EVERY variation (intersection).
    // The ecommerce plugin requires each variant to carry an option for every product
    // variantType, so we only keep the types the variations consistently vary by.
    let dimNames = [...varMaps[0].m.keys()]
    for (const { m } of varMaps) dimNames = dimNames.filter((n) => m.has(n))
    if (!dimNames.length) { console.warn(`  ⚠ ${slug}: varijacije nemaju zajedničke atribute — preskačem`); continue }
    const dimTypeIds = dimNames.map((n) => typeByLabel.get(n)).filter(Boolean) as number[]

    // Existing variants?
    const existing = await payload.find({ collection: 'variants', where: { product: { equals: product.id } }, limit: 500, depth: 0 })
    if (existing.totalDocs > 0) {
      if (!RESEED) { console.log(`  – ${slug}: već ima ${existing.totalDocs} varijanti (preskačem; RESEED=true za ponovo)`); continue }
      if (!DRY_RUN) for (const ev of existing.docs) await payload.delete({ collection: 'variants', id: ev.id })
    }

    // Align the product's variantTypes to the real variation dimensions.
    if (!DRY_RUN) {
      await payload.update({
        collection: 'products', id: product.id,
        data: { enableVariants: true, variantTypes: dimTypeIds } as any,
      }).catch((e: any) => console.warn(`  ⚠ ${slug}: variantTypes update: ${e?.message ?? e}`))
    }

    let made = 0
    let minPrice = Infinity
    const seenCombo = new Set<string>()
    for (const { vr, m } of varMaps) {
      const optionIds: number[] = []
      for (const name of dimNames) {
        const id = await resolveOption(name, m.get(name)!)
        if (id && id > 0) optionIds.push(id)
      }
      if (optionIds.length !== dimNames.length) continue // safety
      const combo = optionIds.slice().sort().join('-')
      if (seenCombo.has(combo)) continue // dedupe identical option combos
      seenCombo.add(combo)

      const price = parsePrice(vr.regularPrice)
      if (price > 0) minPrice = Math.min(minPrice, price)
      const title = dimNames.map((n) => m.get(n)).filter(Boolean).join(' / ') || vr.name || product.slug
      const inStock = vr.inStock === '1' || vr.inStock?.toLowerCase() === 'instock'
      const inv = vr.stock ? parseInt(vr.stock) : inStock ? 50 : 0

      if (DRY_RUN) { made++; continue }
      try {
        await payload.create({
          collection: 'variants',
          data: {
            title, product: product.id, options: optionIds,
            ...(price > 0 ? { price } : {}),
            inventory: inv, priceInUSDEnabled: false, priceInUSD: 0, _status: 'published',
          } as any,
        })
        made++
      } catch (err: any) {
        console.warn(`    ✗ varijanta "${title}" (${slug}): ${err?.message ?? err}`)
      }
    }

    // keep product.price as the cheapest variation price
    if (!DRY_RUN && minPrice !== Infinity && minPrice !== (product as any).price) {
      await payload.update({ collection: 'products', id: product.id, data: { price: minPrice } as any }).catch(() => {})
    }

    totalVariants += made
    productsDone++
    console.log(`  ✓ ${slug}: ${made} varijanti (dim: ${dimNames.join(', ')})${minPrice !== Infinity ? `, od ${minPrice} RSD` : ''}`)
  }

  console.log(`\nGotovo. Proizvoda: ${productsDone}, varijanti: ${totalVariants}${DRY_RUN ? ' (DRY_RUN)' : ''}`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
