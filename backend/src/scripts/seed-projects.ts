/**
 * Seeds showcase projects (posts in "gotovi-projekti" category).
 *
 * NON-DESTRUCTIVE & IDEMPOTENT: skips projects whose slug already exists.
 * Reuses EXISTING product imagery (no new media) — pulls gallery images from
 * products in the relevant product-category so each project looks real.
 *
 * Usage:  pnpm seed:projects
 */

import config from '@payload-config'
import { getPayload } from 'payload'

const txt = (text: string) => ({ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 })
const p = (text: string) => ({ type: 'paragraph', children: [txt(text)], direction: 'ltr', format: '', indent: 0, textFormat: 0, version: 1 })
const h = (text: string, tag: 'h2' | 'h3' = 'h2') => ({ type: 'heading', tag, children: [txt(text)], direction: 'ltr', format: '', indent: 0, version: 1 })
const root = (...c: any[]) => ({ root: { type: 'root', children: c, direction: 'ltr', format: '', indent: 0, version: 1 } })

type ProjectDef = {
  title: string
  slug: string
  excerpt: string
  productCategory: string // slug of product category to source imagery + describe
  body: string[]
  highlights: string[]
}

const PROJECTS: ProjectDef[] = [
  {
    title: 'Aluminijumska klizna kapija i ograda — Dedinje',
    slug: 'aluminijumska-klizna-kapija-i-ograda-dedinje',
    excerpt: 'Kompletno rešenje za stambeni objekat: aluminijumska klizna kapija sa automatizacijom i usklađena ograda u antracit RAL7016.',
    productCategory: 'aluminijumske-ograde',
    body: [
      'Za stambeni objekat na Dedinju projektovali smo i montirali aluminijumsku kliznu kapiju sa automatizacijom, usklađenu sa ogradom u istom dizajnu i boji.',
      'Aluminijum je izabran zbog premium izgleda i nultog održavanja — ograda i kapija zadržavaju izgled godinama bez farbanja.',
    ],
    highlights: ['Klizna kapija sa automatizacijom', 'Aluminijum bez korozije', 'Antracit siva RAL7016', 'Daljinsko upravljanje'],
  },
  {
    title: 'Panelna ograda za sportski teren — Novi Sad',
    slug: 'panelna-ograda-za-sportski-teren-novi-sad',
    excerpt: 'Visoka 3D panelna ograda za fudbalski teren — čvrsta, ekonomična i brzo montirana na velikoj dužini.',
    productCategory: '3d-panelne-ograde',
    body: [
      'Za sportski teren u Novom Sadu postavili smo visoku 3D panelnu ogradu koja zaustavlja loptu i obezbeđuje teren, uz brzu montažu velike dužine.',
      'Izabrana je debljina žice 5 mm radi maksimalne čvrstoće i otpornosti na udarce.',
    ],
    highlights: ['3D paneli, žica 5 mm', 'Visina 2030 mm', 'Brza montaža velike dužine', 'Zelena RAL6005'],
  },
  {
    title: 'Industrijska 2D panelna ograda — Beograd',
    slug: 'industrijska-2d-panelna-ograda-beograd',
    excerpt: 'DOUBLEFENCE 2D ograda visoke sigurnosti za industrijski kompleks, sa kontrolom pristupa na ulazu.',
    productCategory: '2d-panelne-ograde',
    body: [
      'Industrijski kompleks u Beogradu obezbeđen je DOUBLEFENCE 2D ogradom sa duplom horizontalnom žicom, koja pruža visok stepen zaštite.',
      'Na glavnom ulazu integrisana je kontrola pristupa vozila i ljudi.',
    ],
    highlights: ['2D ograda 8/6/8 mm', 'Visoka sigurnost', 'Kontrola pristupa na ulazu', 'INOX spojnice'],
  },
  {
    title: 'Samonosiva kapija na nagibu — Avala',
    slug: 'samonosiva-kapija-na-nagibu-avala',
    excerpt: 'Samonosiva klizna kapija bez šine u tlu, idealno rešenje za prilaz u nagibu i neravnu podlogu.',
    productCategory: 'samonosive-kapije',
    body: [
      'Prilaz objektu na Avali bio je u nagibu, pa klasična klizna kapija sa šinom nije bila moguća. Rešenje je samonosiva kapija koja „lebdi“ na konzoli i radi besprekorno na neravnoj podlozi.',
      'Kapija je automatizovana i radi pouzdano u svim vremenskim uslovima, bez blokade snegom ili nečistoćom.',
    ],
    highlights: ['Bez šine u tlu', 'Za nagib i neravan teren', 'Automatizacija', 'Rad u svim uslovima'],
  },
  {
    title: 'Dvokrilna kapija sa pešačkim ulazom — Zemun',
    slug: 'dvokrilna-kapija-sa-pesackim-ulazom-zemun',
    excerpt: 'Klasična dvokrilna kapija sa usklađenom pešačkom kapijom i elektro-bravom za porodičnu kuću.',
    productCategory: 'dvokrilne-kapije',
    body: [
      'Za porodičnu kuću u Zemunu izradili smo dvokrilnu kapiju sa zasebnim pešačkim ulazom, u jedinstvenom dizajnu i boji.',
      'Pešačka kapija opremljena je elektro-bravom sa interfonom radi kontrole pristupa.',
    ],
    highlights: ['Dvokrilna + pešačka kapija', 'Elektro-brava i interfon', 'Jedinstven dizajn', 'Hidraulična automatizacija'],
  },
  {
    title: '3D panelna ograda za stambeni objekat — Kragujevac',
    slug: '3d-panelna-ograda-stambeni-objekat-kragujevac',
    excerpt: 'EUROFENCE 3D ograda sa PVC trakama za potpunu privatnost dvorišta porodične kuće.',
    productCategory: '3d-panelne-ograde',
    body: [
      'Porodična kuća u Kragujevcu dobila je EUROFENCE 3D ogradu sa ubačenim PVC trakama, čime je dvorište dobilo punu privatnost uz zadržanu čvrstoću panela.',
      'Standardna antracit siva RAL7016 uklopila se sa fasadom i stolarijom objekta.',
    ],
    highlights: ['3D paneli sa PVC trakama', 'Puna privatnost dvorišta', 'Antracit RAL7016', 'Usadni stubovi'],
  },
]

async function main() {
  console.log('🚀 Initializing Payload...')
  const payload = await getPayload({ config })

  // gotovi-projekti category
  const catRes = await payload.find({ collection: 'post-categories', where: { slug: { equals: 'gotovi-projekti' } }, limit: 1 })
  const projectsCat = catRes.docs[0]
  if (!projectsCat) { console.error('❌ Kategorija "gotovi-projekti" ne postoji. Pokreni glavni seed prvo.'); process.exit(1) }
  console.log(`✓ gotovi-projekti = ${projectsCat.id}`)

  const RESEED = process.env.RESEED === 'true'

  // Helper: collect gallery image IDs from a set of products
  const collectImages = (docs: any[], into: number[]) => {
    for (const prod of docs) {
      for (const g of prod.gallery ?? []) {
        const id = typeof g.image === 'object' ? g.image?.id : g.image
        if (id && !into.includes(id)) into.push(id)
      }
    }
  }

  let created = 0, skipped = 0, fallbackOffset = 0

  for (const def of PROJECTS) {
    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: def.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      if (RESEED) {
        await payload.delete({ collection: 'posts', id: existing.docs[0].id })
        console.log(`  ↻ obrisan postojeći: ${def.slug}`)
      } else {
        skipped++; console.log(`  · skip (postoji): ${def.slug}`); continue
      }
    }

    // 1) Try imagery from the relevant product category
    const prodRes = await payload.find({
      collection: 'products',
      where: { 'categories.slug': { equals: def.productCategory }, _status: { equals: 'published' } },
      limit: 3,
      depth: 1,
    })
    const galleryImageIds: number[] = []
    collectImages(prodRes.docs as any[], galleryImageIds)

    // 2) Fallback: any published products with a gallery (rotated so projects differ)
    if (galleryImageIds.length === 0) {
      const anyRes = await payload.find({
        collection: 'products',
        where: { _status: { equals: 'published' } },
        sort: 'title',
        limit: 3,
        page: (fallbackOffset % 8) + 1,
        depth: 1,
      })
      fallbackOffset++
      collectImages(anyRes.docs as any[], galleryImageIds)
    }

    const featuredImage = galleryImageIds[0] ?? null
    const layoutImages  = galleryImageIds.slice(0, 6)

    if (!featuredImage) { console.warn(`  ⚠ nema slika za ${def.productCategory} → ${def.slug} (kreiram bez slike)`) }

    // Build layout: highlights as a content block + a media gallery
    const layout: any[] = [
      {
        blockType: 'content',
        columns: [{
          size: 'full',
          richText: root(
            h('Detalji projekta', 'h3'),
            ...def.highlights.map((hl) => p(`• ${hl}`)),
          ),
        }],
      },
      ...layoutImages.slice(1).map((imgId) => ({ blockType: 'mediaBlock', media: imgId, position: 'default' })),
    ]

    try {
      await payload.create({
        collection: 'posts',
        data: {
          title: def.title,
          slug: def.slug,
          _status: 'published',
          publishedOn: new Date().toISOString(),
          excerpt: def.excerpt,
          ...(featuredImage ? { featuredImage } : {}),
          categories: [projectsCat.id],
          content: root(...def.body.map((b) => p(b))) as any,
          layout: layout as any,
          meta: {
            title: `${def.title} | Gotovi projekti`,
            description: def.excerpt.slice(0, 160),
            ...(featuredImage ? { image: featuredImage } : {}),
          },
        } as any,
      })
      created++
      console.log(`  ✓ ${def.slug} (slika: ${featuredImage ? 'DA' : 'NE'}, galerija: ${layoutImages.length})`)
    } catch (err) {
      console.error(`  ✗ ${def.slug}:`, err)
    }
  }

  console.log(`\n✅ Projekti: kreirano ${created}, preskočeno ${skipped}`)
  process.exit(0)
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1) })
