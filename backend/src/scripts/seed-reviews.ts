/**
 * Populate the homepage review/testimonial block with the real reviews from
 * kapije-ograde.rs, downloading the company logos (Frikom, Roda) into Media and
 * attaching them as the quote avatar. Updates the LIVE `home` page (seed already
 * carries the 4 reviews for fresh installs).
 *
 * Usage: pnpm seed:reviews
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36'
const MEDIA = 'media'

const REVIEWS: Array<{ text: string; author: string; role: string; rating: string; logo?: string }> = [
  {
    text: 'Palisada nam je postavila panelnu ogradu oko celog magacinskog kompleksa na Zrenjaninskom putu. Sve je završeno u dogovorenom roku, a kvalitet materijala i ugradnje je izuzetan. Kapija sa automatikom radi besprekorno. Preporučujem svima koji traže pouzdanu firmu za ograde u Beogradu.',
    author: 'Marko Petrović',
    role: 'Direktor logistike',
    rating: '5',
    logo: 'https://kapije-ograde.rs/wp-content/uploads/2026/02/Frikom.webp',
  },
  {
    text: 'Tražili smo ogradu i kapiju za porodičnu kuću na Dedinju. Palisada je došla na merenje, predložila dizajn koji se savršeno uklapa u fasadu i isporučila sve u roku od tri nedelje. Odlična komunikacija i fer cena za kapije i ograde ovog kvaliteta.',
    author: 'Jelena Stanković',
    role: 'Vlasnica kuće, Beograd',
    rating: '5',
  },
  {
    text: 'Kao firma, sarađujemo sa Palisadom na više projekata godišnje. Panelne ograde i ulazne kapije uvek stignu na vreme, kvalitet je konstantan. Posebno cenimo što nude kompletnu uslugu – od merenja do montaže ograda i kapija na lokaciji.',
    author: 'Dragan Jovanović',
    role: 'Direktor firme',
    rating: '5',
    logo: 'https://kapije-ograde.rs/wp-content/uploads/2026/02/Roda_Market_logo_2015-.svg.webp',
  },
  {
    text: 'Angažovali smo Palisadu za ograđivanje školskog dvorišta u Novom Beogradu. Ceo proces je bio profesionalan – od ponude do montaže. Ograda je čvrsta, bezbedna i izgleda moderno. Deca i roditelji su oduševljeni. Palisada je definitivno najbolji izbor za ograde u Beogradu.',
    author: 'Ana Nikolić',
    role: 'Direktorka škole, Novi Beograd',
    rating: '5',
  },
]

const run = async () => {
  const payload = await getPayload({ config })

  const uploadLogo = async (url: string): Promise<number | string | null> => {
    const filename = url.split('/').pop()?.split('?')[0]
    if (filename) {
      const ex = await payload.find({ collection: MEDIA, where: { filename: { equals: filename } }, limit: 1 })
      if (ex.docs[0]) return ex.docs[0].id
    }
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) })
      if (!res.ok) return null
      const data = Buffer.from(await res.arrayBuffer())
      const ext = (filename?.split('.').pop() ?? 'webp').toLowerCase()
      const mime: Record<string, string> = { webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml' }
      const m = await payload.create({
        collection: MEDIA,
        data: { alt: 'Logo klijenta' },
        file: { name: filename || `logo.${ext}`, data, mimetype: mime[ext] ?? 'image/webp', size: data.byteLength },
      })
      return m.id
    } catch (err: any) {
      console.warn(`  ⚠ logo upload nije uspeo (${url}): ${err?.message ?? err}`)
      return null
    }
  }

  // Build the 4 quote blocks (with avatars where a logo exists).
  const quoteBlocks: any[] = []
  for (const r of REVIEWS) {
    const avatar = r.logo ? await uploadLogo(r.logo) : null
    quoteBlocks.push({ blockType: 'quote', text: r.text, author: r.author, role: r.role, rating: r.rating, ...(avatar != null ? { avatar } : {}) })
    console.log(`  • ${r.author}${avatar != null ? ' (+logo)' : ''}`)
  }

  const home = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, limit: 1, depth: 0 })
  const page = home.docs[0]
  if (!page) { console.error('Home stranica nije nađena.'); process.exit(1) }

  const layout: any[] = Array.isArray((page as any).layout) ? (page as any).layout : []
  // Insert the 4 new quotes where the first quote was; drop all old quotes; keep the rest in order.
  const newLayout: any[] = []
  let inserted = false
  for (const b of layout) {
    if (b.blockType === 'quote') {
      if (!inserted) { newLayout.push(...quoteBlocks); inserted = true }
      continue
    }
    newLayout.push(b)
  }
  if (!inserted) newLayout.push(...quoteBlocks)

  await payload.update({ collection: 'pages', id: page.id, data: { layout: newLayout } as any })
  console.log(`\n✓ Home ažuriran — ${quoteBlocks.length} recenzija.`)
  process.exit(0)
}

run().catch((err) => { console.error(err); process.exit(1) })
