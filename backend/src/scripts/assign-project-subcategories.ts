/**
 * Pravi podkategorije pod "gotovi-projekti" i dodeljuje ih projektima
 * (postovima) na osnovu popunjene `podkategorija` kolone iz CSV-a.
 *
 * Podkategorije (post-categories sa parent = gotovi-projekti):
 *   - "Privatni - Stambeni objekti"     (privatni-stambeni-objekti)
 *   - "Poslovno - Industrijski objekti" (poslovno-industrijski-objekti)
 *
 * NEDESTRUKTIVNO & IDEMPOTENTNO:
 *   - podkategorije: find-or-create po slug-u,
 *   - projektu se DODAJE podkategorija u `categories` (zadržava gotovi-projekti),
 *   - mapiranje po `id` iz CSV-a (id = post id iz export:projects).
 *
 * Usage:
 *   pnpm subcat:projects                 # DRY-RUN (default)
 *   DRY_RUN=false pnpm subcat:projects   # upis
 *   pnpm subcat:projects /putanja/do.csv
 */

import config from '@payload-config'
import { getPayload } from 'payload'
import fs from 'node:fs'

const DRY_RUN = process.env.DRY_RUN !== 'false'
const DEFAULT_CSV = '/Users/nemanjanakomcic/Downloads/projekti podkategorije - projekti-2026-07-06.csv'
const PARENT_SLUG = 'gotovi-projekti'

const SUBCATS = [
  { slug: 'privatni-stambeni-objekti', title: 'Privatni - Stambeni objekti' },
  { slug: 'poslovno-industrijski-objekti', title: 'Poslovno - Industrijski objekti' },
]

// Normalizuje sirovu vrednost iz CSV-a → slug podkategorije (ili null = preskoči).
function normalizeSub(raw: string): string | null {
  const v = raw.trim().toLowerCase()
  if (!v || v === 'nema linka') return null
  if (v.startsWith('privatni')) return 'privatni-stambeni-objekti'
  if (v.startsWith('poslovno')) return 'poslovno-industrijski-objekti'
  return null
}

// ─── CSV parser (RFC 4180) ────────────────────────────────────────────────────
function parseCSV(content: string): Record<string, string>[] {
  const text = content.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const rows: string[][] = []
  let row: string[] = []
  let f = ''
  let q = false
  let i = 0
  while (i < text.length) {
    const c = text[i]
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i += 2; continue } q = false; i++; continue }
      f += c; i++
    } else if (c === '"') { q = true; i++ }
    else if (c === ',') { row.push(f); f = ''; i++ }
    else if (c === '\n') { row.push(f); f = ''; rows.push(row); row = []; i++ }
    else { f += c; i++ }
  }
  if (f || row.length) { row.push(f); rows.push(row) }
  const H = rows[0]
  return rows.slice(1).filter((r) => r.length >= H.length).map((r) => {
    const rec: Record<string, string> = {}
    H.forEach((h, c) => (rec[h] = r[c] ?? ''))
    return rec
  })
}

const run = async () => {
  const csvPath = process.argv[2] || DEFAULT_CSV
  if (!fs.existsSync(csvPath)) { console.error(`CSV nije nađen: ${csvPath}`); process.exit(1) }
  const payload = await getPayload({ config })

  // Parent kategorija
  const parentRes = await payload.find({ collection: 'post-categories', where: { slug: { equals: PARENT_SLUG } }, limit: 1, depth: 0 })
  const parent = parentRes.docs[0]
  if (!parent) { console.error(`Nadređena kategorija "${PARENT_SLUG}" ne postoji.`); process.exit(1) }

  // Find-or-create podkategorije
  const subIdBySlug = new Map<string, number>()
  for (const sc of SUBCATS) {
    const ex = await payload.find({ collection: 'post-categories', where: { slug: { equals: sc.slug } }, limit: 1, depth: 0 })
    if (ex.docs[0]) {
      subIdBySlug.set(sc.slug, ex.docs[0].id as number)
      console.log(`✓ podkategorija postoji: ${sc.title}`)
    } else if (DRY_RUN) {
      console.log(`＋ [dry-run] napravio bih: ${sc.title} (parent: ${PARENT_SLUG})`)
    } else {
      const created = await payload.create({ collection: 'post-categories', data: { title: sc.title, slug: sc.slug, parent: parent.id } as any })
      subIdBySlug.set(sc.slug, created.id as number)
      console.log(`＋ kreirana: ${sc.title}`)
    }
  }

  // CSV → id → sub slug
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf-8'))
  const counts: Record<string, number> = {}
  let assigned = 0, skipped = 0, notFound = 0, already = 0
  const skippedList: string[] = []

  for (const r of rows) {
    const id = parseInt((r['id'] || '').trim())
    if (!id) continue
    const subSlug = normalizeSub(r['podkategorija'] || '')
    if (!subSlug) { skipped++; skippedList.push(`${id} (${(r['naslov_sr'] || '').slice(0, 30)}: "${(r['podkategorija'] || '').trim()}")`); continue }
    counts[subSlug] = (counts[subSlug] || 0) + 1

    const post = await payload.findByID({ collection: 'posts', id, depth: 0 }).catch(() => null)
    if (!post) { notFound++; console.log(`✗ post ${id} ne postoji`); continue }

    const current: number[] = Array.isArray((post as any).categories)
      ? (post as any).categories.map((c: any) => (typeof c === 'object' ? c.id : c))
      : []
    const subId = subIdBySlug.get(subSlug)

    if (subId && current.includes(subId)) { already++; continue }
    if (DRY_RUN) { assigned++; continue }
    if (!subId) continue

    const next = Array.from(new Set([...current, subId]))
    await payload.update({ collection: 'posts', id, data: { categories: next, _status: 'published' } as any })
    assigned++
  }

  console.log('\n────────── REZIME ──────────')
  console.log('Distribucija (CSV):', JSON.stringify(counts))
  console.log(`Dodeljeno${DRY_RUN ? ' (bi)' : ''}: ${assigned} | već imalo: ${already} | preskočeno: ${skipped} | post ne postoji: ${notFound}`)
  if (skippedList.length) console.log('Preskočeni:', skippedList.slice(0, 10).join(' | ') + (skippedList.length > 10 ? ` … +${skippedList.length - 10}` : ''))
  console.log(DRY_RUN ? '\n🔎 DRY-RUN — ništa nije upisano.' : '\n✅ Upis završen.')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
