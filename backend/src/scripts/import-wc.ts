/**
 * WooCommerce → Payload CMS Product Importer (Serbian CSV)
 *
 * Usage:
 *   pnpm import:wc /path/to/wc-export.csv
 *
 * Options (env vars):
 *   IMPORT_LIMIT=10           Import only first N parent products (testing)
 *   IMPORT_IMAGES=false       Skip image downloads
 *   IMPORT_CONCURRENCY=3      Max concurrent image downloads (default 3)
 *   IMPORT_SKIP_EXISTING=true Skip products whose slug already exists (default true)
 */

import config from '@payload-config'
import * as fs from 'fs'
import type { File } from 'payload'
import { getPayload } from 'payload'

// ─── Types ────────────────────────────────────────────────────────────────────

type WCRow = {
  id: string
  type: string          // simple | variable | variation
  sku: string
  name: string
  published: string
  isFeatured: string
  visibility: string    // visible | hidden | catalog | search
  shortDescription: string
  description: string
  salePrice: string
  regularPrice: string
  categories: string
  tags: string
  images: string
  parent: string        // "id:292" for variations
  brands: string
  inStock: string
  stock: string
  metaFocusKeyword: string
  attr1Name: string;  attr1Values: string;  attr1Visible: string
  attr2Name: string;  attr2Values: string;  attr2Visible: string
  attr3Name: string;  attr3Values: string;  attr3Visible: string
  attr4Name: string;  attr4Values: string;  attr4Visible: string
  [key: string]: string
}

// ─── CSV Parser (RFC 4180 compliant) ─────────────────────────────────────────

function parseCSV(content: string): WCRow[] {
  const lines: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

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

  // Serbian CSV header → internal key
  const headerMap: Record<string, keyof WCRow> = {
    'ID': 'id',
    'Tip': 'type',
    'Šifra proizvoda': 'sku',
    'Ime': 'name',
    'Objavljeno': 'published',
    'Da li je izdvojen?': 'isFeatured',
    'Vidljivost u katalogu': 'visibility',
    'Kratak opis': 'shortDescription',
    'Opis': 'description',
    'Cena na sniženju': 'salePrice',
    'Redovna cena': 'regularPrice',
    'Kategorije': 'categories',
    'Oznake': 'tags',
    'Slike': 'images',
    'Roditelj': 'parent',
    'Brendovi': 'brands',
    'Na zalihama?': 'inStock',
    'Zalihe': 'stock',
    'Meta: rank_math_focus_keyword': 'metaFocusKeyword',
    'Ime 1 atributa': 'attr1Name',    'Atribut 1 vrednost(i)': 'attr1Values',    'Atribut 1 je vidljiv': 'attr1Visible',
    'Ime 2 atributa': 'attr2Name',    'Atribut 2 vrednost(i)': 'attr2Values',    'Atribut 2 je vidljiv': 'attr2Visible',
    'Ime 3 atributa': 'attr3Name',    'Atribut 3 vrednost(i)': 'attr3Values',    'Atribut 3 je vidljiv': 'attr3Visible',
    'Ime 4 atributa': 'attr4Name',    'Atribut 4 vrednost(i)': 'attr4Values',    'Atribut 4 je vidljiv': 'attr4Visible',
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[šŠ]/g, 's').replace(/[čČćĆ]/g, 'c').replace(/[žŽ]/g, 'z')
    .replace(/[đĐ]/g, 'd').replace(/[àáâä]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

function parsePrice(raw: string): number {
  if (!raw?.trim()) return 0
  const cleaned = raw.replace(/[^0-9,.]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : Math.round(num)
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim()
}

function htmlToLexical(html: string): object {
  if (!html?.trim()) return makeEmptyLexical()
  const normalized = html
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n').replace(/<ul[^>]*>/gi, '').replace(/<li[^>]*>/gi, '• ')

  const segments = normalized.split('\n').map(s => s.trim()).filter(Boolean)
  const children: object[] = []

  for (const seg of segments) {
    const h2 = seg.match(/<h2[^>]*>(.*?)<\/h2>/i)
    const h3 = seg.match(/<h3[^>]*>(.*?)<\/h3>/i)
    const h4 = seg.match(/<h4[^>]*>(.*?)<\/h4>/i)
    if (h2) { const t = stripHtml(h2[1]); if (t) children.push(makeHeading('h2', t)); continue }
    if (h3) { const t = stripHtml(h3[1]); if (t) children.push(makeHeading('h3', t)); continue }
    if (h4) { const t = stripHtml(h4[1]); if (t) children.push(makeHeading('h4', t)); continue }
    if (/<h[1-6]/.test(seg)) { const t = stripHtml(seg); if (t) children.push(makeHeading('h2', t)); continue }
    const t = stripHtml(seg)
    if (t) children.push(makeParagraph(t))
  }

  return children.length > 0
    ? { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } }
    : makeEmptyLexical()
}

function makeEmptyLexical(): object {
  return { root: { type: 'root', children: [makeParagraph('')], direction: 'ltr', format: '', indent: 0, version: 1 } }
}

function makeParagraph(text: string): object {
  return {
    type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '',
    children: text ? [{ type: 'text', text, version: 1, detail: 0, format: 0, mode: 'normal', style: '' }] : [],
  }
}

function makeHeading(tag: 'h2' | 'h3' | 'h4', text: string): object {
  return {
    type: 'heading', tag, version: 1, direction: 'ltr', format: '', indent: 0,
    children: [{ type: 'text', text, version: 1, detail: 0, format: 0, mode: 'normal', style: '' }],
  }
}

// Maps WooCommerce visibility values → Payload visibility options
function mapVisibility(wcVisibility: string): 'catalog' | 'catalogOnly' | 'searchOnly' | 'hidden' {
  switch (wcVisibility?.toLowerCase()) {
    case 'visible':  return 'catalog'
    case 'catalog':  return 'catalogOnly'
    case 'search':   return 'searchOnly'
    case 'hidden':   return 'hidden'
    default:         return 'catalog'
  }
}

async function downloadImage(url: string): Promise<File | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PalisadeImport/1.0)' },
    })
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const ext = (url.split('.').pop()?.toLowerCase().split('?')[0] ?? 'jpg')
    const mimeMap: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' }
    const mimetype = mimeMap[ext] ?? 'image/jpeg'
    const name = url.split('/').pop()?.split('?')[0] ?? `img-${Date.now()}.jpg`
    return { name, data: Buffer.from(data), mimetype, size: data.byteLength }
  } catch { return null }
}

async function runConcurrent<T>(tasks: (() => Promise<T>)[], max: number): Promise<T[]> {
  const results: T[] = []
  let idx = 0
  async function worker() {
    while (idx < tasks.length) { const i = idx++; results[i] = await tasks[i]() }
  }
  await Promise.all(Array.from({ length: Math.min(max, tasks.length) }, worker))
  return results
}

function getAttributes(row: WCRow): { name: string; values: string[] }[] {
  const attrs: { name: string; values: string[] }[] = []
  for (let n = 1; n <= 4; n++) {
    const name = row[`attr${n}Name`]?.trim()
    const raw = row[`attr${n}Values`]?.trim()
    if (!name || !raw) continue
    const values = raw.split(',').map(v => v.trim()).filter(Boolean)
    if (values.length > 0) attrs.push({ name, values })
  }
  return attrs
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const csvPath = process.argv[2]
  if (!csvPath) { console.error('Usage: pnpm import:wc <csv-path>'); process.exit(1) }
  if (!fs.existsSync(csvPath)) { console.error(`File not found: ${csvPath}`); process.exit(1) }

  const LIMIT         = process.env.IMPORT_LIMIT ? parseInt(process.env.IMPORT_LIMIT) : undefined
  const SKIP_IMAGES   = process.env.IMPORT_IMAGES === 'false'
  const CONCURRENCY   = parseInt(process.env.IMPORT_CONCURRENCY ?? '3')
  const SKIP_EXISTING = process.env.IMPORT_SKIP_EXISTING !== 'false'

  console.log('🚀 Initializing Payload...')
  const payload = await getPayload({ config })

  console.log('📄 Parsing CSV...')
  const content = fs.readFileSync(csvPath, 'utf-8')
  const allRows = parseCSV(content)

  const parents    = allRows.filter(r => r.type === 'simple' || r.type === 'variable').filter(r => r.name?.trim())
  const variations = allRows.filter(r => r.type === 'variation')

  // Build SKU → numeric ID map so SKU-based parent refs (e.g. FORTYSET-40I-JA) can be resolved
  const skuToId = new Map<string, string>()
  for (const p of parents) {
    if (p.sku?.trim()) skuToId.set(p.sku.trim(), p.id)
  }

  // Map WC parent numeric ID → variation rows
  // Handles both "id:292" format and bare SKU format (e.g. FORTYSET-40I-JA)
  const variationsByParent = new Map<string, WCRow[]>()
  for (const v of variations) {
    const raw = v.parent?.trim()
    if (!raw) continue
    let parentId: string
    if (raw.startsWith('id:')) {
      parentId = raw.replace('id:', '').trim()
    } else {
      // SKU-based reference — resolve to numeric ID
      parentId = skuToId.get(raw) ?? raw
    }
    if (!variationsByParent.has(parentId)) variationsByParent.set(parentId, [])
    variationsByParent.get(parentId)!.push(v)
  }

  let productsToImport = parents
  if (LIMIT) { productsToImport = productsToImport.slice(0, LIMIT); console.log(`⚙️  Limit: ${LIMIT}`) }
  const variableParents = productsToImport.filter(r => r.type === 'variable')
  const simpleParents   = productsToImport.filter(r => r.type === 'simple')
  const resolvedVarCount = variableParents.reduce((sum, r) => sum + (variationsByParent.get(r.id)?.length ?? 0), 0)

  console.log(`📦 Parents: ${productsToImport.length} (${variableParents.length} variable, ${simpleParents.length} simple)`)
  console.log(`🔀 Variations in CSV: ${variations.length} | Resolved to parents: ${resolvedVarCount} | Orphaned: ${variations.length - resolvedVarCount}`)

  if (variations.length - resolvedVarCount > 0) {
    const orphanedRows = variations.filter(v => {
      const raw = v.parent?.trim() ?? ''
      const pid = raw.startsWith('id:') ? raw.replace('id:', '').trim() : (skuToId.get(raw) ?? raw)
      return !variableParents.some(p => p.id === pid)
    })
    for (const o of orphanedRows) {
      console.warn(`  ⚠ Orphan variation ID:${o.id} "${o.name?.slice(0,40)}" → parent "${o.parent}" not found`)
    }
  }

  // ── Phase 1: Collect metadata ─────────────────────────────────────────────

  const categoryPaths = new Set<string>()
  const tagNames      = new Set<string>()
  const brandNames    = new Set<string>()

  for (const row of productsToImport) {
    if (row.categories) {
      for (const cp of row.categories.split(',')) {
        const path = cp.trim()
        if (!path) continue
        categoryPaths.add(path)
        const parts = path.split('>').map(p => p.trim())
        for (let i = 1; i < parts.length; i++) categoryPaths.add(parts.slice(0, i).join(' > '))
      }
    }
    if (row.tags) {
      for (const t of row.tags.split(',')) { const n = t.trim(); if (n) tagNames.add(n) }
    }
    if (row.brands) {
      for (const b of row.brands.split(',')) { const n = b.trim(); if (n) brandNames.add(n) }
    }
  }

  // ── Phase 2: Categories ───────────────────────────────────────────────────

  console.log('\n📂 Phase 2: Categories...')
  const categoryMap = new Map<string, number>()
  const sortedPaths = Array.from(categoryPaths).sort((a, b) => a.split('>').length - b.split('>').length)

  for (const path of sortedPaths) {
    const parts     = path.split('>').map(p => p.trim())
    const title     = parts[parts.length - 1]
    const parentPath = parts.length > 1 ? parts.slice(0, -1).join(' > ') : null
    const parentId  = parentPath ? categoryMap.get(parentPath) : undefined
    const slug      = slugify(title)

    const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs.length > 0) { categoryMap.set(path, existing.docs[0].id as number); process.stdout.write('.'); continue }

    try {
      const c = await payload.create({ collection: 'categories', data: { title, slug, ...(parentId ? { parent: parentId } : {}) } })
      categoryMap.set(path, c.id as number)
      process.stdout.write('+')
    } catch (err) { console.warn(`\n  ⚠ Category "${title}": ${err}`) }
  }
  console.log(`\n  ✓ ${categoryMap.size} categories`)

  // ── Phase 3: Tags ─────────────────────────────────────────────────────────

  console.log('\n🔖 Phase 3: Tags...')
  const tagMap = new Map<string, number>()

  for (const name of tagNames) {
    const slug = slugify(name)
    const existing = await payload.find({ collection: 'tags', where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs.length > 0) { tagMap.set(name, existing.docs[0].id as number); process.stdout.write('.'); continue }

    try {
      const t = await payload.create({ collection: 'tags', data: { title: name, slug } })
      tagMap.set(name, t.id as number)
      process.stdout.write('+')
    } catch (err) { console.warn(`\n  ⚠ Tag "${name}": ${err}`) }
  }
  console.log(`\n  ✓ ${tagMap.size} tags`)

  // ── Phase 4: Brands ───────────────────────────────────────────────────────

  console.log('\n🏷️  Phase 4: Brands...')
  const brandMap = new Map<string, number>()

  for (const name of brandNames) {
    const slug = slugify(name)
    const existing = await payload.find({ collection: 'brands', where: { slug: { equals: slug } }, limit: 1 })
    if (existing.docs.length > 0) { brandMap.set(name, existing.docs[0].id as number); process.stdout.write('.'); continue }

    try {
      const b = await payload.create({ collection: 'brands', data: { title: name, slug } })
      brandMap.set(name, b.id as number)
      process.stdout.write('+')
    } catch (err) { console.warn(`\n  ⚠ Brand "${name}": ${err}`) }
  }
  console.log(`\n  ✓ ${brandMap.size} brands`)

  // ── Phase 5: Variant types ────────────────────────────────────────────────
  // VariantType schema: { label: string, name: string }
  // No slug field — deduplicate by label

  console.log('\n🎨 Phase 5: Variant types...')
  const variantTypeMap = new Map<string, number>() // attr name → payload id

  const allAttrNames = new Set<string>()
  for (const row of productsToImport) {
    for (const attr of getAttributes(row)) allAttrNames.add(attr.name)
  }

  for (const attrName of allAttrNames) {
    const existing = await payload.find({ collection: 'variantTypes', where: { label: { equals: attrName } }, limit: 1 })
    if (existing.docs.length > 0) { variantTypeMap.set(attrName, existing.docs[0].id as number); process.stdout.write('.'); continue }
    try {
      const vt = await payload.create({ collection: 'variantTypes', data: { label: attrName, name: slugify(attrName) } })
      variantTypeMap.set(attrName, vt.id as number)
      process.stdout.write('+')
    } catch (err) { console.warn(`\n  ⚠ VariantType "${attrName}": ${err}`) }
  }
  console.log(`\n  ✓ ${variantTypeMap.size} variant types`)

  // ── Phase 6: Products ─────────────────────────────────────────────────────

  console.log('\n🛍️  Phase 6: Products...')
  let created = 0, skipped = 0, failed = 0
  const slugCount = new Map<string, number>()

  const existingSlugsRes = await payload.find({ collection: 'products', limit: 0, select: { slug: true } })
  const existingSlugs = new Set(existingSlugsRes.docs.map((d: any) => d.slug))

  for (let i = 0; i < productsToImport.length; i++) {
    const row = productsToImport[i]
    const productName = row.name.trim()
    let baseSlug = slugify(productName) || `product-${row.id}`
    const cnt = (slugCount.get(baseSlug) ?? 0) + 1
    slugCount.set(baseSlug, cnt)
    const productSlug = cnt === 1 ? baseSlug : `${baseSlug}-${cnt}`

    if (SKIP_EXISTING && existingSlugs.has(productSlug)) { skipped++; continue }

    try {
      // ── Images ────────────────────────────────────────────────────────────

      const gallery: { image: number }[] = []
      let firstImageId: number | null = null

      if (!SKIP_IMAGES && row.images) {
        const imageUrls = row.images.split(',').map(u => u.trim()).filter(Boolean).slice(0, 8)
        const tasks = imageUrls.map(url => async () => {
          const filename = url.split('/').pop()?.split('?')[0] ?? ''
          if (filename) {
            const ex = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1 })
            if (ex.docs.length > 0) return ex.docs[0].id as number
          }
          const file = await downloadImage(url)
          if (!file) return null
          try {
            const m = await payload.create({ collection: 'media', data: { alt: productName }, file })
            return m.id as number
          } catch { return null }
        })
        const ids = await runConcurrent(tasks, CONCURRENCY)
        for (const id of ids) { if (id !== null) gallery.push({ image: id }) }
        firstImageId = gallery[0]?.image ?? null
      }

      // ── Taxonomy ──────────────────────────────────────────────────────────

      const categoryIds: number[] = []
      if (row.categories) {
        for (const cp of row.categories.split(',')) {
          const id = categoryMap.get(cp.trim())
          if (id && !categoryIds.includes(id)) categoryIds.push(id)
        }
      }

      const tagIds: number[] = []
      if (row.tags) {
        for (const t of row.tags.split(',')) {
          const id = tagMap.get(t.trim())
          if (id && !tagIds.includes(id)) tagIds.push(id)
        }
      }

      // Brand (singular relationship — take first brand from CSV)
      const firstBrandName = row.brands?.split(',')[0]?.trim()
      const brandId = firstBrandName ? brandMap.get(firstBrandName) : undefined

      // ── SEO ───────────────────────────────────────────────────────────────

      const metaDescription = row.shortDescription
        ? stripHtml(row.shortDescription).slice(0, 160)
        : stripHtml(row.description).slice(0, 160)
      const metaTitle = productName

      // ── Description ───────────────────────────────────────────────────────

      const descLexical = row.description ? htmlToLexical(row.description) : makeEmptyLexical()

      // ── Highlights from short description (field name is `label`, not `text`) ──

      const highlights: { label: string }[] = []
      if (row.shortDescription) {
        const plain = stripHtml(row.shortDescription)
        const sentences = plain.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 10).slice(0, 3)
        for (const s of sentences) highlights.push({ label: s })
      }

      // ── Variable / variation setup ────────────────────────────────────────

      const isVariable    = row.type === 'variable'
      const rowVariations = isVariable ? (variationsByParent.get(row.id) ?? []) : []
      const attrs         = getAttributes(row)

      // ── Price ─────────────────────────────────────────────────────────────
      // Variable parents have no price in WC — derive from cheapest variation

      let price     = parsePrice(row.regularPrice)
      let salePrice = parsePrice(row.salePrice)

      if (isVariable && price === 0 && rowVariations.length > 0) {
        const varPrices = rowVariations.map(v => parsePrice(v.regularPrice)).filter(p => p > 0)
        if (varPrices.length > 0) price = Math.min(...varPrices)
        const varSalePrices = rowVariations.map(v => parsePrice(v.salePrice)).filter(p => p > 0)
        if (varSalePrices.length > 0) salePrice = Math.min(...varSalePrices)
      }

      // ── Visibility ────────────────────────────────────────────────────────

      const visibility = mapVisibility(row.visibility)

      // ── Variant options ───────────────────────────────────────────────────
      // VariantOption schema: { label: string, value: string, variantType: number }
      // No slug field — deduplicate by label + variantType

      let variantTypeIds: number[] = []
      const variantOptionMap = new Map<string, number>() // "TypeName|OptionValue" → payload option id

      if (isVariable && attrs.length > 0) {
        for (const attr of attrs) {
          const typeId = variantTypeMap.get(attr.name)
          if (!typeId) continue
          if (!variantTypeIds.includes(typeId)) variantTypeIds.push(typeId)

          // Collect all values from parent row + variation rows
          const allValues = new Set(attr.values)
          for (const vRow of rowVariations) {
            for (let n = 1; n <= 4; n++) {
              if (vRow[`attr${n}Name`]?.trim() === attr.name) {
                const v = vRow[`attr${n}Values`]?.trim()
                if (v) allValues.add(v)
              }
            }
          }

          for (const valueStr of allValues) {
            const mapKey   = `${attr.name}|${valueStr}`
            const optValue = slugify(`${attr.name}-${valueStr}`)

            // Deduplicate by label + variantType (no slug field on variantOptions)
            const existing = await payload.find({
              collection: 'variantOptions',
              where: { and: [{ label: { equals: valueStr } }, { variantType: { equals: typeId } }] },
              limit: 1,
            })
            if (existing.docs.length > 0) {
              variantOptionMap.set(mapKey, existing.docs[0].id as number)
              continue
            }
            try {
              const vo = await payload.create({
                collection: 'variantOptions',
                data: { label: valueStr, value: optValue, variantType: typeId },
              })
              variantOptionMap.set(mapKey, vo.id as number)
            } catch (err) { console.warn(`\n  ⚠ VariantOption "${valueStr}": ${err}`) }
          }
        }
      }

      // ── Create Product ────────────────────────────────────────────────────

      const created_product = await payload.create({
        collection: 'products',
        data: {
          title: productName,
          slug: productSlug,
          _status: 'published',
          description: descLexical as any,
          ...(gallery.length > 0 ? { gallery } : {}),
          ...(highlights.length > 0 ? { highlights } : {}),
          layout: [] as any[],
          price: price > 0 ? price : 0,
          ...(salePrice > 0 ? { salePrice } : {}),
          categories: categoryIds,
          tags: tagIds,
          ...(brandId ? { brand: brandId } : {}),
          visibility,
          enableVariants: isVariable,
          ...(isVariable && variantTypeIds.length > 0 ? { variantTypes: variantTypeIds } : {}),
          priceInUSDEnabled: false,
          priceInUSD: 0,
          meta: {
            title: metaTitle,
            description: metaDescription,
            ...(firstImageId ? { image: firstImageId } : {}),
          },
        },
      })

      // ── Create Variants (for variable products) ───────────────────────────

      if (isVariable && rowVariations.length > 0) {
        for (const vRow of rowVariations) {
          const vAttrs     = getAttributes(vRow)
          const optionIds: number[] = []

          for (const vAttr of vAttrs) {
            const mapKey = `${vAttr.name}|${vAttr.values[0]}`
            const optId  = variantOptionMap.get(mapKey)
            if (optId) optionIds.push(optId)
          }

          // Build a human-readable title from attr values (e.g. "Zelena RAL6005 / 830mm / 4mm")
          const vAttrLabel = vAttrs.map(a => a.values[0]).filter(Boolean).join(' / ')
          const variantTitle = vAttrLabel || vRow.name?.trim() || productName

          const inStock  = vRow.inStock === '1' || vRow.inStock?.toLowerCase() === 'instock'
          const stockQty = vRow.stock ? parseInt(vRow.stock) : (inStock ? 50 : 0)

          try {
            await payload.create({
              collection: 'variants',
              data: {
                title: variantTitle,
                product: created_product.id as number,
                options: optionIds,
                inventory: stockQty > 0 ? stockQty : (inStock ? 50 : 0),
                priceInUSDEnabled: false,
                priceInUSD: 0,
                _status: 'published',
              },
            })
          } catch (err) { console.warn(`\n  ⚠ Variant "${vRow.name}": ${err}`) }
        }
      }

      created++
      existingSlugs.add(productSlug)
    } catch (err) {
      failed++
      console.warn(`\n  ⚠ Product "${productName}": ${err}`)
    }

    if ((i + 1) % 5 === 0 || i === productsToImport.length - 1) {
      process.stdout.write(`\r  [${i + 1}/${productsToImport.length}] created:${created} skipped:${skipped} failed:${failed}  `)
    }
  }

  console.log(`\n\n✅ Import complete!`)
  console.log(`   Created:  ${created}`)
  console.log(`   Skipped:  ${skipped} (already existed)`)
  console.log(`   Failed:   ${failed}`)
  process.exit(0)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
