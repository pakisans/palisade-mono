/**
 * Scrape ALL completed projects (gotovi projekti) from palisada.rs via WP REST API
 * and (re)create them in Payload under post-category `gotovi-projekti`.
 *
 * Each project = a gallery: featured image + every content image → mediaBlock layout
 * (the project detail page builds its gallery from featuredImage + mediaBlocks).
 *
 * "Replace all": deletes existing posts in `gotovi-projekti`, then creates the full
 * set from palisada.rs (category 260, 112 projects). Touches ONLY gotovi-projekti.
 *
 * Usage:
 *   DRY_RUN=true pnpm scrape:projekti-palisada
 *   pnpm scrape:projekti-palisada
 *
 * Env: SKIP_IMAGES, DELAY_MS (default 350), LIMIT (cap # of projects, for testing)
 */

import config from '@payload-config'
import { JSDOM } from 'jsdom'
import type { File } from 'payload'
import { getPayload } from 'payload'

const SITE = 'https://palisada.rs'
const SOURCE_CAT = 260 // WP category id for "Gotovi projekti" on palisada.rs
const PROJECTS_SLUG = 'gotovi-projekti'
const POSTS = 'posts' as const
const POST_CATEGORIES = 'post-categories' as const
const MEDIA = 'media' as const

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120 Safari/537.36'

const DELAY_MS = Number(process.env.DELAY_MS ?? 350)
const SKIP_IMAGES = process.env.SKIP_IMAGES === 'true'
const DRY_RUN = process.env.DRY_RUN === 'true'
const LIMIT = process.env.LIMIT ? Number(process.env.LIMIT) : undefined
// ONLY=slug1,slug2 → process just these slugs and SKIP the delete-all (incremental add).
const ONLY = process.env.ONLY ? new Set(process.env.ONLY.split(',').map((s) => s.trim())) : null

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const collapse = (t: string) => (t ?? '').replace(/\s+/g, ' ').trim()

const sharedDoc = new JSDOM('<!doctype html><body></body>').window.document
function decode(s: string): string {
  const el = sharedDoc.createElement('textarea')
  el.innerHTML = s ?? ''
  return el.value
}
function stripTags(htmlStr: string): string {
  return collapse(decode((htmlStr ?? '').replace(/<[^>]+>/g, ' ')))
}
function trimExcerpt(s: string, max = 200): string {
  const t = collapse(s).replace(/\[…\]|\[\.\.\.\]/g, '…')
  return t.length > max ? `${t.slice(0, max).replace(/\s+\S*$/, '')}…` : t
}

type ImageRef = { url: string; alt: string }

// ─── Fetch + media ──────────────────────────────────────────────────────────

let lastReq = 0
async function fetchJson(url: string): Promise<{ json: any; totalPages: number }> {
  const wait = DELAY_MS - (Date.now() - lastReq)
  if (wait > 0) await sleep(wait)
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000), headers: { 'User-Agent': UA, Accept: 'application/json' } })
  lastReq = Date.now()
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const totalPages = Number(res.headers.get('x-wp-totalpages') ?? '1')
  return { json: await res.json(), totalPages }
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
      const ex = await payload.find({ collection: MEDIA, where: { filename: { equals: filename } }, limit: 1 })
      if (ex.docs[0]) return ex.docs[0].id
    }
    const file = await downloadImage(image.url)
    if (!file) return null
    try {
      const m = await payload.create({ collection: MEDIA, data: { alt: image.alt || filename || 'Projekat' }, file })
      return m.id
    } catch (err: any) {
      console.warn(`      ⚠ upload nije uspeo (${filename}): ${err?.message ?? err}`)
      return null
    }
  }
}

// ─── Lexical builders ───────────────────────────────────────────────────────

const tText = (text: string, format = 0): any => ({ type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1 })
const tParagraph = (children: any[]): any => ({ type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', version: 1 })
const tHeading = (text: string, tag: 'h2' | 'h3'): any => ({ type: 'heading', tag, children: [tText(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const tRoot = (children: any[]): any => ({
  root: { type: 'root', children: children.length ? children : [tParagraph([tText('')])], direction: 'ltr', format: '', indent: 0, version: 1 },
})
const BOLD = 1, ITALIC = 2
const tLink = (text: string, url: string): any => ({ type: 'link', fields: { linkType: 'custom', newTab: /^https?:/.test(url) && !/palisad/i.test(url), url }, children: [tText(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const tList = (items: any[][], ordered: boolean): any => ({ type: 'list', listType: ordered ? 'number' : 'bullet', start: 1, tag: ordered ? 'ol' : 'ul', children: items.map((c, i) => ({ type: 'listitem', value: i + 1, children: c.length ? c : [tText('')], direction: 'ltr', format: '', indent: 0, version: 1 })), direction: 'ltr', format: '', indent: 0, version: 1 })

// Inline walker: preserves <strong>/<b> (bold), <em>/<i> (italic), <a> (links).
function inlineNodes(el: Element): any[] {
  const out: any[] = []
  const walk = (node: any, fmt: number) => {
    // Collapse whitespace runs but DO NOT trim — preserves the space between text and inline tags.
    if (node.nodeType === 3) { const t = decode(node.textContent ?? '').replace(/\s+/g, ' '); if (t) out.push(tText(t, fmt)); return }
    if (node.nodeType !== 1) return
    const tag = node.tagName.toLowerCase()
    if (tag === 'a') { const href = node.getAttribute('href') || '#'; const text = collapse(node.textContent ?? ''); if (text) out.push(tLink(decode(text), href)); return }
    if (tag === 'br') { out.push({ type: 'linebreak', version: 1 }); return }
    const nf = tag === 'strong' || tag === 'b' ? fmt | BOLD : tag === 'em' || tag === 'i' ? fmt | ITALIC : fmt
    node.childNodes.forEach((c: any) => walk(c, nf))
  }
  el.childNodes.forEach((c: any) => walk(c, 0))
  return out
}

function youtubeUrl(html: string): string {
  const m = html.match(/<iframe[^>]+src=["']([^"']*(?:youtube\.com|youtu\.be|youtube-nocookie\.com)[^"']*)["']/i)
  if (!m) return ''
  const id = m[1].match(/(?:embed\/|youtu\.be\/|v=)([\w-]{6,})/)?.[1]
  return id ? `https://www.youtube.com/watch?v=${id}` : ''
}

// Largest candidate from a srcset (full-res gallery images).
function bestFromSrcset(srcset: string | null, fallback: string): string {
  if (!srcset) return fallback
  const best = srcset
    .split(',')
    .map((p) => p.trim().split(/\s+/))
    .map(([u, w]) => ({ u, w: parseInt(w ?? '0', 10) || 0 }))
    .sort((a, b) => b.w - a.w)[0]
  return best?.u || fallback
}

// ─── Parse project content → text nodes + ordered gallery images ────────────────

type Parsed = { content: any[]; images: ImageRef[]; firstText: string; videoUrl: string }

function parseProject(htmlStr: string, title: string): Parsed {
  const doc = new JSDOM(`<body>${htmlStr}</body>`).window.document.body
  const content: any[] = []
  const images: ImageRef[] = []
  const seen = new Set<string>()
  let firstText = ''

  doc.querySelectorAll('img').forEach((img) => {
    const raw = img.getAttribute('src') || ''
    const url = bestFromSrcset(img.getAttribute('srcset'), raw)
    if (!/^https?:/.test(url) || !/\/wp-content\/uploads\//.test(url)) return
    if (/logo|icon|favicon|placeholder/i.test(url)) return
    const key = url.split('?')[0].replace(/-\d+x\d+(\.\w+)$/, '$1')
    if (seen.has(key)) return
    seen.add(key)
    images.push({ url, alt: img.getAttribute('alt') || title })
  })

  const videoUrl = youtubeUrl(htmlStr)

  // Walk block-level nodes in order, preserving headings / bold / links / lists.
  const handle = (el: Element) => {
    const tag = el.tagName.toLowerCase()
    const plain = collapse(el.textContent ?? '')
    if (/^h[1-6]$/.test(tag)) {
      if (!plain) return
      content.push(tHeading(plain, tag === 'h1' || tag === 'h2' ? 'h2' : 'h3'))
    } else if (tag === 'p') {
      if (!plain) return
      // Standalone fully-bold short line → section heading.
      const strong = el.querySelector('strong, b')
      if (strong && collapse(strong.textContent ?? '') === plain && plain.length < 90) {
        content.push(tHeading(plain.replace(/:$/, ''), 'h2'))
        return
      }
      content.push(tParagraph(inlineNodes(el)))
      if (!firstText) firstText = plain
    } else if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'li').map((li) => inlineNodes(li as Element)).filter((c) => c.length)
      if (items.length) content.push(tList(items, tag === 'ol'))
    } else if (['div', 'section', 'article', 'figure'].includes(tag)) {
      Array.from(el.children).forEach(handle)
    }
  }
  Array.from(doc.children).forEach(handle)

  return { content, images, firstText, videoUrl }
}

// ─── Main ───────────────────────────────────────────────────────────────────

const run = async () => {
  const payload = await getPayload({ config })
  const upload = makeUploader(payload)

  const cat = await payload.find({ collection: POST_CATEGORIES, where: { slug: { equals: PROJECTS_SLUG } }, limit: 1 })
  const catId = cat.docs[0]?.id
  if (!catId) { console.error(`Post-kategorija "${PROJECTS_SLUG}" ne postoji.`); process.exit(1) }

  // Fetch all source projects (paginated, per_page=100).
  const fields = 'id,slug,title,excerpt,content,date,featured_media'
  let all: any[] = []
  let page = 1
  let totalPages = 1
  do {
    const { json, totalPages: tp } = await fetchJson(`${SITE}/wp-json/wp/v2/posts?categories=${SOURCE_CAT}&per_page=100&page=${page}&orderby=date&order=desc&_fields=${fields}`)
    totalPages = tp
    all = all.concat(json)
    page++
  } while (page <= totalPages)
  if (ONLY) all = all.filter((p) => ONLY.has(p.slug))
  if (LIMIT) all = all.slice(0, LIMIT)
  console.log(`Izvor: ${all.length} projekata (kategorija ${SOURCE_CAT}, ${totalPages} strana).${ONLY ? ' [ONLY — bez brisanja]' : ''}`)

  if (DRY_RUN) {
    let imgTotal = 0
    for (const p of all) {
      const parsed = parseProject(p.content.rendered, decode(p.title.rendered))
      imgTotal += parsed.images.length
      console.log(`  • ${p.slug}  [img:${parsed.images.length}${p.featured_media ? '+fm' : ''} txt:${parsed.content.length}${parsed.videoUrl ? ' +video' : ''}]  ${decode(p.title.rendered).slice(0, 50)}`)
    }
    console.log(`\n[DRY_RUN] ukupno galerijskih slika: ${imgTotal}. Ništa nije upisano.`)
    process.exit(0)
  }

  // Replace all: delete existing projects (skipped in ONLY/incremental mode).
  if (!ONLY) {
    const existing = await payload.find({ collection: POSTS, where: { 'categories.slug': { equals: PROJECTS_SLUG } }, limit: 500, depth: 0 })
    console.log(`Brišem postojećih projekata: ${existing.docs.length}`)
    for (const doc of existing.docs) await payload.delete({ collection: POSTS, id: doc.id })
  }

  const mediaUrl = async (id: number): Promise<ImageRef | null> => {
    if (!id) return null
    try {
      const { json } = await fetchJson(`${SITE}/wp-json/wp/v2/media/${id}?_fields=source_url,alt_text`)
      return json?.source_url ? { url: json.source_url, alt: json.alt_text || 'Projekat' } : null
    } catch { return null }
  }

  const uniqueSlug = async (base: string): Promise<string> => {
    let s = base
    let n = 0
    while (true) {
      const f = await payload.find({ collection: POSTS, where: { slug: { equals: s } }, limit: 1, depth: 0 })
      if (!f.docs[0]) return s
      n++
      s = n === 1 ? `${base}-projekat` : `${base}-projekat-${n}`
    }
  }

  let created = 0
  let failed = 0
  let imgCount = 0
  for (const p of all) {
    const title = decode(p.title.rendered)
    const parsed = parseProject(p.content.rendered, title)
    const excerpt = trimExcerpt(stripTags(p.excerpt?.rendered) || parsed.firstText || title)
    const slug = await uniqueSlug(p.slug)

    const fm = await mediaUrl(p.featured_media)
    const featuredId = fm ? await upload(fm) : null

    const layout: any[] = []
    if (parsed.videoUrl) layout.push({ blockType: 'video', platform: 'youtube', url: parsed.videoUrl })
    for (const img of parsed.images) {
      const id = await upload(img)
      if (id != null) { layout.push({ blockType: 'mediaBlock', media: id, position: 'normal' }); imgCount++ }
    }

    try {
      await payload.create({
        collection: POSTS,
        data: {
          title,
          slug,
          _status: 'published',
          publishedOn: p.date ? new Date(p.date).toISOString() : new Date().toISOString(),
          excerpt,
          ...(featuredId != null ? { featuredImage: featuredId } : {}),
          categories: [catId],
          content: tRoot(parsed.content),
          ...(layout.length ? { layout } : {}),
          meta: {
            title: `${title} | Palisade`,
            description: excerpt.slice(0, 160),
            ...(featuredId != null ? { image: featuredId } : {}),
          },
        } as any,
      })
      created++
      const note = slug !== p.slug ? ` (slug→${slug})` : ''
      const galN = layout.filter((b) => b.blockType === 'mediaBlock').length
      console.log(`  ✓ ${p.slug}${note} — galerija:${galN}${featuredId ? '+fm' : ''}${parsed.videoUrl ? ' +video' : ''} txt:${parsed.content.length}`)
    } catch (err: any) {
      failed++
      console.warn(`  ✗ ${p.slug}: ${err?.message ?? err}`)
    }
  }

  console.log(`\nGotovo. Projekata: ${created}/${all.length}${failed ? ` (neuspešno: ${failed})` : ''}, ukupno slika u galerijama: ${imgCount}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
