/**
 * Scrape & seed real projects from kapije-ograde.rs → Palisade Payload CMS.
 *
 * Crawls the Bricks-Builder projects archive (28 pages), opens every project,
 * and maps the source content into the SAME blocks a human would use in the
 * admin — NOT one big text dump:
 *   - prose (headings / paragraphs / lists) → post `content` richText, with
 *     `<a>` anchors preserved as real inline Lexical link nodes
 *   - YouTube `<iframe>` / youtu.be URLs       → `layout` → `video` block
 *   - content images / galleries               → `layout` → `mediaBlock`
 *   - SEO keyword-spam / 🔗 / empty paragraphs  → dropped as noise
 *
 * COLLECTION NAMES (adapt here if your config differs):
 *   POSTS_COLLECTION='posts'  CATEGORY_COLLECTION='post-categories'  MEDIA_COLLECTION='media'
 *
 * Every project is linked to the `gotovi-projekti` post-category (find-or-create).
 * A project is NEVER created without that category — if the link can't be made,
 * the project is skipped and reported. After import, category assignment counts
 * are verified and printed.
 *
 * Usage:
 *   pnpm scrape:projects                       # full import (skips existing slugs)
 *   DRY_RUN=true SCRAPE_LIMIT=3 pnpm scrape:projects   # preview exact payload, write nothing
 *   CLEANUP=true pnpm scrape:projects          # delete ONLY scraper projects in gotovi-projekti
 *   RESEED=true pnpm scrape:projects           # delete+recreate scraped projects
 *
 * Env flags:
 *   SCRAPE_PAGES, SCRAPE_LIMIT, DELAY_MS (default 800), CONCURRENCY (default 2),
 *   SKIP_IMAGES, RESEED, DRY_RUN, CLEANUP
 */

import config from '@payload-config'
import { JSDOM } from 'jsdom'
import type { File } from 'payload'
import { getPayload } from 'payload'

// ─── Configuration ──────────────────────────────────────────────────────────

const SITE = 'https://kapije-ograde.rs'
const LISTING = `${SITE}/projekti/`
// Same-site domains whose absolute links should be rewritten to relative paths.
const INTERNAL_HOSTS = ['kapije-ograde.rs', 'palisada.rs']
const PROJECTS_CATEGORY_SLUG = 'gotovi-projekti'
const PROJECTS_CATEGORY_TITLE = 'Gotovi projekti'

const POSTS_COLLECTION = 'posts' as const
const CATEGORY_COLLECTION = 'post-categories' as const
const MEDIA_COLLECTION = 'media' as const

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120 Safari/537.36'

const DELAY_MS = Number(process.env.DELAY_MS ?? 800)
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 2)
const MAX_PAGES_OVERRIDE = process.env.SCRAPE_PAGES ? Number(process.env.SCRAPE_PAGES) : undefined
const LIMIT = process.env.SCRAPE_LIMIT ? Number(process.env.SCRAPE_LIMIT) : undefined
const SKIP_IMAGES = process.env.SKIP_IMAGES === 'true'
const RESEED = process.env.RESEED === 'true'
const DRY_RUN = process.env.DRY_RUN === 'true'
const CLEANUP = process.env.CLEANUP === 'true'
const PREVIEW_COUNT = 3

// ─── Types ──────────────────────────────────────────────────────────────────

type ImageRef = { url: string; alt: string; width?: number; height?: number }

type ProjectCard = {
  title: string
  url: string
  slug: string
  excerpt: string
  image: ImageRef | null
}

/** Inline run inside a paragraph: plain text (with optional format flags) or a link. */
type Inline =
  | { kind: 'text'; text: string; format: number }
  | { kind: 'link'; text: string; url: string; newTab: boolean }

/** Ordered content node parsed from the source post body. */
type ContentNode =
  | { kind: 'heading'; tag: 'h2' | 'h3'; text: string }
  | { kind: 'paragraph'; inlines: Inline[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'video'; videoId: string; url: string }
  | { kind: 'image'; image: ImageRef }

type ProjectDetail = {
  title: string
  slug: string
  url: string
  excerpt: string
  nodes: ContentNode[]
  featuredImage: ImageRef | null
  meta: { title: string; description: string; ogImage: string | null }
  linkRewrites: { from: string; to: string }[]
}

// ─── Generic utilities ────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const collapse = (text: string): string => (text ?? '').replace(/\s+/g, ' ').trim()

/** Strip decorative noise (link emoji etc.) the user flagged. */
const denoise = (text: string): string => text.replace(/🔗/g, '').replace(/\s+/g, ' ').trim()

/** True for SEO keyword-stuffing paragraphs that a human would never keep. */
const isNoiseParagraph = (text: string): boolean =>
  /^\s*(ključne reči|kljucne reci|keywords)\s*:/i.test(text) || text === ''

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[šŠ]/g, 's')
    .replace(/[čČćĆ]/g, 'c')
    .replace(/[žŽ]/g, 'z')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

function slugFromUrl(url: string): string {
  try {
    const seg = new URL(url).pathname.replace(/\/+$/, '').split('/').filter(Boolean).pop() ?? ''
    return seg || slugify(url)
  } catch {
    return slugify(url)
  }
}

function trimExcerpt(text: string, max = 220): string {
  const t = collapse(text).replace(/[…]+$/, '').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  if (lastStop > max * 0.5) return cut.slice(0, lastStop + 1).trim()
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

function bestFromSrcset(srcset: string | null, fallback: string): string {
  if (!srcset) return stripWpSizeSuffix(fallback)
  let best = fallback
  let bestW = 0
  for (const part of srcset.split(',')) {
    const [u, w] = part.trim().split(/\s+/)
    const width = parseInt(w ?? '0', 10)
    if (u && width > bestW) {
      bestW = width
      best = u
    }
  }
  return best
}

const stripWpSizeSuffix = (url: string): string =>
  url.replace(/-\d+x\d+(\.[a-z]{2,5})(\?.*)?$/i, '$1')

/** Extract a YouTube video id from any embed/watch/short URL. */
function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|\/embed\/|[?&]v=|\/shorts\/)([\w-]{6,})/)
  return m ? m[1] : null
}

async function runConcurrent<T>(tasks: (() => Promise<T>)[], max: number): Promise<T[]> {
  const results: T[] = []
  let idx = 0
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      results[i] = await tasks[i]()
    }
  }
  await Promise.all(Array.from({ length: Math.min(max, tasks.length) }, worker))
  return results
}

// ─── Link rewriting (absolute same-site → relative + route remaps) ─────────────

/**
 * Rewrite a source href to something usable on the new Palisade frontend.
 * Returns null for empty/anchor/js links. `newTab` true only for external hosts.
 */
function rewriteHref(href: string): { url: string; newTab: boolean } | null {
  const raw = (href ?? '').trim()
  if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:')) {
    return raw.startsWith('mailto:') || raw.startsWith('tel:') ? { url: raw, newTab: false } : null
  }
  let url: URL
  try {
    url = new URL(raw, SITE)
  } catch {
    return null
  }
  const internal = INTERNAL_HOSTS.some((h) => url.host === h || url.host.endsWith(`.${h}`))
  if (!internal) return { url: url.toString(), newTab: true }

  // Same-site → relative path, remapped to current frontend routes.
  // Frontend categories are FLAT (`/kategorije/[slug]`), but the legacy site
  // uses nested + paginated category URLs, so collapse any category-shaped path
  // to its last meaningful slug. (Best-effort — verify the slug exists.)
  let path = url.pathname
  if (/^\/(product-category|kategorija|kategorije)\//.test(path)) {
    const seg = path
      .replace(/\/page\/\d+\/?$/, '/') // drop pagination
      .replace(/\/+$/, '')
      .split('/')
      .filter(Boolean)
      .pop()
    path = `/kategorije/${seg}/`
  } else {
    path = path.replace(/^\/proizvod\//, '/proizvodi/')
  }
  return { url: path + (url.search || ''), newTab: false }
}

// ─── HTTP with retry + politeness delay ───────────────────────────────────────

let lastRequestAt = 0

async function fetchHtml(url: string, attempts = 3): Promise<string> {
  const wait = DELAY_MS - (Date.now() - lastRequestAt)
  if (wait > 0) await sleep(wait)
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(30_000),
        headers: { 'User-Agent': UA, Accept: 'text/html' },
      })
      lastRequestAt = Date.now()
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return await res.text()
    } catch (err) {
      lastRequestAt = Date.now()
      if (attempt === attempts) throw err
      const backoff = DELAY_MS * attempt * 2
      console.warn(`    ⚠ fetch ${url} failed (${String(err)}), retry ${attempt} in ${backoff}ms`)
      await sleep(backoff)
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
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml',
    }
    const name = clean.split('/').pop() || `img-${Date.now()}.${ext}`
    return { name, data: Buffer.from(data), mimetype: mimeMap[ext] ?? 'image/jpeg', size: data.byteLength }
  } catch {
    return null
  }
}

// ─── Listing-page parsing ──────────────────────────────────────────────────────

function parseListing(html: string): ProjectCard[] {
  const doc = new JSDOM(html).window.document
  const cards: ProjectCard[] = []
  for (const article of doc.querySelectorAll('article.bde-loop-item, article.ee-post')) {
    const link = article.querySelector('a.bde-loop-item__title-link, a.bde-loop-item__image-link, a[href]')
    const href = link?.getAttribute('href')
    if (!href) continue
    const url = href.split('?')[0].replace(/\/+$/, '') + '/'
    const title = collapse(article.querySelector('.ee-post-title')?.textContent ?? '')
    const excerpt = collapse(article.querySelector('.ee-post-content')?.textContent ?? '')
    const img = article.querySelector('img.wp-post-image, .ee-post-image img, img')
    let image: ImageRef | null = null
    if (img) {
      const src = img.getAttribute('src') ?? ''
      image = {
        url: bestFromSrcset(img.getAttribute('srcset'), src),
        alt: img.getAttribute('alt') || title,
        width: img.getAttribute('width') ? Number(img.getAttribute('width')) : undefined,
        height: img.getAttribute('height') ? Number(img.getAttribute('height')) : undefined,
      }
    }
    cards.push({ title, url, slug: slugFromUrl(url), excerpt, image })
  }
  return cards
}

function detectLastPage(html: string): number {
  const doc = new JSDOM(html).window.document
  let max = 1
  for (const a of doc.querySelectorAll('a[href]')) {
    const m = (a.getAttribute('href') ?? '').match(/\/projekti\/page\/(\d+)\//)
    if (m) max = Math.max(max, Number(m[1]))
  }
  return max
}

/** Crawl every listing page and return deduped cards (keyed by slug). */
async function crawlListing(): Promise<ProjectCard[]> {
  const firstHtml = await fetchHtml(LISTING)
  const lastPage = MAX_PAGES_OVERRIDE ?? detectLastPage(firstHtml)
  console.log(`   Detektovano stranica: ${lastPage}`)
  const bySlug = new Map<string, ProjectCard>()
  const add = (cards: ProjectCard[], page: number) => {
    let added = 0
    for (const c of cards) if (!bySlug.has(c.slug)) (bySlug.set(c.slug, c), added++)
    console.log(`   • strana ${page}: ${cards.length} kartica (${added} novih, ukupno ${bySlug.size})`)
  }
  add(parseListing(firstHtml), 1)
  for (let page = 2; page <= lastPage; page++) {
    try {
      const cards = parseListing(await fetchHtml(`${SITE}/projekti/page/${page}/`))
      add(cards, page)
      if (cards.length === 0) break
    } catch (err) {
      console.warn(`   ⚠ strana ${page} preskočena: ${String(err)}`)
    }
  }
  return Array.from(bySlug.values())
}

// ─── Detail-page parsing → ordered ContentNode[] ──────────────────────────────

const metaContent = (doc: Document, sel: string): string =>
  doc.querySelector(sel)?.getAttribute('content')?.trim() ?? ''

/**
 * Build inline runs (text + links) from a paragraph, RECURSING through the
 * `<span>`/`<strong>`/`<em>` wrappers Bricks emits — anchors are frequently
 * nested several levels deep, so a shallow scan would flatten them to text.
 */
function parseInlines(el: Element, rewrites: { from: string; to: string }[]): Inline[] {
  const raw: Inline[] = []

  const walk = (node: Node, format: number) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        // Collapse internal whitespace but PRESERVE boundary spaces. (denoise()
        // does .trim(), which would glue text onto an adjacent link / <strong>
        // run, e.g. "je EUROFENCE" → "jeEUROFENCE".)
        const collapsed = (child.textContent ?? '').replace(/\s+/g, ' ').replace(/🔗/g, '')
        if (collapsed.trim() || collapsed === ' ')
          raw.push({ kind: 'text', text: collapsed || ' ', format: collapsed.trim() ? format : 0 })
        continue
      }
      if (child.nodeType !== 1) continue
      const e = child as Element
      const tag = e.tagName
      if (tag === 'A') {
        const label = denoise(e.textContent ?? '')
        if (!label) continue
        const rewritten = rewriteHref(e.getAttribute('href') ?? '')
        if (rewritten) {
          const from = e.getAttribute('href') ?? ''
          if (from && from !== rewritten.url) rewrites.push({ from, to: rewritten.url })
          raw.push({ kind: 'link', text: label, url: rewritten.url, newTab: rewritten.newTab })
        } else {
          raw.push({ kind: 'text', text: label, format })
        }
        continue // anchor text already captured; don't double-walk
      }
      if (tag === 'BR') continue
      const nextFormat = format | (tag === 'STRONG' || tag === 'B' ? 1 : 0) | (tag === 'EM' || tag === 'I' ? 2 : 0)
      walk(e, nextFormat)
    }
  }
  walk(el, 0)

  // Merge adjacent same-format text runs so output reads like hand-written prose.
  const merged: Inline[] = []
  for (const inl of raw) {
    const last = merged[merged.length - 1]
    if (inl.kind === 'text' && last && last.kind === 'text' && last.format === inl.format) {
      last.text = (last.text + inl.text).replace(/\s+/g, ' ')
    } else {
      merged.push({ ...inl })
    }
  }
  while (merged.length && merged[0].kind === 'text' && !merged[0].text.trim()) merged.shift()
  while (merged.length && merged[merged.length - 1].kind === 'text' && !merged[merged.length - 1].text.trim()) merged.pop()
  return merged
}

function inlinesPlainText(inlines: Inline[]): string {
  return collapse(inlines.map((i) => i.text).join(''))
}

function parseDetail(html: string, url: string, card?: ProjectCard): ProjectDetail {
  const doc = new JSDOM(html).window.document
  const title = collapse(card?.title || doc.querySelector('h1')?.textContent || '')
  const slug = slugFromUrl(url)
  const metaTitle = collapse(metaContent(doc, 'meta[property="og:title"]') || doc.querySelector('title')?.textContent || title)
  const metaDescription = collapse(metaContent(doc, 'meta[name="description"]') || metaContent(doc, 'meta[property="og:description"]'))
  const ogImage = metaContent(doc, 'meta[property="og:image"]') || null

  // The post body lives in a `.bde-rich-text` container that holds the Gutenberg
  // `.wp-block-*` blocks. Global template text uses `.bde-text` (excluded), and
  // the @Palisada channel/social links live outside this container (excluded).
  const anchor = doc.querySelector('.wp-block-paragraph, .wp-block-heading, .wp-block-list')
  const container = anchor?.closest('.bde-rich-text') ?? anchor?.parentElement ?? null

  const rewrites: { from: string; to: string }[] = []
  const nodes: ContentNode[] = []
  const seenText = new Set<string>()

  if (container) {
    const selectables = container.querySelectorAll(
      '.wp-block-paragraph, .wp-block-heading, h2.wp-block-heading, h3.wp-block-heading, .wp-block-list, iframe, .wp-block-image img',
    )
    for (const el of selectables) {
      const tag = el.tagName

      if (tag === 'IFRAME') {
        const src = el.getAttribute('src') || el.getAttribute('data-src') || ''
        const id = youtubeId(src)
        if (id) nodes.push({ kind: 'video', videoId: id, url: `https://www.youtube.com/watch?v=${id}` })
        continue
      }

      if (tag === 'IMG') {
        const src = el.getAttribute('src') ?? ''
        if (!/wp-content\/uploads/.test(src)) continue
        nodes.push({
          kind: 'image',
          image: { url: bestFromSrcset(el.getAttribute('srcset'), src), alt: el.getAttribute('alt') || title },
        })
        continue
      }

      if (el.classList.contains('wp-block-heading') || tag === 'H2' || tag === 'H3') {
        const text = denoise(el.textContent ?? '')
        if (text && !seenText.has(text)) {
          seenText.add(text)
          nodes.push({ kind: 'heading', tag: tag === 'H3' ? 'h3' : 'h2', text })
        }
        continue
      }

      if (el.classList.contains('wp-block-list')) {
        const items: string[] = []
        for (const li of el.querySelectorAll('li')) {
          const t = denoise(li.textContent ?? '')
          if (t && !seenText.has(t)) {
            seenText.add(t)
            items.push(t)
          }
        }
        if (items.length) nodes.push({ kind: 'list', items })
        continue
      }

      // paragraph
      const plain = denoise(el.textContent ?? '')
      if (isNoiseParagraph(plain) || seenText.has(plain)) continue
      seenText.add(plain)

      // A paragraph that is solely a YouTube link/URL → promote to video block.
      const onlyYt = youtubeId(plain) && /^https?:\/\/\S+$/.test(plain)
      const singleYtAnchor =
        el.children.length === 1 &&
        el.children[0].tagName === 'A' &&
        youtubeId(el.children[0].getAttribute('href') ?? '')
      if (onlyYt || singleYtAnchor) {
        const ytUrl = singleYtAnchor ? el.children[0].getAttribute('href')! : plain
        const id = youtubeId(ytUrl)!
        nodes.push({ kind: 'video', videoId: id, url: `https://www.youtube.com/watch?v=${id}` })
        continue
      }

      const inlines = parseInlines(el, rewrites)
      if (inlinesPlainText(inlines)) nodes.push({ kind: 'paragraph', inlines })
    }
  }

  const featuredImage: ImageRef | null = card?.image
    ? card.image
    : ogImage
      ? { url: stripWpSizeSuffix(ogImage), alt: title }
      : null

  const firstPara = nodes.find((n) => n.kind === 'paragraph') as Extract<ContentNode, { kind: 'paragraph' }> | undefined
  const excerpt = trimExcerpt(
    (firstPara ? inlinesPlainText(firstPara.inlines) : '') || card?.excerpt || metaDescription,
  )

  return {
    title,
    slug,
    url,
    excerpt,
    nodes,
    featuredImage,
    meta: { title: metaTitle, description: trimExcerpt(metaDescription || excerpt, 160), ogImage },
    linkRewrites: rewrites,
  }
}

// ─── Lexical builders (shapes verified against richText.ts + RichText.jsx) ─────

const tText = (text: string, format = 0) => ({ type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1 })
const tLink = (text: string, url: string, newTab: boolean) => ({
  type: 'link',
  fields: { linkType: 'custom', newTab, url },
  children: [tText(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tParagraph = (children: any[]) => ({ type: 'paragraph', children, direction: 'ltr', format: '', indent: 0, textFormat: 0, textStyle: '', version: 1 })
const tHeading = (text: string, tag: 'h2' | 'h3') => ({ type: 'heading', tag, children: [tText(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const tList = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, i) => ({ type: 'listitem', value: i + 1, children: [tText(item)], direction: 'ltr', format: '', indent: 0, version: 1 })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tRoot = (children: any[]) => ({
  root: { type: 'root', children: children.length ? children : [tParagraph([tText('')])], direction: 'ltr', format: '', indent: 0, version: 1 },
})

const inlineToLexical = (inline: Inline) =>
  inline.kind === 'link' ? tLink(inline.text, inline.url, inline.newTab) : tText(inline.text, inline.format)

// ─── Build the validated Payload payload ──────────────────────────────────────

type MediaResolver = (image: ImageRef) => Promise<number | string | null>

/** Result of mapping a project to a Payload payload. */
type BuildResult =
  | { ok: true; data: any; stats: { paragraphs: number; headings: number; lists: number; videos: number; mediaBlocks: number; links: number } }
  | { ok: false; reason: string }

/**
 * Map a parsed project → `posts` payload using existing blocks, validating as
 * we go. `resolveMedia` uploads (real run) or returns a placeholder (dry run).
 */
async function buildPayload(
  detail: ProjectDetail,
  categoryId: number | string,
  resolveMedia: MediaResolver,
): Promise<BuildResult> {
  if (!categoryId) return { ok: false, reason: 'Kategorija "gotovi-projekti" nije razrešena' }

  // 1) Text flow → content richText (with inline links).
  const contentChildren: any[] = []
  let links = 0
  let headings = 0
  let lists = 0
  let paragraphs = 0
  for (const node of detail.nodes) {
    if (node.kind === 'heading') {
      contentChildren.push(tHeading(node.text, node.tag))
      headings++
    } else if (node.kind === 'list') {
      contentChildren.push(tList(node.items))
      lists++
    } else if (node.kind === 'paragraph') {
      links += node.inlines.filter((i) => i.kind === 'link').length
      contentChildren.push(tParagraph(node.inlines.map(inlineToLexical)))
      paragraphs++
    }
  }

  // Required `content` field must be non-empty & meaningful.
  if (contentChildren.length === 0) {
    if (detail.excerpt) contentChildren.push(tParagraph([tText(detail.excerpt)]))
    else return { ok: false, reason: 'Nema tekstualnog sadržaja (prazan content)' }
  }

  // 2) Media flow → layout blocks (video + images), in source order.
  const layout: any[] = []
  let videos = 0
  let mediaBlocks = 0
  for (const node of detail.nodes) {
    if (node.kind === 'video') {
      if (!node.url) return { ok: false, reason: 'Video blok bez URL-a' }
      layout.push({ blockType: 'video', platform: 'youtube', autoplay: false, url: node.url })
      videos++
    } else if (node.kind === 'image') {
      const id = await resolveMedia(node.image)
      if (id != null) {
        layout.push({ blockType: 'mediaBlock', media: id })
        mediaBlocks++
      }
    }
  }

  // 3) Featured image (skippable — not fatal).
  const featuredId = detail.featuredImage ? await resolveMedia(detail.featuredImage) : null

  // 4) Category guard — never create without it.
  const categories = [categoryId]
  if (!categories.includes(categoryId)) return { ok: false, reason: 'Dodela kategorije nije uspela' }

  const data: any = {
    title: detail.title,
    slug: detail.slug,
    _status: 'published',
    publishedOn: new Date().toISOString(),
    excerpt: detail.excerpt,
    ...(featuredId != null ? { featuredImage: featuredId } : {}),
    categories,
    content: tRoot(contentChildren),
    ...(layout.length ? { layout } : {}),
    meta: {
      title: detail.meta.title,
      description: detail.meta.description,
      ...(featuredId != null ? { image: featuredId } : {}),
    },
  }

  return { ok: true, data, stats: { paragraphs, headings, lists, videos, mediaBlocks, links } }
}

// ─── Payload helpers ───────────────────────────────────────────────────────────

async function findCategory(payload: any): Promise<{ id: number | string } | null> {
  const found = await payload.find({ collection: CATEGORY_COLLECTION, where: { slug: { equals: PROJECTS_CATEGORY_SLUG } }, limit: 1 })
  return found.docs[0] ? { id: found.docs[0].id } : null
}

async function ensureCategory(payload: any): Promise<number | string> {
  const existing = await findCategory(payload)
  if (existing) {
    console.log(`✓ Kategorija "${PROJECTS_CATEGORY_SLUG}" postoji (id: ${existing.id})`)
    return existing.id
  }
  if (DRY_RUN) {
    console.log(`[dry-run] kreirao bih kategoriju "${PROJECTS_CATEGORY_SLUG}"`)
    return 'DRY_RUN_CATEGORY_ID'
  }
  const created = await payload.create({ collection: CATEGORY_COLLECTION, data: { title: PROJECTS_CATEGORY_TITLE, slug: PROJECTS_CATEGORY_SLUG } })
  console.log(`+ Kreirana kategorija "${PROJECTS_CATEGORY_SLUG}" (id: ${created.id})`)
  return created.id
}

/** Real-run media uploader (dedupes by filename). */
function makeUploader(payload: any): MediaResolver {
  return async (image: ImageRef) => {
    if (SKIP_IMAGES) return null
    const filename = image.url.split('/').pop()?.split('?')[0]
    if (filename) {
      const ex = await payload.find({ collection: MEDIA_COLLECTION, where: { filename: { equals: filename } }, limit: 1 })
      if (ex.docs[0]) return ex.docs[0].id
    }
    const file = await downloadImage(image.url)
    if (!file) {
      console.warn(`    ⚠ ne mogu da preuzmem sliku: ${image.url}`)
      return null
    }
    try {
      const m = await payload.create({ collection: MEDIA_COLLECTION, data: { alt: image.alt || filename || 'Projekat' }, file })
      return m.id
    } catch (err) {
      console.warn(`    ⚠ upload nije uspeo (${filename}): ${errMessage(err)}`)
      return null
    }
  }
}

/** Dry-run media resolver — returns a readable placeholder instead of uploading. */
const dryRunResolver: MediaResolver = async (image) =>
  `<MEDIA: ${image.url.split('/').pop()?.split('?')[0]}>`

/** Extract a real, full error message (incl. Payload field-level validation errors). */
function errMessage(err: any): string {
  if (!err) return 'Unknown error'
  const parts: string[] = []
  if (err.name) parts.push(err.name)
  if (err.message) parts.push(err.message)
  // Payload ValidationError carries field-level details in `.data` / `.errors`.
  const details = err.data?.errors ?? err.errors ?? err.data
  if (Array.isArray(details)) {
    for (const d of details) parts.push(`[${d.path ?? d.field ?? '?'}] ${d.message ?? JSON.stringify(d)}`)
  } else if (details && typeof details === 'object') {
    parts.push(JSON.stringify(details))
  }
  return parts.join(' | ') || String(err)
}

// ─── Cleanup: delete ONLY scraper projects from gotovi-projekti ───────────────

async function runCleanup(payload: any) {
  console.log('🧹 CLEANUP — brišem samo scraper projekte iz kategorije "gotovi-projekti"')
  const category = await findCategory(payload)
  if (!category) {
    console.log(`   Kategorija "${PROJECTS_CATEGORY_SLUG}" ne postoji — nema šta da se briše.`)
    process.exit(0)
  }

  // Authoritative set of scraper-owned slugs = current live listing slugs.
  console.log('   Čitam listing da utvrdim koje slugove je scraper kreirao...')
  const scrapedSlugs = new Set((await crawlListing()).map((c) => c.slug))
  console.log(`   Scraper-owned slugova: ${scrapedSlugs.size}`)

  // Posts currently in the category.
  const inCategory = await payload.find({
    collection: POSTS_COLLECTION,
    where: { 'categories.slug': { equals: PROJECTS_CATEGORY_SLUG } },
    limit: 1000,
    depth: 0,
    select: { slug: true },
  })

  const toDelete = inCategory.docs.filter((d: any) => scrapedSlugs.has(d.slug))
  const protectedDocs = inCategory.docs.filter((d: any) => !scrapedSlugs.has(d.slug))
  console.log(`   U kategoriji ukupno: ${inCategory.docs.length} | za brisanje (scraper): ${toDelete.length} | zaštićeno (ručno/placeholder): ${protectedDocs.length}`)
  if (protectedDocs.length) console.log(`   Zaštićeni slugovi: ${protectedDocs.map((d: any) => d.slug).join(', ')}`)

  let deleted = 0
  for (const doc of toDelete) {
    if (DRY_RUN) {
      console.log(`   [dry-run] obrisao bih: ${doc.slug}`)
      continue
    }
    try {
      await payload.delete({ collection: POSTS_COLLECTION, id: doc.id })
      deleted++
      console.log(`   ✓ obrisan: ${doc.slug}`)
    } catch (err) {
      console.error(`   ✗ brisanje ${doc.slug}: ${errMessage(err)}`)
    }
  }
  console.log(`\n✅ Cleanup gotov. Obrisano: ${DRY_RUN ? toDelete.length + ' (dry-run)' : deleted}. Mediji/kategorije/ostali postovi netaknuti.`)
  process.exit(0)
}

// ─── DRY_RUN preview printer ──────────────────────────────────────────────────

function printPreview(detail: ProjectDetail, build: BuildResult, index: number) {
  console.log(`\n┌─ PREVIEW [${index + 1}] ${detail.slug} ${'─'.repeat(Math.max(0, 40 - detail.slug.length))}`)
  console.log(`│ source: ${detail.url}`)
  if (!build.ok) {
    console.log(`│ ❌ NE BI SE KREIRAO — razlog: ${build.reason}`)
    console.log('└' + '─'.repeat(60))
    return
  }
  console.log(
    `│ mapping → paragrafa:${build.stats.paragraphs} naslova:${build.stats.headings} lista:${build.stats.lists} ` +
      `videa:${build.stats.videos} media-blokova:${build.stats.mediaBlocks} inline-linkova:${build.stats.links}`,
  )
  if (detail.linkRewrites.length) {
    console.log('│ link rewrites:')
    for (const r of detail.linkRewrites) console.log(`│   ${r.from}  →  ${r.to}`)
  }
  console.log('│ ── PAYLOAD (posts) ──')
  console.log(
    indentBlock(
      JSON.stringify(
        { title: build.data.title, slug: build.data.slug, _status: build.data._status, categories: build.data.categories, excerpt: build.data.excerpt, featuredImage: build.data.featuredImage, content: build.data.content, layout: build.data.layout ?? [], meta: build.data.meta },
        null,
        2,
      ),
    ),
  )
  console.log('└' + '─'.repeat(60))
}

const indentBlock = (s: string) => s.split('\n').map((l) => '│ ' + l).join('\n')

// ─── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Inicijalizacija Payload-a...')
  const payload = await getPayload({ config })

  if (CLEANUP) return runCleanup(payload)

  const categoryId = await ensureCategory(payload)

  // Phase 1 — crawl listings.
  console.log(`\n📑 Faza 1: čitam listing — ${LISTING}`)
  let cards = await crawlListing()
  if (LIMIT) {
    cards = cards.slice(0, LIMIT)
    console.log(`   ⚙ SCRAPE_LIMIT=${LIMIT} → ${cards.length} projekata`)
  }
  console.log(`\n✓ ${cards.length} jedinstvenih projekata.`)

  // Phase 2 — fetch + parse detail pages.
  console.log(`\n🔍 Faza 2: čitam pojedinačne stranice (concurrency ${CONCURRENCY})...`)
  let parsed = 0
  const tasks = cards.map((card) => async (): Promise<ProjectDetail | null> => {
    try {
      const detail = parseDetail(await fetchHtml(card.url), card.url, card)
      parsed++
      console.log(`   [${parsed}/${cards.length}] ${detail.slug} — ${detail.nodes.length} čvorova`)
      return detail
    } catch (err) {
      console.warn(`   ⚠ ${card.url}: ${errMessage(err)}`)
      return null
    }
  })
  const details = (await runConcurrent(tasks, CONCURRENCY)).filter(Boolean) as ProjectDetail[]

  // ── DRY RUN — build, validate, preview first N, report would-fail ──────────
  if (DRY_RUN) {
    console.log(`\n🧪 DRY RUN — gradim i validiram payload-e (ništa se ne upisuje).`)
    let okCount = 0
    const failures: { url: string; reason: string }[] = []
    for (let i = 0; i < details.length; i++) {
      const build = await buildPayload(details[i], categoryId, dryRunResolver)
      if (build.ok) okCount++
      else failures.push({ url: details[i].url, reason: build.reason })
      if (i < PREVIEW_COUNT) printPreview(details[i], build, i)
    }
    console.log(`\n──────── DRY RUN SUMMARY ────────`)
    console.log(`Projekata parsirano:  ${details.length}`)
    console.log(`Validno za upis:      ${okCount}`)
    console.log(`Ne bi se kreiralo:    ${failures.length}`)
    for (const f of failures) console.log(`   ✗ ${f.url} → ${f.reason}`)
    console.log(`(Prikazano prvih ${Math.min(PREVIEW_COUNT, details.length)} payload-a iznad.)`)
    process.exit(0)
  }

  // ── REAL RUN — upsert with category guard + real error messages ────────────
  console.log(`\n💾 Faza 3: upis u "${POSTS_COLLECTION}" (kategorija ${PROJECTS_CATEGORY_SLUG} = ${categoryId})...`)
  const uploader = makeUploader(payload)
  let created = 0,
    skipped = 0,
    failed = 0
  const createdSlugs: string[] = []
  const failures: { url: string; reason: string }[] = []

  for (const detail of details) {
    const existing = await payload.find({ collection: POSTS_COLLECTION, where: { slug: { equals: detail.slug } }, limit: 1 })
    if (existing.docs[0]) {
      if (!RESEED) {
        skipped++
        console.log(`  · skip (postoji): ${detail.slug}`)
        continue
      }
      try {
        await payload.delete({ collection: POSTS_COLLECTION, id: existing.docs[0].id })
        console.log(`  ↻ obrisan postojeći: ${detail.slug}`)
      } catch (err) {
        failed++
        failures.push({ url: detail.url, reason: `delete pre RESEED: ${errMessage(err)}` })
        continue
      }
    }

    // Validate + build BEFORE creating.
    const build = await buildPayload(detail, categoryId, uploader)
    if (!build.ok) {
      failed++
      failures.push({ url: detail.url, reason: build.reason })
      console.error(`  ✗ ${detail.slug}: SKIP (${build.reason})`)
      continue
    }
    // Hard category guard — never create without gotovi-projekti.
    if (!Array.isArray(build.data.categories) || !build.data.categories.includes(categoryId)) {
      failed++
      failures.push({ url: detail.url, reason: 'Kategorija nije dodeljena — preskočeno' })
      console.error(`  ✗ ${detail.slug}: nema kategoriju — SKIP`)
      continue
    }

    try {
      await payload.create({ collection: POSTS_COLLECTION, data: build.data })
      created++
      createdSlugs.push(detail.slug)
      console.log(`  ✓ ${detail.slug} (p:${build.stats.paragraphs} h:${build.stats.headings} video:${build.stats.videos} media:${build.stats.mediaBlocks} link:${build.stats.links})`)
    } catch (err) {
      failed++
      const reason = errMessage(err)
      failures.push({ url: detail.url, reason })
      console.error(`  ✗ ${detail.slug}: ${reason}`)
    }
  }

  // ── Category assignment verification ───────────────────────────────────────
  const assigned = await payload.count({
    collection: POSTS_COLLECTION,
    where: { 'categories.slug': { equals: PROJECTS_CATEGORY_SLUG }, slug: { in: createdSlugs.length ? createdSlugs : ['__none__'] } },
  })
  const assignedCount = assigned.totalDocs
  const missing = created - assignedCount

  console.log('\n════════════════ REPORT ════════════════')
  console.log(`Category:\n${PROJECTS_CATEGORY_SLUG}\n`)
  console.log(`Projects imported:\n${created}\n`)
  console.log(`Projects assigned to category:\n${assignedCount}\n`)
  console.log(`Projects missing category:\n${missing}`)
  console.log('─────────────────────────────────────────')
  console.log(`Skipped (već postoje): ${skipped}`)
  console.log(`Failed: ${failed}`)
  if (failures.length) {
    console.log('\nFAILURES (URL → razlog):')
    for (const f of failures) console.log(`  ✗ ${f.url}\n      ${f.reason}`)
  }
  console.log('═════════════════════════════════════════')

  const importFailed = missing !== 0
  if (importFailed) console.error('❌ IMPORT FAILED — neki projekat je kreiran bez kategorije gotovi-projekti.')
  process.exit(importFailed || failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal:', errMessage(err))
  process.exit(1)
})
