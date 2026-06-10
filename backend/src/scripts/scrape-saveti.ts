/**
 * Scrape & seed advice posts from kapije-ograde.rs/saveti/ → Payload CMS.
 *
 * Keeps this flow separate from gotovi-projekti:
 *   - crawls only the /saveti/ listing and posts linked from that listing
 *   - every created post is assigned to post-category `saveti`
 *   - never creates a post if the category cannot be resolved
 *   - dedupes by post slug
 *
 * Usage:
 *   DRY_RUN=true pnpm scrape:saveti
 *   pnpm scrape:saveti
 *
 * Env flags:
 *   SCRAPE_LIMIT, DELAY_MS (default 500), CONCURRENCY (default 2),
 *   SKIP_IMAGES, RESEED, DRY_RUN
 */

import config from '@payload-config'
import { JSDOM } from 'jsdom'
import type { File } from 'payload'
import { getPayload } from 'payload'

const SITE = 'https://kapije-ograde.rs'
const LISTING = `${SITE}/saveti/`
const INTERNAL_HOSTS = ['kapije-ograde.rs', 'palisada.rs']
const CATEGORY_SLUGS = new Set([
  'pesacke-kapije',
  'dvokrilne-kapije',
  'klizne-kapije',
  'samonosive-kapije',
  '3d-panelne-ograde',
  '2d-panelne-ograde',
  'aluminijumske-ograde',
])
const ADVICE_CATEGORY_SLUG = 'saveti'
const ADVICE_CATEGORY_TITLE = 'Saveti'

const POSTS_COLLECTION = 'posts' as const
const CATEGORY_COLLECTION = 'post-categories' as const
const MEDIA_COLLECTION = 'media' as const

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120 Safari/537.36'

const DELAY_MS = Number(process.env.DELAY_MS ?? 500)
const CONCURRENCY = Number(process.env.CONCURRENCY ?? 2)
const LIMIT = process.env.SCRAPE_LIMIT ? Number(process.env.SCRAPE_LIMIT) : undefined
const SKIP_IMAGES = process.env.SKIP_IMAGES === 'true'
const RESEED = process.env.RESEED === 'true'
const DRY_RUN = process.env.DRY_RUN === 'true'
const PREVIEW_COUNT = 3

type ImageRef = { url: string; alt: string; width?: number; height?: number }

type AdviceCard = {
  title: string
  url: string
  slug: string
  excerpt: string
  image: ImageRef | null
}

type Inline =
  | { kind: 'text'; text: string; format: number }
  | { kind: 'link'; text: string; url: string; newTab: boolean }

type ContentNode =
  | { kind: 'heading'; tag: 'h2' | 'h3'; text: string }
  | { kind: 'paragraph'; inlines: Inline[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'video'; videoId: string; url: string }
  | { kind: 'image'; image: ImageRef }

type AdviceDetail = {
  title: string
  slug: string
  url: string
  excerpt: string
  nodes: ContentNode[]
  featuredImage: ImageRef | null
  meta: { title: string; description: string; ogImage: string | null }
  linkRewrites: { from: string; to: string }[]
}

type MediaResolver = (image: ImageRef) => Promise<number | string | null>

type BuildResult =
  | {
      ok: true
      data: any
      stats: {
        paragraphs: number
        headings: number
        lists: number
        videos: number
        mediaBlocks: number
        links: number
      }
    }
  | { ok: false; reason: string }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const collapse = (text: string): string => (text ?? '').replace(/\s+/g, ' ').trim()
const denoise = (text: string): string => text.replace(/🔗/g, '').replace(/\s+/g, ' ').trim()
const denoiseInlineText = (text: string): string => text.replace(/🔗/g, '').replace(/\s+/g, ' ')
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

const stripWpSizeSuffix = (url: string): string =>
  url.replace(/-\d+x\d+(\.[a-z]{2,5})(\?.*)?$/i, '$1')

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
  return stripWpSizeSuffix(best)
}

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

function rewriteHref(href: string): { url: string; newTab: boolean } | null {
  const raw = (href ?? '').trim()
  if (!raw || raw.startsWith('#')) return null
  if (raw.startsWith('mailto:') || raw.startsWith('tel:')) return { url: raw, newTab: false }

  let url: URL
  try {
    url = new URL(raw, SITE)
  } catch {
    return null
  }

  const internal = INTERNAL_HOSTS.some((h) => url.host === h || url.host.endsWith(`.${h}`))
  if (!internal) return { url: url.toString(), newTab: true }

  let path = url.pathname
  if (path === '/saveti/' || path === '/saveti') path = '/saveti'
  else if (/^\/(product-category|kategorija|kategorije)\//.test(path)) {
    const seg = path
      .replace(/\/page\/\d+\/?$/, '/')
      .replace(/\/+$/, '')
      .split('/')
      .filter(Boolean)
      .pop()
    path = `/kategorije/${seg}`
  } else {
    const seg = path.replace(/\/+$/, '').split('/').filter(Boolean).pop()
    if (seg && CATEGORY_SLUGS.has(seg)) path = `/kategorije/${seg}`
    else path = path.replace(/^\/proizvod\//, '/proizvodi/')
  }

  return { url: path.replace(/\/+$/, '') + (url.search || ''), newTab: false }
}

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
    const res = await fetch(url, {
      signal: AbortSignal.timeout(30_000),
      headers: { 'User-Agent': UA },
    })
    if (!res.ok) return null
    const data = await res.arrayBuffer()
    const clean = url.split('?')[0]
    const ext = (clean.split('.').pop() ?? 'jpg').toLowerCase()
    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
    }
    const name = clean.split('/').pop() || `img-${Date.now()}.${ext}`
    return {
      name,
      data: Buffer.from(data),
      mimetype: mimeMap[ext] ?? 'image/jpeg',
      size: data.byteLength,
    }
  } catch {
    return null
  }
}

function parseListing(html: string): AdviceCard[] {
  const doc = new JSDOM(html).window.document
  const cards: AdviceCard[] = []

  for (const article of doc.querySelectorAll('article.bde-loop-item, article.ee-post')) {
    const link = article.querySelector(
      'a.bde-loop-item__title-link, a.bde-loop-item__image-link, a[href]',
    )
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

    if (title && url) cards.push({ title, url, slug: slugFromUrl(url), excerpt, image })
  }

  return cards
}

async function crawlListing(): Promise<AdviceCard[]> {
  const html = await fetchHtml(LISTING)
  const bySlug = new Map<string, AdviceCard>()
  for (const card of parseListing(html)) {
    if (!bySlug.has(card.slug)) bySlug.set(card.slug, card)
  }
  console.log(`   • /saveti/: ${bySlug.size} kartica`)
  return Array.from(bySlug.values())
}

const metaContent = (doc: Document, key: string): string => {
  for (const meta of Array.from(doc.querySelectorAll('meta'))) {
    if (meta.getAttribute('property') === key || meta.getAttribute('name') === key) {
      return meta.getAttribute('content')?.trim() ?? ''
    }
  }
  return ''
}

function parseInlines(el: Element, rewrites: { from: string; to: string }[]): Inline[] {
  const raw: Inline[] = []

  const walk = (node: Node, format: number) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        const collapsed = (child.textContent ?? '').replace(/\s+/g, ' ')
        if (collapsed.trim() || collapsed === ' ') {
          raw.push({
            kind: 'text',
            text: denoiseInlineText(collapsed) || ' ',
            format: collapsed.trim() ? format : 0,
          })
        }
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
        continue
      }
      if (tag === 'BR') continue

      const nextFormat =
        format | (tag === 'STRONG' || tag === 'B' ? 1 : 0) | (tag === 'EM' || tag === 'I' ? 2 : 0)
      walk(e, nextFormat)
    }
  }

  walk(el, 0)

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
  while (
    merged.length &&
    merged[merged.length - 1].kind === 'text' &&
    !merged[merged.length - 1].text.trim()
  ) {
    merged.pop()
  }
  return merged
}

function inlinesPlainText(inlines: Inline[]): string {
  return collapse(inlines.map((i) => i.text).join(''))
}

function parseDetail(html: string, url: string, card?: AdviceCard): AdviceDetail {
  const doc = new JSDOM(html).window.document
  const title = collapse(card?.title || doc.querySelector('h1')?.textContent || '')
  const slug = slugFromUrl(url)
  const metaTitle = collapse(
    metaContent(doc, 'og:title') || doc.querySelector('title')?.textContent || title,
  )
  const metaDescription = collapse(
    metaContent(doc, 'description') || metaContent(doc, 'og:description'),
  )
  const ogImage = metaContent(doc, 'og:image') || null
  const ogImageAlt = metaContent(doc, 'og:image:alt')

  const container =
    doc.querySelector('.bde-rich-text-19-115, .bde-rich-text.breakdance-rich-text-styles') ??
    doc.querySelector('main .bde-rich-text') ??
    null

  const rewrites: { from: string; to: string }[] = []
  const nodes: ContentNode[] = []
  const seenText = new Set<string>()

  if (container) {
    const selectables = container.querySelectorAll('p,h2,h3,ul,ol,iframe,lite-youtube,img')
    for (const el of Array.from(selectables)) {
      const tag = el.tagName

      if (tag === 'IFRAME' || tag === 'LITE-YOUTUBE') {
        const src =
          el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('videoid') || ''
        const id = tag === 'LITE-YOUTUBE' ? src : youtubeId(src)
        if (id)
          nodes.push({ kind: 'video', videoId: id, url: `https://www.youtube.com/watch?v=${id}` })
        continue
      }

      if (tag === 'IMG') {
        const src = el.getAttribute('src') ?? ''
        if (!/wp-content\/uploads/.test(src)) continue
        nodes.push({
          kind: 'image',
          image: {
            url: bestFromSrcset(el.getAttribute('srcset'), src),
            alt: el.getAttribute('alt') || title,
          },
        })
        continue
      }

      if (tag === 'H2' || tag === 'H3') {
        const text = denoise(el.textContent ?? '')
        if (text && !seenText.has(text)) {
          seenText.add(text)
          nodes.push({ kind: 'heading', tag: tag === 'H3' ? 'h3' : 'h2', text })
        }
        continue
      }

      if (tag === 'UL' || tag === 'OL') {
        const items: string[] = []
        for (const li of Array.from(el.querySelectorAll('li'))) {
          const t = denoise(li.textContent ?? '')
          if (t && !seenText.has(t)) {
            seenText.add(t)
            items.push(t)
          }
        }
        if (items.length) nodes.push({ kind: 'list', items })
        continue
      }

      const plain = denoise(el.textContent ?? '')
      if (isNoiseParagraph(plain) || seenText.has(plain)) continue
      seenText.add(plain)

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
      ? { url: stripWpSizeSuffix(ogImage), alt: ogImageAlt || title }
      : null

  const firstPara = nodes.find((n) => n.kind === 'paragraph') as
    | Extract<ContentNode, { kind: 'paragraph' }>
    | undefined
  const excerpt = trimExcerpt(
    (
      card?.excerpt ||
      (firstPara ? inlinesPlainText(firstPara.inlines) : '') ||
      metaDescription
    ).replace(/&hellip;/g, '…'),
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

const tText = (text: string, format = 0) => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})
const tLink = (text: string, url: string, newTab: boolean) => ({
  type: 'link',
  fields: { linkType: 'custom', newTab, url },
  children: [tText(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tParagraph = (children: any[]) => ({
  type: 'paragraph',
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})
const tHeading = (text: string, tag: 'h2' | 'h3') => ({
  type: 'heading',
  tag,
  children: [tText(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tList = (items: string[]) => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, i) => ({
    type: 'listitem',
    value: i + 1,
    children: [tText(item)],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tRoot = (children: any[]) => ({
  root: {
    type: 'root',
    children: children.length ? children : [tParagraph([tText('')])],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})
const inlineToLexical = (inline: Inline) =>
  inline.kind === 'link'
    ? tLink(inline.text, inline.url, inline.newTab)
    : tText(inline.text, inline.format)

async function buildPayload(
  detail: AdviceDetail,
  categoryId: number | string,
  resolveMedia: MediaResolver,
): Promise<BuildResult> {
  if (!categoryId) return { ok: false, reason: 'Kategorija "saveti" nije razrešena' }

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

  if (contentChildren.length === 0) {
    if (detail.excerpt) contentChildren.push(tParagraph([tText(detail.excerpt)]))
    else return { ok: false, reason: 'Nema tekstualnog sadržaja (prazan content)' }
  }

  const layout: any[] = []
  let videos = 0
  let mediaBlocks = 0

  for (const node of detail.nodes) {
    if (node.kind === 'video') {
      layout.push({ blockType: 'video', platform: 'youtube', autoplay: false, url: node.url })
      videos++
    } else if (node.kind === 'image') {
      const id = await resolveMedia(node.image)
      if (id != null) {
        layout.push({ blockType: 'mediaBlock', media: id, position: 'normal' })
        mediaBlocks++
      }
    }
  }

  const featuredId = detail.featuredImage ? await resolveMedia(detail.featuredImage) : null
  const categories = [categoryId]
  if (!categories.includes(categoryId))
    return { ok: false, reason: 'Dodela kategorije nije uspela' }

  return {
    ok: true,
    data: {
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
    },
    stats: { paragraphs, headings, lists, videos, mediaBlocks, links },
  }
}

async function findCategory(payload: any): Promise<{ id: number | string } | null> {
  const found = await payload.find({
    collection: CATEGORY_COLLECTION,
    where: { slug: { equals: ADVICE_CATEGORY_SLUG } },
    limit: 1,
  })
  return found.docs[0] ? { id: found.docs[0].id } : null
}

async function ensureCategory(payload: any): Promise<number | string> {
  const existing = await findCategory(payload)
  if (existing) {
    console.log(`✓ Kategorija "${ADVICE_CATEGORY_SLUG}" postoji (id: ${existing.id})`)
    return existing.id
  }
  if (DRY_RUN) {
    console.log(`[dry-run] kreirao bih kategoriju "${ADVICE_CATEGORY_SLUG}"`)
    return 'DRY_RUN_CATEGORY_ID'
  }
  const created = await payload.create({
    collection: CATEGORY_COLLECTION,
    data: {
      title: ADVICE_CATEGORY_TITLE,
      slug: ADVICE_CATEGORY_SLUG,
      description:
        'Stručni saveti o ogradama, kapijama, materijalima, automatizaciji i RAL bojama.',
    },
  })
  console.log(`+ Kreirana kategorija "${ADVICE_CATEGORY_SLUG}" (id: ${created.id})`)
  return created.id
}

function makeUploader(payload: any): MediaResolver {
  return async (image: ImageRef) => {
    if (SKIP_IMAGES) return null
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
    if (!file) {
      console.warn(`    ⚠ ne mogu da preuzmem sliku: ${image.url}`)
      return null
    }
    try {
      const m = await payload.create({
        collection: MEDIA_COLLECTION,
        data: { alt: image.alt || filename || 'Saveti' },
        file,
      })
      return m.id
    } catch (err) {
      console.warn(`    ⚠ upload nije uspeo (${filename}): ${errMessage(err)}`)
      return null
    }
  }
}

const dryRunResolver: MediaResolver = async (image) =>
  `<MEDIA: ${image.url.split('/').pop()?.split('?')[0]}>`

function errMessage(err: any): string {
  if (!err) return 'Unknown error'
  const parts: string[] = []
  if (err.name) parts.push(err.name)
  if (err.message) parts.push(err.message)
  const details = err.data?.errors ?? err.errors ?? err.data
  if (Array.isArray(details)) {
    for (const d of details)
      parts.push(`[${d.path ?? d.field ?? '?'}] ${d.message ?? JSON.stringify(d)}`)
  } else if (details && typeof details === 'object') {
    parts.push(JSON.stringify(details))
  }
  return parts.join(' | ') || String(err)
}

function printPreview(detail: AdviceDetail, build: BuildResult, index: number) {
  console.log(
    `\n┌─ PREVIEW [${index + 1}] ${detail.slug} ${'─'.repeat(Math.max(0, 40 - detail.slug.length))}`,
  )
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
        {
          title: build.data.title,
          slug: build.data.slug,
          _status: build.data._status,
          categories: build.data.categories,
          excerpt: build.data.excerpt,
          featuredImage: build.data.featuredImage,
          contentBlocks: build.data.content.root.children.length,
          layout: build.data.layout ?? [],
          meta: build.data.meta,
        },
        null,
        2,
      ),
    ),
  )
  console.log('└' + '─'.repeat(60))
}

const indentBlock = (s: string) =>
  s
    .split('\n')
    .map((l) => '│ ' + l)
    .join('\n')

async function main() {
  console.log('🚀 Inicijalizacija Payload-a...')
  const payload = await getPayload({ config })
  const categoryId = await ensureCategory(payload)

  console.log(`\n📑 Faza 1: čitam listing — ${LISTING}`)
  let cards = await crawlListing()
  if (LIMIT) {
    cards = cards.slice(0, LIMIT)
    console.log(`   ⚙ SCRAPE_LIMIT=${LIMIT} → ${cards.length} saveta`)
  }
  console.log(`✓ Ukupno pronađeno saveta: ${cards.length}`)

  console.log(`\n🔍 Faza 2: čitam pojedinačne savete (concurrency ${CONCURRENCY})...`)
  let parsed = 0
  const fetchFailures: { url: string; reason: string }[] = []
  const tasks = cards.map((card) => async (): Promise<AdviceDetail | null> => {
    try {
      const detail = parseDetail(await fetchHtml(card.url), card.url, card)
      parsed++
      console.log(`   [${parsed}/${cards.length}] ${detail.slug} — ${detail.nodes.length} čvorova`)
      return detail
    } catch (err) {
      const reason = errMessage(err)
      fetchFailures.push({ url: card.url, reason })
      console.warn(`   ⚠ ${card.url}: ${reason}`)
      return null
    }
  })
  const details = (await runConcurrent(tasks, CONCURRENCY)).filter(Boolean) as AdviceDetail[]

  if (DRY_RUN) {
    console.log(`\n🧪 DRY RUN — gradim i validiram payload-e (ništa se ne upisuje).`)
    let okCount = 0
    const failures: { url: string; reason: string }[] = []
    let assignedToSaveti = 0
    let missingCategory = 0
    let missingFeaturedImage = 0
    let zeroContentBlocks = 0

    for (let i = 0; i < details.length; i++) {
      const build = await buildPayload(details[i], categoryId, dryRunResolver)
      if (build.ok) {
        okCount++
        if (Array.isArray(build.data.categories) && build.data.categories.includes(categoryId))
          assignedToSaveti++
        else missingCategory++
        if (!build.data.featuredImage) missingFeaturedImage++
        if (!build.data.content?.root?.children?.length) zeroContentBlocks++
      } else {
        failures.push({ url: details[i].url, reason: build.reason })
      }
      if (i < PREVIEW_COUNT) printPreview(details[i], build, i)
    }

    console.log(`\n──────── DRY RUN SUMMARY ────────`)
    console.log(`Total advice posts found:        ${cards.length}`)
    console.log(`Total created:                   0 (dry-run)`)
    console.log(`Total skipped:                   0 (dry-run)`)
    console.log(`Total errors:                    ${fetchFailures.length + failures.length}`)
    console.log(`Total assigned to "saveti":      ${assignedToSaveti}`)
    console.log(`Posts missing category:          ${missingCategory}`)
    console.log(`Posts missing featured image:    ${missingFeaturedImage}`)
    console.log(`Posts with zero content blocks:  ${zeroContentBlocks}`)
    console.log(`Validno za upis:                 ${okCount}`)
    if (fetchFailures.length || failures.length) {
      console.log('\nFAILED URLS (URL → real error):')
      for (const f of [...fetchFailures, ...failures])
        console.log(`  ✗ ${f.url}\n      ${f.reason}`)
    }
    console.log(`(Prikazano prvih ${Math.min(PREVIEW_COUNT, details.length)} payload-a iznad.)`)
    process.exit(
      fetchFailures.length + failures.length + missingCategory + zeroContentBlocks > 0 ? 1 : 0,
    )
  }

  console.log(
    `\n💾 Faza 3: upis u "${POSTS_COLLECTION}" (kategorija ${ADVICE_CATEGORY_SLUG} = ${categoryId})...`,
  )
  const uploader = makeUploader(payload)
  let created = 0
  let skipped = 0
  let failed = 0
  const createdSlugs: string[] = []
  const failures: { url: string; reason: string }[] = [...fetchFailures]
  let missingFeaturedImage = 0
  let zeroContentBlocks = 0

  for (const detail of details) {
    const existing = await payload.find({
      collection: POSTS_COLLECTION,
      where: { slug: { equals: detail.slug } },
      limit: 1,
    })
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

    const build = await buildPayload(detail, categoryId, uploader)
    if (!build.ok) {
      failed++
      failures.push({ url: detail.url, reason: build.reason })
      console.error(`  ✗ ${detail.slug}: SKIP (${build.reason})`)
      continue
    }

    if (!Array.isArray(build.data.categories) || !build.data.categories.includes(categoryId)) {
      failed++
      failures.push({ url: detail.url, reason: 'Kategorija saveti nije dodeljena — preskočeno' })
      console.error(`  ✗ ${detail.slug}: nema kategoriju — SKIP`)
      continue
    }

    if (!build.data.featuredImage) missingFeaturedImage++
    if (!build.data.content?.root?.children?.length) zeroContentBlocks++

    try {
      await payload.create({ collection: POSTS_COLLECTION, data: build.data })
      created++
      createdSlugs.push(detail.slug)
      console.log(
        `  ✓ ${detail.slug} (p:${build.stats.paragraphs} h:${build.stats.headings} video:${build.stats.videos} media:${build.stats.mediaBlocks} link:${build.stats.links})`,
      )
    } catch (err) {
      failed++
      const reason = errMessage(err)
      failures.push({ url: detail.url, reason })
      console.error(`  ✗ ${detail.slug}: ${reason}`)
    }
  }

  const assigned = await payload.count({
    collection: POSTS_COLLECTION,
    where: {
      'categories.slug': { equals: ADVICE_CATEGORY_SLUG },
      slug: { in: createdSlugs.length ? createdSlugs : ['__none__'] },
    },
  })
  const assignedCount = assigned.totalDocs
  const missingCategory = created - assignedCount

  console.log('\n════════════════ REPORT ════════════════')
  console.log(`Category:                         ${ADVICE_CATEGORY_SLUG}`)
  console.log(`Total advice posts found:          ${cards.length}`)
  console.log(`Total created:                     ${created}`)
  console.log(`Total skipped:                     ${skipped}`)
  console.log(`Total errors:                      ${failures.length}`)
  console.log(`Total assigned to "saveti":        ${assignedCount}`)
  console.log(`Posts missing category:            ${missingCategory}`)
  console.log(`Posts missing featured image:      ${missingFeaturedImage}`)
  console.log(`Posts with zero content blocks:    ${zeroContentBlocks}`)
  if (failures.length) {
    console.log('\nFAILED URLS (URL → real error):')
    for (const f of failures) console.log(`  ✗ ${f.url}\n      ${f.reason}`)
  }
  console.log('═════════════════════════════════════════')

  const importFailed =
    missingCategory !== 0 || zeroContentBlocks !== 0 || failed > 0 || fetchFailures.length > 0
  if (importFailed) console.error('❌ IMPORT FAILED — proveri report iznad.')
  process.exit(importFailed ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal:', errMessage(err))
  process.exit(1)
})
