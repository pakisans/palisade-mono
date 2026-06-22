/**
 * Scrape ALL advice posts (saveti) from palisada.rs via the WordPress REST API
 * and (re)create them in Payload under post-category `saveti`.
 *
 * "Replace all": deletes existing posts in the `saveti` category, then creates
 * the full set from palisada.rs (category 261, 17 posts). Touches ONLY saveti.
 *
 * Usage:
 *   DRY_RUN=true pnpm scrape:saveti-palisada   # print structure, write/delete nothing
 *   pnpm scrape:saveti-palisada                # replace all saveti
 *
 * Env: SKIP_IMAGES, DELAY_MS (default 400)
 */

import config from '@payload-config'
import { JSDOM } from 'jsdom'
import type { File } from 'payload'
import { getPayload } from 'payload'

const SITE = 'https://palisada.rs'
const SOURCE_CAT = 261 // WP category id for "Novosti i saveti" on palisada.rs
const ADVICE_SLUG = 'saveti'
const POSTS = 'posts' as const
const POST_CATEGORIES = 'post-categories' as const
const MEDIA = 'media' as const

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120 Safari/537.36'

const DELAY_MS = Number(process.env.DELAY_MS ?? 400)
const SKIP_IMAGES = process.env.SKIP_IMAGES === 'true'
const DRY_RUN = process.env.DRY_RUN === 'true'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const collapse = (t: string) => (t ?? '').replace(/\s+/g, ' ').trim()

// Shared DOM for entity decoding.
const sharedDoc = new JSDOM('<!doctype html><body></body>').window.document
function decode(s: string): string {
  const el = sharedDoc.createElement('textarea')
  el.innerHTML = s ?? ''
  return el.value
}
function stripTags(htmlStr: string): string {
  return collapse(decode((htmlStr ?? '').replace(/<[^>]+>/g, ' ')))
}
function trimExcerpt(s: string, max = 220): string {
  const t = collapse(s).replace(/\[…\]|\[\.\.\.\]/g, '…')
  return t.length > max ? `${t.slice(0, max).replace(/\s+\S*$/, '')}…` : t
}

type ImageRef = { url: string; alt: string }

// ─── Fetch + media ──────────────────────────────────────────────────────────

let lastReq = 0
async function fetchJson(url: string): Promise<any> {
  const wait = DELAY_MS - (Date.now() - lastReq)
  if (wait > 0) await sleep(wait)
  const res = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  })
  lastReq = Date.now()
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  return res.json()
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
    const mime: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml',
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
        collection: MEDIA,
        where: { filename: { equals: filename } },
        limit: 1,
      })
      if (ex.docs[0]) return ex.docs[0].id
    }
    const file = await downloadImage(image.url)
    if (!file) return null
    try {
      const m = await payload.create({
        collection: MEDIA,
        data: { alt: image.alt || filename || 'Saveti' },
        file,
      })
      return m.id
    } catch (err: any) {
      console.warn(`    ⚠ upload nije uspeo (${filename}): ${err?.message ?? err}`)
      return null
    }
  }
}

// ─── Lexical builders (copied from scrape-saveti.ts) ────────────────────────────

const tText = (text: string, format = 0): any => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})
const tLink = (text: string, url: string, newTab: boolean): any => ({
  type: 'link',
  fields: { linkType: 'custom', newTab, url },
  children: [tText(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tParagraph = (children: any[]): any => ({
  type: 'paragraph',
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})
const tHeading = (text: string, tag: 'h2' | 'h3'): any => ({
  type: 'heading',
  tag,
  children: [tText(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const tList = (items: any[][], ordered: boolean): any => ({
  type: 'list',
  listType: ordered ? 'number' : 'bullet',
  start: 1,
  tag: ordered ? 'ol' : 'ul',
  children: items.map((inlines, i) => ({
    type: 'listitem',
    value: i + 1,
    children: inlines.length ? inlines : [tText('')],
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
const tRoot = (children: any[]): any => ({
  root: {
    type: 'root',
    children: children.length ? children : [tParagraph([tText('')])],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

// ─── Content parsing (WP content.rendered → lexical + image blocks) ─────────────

const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2

// Convert inline children of a block element into lexical inline nodes.
function inlineNodes(el: Element): any[] {
  const out: any[] = []
  const walk = (node: ChildNode, fmt: number) => {
    if (node.nodeType === 3) {
      const text = node.textContent ?? ''
      if (text) out.push(tText(decode(text).replace(/\s+/g, ' '), fmt))
      return
    }
    if (node.nodeType !== 1) return
    const e = node as Element
    const tag = e.tagName.toLowerCase()
    if (tag === 'a') {
      const href = e.getAttribute('href') || '#'
      const text = collapse(e.textContent ?? '')
      if (text) out.push(tLink(text, href, /^https?:/.test(href) && !href.includes('palisada.rs')))
      return
    }
    if (tag === 'br') return
    const nextFmt =
      tag === 'strong' || tag === 'b'
        ? fmt | FORMAT_BOLD
        : tag === 'em' || tag === 'i'
          ? fmt | FORMAT_ITALIC
          : fmt
    e.childNodes.forEach((c) => walk(c, nextFmt))
  }
  el.childNodes.forEach((c) => walk(c, 0))
  // merge/trim empties
  return out.filter((n) => n.type !== 'text' || n.text.trim() !== '' || out.length === 1)
}

type Parsed = { content: any[]; images: ImageRef[]; firstText: string }

function parseContent(htmlStr: string, title: string): Parsed {
  const doc = new JSDOM(`<body>${htmlStr}</body>`).window.document.body
  const content: any[] = []
  const images: ImageRef[] = []
  let firstText = ''
  let h1seen = false

  const pushImg = (img: Element) => {
    const src = img.getAttribute('src') || ''
    if (src && /^https?:/.test(src))
      images.push({ url: src, alt: img.getAttribute('alt') || title })
  }

  const handle = (el: Element) => {
    const tag = el.tagName.toLowerCase()
    if (tag === 'h1') {
      if (!h1seen) {
        h1seen = true
        return
      } // first h1 == post title (skip)
      content.push(tHeading(collapse(el.textContent ?? ''), 'h2'))
    } else if (tag === 'h2') {
      const t = collapse(el.textContent ?? '')
      if (t) content.push(tHeading(t, 'h2'))
    } else if (tag === 'h3' || tag === 'h4') {
      const t = collapse(el.textContent ?? '')
      if (t) content.push(tHeading(t, 'h3'))
    } else if (tag === 'p') {
      const imgs = el.querySelectorAll('img')
      if (imgs.length) imgs.forEach(pushImg)
      const nodes = inlineNodes(el)
      const plain = collapse(el.textContent ?? '')
      if (plain) {
        content.push(tParagraph(nodes))
        if (!firstText) firstText = plain
      }
    } else if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(el.children)
        .filter((c) => c.tagName.toLowerCase() === 'li')
        .map((li) => inlineNodes(li))
      if (items.length) content.push(tList(items, tag === 'ol'))
    } else if (tag === 'blockquote') {
      const t = collapse(el.textContent ?? '')
      if (t) content.push(tParagraph([tText(t, FORMAT_ITALIC)]))
    } else if (tag === 'figure') {
      el.querySelectorAll('img').forEach(pushImg)
    } else if (tag === 'img') {
      pushImg(el)
    } else {
      // unknown wrapper → descend
      Array.from(el.children).forEach(handle)
    }
  }

  Array.from(doc.children).forEach(handle)
  return { content, images, firstText }
}

// ─── Main ───────────────────────────────────────────────────────────────────

const run = async () => {
  const payload = await getPayload({ config })
  const upload = makeUploader(payload)

  // Resolve saveti category.
  const cat = await payload.find({
    collection: POST_CATEGORIES,
    where: { slug: { equals: ADVICE_SLUG } },
    limit: 1,
  })
  const catId = cat.docs[0]?.id
  if (!catId) {
    console.error(`Post-kategorija "${ADVICE_SLUG}" ne postoji.`)
    process.exit(1)
  }

  // Fetch all source posts.
  const fields = 'id,slug,title,excerpt,content,date,featured_media'
  const posts: any[] = await fetchJson(
    `${SITE}/wp-json/wp/v2/posts?categories=${SOURCE_CAT}&per_page=100&orderby=date&order=asc&_fields=${fields}`,
  )
  console.log(`Izvor: ${posts.length} postova (kategorija ${SOURCE_CAT}).`)

  if (DRY_RUN) {
    for (const p of posts) {
      const parsed = parseContent(p.content.rendered, decode(p.title.rendered))
      const h = parsed.content.filter((n) => n.type === 'heading').length
      const li = parsed.content.filter((n) => n.type === 'list').length
      const pr = parsed.content.filter((n) => n.type === 'paragraph').length
      console.log(
        `  • ${p.slug}  [p:${pr} h:${h} ul:${li} img:${parsed.images.length}${p.featured_media ? '+1fm' : ''}]  ${decode(p.title.rendered).slice(0, 60)}`,
      )
    }
    console.log('\n[DRY_RUN] ništa nije obrisano/upisano.')
    process.exit(0)
  }

  // Replace all: delete existing saveti posts.
  const existing = await payload.find({
    collection: POSTS,
    where: { 'categories.slug': { equals: ADVICE_SLUG } },
    limit: 200,
    depth: 0,
  })
  console.log(`Brišem postojećih saveta: ${existing.docs.length}`)
  for (const doc of existing.docs) {
    await payload.delete({ collection: POSTS, id: doc.id })
  }

  // Featured media URL cache.
  const mediaUrl = async (id: number): Promise<ImageRef | null> => {
    if (!id) return null
    try {
      const m = await fetchJson(`${SITE}/wp-json/wp/v2/media/${id}?_fields=source_url,alt_text`)
      return m?.source_url ? { url: m.source_url, alt: m.alt_text || 'Saveti' } : null
    } catch {
      return null
    }
  }

  // Slugs are unique across the whole `posts` collection — if a savet slug
  // collides with an existing post (e.g. a project), suffix it with "-savet".
  const uniqueSlug = async (base: string): Promise<string> => {
    let s = base
    let n = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const f = await payload.find({
        collection: POSTS,
        where: { slug: { equals: s } },
        limit: 1,
        depth: 0,
      })
      if (!f.docs[0]) return s
      n++
      s = n === 1 ? `${base}-savet` : `${base}-savet-${n}`
    }
  }

  let created = 0
  let failed = 0
  for (const p of posts) {
    const title = decode(p.title.rendered)
    const parsed = parseContent(p.content.rendered, title)
    const excerpt = trimExcerpt(stripTags(p.excerpt?.rendered) || parsed.firstText)
    const slug = await uniqueSlug(p.slug)

    // featured image
    const fm = await mediaUrl(p.featured_media)
    const featuredId = fm ? await upload(fm) : null

    // inline images → layout media blocks
    const layout: any[] = []
    for (const img of parsed.images) {
      const id = await upload(img)
      if (id != null) layout.push({ blockType: 'mediaBlock', media: id, position: 'normal' })
    }

    if (parsed.content.length === 0 && excerpt) parsed.content.push(tParagraph([tText(excerpt)]))

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
            title: `${title} | Palisada`,
            description: excerpt.slice(0, 160),
            ...(featuredId != null ? { image: featuredId } : {}),
          },
        } as any,
      })
      created++
      const note = slug !== p.slug ? ` (slug→${slug})` : ''
      console.log(
        `  ✓ ${p.slug}${note} (${parsed.content.length} blokova, img:${parsed.images.length}${featuredId ? '+fm' : ''})`,
      )
    } catch (err: any) {
      failed++
      console.warn(`  ✗ ${p.slug}: ${err?.message ?? err}`)
    }
  }

  console.log(
    `\nGotovo. Kreirano saveta: ${created}/${posts.length}${failed ? ` (neuspešno: ${failed})` : ''}`,
  )
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
