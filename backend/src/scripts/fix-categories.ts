/**
 * Align CMS categories with palisada.rs: remove categories that don't exist there
 * and repoint the Header/Footer nav dropdowns to the real palisada.rs subcategories.
 *
 * Extra categories (NOT on palisada.rs, 0 products): pesacke-kapije, 2d-panelne-ograde,
 * 3d-panelne-ograde, aluminijumske-ograde.
 *
 * Palisada.rs taxonomy:
 *   Kapije → jednokrilne, dvokrilne, klizne, samonosive
 *   Ograde → dekorativne-ograde, panelne-ograde
 *
 * Usage: pnpm fix:categories   (DRY_RUN=true to preview)
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const DRY_RUN = process.env.DRY_RUN === 'true'
const EXTRA_SLUGS = ['pesacke-kapije', '2d-panelne-ograde', '3d-panelne-ograde', 'aluminijumske-ograde']

// Nested, singular paths matching palisada.rs: /kategorija/<parent>/<child>.
const navlink = (label: string, url: string) => ({
  link: { type: 'custom', appearance: 'default', label, url, newTab: false },
})
const sub = (label: string, parentSlug: string, slug: string) =>
  navlink(label, `/kategorija/${parentSlug}/${slug}`)

const KAPIJE_SUB = [
  sub('Jednokrilne kapije', 'kapije', 'jednokrilne-kapije'),
  sub('Dvokrilne kapije', 'kapije', 'dvokrilne-kapije'),
  sub('Klizne kapije', 'kapije', 'klizne-kapije'),
  sub('Samonosive kapije', 'kapije', 'samonosive-kapije'),
]
const OGRADE_SUB = [
  sub('Dekorativne ograde', 'ograde', 'dekorativne-ograde'),
  sub('Panelne ograde', 'ograde', 'panelne-ograde'),
]

function fixNav(navItems: any[]): { items: any[]; changed: boolean } {
  let changed = false
  const items = (navItems ?? []).map((item) => {
    const label = item?.link?.label
    if (label === 'Kapije') {
      changed = true
      return { ...item, link: { ...item.link, url: '/kategorija/kapije' }, subItems: KAPIJE_SUB }
    }
    if (label === 'Ograde') {
      changed = true
      return { ...item, link: { ...item.link, url: '/kategorija/ograde' }, subItems: OGRADE_SUB }
    }
    return item
  })
  return { items, changed }
}

const run = async () => {
  const payload = await getPayload({ config })

  // 1) Delete extra categories (guard: only if 0 products).
  for (const slug of EXTRA_SLUGS) {
    const found = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    const cat = found.docs[0]
    if (!cat) { console.log(`  – ${slug}: ne postoji (preskačem)`); continue }
    const prods = await payload.find({ collection: 'products', where: { 'categories.slug': { equals: slug } }, limit: 0, depth: 0 })
    if ((prods.totalDocs ?? 0) > 0) { console.warn(`  ⚠ ${slug}: ima ${prods.totalDocs} proizvoda — NE brišem`); continue }
    if (DRY_RUN) { console.log(`  [dry] obrisao bih kategoriju ${slug} (id ${cat.id})`); continue }
    await payload.delete({ collection: 'categories', id: cat.id })
    console.log(`  ✓ obrisana kategorija ${slug} (id ${cat.id})`)
  }

  // 2) Header nav: single "Proizvodi" item (code renders a mega-menu with ALL top
  //    categories). Replaces the manual Kapije/Ograde dropdowns.
  const HEADER_NAV = [
    { link: { type: 'custom', appearance: 'default', label: 'Naslovna', url: '/', newTab: false }, subItems: [] },
    { link: { type: 'custom', appearance: 'default', label: 'Proizvodi', url: '/proizvodi', newTab: false }, subItems: [] },
    { link: { type: 'custom', appearance: 'default', label: 'O nama', url: '/o-nama', newTab: false }, subItems: [] },
    { link: { type: 'custom', appearance: 'default', label: 'Saveti', url: '/saveti', newTab: false }, subItems: [] },
    { link: { type: 'custom', appearance: 'default', label: 'Projekti', url: '/projekti', newTab: false }, subItems: [] },
    { link: { type: 'custom', appearance: 'default', label: 'Kontakt', url: '/kontakt', newTab: false }, subItems: [] },
  ]
  if (DRY_RUN) console.log('  [dry] postavio bih header nav (Proizvodi mega-meni)')
  else {
    await payload.updateGlobal({ slug: 'header', data: { navItems: HEADER_NAV } as any })
    console.log('  ✓ header nav postavljen (Naslovna · Proizvodi · O nama · Saveti · Projekti · Kontakt)')
  }

  // 3) Fix Footer "Kapije"/"Ograde" link columns (footerColumn blocks in `sections`).
  const footer = await payload.findGlobal({ slug: 'footer' })
  const sections = footer?.sections ?? []
  let secChanged = false
  const newSections = sections.map((s: any) => {
    if (s?.blockType !== 'footerColumn') return s
    if (s.title === 'Kapije') {
      secChanged = true
      return { ...s, links: [...KAPIJE_SUB, navlink('Sve kapije →', '/kategorija/kapije')] }
    }
    if (s.title === 'Ograde') {
      secChanged = true
      return { ...s, links: [...OGRADE_SUB, navlink('Sve ograde →', '/kategorija/ograde')] }
    }
    return s
  })
  if (!secChanged) console.log('  – footer: nema Kapije/Ograde kolone (preskačem)')
  else if (DRY_RUN) console.log('  [dry] ažurirao bih footer kolone')
  else {
    await payload.updateGlobal({ slug: 'footer', data: { sections: newSections } as any })
    console.log('  ✓ footer kolone (Kapije/Ograde) ažurirane')
  }

  // 4) Fix any `/kategorije/...` links embedded in page docs (hero links, CTA blocks…).
  const deepFix = (val: any): { val: any; changed: boolean } => {
    let changed = false
    if (typeof val === 'string') {
      if (val.includes('/kategorije/')) { changed = true; return { val: val.replace(/\/kategorije\//g, '/kategorija/'), changed } }
      return { val, changed }
    }
    if (Array.isArray(val)) {
      const out = val.map((v) => { const r = deepFix(v); if (r.changed) changed = true; return r.val })
      return { val: out, changed }
    }
    if (val && typeof val === 'object') {
      const out: any = {}
      for (const [k, v] of Object.entries(val)) { const r = deepFix(v); if (r.changed) changed = true; out[k] = r.val }
      return { val: out, changed }
    }
    return { val, changed }
  }

  const pages = await payload.find({ collection: 'pages', limit: 200, depth: 0 })
  for (const p of pages.docs) {
    const { val, changed } = deepFix(p)
    if (!changed) continue
    if (DRY_RUN) { console.log(`  [dry] sredio bih linkove na stranici "${p.slug}"`); continue }
    const { id, createdAt, updatedAt, ...data } = val
    await payload.update({ collection: 'pages', id: p.id, data, context: { disableRevalidate: true } as any })
    console.log(`  ✓ stranica "${p.slug}" — linkovi /kategorije/ → /kategorija/`)
  }

  console.log('\nGotovo.')
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
