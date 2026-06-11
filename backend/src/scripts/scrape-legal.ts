/**
 * Scrape the legal pages from palisada.rs → CMS `pages`, and link them in the footer.
 *   - /pravila-o-kolacicima/  → "Pravila o kolačićima"
 *   - /politika-privatnosti/  → "Politika privatnosti"
 *
 * Renders via the generic /[slug] route (PageHero + Content block, readable prose).
 * Adds both to footer.bottomBar.legalLinks.
 *
 * Usage: pnpm scrape:legal   (DRY_RUN=true to preview)
 */

import config from '@payload-config'
import { JSDOM } from 'jsdom'
import { getPayload } from 'payload'

const SITE = 'https://palisada.rs'
const DRY_RUN = process.env.DRY_RUN === 'true'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'

const PAGES = [
  { slug: 'pravila-o-kolacicima', fallbackTitle: 'Pravila o kolačićima' },
  { slug: 'politika-privatnosti', fallbackTitle: 'Politika privatnosti' },
]

const collapse = (t: string) => (t ?? '').replace(/\s+/g, ' ').trim()
const sharedDoc = new JSDOM('<!doctype html><body></body>').window.document
const decode = (s: string) => { const e = sharedDoc.createElement('textarea'); e.innerHTML = s ?? ''; return e.value }

// ─── Lexical builders ─────────────────────────────────────────────────────────
const BOLD = 1, ITALIC = 2
const tText = (text: string, format = 0): any => ({ type: 'text', detail: 0, format, mode: 'normal', style: '', text, version: 1 })
const tLink = (text: string, url: string): any => ({ type: 'link', fields: { linkType: 'custom', newTab: !url.startsWith('/') && !url.includes('palisad'), url }, children: [tText(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const tParagraph = (children: any[]): any => ({ type: 'paragraph', children: children.length ? children : [tText('')], direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })
const tHeading = (text: string, tag: 'h2' | 'h3'): any => ({ type: 'heading', tag, children: [tText(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const tList = (items: any[][], ordered: boolean): any => ({ type: 'list', listType: ordered ? 'number' : 'bullet', start: 1, tag: ordered ? 'ol' : 'ul', children: items.map((c, i) => ({ type: 'listitem', value: i + 1, children: c.length ? c : [tText('')], direction: 'ltr', format: '', indent: 0, version: 1 })), direction: 'ltr', format: '', indent: 0, version: 1 })
const tRoot = (children: any[]): any => ({ root: { type: 'root', children: children.length ? children : [tParagraph([tText('')])], direction: 'ltr', format: '', indent: 0, version: 1 } })

// The source corrupted English URLs (w→v, x→k find/replace). Restore real ones,
// and rewrite our own domain to internal relative links.
function fixUrl(u: string): string {
  let s = u
    .replace('/ansver/', '/answer/')
    .replace('firefok', 'firefox')
    .replace('ekplorer', 'explorer')
    .replace('hov-to', 'how-to')
    .replace('vebsites', 'websites')
    .replace('vebsite', 'website')
  // palisada.rs (incl. www) → interni relativni link
  s = s.replace(/^https?:\/\/(www\.)?palisada\.rs/i, '')
  if (s === '') s = '/'
  return s
}

// Which policy is the current page (avoid self-linking its own name in the body).
let SELF_POLICY = ''
const COOKIE_PATH = '/pravila-o-kolacicima'
const PRIVACY_PATH = '/politika-privatnosti'

// Turn bare emails / phone numbers / URLs inside a text run into clickable links.
function autolink(text: string, fmt: number): any[] {
  const re = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(https?:\/\/[^\s<>()]+)|(\+\d[\d\s().\-/]{7,}\d)|(pravila o kola[čc]i[ćc]ima|politik[aue] kola[čc]i[ćc]a)|(pravila o privatnosti|politik[aue] privatnosti)/giu
  const out: any[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(tText(text.slice(last, m.index), fmt))
    const [full, email, url, phone, cookie, privacy] = m
    if (email) {
      out.push(tLink(email, `mailto:${email}`))
    } else if (url) {
      const trail = (url.match(/[.,;:)]+$/) || [''])[0]
      const fixed = fixUrl(url.slice(0, url.length - trail.length))
      out.push(tLink(fixed, fixed))
      if (trail) out.push(tText(trail, fmt))
    } else if (phone) {
      const digits = phone.replace(/[^\d+]/g, '')
      if (digits.replace('+', '').length >= 8) out.push(tLink(collapse(phone), `tel:${digits}`))
      else out.push(tText(full, fmt))
    } else if (cookie) {
      // "Politika/Pravila o kolačićima" → internal cookie page (unless we're on it)
      if (SELF_POLICY === 'cookie') out.push(tText(full, fmt))
      else out.push(tLink(full, COOKIE_PATH))
    } else if (privacy) {
      if (SELF_POLICY === 'privacy') out.push(tText(full, fmt))
      else out.push(tLink(full, PRIVACY_PATH))
    }
    last = m.index + full.length
  }
  if (last < text.length) out.push(tText(text.slice(last), fmt))
  return out.length ? out : [tText(text, fmt)]
}

function inlineNodes(el: Element): any[] {
  const out: any[] = []
  const walk = (node: ChildNode, fmt: number) => {
    if (node.nodeType === 3) { const t = node.textContent ?? ''; if (t.trim()) out.push(...autolink(decode(t).replace(/\s+/g, ' '), fmt)); return }
    if (node.nodeType !== 1) return
    const e = node as Element
    const tag = e.tagName.toLowerCase()
    if (tag === 'a') { const href = fixUrl(e.getAttribute('href') || '#'); const text = collapse(e.textContent ?? ''); if (text) out.push(tLink(text, href)); return }
    if (tag === 'br') return
    const nf = tag === 'strong' || tag === 'b' ? fmt | BOLD : tag === 'em' || tag === 'i' ? fmt | ITALIC : fmt
    e.childNodes.forEach((c) => walk(c, nf))
  }
  el.childNodes.forEach((c) => walk(c, 0))
  return out
}

function parseLegal(htmlStr: string, title: string, slug: string): { nodes: any[]; description: string; updated: string } {
  SELF_POLICY = slug === 'pravila-o-kolacicima' ? 'cookie' : slug === 'politika-privatnosti' ? 'privacy' : ''
  const body = new JSDOM(`<body>${htmlStr}</body>`).window.document.body
  body.querySelectorAll('style, script, .cky-banner-element').forEach((e) => e.remove())
  const nodes: any[] = []
  let description = ''
  let updated = ''

  const captureMeta = (plain: string) => {
    const m = plain.match(/(?:poslednji put a[žz]urirano|datum stupanja na snagu)[^.\d]*([\d]{1,2}\.?\s*\p{L}+\s*\d{4}|\d{1,2}\.\s*\w+\s*\d{4})/iu)
    if (m && !updated) updated = collapse(m[0])
  }

  const handle = (el: Element) => {
    const tag = el.tagName.toLowerCase()
    const plain = collapse(el.textContent ?? '')
    if (!plain && tag !== 'ul' && tag !== 'ol') return

    if (tag === 'h1' || tag === 'h2') {
      if (plain.toLowerCase() === title.toLowerCase()) return // skip duplicate page title
      nodes.push(tHeading(plain, 'h2'))
    } else if (tag === 'h3' || tag === 'h4') {
      nodes.push(tHeading(plain, 'h3'))
    } else if (tag === 'p') {
      if (/poslednji put|datum stupanja/i.test(plain)) { captureMeta(plain); return } // moves to hero
      const strong = el.querySelector('strong, b')
      const fullyBold = strong && collapse(strong.textContent ?? '') === plain
      if (fullyBold && plain.length < 90) { nodes.push(tHeading(plain.replace(/:$/, ''), 'h3')); return }
      if (plain.toLowerCase() === title.toLowerCase()) return
      nodes.push(tParagraph(inlineNodes(el)))
      if (!description && plain.length > 40) description = plain
    } else if (tag === 'ul' || tag === 'ol') {
      const lis = Array.from(el.children).filter((c) => c.tagName.toLowerCase() === 'li')
      // "Section-like" lists (each item = bold heading + paragraph) → render as h3 + paragraphs.
      const sectionLike = lis.some(
        (li) => li.querySelector('p') || (li.querySelector('strong, b') && collapse(li.textContent ?? '').length > 110),
      )
      if (sectionLike) {
        lis.forEach((li, idx) => {
          const strong = li.querySelector('strong, b')
          const label = strong ? collapse(strong.textContent ?? '').replace(/:$/, '') : ''
          if (label) nodes.push(tHeading(`${tag === 'ol' ? `${idx + 1}. ` : ''}${label}`, 'h3'))
          const ps = Array.from(li.querySelectorAll(':scope > p'))
          if (ps.length) {
            ps.forEach((p) => { if (collapse(p.textContent ?? '')) nodes.push(tParagraph(inlineNodes(p as Element))) })
          } else {
            // No nested <p>: take the li text without the strong label.
            const clone = li.cloneNode(true) as Element
            clone.querySelector('strong, b')?.remove()
            const rest = inlineNodes(clone)
            if (rest.some((n) => (n.text ?? '').trim() || n.type === 'link')) nodes.push(tParagraph(rest))
          }
        })
      } else {
        const items = lis.map((li) => inlineNodes(li)).filter((c) => c.length)
        if (items.length) nodes.push(tList(items, tag === 'ol'))
      }
    } else {
      Array.from(el.children).forEach(handle)
    }
  }
  Array.from(body.children).forEach(handle)
  return { nodes, description: description.slice(0, 160), updated }
}

const contentBlock = (nodes: any[]) => ({ blockType: 'content', columns: [{ size: 'full', richText: tRoot(nodes) }] })

// ─── Main ───────────────────────────────────────────────────────────────────

const run = async () => {
  const payload = await getPayload({ config })
  const legalLinks: any[] = []

  for (const { slug, fallbackTitle } of PAGES) {
    const res = await fetch(`${SITE}/wp-json/wp/v2/pages?slug=${slug}&_fields=slug,title,content`, { headers: { 'User-Agent': UA } })
    const arr = await res.json()
    const src = Array.isArray(arr) ? arr[0] : null
    if (!src) { console.warn(`  ⚠ ${slug}: nije nađeno na izvoru`); continue }
    const title = decode(src.title.rendered) || fallbackTitle
    const { nodes, description, updated } = parseLegal(src.content.rendered, title, slug)
    console.log(`  ▸ ${slug} — "${title}" (${nodes.length} blokova)${updated ? ` [${updated}]` : ''}`)

    legalLinks.push({ link: { type: 'custom', appearance: 'default', label: title, url: `/${slug}`, newTab: false } })

    if (DRY_RUN) {
      nodes.slice(0, 8).forEach((n) => console.log(`     ${n.type}${n.tag ? `(${n.tag})` : ''}: ${(n.children?.[0]?.text || n.children?.[0]?.children?.[0]?.text || '').slice(0, 70)}`))
      continue
    }

    // Light hero: H1 title + "Poslednji put ažurirano" line.
    const heroChildren = [tHeading(title, 'h1')]
    if (updated) heroChildren.push(tParagraph([tText(updated)]))

    const data: any = {
      slug,
      title,
      _status: 'published',
      hero: { type: 'lowImpact', richText: tRoot(heroChildren) },
      layout: [contentBlock(nodes)],
      meta: { title: `${title} | Palisade`, description: description || `${title} — Palisade d.o.o.` },
    }

    const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    if (existing.docs[0]) {
      await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
      console.log(`    ✓ ažurirana stranica /${slug}`)
    } else {
      await payload.create({ collection: 'pages', data })
      console.log(`    ✓ kreirana stranica /${slug}`)
    }
  }

  // Footer legal links (bottom bar)
  if (!DRY_RUN && legalLinks.length) {
    const footer = await payload.findGlobal({ slug: 'footer' })
    await payload.updateGlobal({
      slug: 'footer',
      data: { bottomBar: { ...(footer?.bottomBar ?? {}), legalLinks } } as any,
    })
    console.log(`  ✓ footer legalLinks postavljeni (${legalLinks.length})`)
  }

  console.log('\nGotovo.')
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
