/**
 * Popunjava `technicalSheet` (PDF) i `installationVideo` (YouTube link) na
 * proizvodima, čitajući ih iz WooCommerce export CSV-a.
 *
 * Izvor u CSV-u su WordPress `[button]` shortcode-ovi u koloni "Opis":
 *   [button ... text="tehnički list" link="<PDF URL>" ...]
 *   [button ... text="VIDEO INSTALACIJE" li2nk|link="<YouTube URL>" ...]
 *
 * NEDESTRUKTIVNO & IDEMPOTENTNO:
 *   - dira SAMO proizvode koji u CSV-u imaju ove podatke (ostali netaknuti),
 *   - PDF se skida sa palisada.rs i uploaduje u našu `media` kolekciju
 *     (deduplikacija po nazivu fajla — ne uploaduje isti PDF dvaput),
 *   - YouTube se čuva kao link (nova polja), bez lokalizacije.
 *
 * Mapiranje na proizvod: slug(Ime) === products.slug (isti slugify kao import:wc).
 *
 * Usage:
 *   pnpm docs:import                 # DRY-RUN (podrazumevano) — samo ispiše plan
 *   DRY_RUN=false pnpm docs:import   # stvarno upisuje
 *   pnpm docs:import /putanja/do.csv # custom CSV
 */

import config from '@payload-config'
import { getPayload } from 'payload'
import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.env.DRY_RUN !== 'false'
const DEFAULT_CSV = path.resolve(process.cwd(), '../wc-product-export-3-6-2026-1780486976613.csv')

// ─── CSV parser (RFC 4180) — isti pristup kao import-wc ────────────────────────
function parseCSV(content: string): Record<string, string>[] {
  const rows: string[][] = []
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
    } else if (ch === '"') { inQuotes = true; i++ }
    else if (ch === ',') { row.push(field); field = ''; i++ }
    else if (ch === '\n') { row.push(field); field = ''; rows.push(row); row = []; i++ }
    else { field += ch; i++ }
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  if (rows.length < 2) return []
  const headers = rows[0].map((h) => h.trim().replace(/^﻿/, ''))
  return rows.slice(1).filter((r) => r.length > 1).map((r) => {
    const rec: Record<string, string> = {}
    headers.forEach((h, c) => (rec[h] = r[c] ?? ''))
    return rec
  })
}

// ─── slugify — MORA biti identičan import:wc da bi slug-ovi mapirali ──────────
function slugify(t: string): string {
  return t.toLowerCase()
    .replace(/[šŠ]/g, 's').replace(/[čČćĆ]/g, 'c').replace(/[žŽ]/g, 'z').replace(/[đĐ]/g, 'd')
    .replace(/[àáâä]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i').replace(/[òóôö]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96)
}

// ─── Ekstrakcija dugmadi iz opisa ─────────────────────────────────────────────
function extractDocs(desc: string): { pdf: string | null; video: string | null; warnings: string[] } {
  const warnings: string[] = []
  let pdf: string | null = null
  let video: string | null = null

  const techBtn = desc.match(/\[button[^\]]*text="tehnički list"[^\]]*\]/i)
  if (techBtn) {
    const m = techBtn[0].match(/link="([^"]+)"/i)
    if (m) pdf = m[1].trim()
    else warnings.push('tehnički list dugme nema link=')
  }

  const videoBtn = desc.match(/\[button[^\]]*text="VIDEO INSTALACIJE"[^\]]*\]/i)
  if (videoBtn) {
    // Izvor koristi čas `link=`, čas typo `li2nk=`
    const m = videoBtn[0].match(/(?:li2nk|link)="([^"]+)"/i)
    if (m) {
      video = m[1].trim().replace(/&amp;/g, '&')
      if (!/^https?:\/\//i.test(video)) video = 'https://' + video.replace(/^\/+/, '')
      // Provera dužine YouTube ID-a (11 znakova) — upozorenje na sumnjive
      const id = video.match(/[?&]v=([^&]+)/)?.[1]
      if (id && id.length !== 11) warnings.push(`sumnjiv YouTube ID (${id.length} zn.): ${id}`)
    } else warnings.push('VIDEO INSTALACIJE dugme nema link=/li2nk=')
  }
  return { pdf, video, warnings }
}

// ─── PDF download (sa fallback-om za typo .pdf2 → .pdf) ───────────────────────
async function downloadPdf(url: string): Promise<{ name: string; data: Buffer; size: number } | null> {
  const candidates = [url]
  const fixed = url.replace(/\.pdf\d+(\?|$)/i, '.pdf$1')
  if (fixed !== url) candidates.push(fixed)
  for (const u of candidates) {
    try {
      const res = await fetch(u, { signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': 'Mozilla/5.0 (PalisadeImport/1.0)' } })
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      let name = decodeURIComponent(u.split('/').pop()?.split('?')[0] ?? `doc-${Date.now()}.pdf`)
      name = name.replace(/\.pdf\d+$/i, '.pdf')
      return { name, data: buf, size: buf.byteLength }
    } catch { /* probaj sledeći kandidat */ }
  }
  return null
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const run = async () => {
  const csvPath = process.argv[2] || DEFAULT_CSV
  if (!fs.existsSync(csvPath)) { console.error(`CSV nije nađen: ${csvPath}`); process.exit(1) }

  const payload = await getPayload({ config })
  const rows = parseCSV(fs.readFileSync(csvPath, 'utf-8'))
  console.log(`${DRY_RUN ? '🔎 DRY-RUN' : '✍️  UPIS'} — ${rows.length} redova iz CSV-a\n`)

  // Sakupi po slug-u (prvi red sa podacima pobeđuje; preskoči varijacije/prazne)
  type Job = { name: string; slug: string; pdf: string | null; video: string | null; warnings: string[] }
  const jobs = new Map<string, Job>()
  for (const r of rows) {
    const name = (r['Ime'] || '').trim()
    if (!name) continue
    // Dugmad su u "Kratak opis"; čitamo i "Opis" za svaki slučaj.
    const desc = `${r['Kratak opis'] || ''}\n${r['Opis'] || ''}`
    if (!/tehnički list|VIDEO INSTALACIJE/i.test(desc)) continue
    const { pdf, video, warnings } = extractDocs(desc)
    if (!pdf && !video) continue
    const slug = slugify(name)
    if (!jobs.has(slug)) jobs.set(slug, { name, slug, pdf, video, warnings })
  }
  console.log(`Proizvoda sa dokumentima u CSV-u: ${jobs.size}\n`)

  const mediaCache = new Map<string, number>() // filename → media id
  let matched = 0, unmatched = 0, pdfsSet = 0, videosSet = 0, pdfFail = 0
  const unmatchedSlugs: string[] = []

  for (const job of jobs.values()) {
    // 1) mapiranje po slug-u; 2) fallback na TAČAN naslov (import je nekim
    //    proizvodima skratio/izmenio slug, npr. izgubljen "-2"/"-set").
    const bySlug = await payload.find({ collection: 'products', where: { slug: { equals: job.slug } }, limit: 1, depth: 0 })
    let product = bySlug.docs[0]
    let matchBy = 'slug'
    if (!product) {
      const byTitle = await payload.find({ collection: 'products', where: { title: { equals: job.name } }, locale: 'sr', limit: 2, depth: 0 })
      if (byTitle.docs.length === 1) { product = byTitle.docs[0]; matchBy = 'naslov' }
      else if (byTitle.docs.length > 1) { console.log(`     ⚠️  višeznačan naslov (${byTitle.docs.length}) — preskačem`) }
    }
    const status = product ? (matchBy === 'slug' ? '✓' : '✓ (po naslovu)') : '✗ NEMA PROIZVODA'
    if (!product) { unmatched++; unmatchedSlugs.push(job.slug) }
    else matched++

    console.log(`${status}  ${job.name}`)
    console.log(`     slug: ${job.slug}${product && matchBy === 'naslov' ? ` → DB slug: ${product.slug}` : ''}`)
    if (job.pdf) console.log(`     PDF:   ${job.pdf}`)
    if (job.video) console.log(`     VIDEO: ${job.video}`)
    for (const w of job.warnings) console.log(`     ⚠️  ${w}`)

    if (!product) continue

    const data: Record<string, unknown> = {}

    // PDF → media upload (dedupe po nazivu fajla)
    if (job.pdf) {
      const guessedName = decodeURIComponent(job.pdf.split('/').pop()?.split('?')[0] ?? '').replace(/\.pdf\d+$/i, '.pdf')
      if (DRY_RUN) {
        pdfsSet++
      } else {
        let mediaId = mediaCache.get(guessedName)
        if (!mediaId) {
          // već u bazi?
          const existingMedia = await payload.find({ collection: 'media', where: { filename: { equals: guessedName } }, limit: 1, depth: 0 })
          if (existingMedia.docs[0]) mediaId = existingMedia.docs[0].id as number
        }
        if (!mediaId) {
          const file = await downloadPdf(job.pdf)
          if (!file) { console.log(`     ❌ PDF download nije uspeo`); pdfFail++ }
          else {
            const created = await payload.create({
              collection: 'media',
              data: { alt: `Tehnički list — ${job.name}` },
              file: { name: file.name, data: file.data, mimetype: 'application/pdf', size: file.size },
            })
            mediaId = created.id as number
            mediaCache.set(file.name, mediaId)
          }
        } else {
          mediaCache.set(guessedName, mediaId)
        }
        if (mediaId) { data.technicalSheet = mediaId; pdfsSet++ }
      }
    }

    // Video → text polje
    if (job.video) { data.installationVideo = job.video; videosSet++ }

    if (!DRY_RUN && Object.keys(data).length) {
      await payload.update({ collection: 'products', id: product.id, data })
    }
  }

  console.log('\n────────── REZIME ──────────')
  console.log(`Poklopljeno proizvoda:   ${matched}`)
  console.log(`Nepoklopljeno (nema):    ${unmatched}${unmatchedSlugs.length ? '  → ' + unmatchedSlugs.join(', ') : ''}`)
  console.log(`PDF (tehnički list):     ${pdfsSet}${pdfFail ? `  (download fail: ${pdfFail})` : ''}`)
  console.log(`Video instalacije:       ${videosSet}`)
  console.log(DRY_RUN ? '\n🔎 DRY-RUN — ništa nije upisano. Pokreni sa DRY_RUN=false da upišeš.' : '\n✅ Upis završen.')
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
