/**
 * Scrape marketing content from kapije-ograde.rs → Palisade CMS.
 *
 * Currently handles SERVICE CATEGORY pages (Kapije/Ograde tipovi):
 *   - intro heading + paragraphs       → category.description + Content block
 *   - "Prednosti …" section            → Content block
 *   - "Najčešća pitanja …" accordion   → FAQ block
 *   - hero/gallery images              → category.image + MediaBlock(s)
 * It does NOT touch projekti or saveti.
 *
 * NON-DESTRUCTIVE: only updates categories that already exist (matched by slug).
 *
 * Usage:
 *   DRY_RUN=true pnpm scrape:site      # print extracted structure, write nothing
 *   pnpm scrape:site                   # download media + update categories
 *
 * Env: DELAY_MS (700), SKIP_IMAGES, ONLY=klizne-kapije,pesacke-kapije
 */

import config from '@payload-config'
import { JSDOM } from 'jsdom'
import type { File } from 'payload'
import { getPayload } from 'payload'

import {
  contentColumnsBlock,
  faqBlock,
  heading,
  paragraph,
  richText,
} from '../endpoints/seed/richText'

const SITE = 'https://kapije-ograde.rs'
const MEDIA_COLLECTION = 'media' as const
const CATEGORY_COLLECTION = 'categories' as const
const PAGES_COLLECTION = 'pages' as const

// What to scrape: categories (default) | clients | home | all
const MODE = (process.env.MODE ?? 'categories').toLowerCase()

// Reference URL slug → CMS category slug (here they happen to match).
const SERVICE_CATEGORIES = [
  'pesacke-kapije',
  'dvokrilne-kapije',
  'klizne-kapije',
  'samonosive-kapije',
  '2d-panelne-ograde',
  '3d-panelne-ograde',
  'aluminijumske-ograde',
]

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120 Safari/537.36'

const DELAY_MS = Number(process.env.DELAY_MS ?? 700)
const SKIP_IMAGES = process.env.SKIP_IMAGES === 'true'
const DRY_RUN = process.env.DRY_RUN === 'true'
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',').map((s) => s.trim())) : null

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const collapse = (t: string) => (t ?? '').replace(/\s+/g, ' ').trim()

type ImageRef = { url: string; alt: string }
type CategoryContent = {
  slug: string
  title: string
  hero: ImageRef | null
  intro: { heading: string; paras: string[] }
  advantages: { heading: string; paras: string[] }
  faq: { heading: string; items: { question: string; answer: string[] }[] }
  gallery: ImageRef[]
  meta: { title: string; description: string }
}

// ─── Fetch helpers ──────────────────────────────────────────────────────────

let lastReq = 0
async function fetchHtml(url: string, attempts = 3): Promise<string> {
  const wait = DELAY_MS - (Date.now() - lastReq)
  if (wait > 0) await sleep(wait)
  for (let a = 1; a <= attempts; a++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(30_000),
        headers: { 'User-Agent': UA, Accept: 'text/html' },
      })
      lastReq = Date.now()
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (err) {
      lastReq = Date.now()
      if (a === attempts) throw err
      await sleep(DELAY_MS * a * 2)
    }
  }
  throw new Error('unreachable')
}

async function downloadImage(url: string): Promise<File | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': UA } })
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const clean = url.split('?')[0]
    const ext = (clean.split('.').pop() ?? 'jpg').toLowerCase()
    const mime: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
    }
    return {
      name: clean.split('/').pop() || `img-${Date.now()}.${ext}`,
      data: Buffer.from(data),
      mimetype: mime[ext] ?? 'image/jpeg',
      size: data.byteLength,
    }
  } catch {
    return null
  }
}

function makeUploader(payload: any) {
  return async (image: ImageRef): Promise<number | string | null> => {
    if (SKIP_IMAGES || !image?.url) return null
    const filename = image.url.split('/').pop()?.split('?')[0]
    if (filename) {
      const ex = await payload.find({
        collection: MEDIA_COLLECTION,
        where: { filename: { equals: filename } },
        limit: 1,
      })
      if (ex.docs[0]) return ex.docs[0].id
    }
    const file = await downloadImage(image.url)
    if (!file) return null
    try {
      const m = await payload.create({
        collection: MEDIA_COLLECTION,
        data: { alt: image.alt || filename || 'Palisade' },
        file,
      })
      return m.id
    } catch (err: any) {
      console.warn(`    ⚠ upload nije uspeo (${filename}): ${err?.message ?? err}`)
      return null
    }
  }
}

// ─── Parsing ──────────────────────────────────────────────────────────────────

function bestFromSrcset(srcset: string | null, fallback: string): string {
  if (!srcset) return fallback
  const best = srcset
    .split(',')
    .map((p) => p.trim().split(/\s+/))
    .map(([u, w]) => ({ u, w: parseInt(w ?? '0', 10) || 0 }))
    .sort((a, b) => b.w - a.w)[0]
  return best?.u || fallback
}

function metaContent(doc: Document, prop: string): string {
  const el =
    doc.querySelector(`meta[property="${prop}"]`) || doc.querySelector(`meta[name="${prop}"]`)
  return el?.getAttribute('content') ?? ''
}

// FAQ accordion (Breakdance) → {question, answer[]}.
function extractFaq(doc: Document): { question: string; answer: string[] }[] {
  const items: { question: string; answer: string[] }[] = []
  doc.querySelectorAll('.bde-faq__item').forEach((item) => {
    const q = collapse(item.querySelector('.bde-faq__title')?.textContent ?? '')
    const panelId = item.querySelector('button[aria-controls]')?.getAttribute('aria-controls')
    let answer = panelId ? collapse(doc.getElementById(panelId)?.textContent ?? '') : ''
    if (!answer) answer = collapse((item.textContent ?? '').replace(q, ''))
    if (q && answer) items.push({ question: q, answer: [answer] })
  })
  return items
}

// Client logos shown in the "Preko 700 firmi" carousel (exclude the site's own logo).
function collectLogos(doc: Document): ImageRef[] {
  const seen = new Set<string>()
  const logos: ImageRef[] = []
  doc.querySelectorAll('img').forEach((img) => {
    const raw = img.getAttribute('src') ?? ''
    const url = bestFromSrcset(img.getAttribute('srcset'), raw)
    if (!/\/wp-content\/uploads\//.test(url)) return
    const file = (url.split('?')[0].split('/').pop() ?? '').toLowerCase()
    // keep brand logos / client collages; drop the site's own logo + decorative
    if (/palisada|^logo-svg|favicon|placeholder/.test(file)) return
    if (!/logo|klijent|coca|frikom|idea|roda|lidl|vodovod|delhaize|metro|nelt/.test(file)) return
    const key = url.split('?')[0]
    if (seen.has(key)) return
    seen.add(key)
    logos.push({ url, alt: img.getAttribute('alt') || file.replace(/[-_].*$/, '') })
  })
  return logos
}

function youtubeUrl(doc: Document, html: string): string | null {
  const id =
    html.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/)?.[1] ?? null
  return id ? `https://www.youtube.com/watch?v=${id}` : null
}

function parseCategory(html: string, slug: string): CategoryContent {
  const doc = new JSDOM(html).window.document

  const title = collapse(doc.querySelector('h1')?.textContent ?? slug)
  const metaTitle = collapse(doc.querySelector('title')?.textContent ?? title)
  const metaDesc = collapse(metaContent(doc, 'description') || metaContent(doc, 'og:description'))
  const ogImage = metaContent(doc, 'og:image')

  // Ordered walk of headings + text blocks in the main content.
  const blocks: { type: 'h' | 't'; text: string; tag?: string }[] = []
  doc.querySelectorAll('.bde-heading, .bde-text').forEach((el) => {
    if (el.closest('footer, header, nav')) return // skip site chrome
    const text = collapse(el.textContent ?? '')
    if (!text) return
    if (el.classList.contains('bde-heading')) {
      blocks.push({ type: 'h', text, tag: el.tagName.toLowerCase() })
    } else {
      blocks.push({ type: 't', text })
    }
  })

  // Segment by known headings.
  const intro = { heading: '', paras: [] as string[] }
  const advantages = { heading: '', paras: [] as string[] }
  let bucket: 'none' | 'intro' | 'adv' = 'none'

  for (const b of blocks) {
    if (b.type === 'h') {
      const low = b.text.toLowerCase()
      if (/najčešća pitanja|najcesca pitanja/.test(low)) break // FAQ handled separately
      if (/prednost/.test(low)) {
        advantages.heading = b.text
        bucket = 'adv'
        continue
      }
      if (b.text.toLowerCase() === title.toLowerCase()) {
        bucket = 'intro'
        continue
      }
      // First non-title heading starts the intro section.
      if (bucket === 'none') {
        intro.heading = b.text
        bucket = 'intro'
        continue
      }
      // Sub-heading inside current bucket → fold as a paragraph lead-in.
      ;(bucket === 'adv' ? advantages : intro).paras.push(b.text)
    } else {
      if (bucket === 'adv') advantages.paras.push(b.text)
      else if (bucket === 'intro') intro.paras.push(b.text)
    }
  }

  // FAQ
  const faqItems = extractFaq(doc)
  const faqHeadingEl = Array.from(doc.querySelectorAll('.bde-heading')).find((h) =>
    /najčešća pitanja|najcesca pitanja/i.test(h.textContent ?? ''),
  )
  const faq = {
    heading: collapse(faqHeadingEl?.textContent ?? 'Najčešća pitanja'),
    items: faqItems,
  }

  // Images — content imagery appears before the FAQ section in source order.
  const faqIdx = html.search(/najčešća pitanja|najcesca pitanja/i)
  const seen = new Set<string>()
  const gallery: ImageRef[] = []
  doc.querySelectorAll('img').forEach((img) => {
    const raw = img.getAttribute('src') ?? ''
    const url = bestFromSrcset(img.getAttribute('srcset'), raw)
    if (!/\/wp-content\/uploads\//.test(url)) return
    if (/logo|icon|favicon|placeholder/i.test(url)) return
    const at = html.indexOf(url.split('?')[0].split('/').pop() ?? '###')
    if (faqIdx !== -1 && at !== -1 && at > faqIdx) return // skip footer/logo images
    const key = url.split('?')[0]
    if (seen.has(key)) return
    seen.add(key)
    gallery.push({ url, alt: img.getAttribute('alt') || title })
  })

  const hero: ImageRef | null = ogImage
    ? { url: ogImage, alt: title }
    : gallery[0] ?? null

  return {
    slug,
    title,
    hero,
    intro,
    advantages,
    faq,
    gallery: gallery.filter((g) => g.url !== hero?.url).slice(0, 4),
    meta: { title: metaTitle, description: metaDesc },
  }
}

// ─── Build category.content flexibleContent ────────────────────────────────────

async function buildContent(c: CategoryContent, upload: (i: ImageRef) => Promise<any>) {
  const layout: any[] = []

  if (c.intro.heading || c.intro.paras.length) {
    layout.push(
      contentColumnsBlock([
        {
          size: 'full',
          texts: [
            ...(c.intro.heading ? [heading(c.intro.heading, 'h2')] : []),
            ...c.intro.paras.map((p) => paragraph(p)),
          ],
        },
      ]),
    )
  }

  // Gallery as media blocks between intro and advantages.
  for (const img of c.gallery) {
    const id = await upload(img)
    if (id) layout.push({ blockType: 'mediaBlock', media: id })
  }

  if (c.advantages.heading || c.advantages.paras.length) {
    layout.push(
      contentColumnsBlock([
        {
          size: 'full',
          texts: [
            ...(c.advantages.heading ? [heading(c.advantages.heading, 'h2')] : []),
            ...c.advantages.paras.map((p) => paragraph(p)),
          ],
        },
      ]),
    )
  }

  if (c.faq.items.length) {
    layout.push(faqBlock(c.faq.heading, c.faq.items))
  }

  return layout
}

// ─── Scrapers ───────────────────────────────────────────────────────────────

async function scrapeCategories(payload: any, upload: (i: ImageRef) => Promise<any>) {
  const slugs = SERVICE_CATEGORIES.filter((s) => !ONLY || ONLY.has(s))
  let updated = 0

  for (const slug of slugs) {
    const url = `${SITE}/${slug}/`
    process.stdout.write(`\n▸ ${slug} … `)
    let html: string
    try {
      html = await fetchHtml(url)
    } catch (err: any) {
      console.warn(`preskačem (${err?.message ?? err})`)
      continue
    }

    const c = parseCategory(html, slug)
    console.log(
      `intro:${c.intro.paras.length}p adv:${c.advantages.paras.length}p faq:${c.faq.items.length} img:${(c.hero ? 1 : 0) + c.gallery.length}`,
    )

    if (DRY_RUN) {
      console.log(`   title: ${c.title}`)
      console.log(`   hero:  ${c.hero?.url ?? '—'}`)
      console.log(`   intro: ${c.intro.heading} | ${c.intro.paras[0]?.slice(0, 90) ?? ''}`)
      console.log(`   adv:   ${c.advantages.heading} | ${c.advantages.paras.length} paragrafa`)
      c.faq.items.forEach((f, i) => console.log(`   FAQ${i + 1}: ${f.question}`))
      continue
    }

    // Resolve existing category by slug.
    const found = await payload.find({
      collection: CATEGORY_COLLECTION,
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    const cat = found.docs[0]
    if (!cat) {
      console.warn(`   ⚠ kategorija "${slug}" ne postoji u CMS-u — preskačem`)
      continue
    }

    const heroId = c.hero ? await upload(c.hero) : null
    const content = await buildContent(c, upload)

    const data: any = { content }
    if (heroId) data.image = heroId
    if (c.intro.paras[0]) data.description = c.intro.paras[0].slice(0, 280)

    await payload.update({ collection: CATEGORY_COLLECTION, id: cat.id, data })
    updated++
    console.log(`   ✓ ažurirana kategorija (id ${cat.id}, ${content.length} blokova)`)
  }

  console.log(`\nGotovo. Ažurirano kategorija: ${updated}/${slugs.length}`)
}

// Populate the `clients` global with logos from the homepage carousel.
async function scrapeClients(payload: any, upload: (i: ImageRef) => Promise<any>) {
  console.log('\n▸ Klijenti (logoi) …')
  const doc = new JSDOM(await fetchHtml(`${SITE}/`)).window.document
  const logos = collectLogos(doc)
  console.log(`   pronađeno logoa: ${logos.length}`)
  if (DRY_RUN) {
    logos.forEach((l) => console.log(`   - ${l.url.split('/').pop()}`))
    return
  }
  const items: any[] = []
  for (const logo of logos) {
    const id = await upload(logo)
    if (id) items.push({ image: id, name: logo.alt })
  }
  await payload.updateGlobal({
    slug: 'clients',
    data: { heading: 'Preko 700 firmi ogradila je PALISADA', logos: items },
  })
  console.log(`   ✓ clients global ažuriran (${items.length} logoa)`)
}

// Patch the home page doc with real homepage content (CEO video + FAQ + hero image).
async function scrapeHome(payload: any, upload: (i: ImageRef) => Promise<any>) {
  console.log('\n▸ Početna (home) …')
  const html = await fetchHtml(`${SITE}/`)
  const doc = new JSDOM(html).window.document
  const video = youtubeUrl(doc, html)
  const faq = extractFaq(doc)
  const ogImage = metaContent(doc, 'og:image')
  console.log(`   CEO video: ${video ?? '—'} | FAQ: ${faq.length} | hero: ${ogImage || '—'}`)
  if (DRY_RUN) {
    faq.forEach((f, i) => console.log(`   FAQ${i + 1}: ${f.question}`))
    return
  }

  const found = await payload.find({
    collection: PAGES_COLLECTION,
    where: { slug: { equals: 'home' } },
    limit: 1,
    depth: 0,
  })
  const home = found.docs[0]
  if (!home) {
    console.warn('   ⚠ home stranica ne postoji — preskačem (pokreni seed prvo)')
    return
  }

  const layout = Array.isArray(home.layout) ? [...home.layout] : []
  // brandStory → CEO video
  if (video) {
    const bs = layout.find((b: any) => b?.blockType === 'brandStory')
    if (bs) bs.videoUrl = video
  }
  // faq → real items
  if (faq.length) {
    const fb = layout.findIndex((b: any) => b?.blockType === 'faq')
    const real = faqBlock('Česta pitanja', faq)
    if (fb !== -1) layout[fb] = { ...layout[fb], ...real }
    else layout.push(real)
  }

  const data: any = { layout }
  if (ogImage) {
    const heroId = await upload({ url: ogImage, alt: 'Palisade' })
    if (heroId) data.hero = { ...home.hero, media: heroId }
  }

  await payload.update({ collection: PAGES_COLLECTION, id: home.id, data })
  console.log(`   ✓ home ažurirana (video:${video ? 'da' : 'ne'}, faq:${faq.length})`)
}

// Generic content page (o-nama): ordered headings+paragraphs → content blocks,
// images → media blocks, FAQ accordion → FAQ block. Updates the page's hero + layout.
async function scrapeAbout(payload: any, upload: (i: ImageRef) => Promise<any>) {
  console.log('\n▸ O nama (o-nama) …')
  const html = await fetchHtml(`${SITE}/o-nama/`)
  const doc = new JSDOM(html).window.document

  const h1 = collapse(doc.querySelector('h1')?.textContent ?? 'O nama')
  const faqIdx = html.search(/najčešća pitanja|najcesca pitanja/i)

  // Ordered sections: a heading starts a new section, following .bde-text are its paragraphs.
  type Section = { heading: string; paras: string[] }
  const sections: Section[] = []
  let cur: Section | null = null
  doc.querySelectorAll('.bde-heading, .bde-text').forEach((el) => {
    if (el.closest('footer, header, nav')) return // skip site chrome
    const text = collapse(el.textContent ?? '')
    if (!text) return
    if (/kad sigurnost zahteva|najčešća pitanja|najcesca pitanja/i.test(text)) return
    if (/^\d+([.,]\d+)?$/.test(text)) return // bare rating numbers like "4.9"
    if (el.classList.contains('bde-heading')) {
      if (el.tagName.toLowerCase() === 'h1') return
      cur = { heading: text, paras: [] }
      sections.push(cur)
    } else if (cur) {
      cur.paras.push(text)
    }
  })
  const faq = extractFaq(doc)

  console.log(`   sekcija: ${sections.length} | faq: ${faq.length}`)
  if (DRY_RUN) {
    sections.forEach((s) => console.log(`   § ${s.heading} (${s.paras.length}p)`))
    return
  }

  const found = await payload.find({
    collection: PAGES_COLLECTION,
    where: { slug: { equals: 'o-nama' } },
    limit: 1,
    depth: 0,
  })
  const about = found.docs[0]
  if (!about) {
    console.warn('   ⚠ o-nama stranica ne postoji — preskačem (pokreni seed prvo)')
    return
  }

  const layout: any[] = []
  const keep = sections.filter(
    (s) => s.paras.length && !/kontakt info|društveni|drustveni|pratite nas/i.test(s.heading),
  )
  for (const s of keep) {
    layout.push(
      contentColumnsBlock([
        { size: 'full', texts: [heading(s.heading, 'h2'), ...s.paras.map((p) => paragraph(p))] },
      ]),
    )
  }
  if (faq.length) layout.push(faqBlock('Česta pitanja', faq))
  layout.push({
    blockType: 'cta',
    richText: richText(
      heading('Kad sigurnost zahteva rešenje!', 'h2'),
      paragraph('Zatražite besplatno merenje i ponudu — odgovaramo u roku od 24 sata.'),
    ),
    links: [{ link: { type: 'custom', appearance: 'default', label: 'Zatraži rešenje', url: '/kontakt' } }],
  })

  await payload.update({
    collection: PAGES_COLLECTION,
    id: about.id,
    data: { layout, hero: { ...about.hero, richText: richText(heading(h1, 'h1')) } },
  })
  console.log(`   ✓ o-nama ažurirana (${layout.length} blokova)`)
}

// Lexical inline helpers (for clickable contact links).
const txt = (text: string, format = 0): any => ({
  type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1,
})
const link = (text: string, url: string, newTab = false): any => ({
  type: 'link', fields: { linkType: 'custom', url, newTab },
  children: [txt(text)], direction: 'ltr', format: '', indent: 0, version: 2,
})
const para = (...children: any[]): any => ({
  type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1,
})

// Contact page → hero + "Kontakt info" + form + CTA, mirroring the source page.
async function scrapeContact(payload: any, upload: (i: ImageRef) => Promise<any>) {
  console.log('\n▸ Kontakt …')
  const html = await fetchHtml(`${SITE}/kontakt/`)
  const doc = new JSDOM(html).window.document
  const find = (re: RegExp, fb = '') => (html.match(re)?.[1] ?? fb).trim()

  const h1 = collapse(doc.querySelector('h1')?.textContent ?? 'Zatražite ponudu')
  const subEl = Array.from(doc.querySelectorAll('.bde-heading, .bde-text')).find((e) =>
    /javite se|šaljemo|saljemo/i.test(e.textContent ?? ''),
  )
  const sub = collapse(subEl?.textContent ?? 'Javite se i šaljemo još danas ponudu.')

  const phoneRaw = find(/href="tel:([^"]+)"/, '+381652227007')
  const phonePretty = find(/(\+381\s?\d{2}\s?\d{3}\s?\d{4})/, '+381 65 222 7007')
  const email = find(/href="mailto:([^"]+)"/, 'goran@palisada.rs')
  const wa = find(/href="(https?:\/\/wa\.me\/[^"]+)"/, 'https://wa.me/381652227007')
  const map = find(/href="(https?:\/\/www\.google\.[^"]*maps[^"]+)"/, '')
  const address = collapse(
    Array.from(doc.querySelectorAll('a, .bde-text')).find((e) =>
      /Zrenjaninski/i.test(e.textContent ?? ''),
    )?.textContent ?? 'Zrenjaninski put 139E, Beograd',
  )

  console.log(`   tel:${phonePretty} email:${email} wa:${wa ? 'da' : 'ne'} map:${map ? 'da' : 'ne'}`)
  if (DRY_RUN) return

  const found = await payload.find({
    collection: PAGES_COLLECTION,
    where: { slug: { equals: 'kontakt' } },
    limit: 1,
    depth: 0,
  })
  const page = found.docs[0]
  if (!page) {
    console.warn('   ⚠ kontakt stranica ne postoji — preskačem (pokreni seed prvo)')
    return
  }

  // Preserve the existing form reference.
  const existingForm = (page.layout ?? []).find((b: any) => b?.blockType === 'formBlock')
  const formId = existingForm?.form ?? null

  const contactInfo = {
    blockType: 'contactInfo',
    heading: 'Kontakt info',
    phone: phonePretty,
    whatsapp: wa || undefined,
    email,
    address,
    mapUrl: map || undefined,
  }

  const formBlock = {
    blockType: 'formBlock',
    ...(formId ? { form: formId } : {}),
    // MAP_ADDRESS override → precizna adresa za pin na mapi (poštanski broj + Serbia)
    mapAddress: process.env.MAP_ADDRESS || address,
    enableIntro: true,
    introContent: richText(
      heading('Pošaljite detalje vašeg projekta za bržu ponudu', 'h3'),
      paragraph('Što više detalja navedete (vrsta, dimenzije, lokacija), to brže i preciznije šaljemo ponudu.'),
    ),
  }

  const cta = {
    blockType: 'cta',
    richText: richText(
      heading('Kad sigurnost zahteva rešenje!', 'h2'),
      paragraph('Zatražite besplatno merenje i ponudu — odgovaramo u roku od 24 sata.'),
    ),
    links: [{ link: { type: 'custom', appearance: 'default', label: 'Zatraži rešenje', url: '#contact-form' } }],
  }

  const layout: any[] = [contactInfo]
  if (formId) layout.push(formBlock)
  layout.push(cta)

  await payload.update({
    collection: PAGES_COLLECTION,
    id: page.id,
    data: {
      layout,
      hero: { ...page.hero, richText: richText(heading(h1, 'h1'), paragraph(sub)) },
    },
  })
  console.log(`   ✓ kontakt ažurirana (form:${formId ?? 'nema'}, ${layout.length} blokova)`)
}

// ─── Main / dispatch ───────────────────────────────────────────────────────────

const run = async () => {
  const payload = await getPayload({ config })
  const upload = makeUploader(payload)

  if (MODE === 'categories' || MODE === 'all') await scrapeCategories(payload, upload)
  if (MODE === 'clients' || MODE === 'all') await scrapeClients(payload, upload)
  if (MODE === 'home' || MODE === 'all') await scrapeHome(payload, upload)
  if (MODE === 'about' || MODE === 'all') await scrapeAbout(payload, upload)
  if (MODE === 'contact' || MODE === 'all') await scrapeContact(payload, upload)

  console.log('\n✓ Gotovo.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
