/**
 * Čisti opise proizvoda: literalni „\n" (i pravi newline) zaglavljeni u tekst nodovima
 * (ostatak WooCommerce importa) razbija pasus na više pasusa — svaka ključna
 * karakteristika u svom redu, bez vidljivog „\n".
 *
 * NEDESTRUKTIVNO osim ciljanog: dira samo `products.description` i to samo pasuse
 * koji sadrže „\n". Ostali blokovi/headingi/liste ostaju netaknuti. Idempotentno.
 *
 *   pregled:  node_modules/.bin/tsx src/scripts/clean-product-descriptions.ts
 *   primena:  DRY_RUN=false node_modules/.bin/tsx src/scripts/clean-product-descriptions.ts
 */

import config from '@payload-config'
import { getPayload } from 'payload'
import { paragraph } from '../endpoints/seed/richText'

const DRY_RUN = process.env.DRY_RUN !== 'false'
const SPLIT = /\\n|\r\n|\r|\n/ // literalni "\n" ILI pravi newline

function plainText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  return (node.children || []).map(plainText).join('')
}

// Vrati novi description ako je bilo izmena, inače null.
function cleanDescription(desc: any): any | null {
  const root = desc?.root
  if (!root || !Array.isArray(root.children)) return null

  let changed = false
  const out: any[] = []

  for (const child of root.children) {
    if (child?.type === 'paragraph') {
      const text = plainText(child)
      if (SPLIT.test(text)) {
        const lines = text
          .split(SPLIT)
          .map((s) => s.trim())
          .filter(Boolean)
        if (lines.length) {
          for (const line of lines) out.push(paragraph(line))
          changed = true
          continue
        }
        // pasus je bio samo prazni "\n" → preskoči ga
        changed = true
        continue
      }
    }
    out.push(child)
  }

  if (!changed) return null
  return { ...desc, root: { ...root, children: out } }
}

// "Ključne karakteristike" — polje `highlights` (niz { label }). Labela sa „\n"
// se razbija u više stavki (svaka karakteristika svoj bullet).
function cleanHighlights(arr: any): any[] | null {
  if (!Array.isArray(arr) || arr.length === 0) return null
  let changed = false
  const out: any[] = []
  for (const h of arr) {
    const label = typeof h === 'object' && h ? (h.label ?? '') : String(h ?? '')
    if (SPLIT.test(label)) {
      const parts = label
        .split(SPLIT)
        .map((s: string) => s.trim())
        .filter(Boolean)
      for (const part of parts) out.push({ label: part })
      changed = true
    } else {
      out.push(h)
    }
  }
  return changed ? out : null
}

async function main() {
  const payload = await getPayload({ config })
  const docs = (await payload.find({ collection: 'products', limit: 0, depth: 0 })).docs as any[]

  let updated = 0
  for (const p of docs) {
    const cleanedDesc = cleanDescription(p.description)
    const cleanedHl = cleanHighlights(p.highlights)
    if (!cleanedDesc && !cleanedHl) continue
    updated++
    const parts = []
    if (cleanedDesc) parts.push('opis')
    if (cleanedHl) parts.push('ključne karakteristike')
    console.log(`  ✓ ${p.slug}  (${parts.join(' + ')})`)
    if (!DRY_RUN) {
      await payload.update({
        collection: 'products',
        id: p.id,
        data: {
          ...(p._status === 'published' ? { _status: 'published' } : {}),
          ...(cleanedDesc ? { description: cleanedDesc } : {}),
          ...(cleanedHl ? { highlights: cleanedHl } : {}),
        },
        overrideAccess: true,
      })
    }
  }

  console.log(`\n${DRY_RUN ? 'ZA IZMENU' : 'OČIŠĆENO'}: ${updated} proizvoda`)
  if (DRY_RUN) console.log('— DRY_RUN — pokreni sa DRY_RUN=false da primeniš.')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
