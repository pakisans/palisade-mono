import type { CollectionSlug, File, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { aboutPageData } from './about'
import { createBlogPostsSeed } from './blog-posts'
import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'

// ─── Collections to wipe before seeding ───────────────────────────────────────

const collections: CollectionSlug[] = [
  'categories',
  'tags',
  'brands',
  'media',
  'pages',
  'posts',
  'post-categories',
  'products',
  'forms',
  'form-submissions',
  'variants',
  'variantOptions',
  'variantTypes',
  'carts',
  'transactions',
  'addresses',
  'orders',
]

const globals: GlobalSlug[] = ['header', 'footer']

// ─── Seed ─────────────────────────────────────────────────────────────────────

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info('— Seeding Palisade database...')

  // ——— 1. Clear globals ————————————————————————————————————————————————————————
  payload.logger.info('— Clearing globals...')
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data:
          global === 'footer'
            ? { navItems: [], sections: [], bottomBar: { copyright: '', legalLinks: [] } }
            : {
                navItems: [],
                topBar: [],
                promoBanner: {
                  enabled: false,
                  text: '',
                  link: { type: 'custom', url: '/', label: '-', newTab: false },
                },
              },
        depth: 0,
        context: { disableRevalidate: true },
      } as any),
    ),
  )

  // ——— 2. Clear collections ────────────────────────────────────────────────────
  payload.logger.info('— Clearing collections...')
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection]?.config?.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  // ——— 3. Upload placeholder images ────────────────────────────────────────────
  payload.logger.info('— Uploading placeholder images...')
  const [heroBuffer, postBuffer, productBuffer] = await Promise.all([
    fetchFileByURL('https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp'),
    fetchFileByURL('https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp').catch(async () =>
      fetchFileByURL('https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp'),
    ),
    fetchFileByURL('https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp'),
  ])

  const [heroImage, postImage, productImage] = await Promise.all([
    payload.create({ collection: 'media', data: { alt: 'Kapije i ograde — Palisade d.o.o.' }, file: heroBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Palisade saveti i vodiči' }, file: postBuffer }),
    payload.create({ collection: 'media', data: { alt: 'Palisade proizvod' }, file: productBuffer }),
  ])

  // ——— 4. Product categories (hierarchical) ────────────────────────────────────
  payload.logger.info('— Seeding product categories...')

  const [kapijeCat, ogradeCat] = await Promise.all([
    payload.create({
      collection: 'categories',
      data: {
        title: 'Kapije',
        slug: 'kapije',
        meta: {
          title: 'Kapije — pešačke, dvokrilne, klizne i samonosive | Palisade',
          description: 'Sve vrste kapija po meri — pešačke, dvokrilne, klizne i samonosive. Izrada i montaža u Beogradu i celoj Srbiji.',
        },
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Ograde',
        slug: 'ograde',
        meta: {
          title: 'Ograde — panelne i aluminijumske | Palisade',
          description: 'Panelne 2D/3D i aluminijumske ograde po meri. Dostupne u svim RAL bojama. Montaža u Beogradu i Srbiji.',
        },
      },
    }),
  ])

  const [
    pesackeKapijeCat, dvokrilneCat, klizneCat, samonosiveCat,
    panelne3dCat, panelne2dCat, aluminijumskeOgradeCat,
  ] = await Promise.all([
    payload.create({ collection: 'categories', data: { title: 'Pešačke kapije', slug: 'pesacke-kapije', parent: kapijeCat.id, meta: { title: 'Pešačke kapije po meri | Palisade', description: 'Elegantne pešačke kapije za dvorišta, poslovne i stambene objekte. Sve dimenzije, svi RAL. Besplatno merenje.' } } }),
    payload.create({ collection: 'categories', data: { title: 'Dvokrilne kapije', slug: 'dvokrilne-kapije', parent: kapijeCat.id, meta: { title: 'Dvokrilne kapije | Palisade', description: 'Dvokrilne kapije za dvorišta i poslovne objekte. Klasičan izgled, vrhunski materijali.' } } }),
    payload.create({ collection: 'categories', data: { title: 'Klizne kapije', slug: 'klizne-kapije', parent: kapijeCat.id, meta: { title: 'Klizne kapije sa automatizacijom | Palisade', description: 'Klizne kapije sa i bez automatizacije. Idealne za stambene objekte, garaže i industrijska dvorišta.' } } }),
    payload.create({ collection: 'categories', data: { title: 'Samonosive kapije', slug: 'samonosive-kapije', parent: kapijeCat.id, meta: { title: 'Samonosive kapije | Palisade', description: 'Samonosive kapije bez šine u tlu — idealne za neravne podloge. Montaža u celoj Srbiji.' } } }),
    payload.create({ collection: 'categories', data: { title: '3D Panelne ograde', slug: '3d-panelne-ograde', parent: ogradeCat.id, meta: { title: '3D Panelne ograde EUROFENCE | Palisade', description: 'Najprodavanija 3D panelna ograda za stambene i industrijske objekte. Dostupna u svim visinama i RAL bojama.' } } }),
    payload.create({ collection: 'categories', data: { title: '2D Panelne ograde', slug: '2d-panelne-ograde', parent: ogradeCat.id, meta: { title: '2D Panelne ograde DOUBLEFENCE | Palisade', description: 'Čvrste 2D panelne ograde za industrijske i poslovne objekte koji zahtevaju višu sigurnost.' } } }),
    payload.create({ collection: 'categories', data: { title: 'Aluminijumske ograde', slug: 'aluminijumske-ograde', parent: ogradeCat.id, meta: { title: 'Aluminijumske ograde po meri | Palisade', description: 'Premium aluminijumske ograde — bez korozije, nulto održavanje, dostupne u svim RAL bojama.' } } }),
  ])

  // ——— 5. Blog post categories ─────────────────────────────────────────────────
  payload.logger.info('— Seeding blog post categories...')

  const [savetiCat, vodiciCat, projektiCat] = await Promise.all([
    payload.create({ collection: 'post-categories', data: { title: 'Saveti', slug: 'saveti', description: 'Stručni saveti o ogradama, kapijama, materijalima i RAL bojama.' } }),
    payload.create({ collection: 'post-categories', data: { title: 'Vodiči', slug: 'vodici', description: 'Detaljni vodiči za odabir, kupovinu i ugradnju kapija i ograda.' } }),
    payload.create({ collection: 'post-categories', data: { title: 'Gotovi projekti', slug: 'gotovi-projekti', description: 'Pregled završenih projekata — kapije, ograde i kompleksne ugradnje.' } }),
  ])

  // ——— 6. Contact form ──────────────────────────────────────────────────────────
  payload.logger.info('— Seeding contact form...')
  const contactForm = await payload.create({ collection: 'forms', depth: 0, data: contactFormData() })

  // ——— 7. Pages ─────────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding pages...')
  await Promise.all([
    payload.create({ collection: 'pages', depth: 0, data: homePageData({ heroImage, metaImage: heroImage }) }),
    payload.create({ collection: 'pages', depth: 0, data: aboutPageData({ heroImage, metaImage: heroImage }) }),
    payload.create({ collection: 'pages', depth: 0, data: contactPageData({ contactForm, heroImage, metaImage: heroImage }) }),
  ])

  // ——— 8. Blog posts ────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding blog posts...')
  const postDataList = createBlogPostsSeed({
    heroImage: postImage,
    categories: { saveti: savetiCat, vodici: vodiciCat, projekti: projektiCat },
  })

  const createdPosts = []
  for (const postData of postDataList) {
    const post = await payload.create({ collection: 'posts', depth: 0, data: postData })
    createdPosts.push(post)
  }

  // Sequential to prevent PostgreSQL deadlock on posts_rels
  if (createdPosts.length >= 2) {
    await payload.update({ collection: 'posts', id: createdPosts[0].id, data: { relatedPosts: [createdPosts[1].id, createdPosts[2]?.id].filter(Boolean) } })
    await payload.update({ collection: 'posts', id: createdPosts[1].id, data: { relatedPosts: [createdPosts[0].id, createdPosts[2]?.id].filter(Boolean) } })
    if (createdPosts[2]) {
      await payload.update({ collection: 'posts', id: createdPosts[2].id, data: { relatedPosts: [createdPosts[0].id, createdPosts[1].id] } })
    }
  }

  // ——— 9. Header global ─────────────────────────────────────────────────────────
  payload.logger.info('— Seeding header global...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      siteName: 'Palisade d.o.o.',
      topBar: [
        { link: { type: 'custom', label: '+381 11 2960 574', url: 'tel:+381112960574', newTab: false } },
        { link: { type: 'custom', label: 'info@palisada.rs', url: 'mailto:info@palisada.rs', newTab: false } },
        { link: { type: 'custom', label: 'Pon–Pet: 08:00–16:00', url: '/kontakt', newTab: false } },
      ],
      navItems: [
        {
          link: { type: 'custom', label: 'Naslovna', url: '/', newTab: false },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'Kapije', url: '/kategorije/kapije', newTab: false },
          subItems: [
            { link: { type: 'custom', label: 'Pešačke kapije',    url: '/kategorije/pesacke-kapije',    newTab: false } },
            { link: { type: 'custom', label: 'Dvokrilne kapije',  url: '/kategorije/dvokrilne-kapije',  newTab: false } },
            { link: { type: 'custom', label: 'Klizne kapije',     url: '/kategorije/klizne-kapije',     newTab: false } },
            { link: { type: 'custom', label: 'Samonosive kapije', url: '/kategorije/samonosive-kapije', newTab: false } },
          ],
        },
        {
          link: { type: 'custom', label: 'Ograde', url: '/kategorije/ograde', newTab: false },
          subItems: [
            { link: { type: 'custom', label: '3D Panelne ograde',    url: '/kategorije/3d-panelne-ograde',    newTab: false } },
            { link: { type: 'custom', label: '2D Panelne ograde',    url: '/kategorije/2d-panelne-ograde',    newTab: false } },
            { link: { type: 'custom', label: 'Aluminijumske ograde', url: '/kategorije/aluminijumske-ograde', newTab: false } },
          ],
        },
        {
          link: { type: 'custom', label: 'Saveti', url: '/blog', newTab: false },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'O nama', url: '/o-nama', newTab: false },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'Kontakt', url: '/kontakt', newTab: false },
          subItems: [],
        },
      ],
      promoBanner: {
        enabled: true,
        text: 'Besplatno merenje i konsultacija na terenu — bez obaveze!',
        link: { type: 'custom', label: 'Zatražite ponudu', url: '/kontakt', newTab: false },
      },
    } as any,
  })

  // ——— 10. Footer global ────────────────────────────────────────────────────────
  payload.logger.info('— Seeding footer global...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      navItems: [
        { link: { type: 'custom', label: 'Naslovna',       url: '/',        newTab: false } },
        { link: { type: 'custom', label: 'O nama',         url: '/o-nama',  newTab: false } },
        { link: { type: 'custom', label: 'Saveti',         url: '/blog',    newTab: false } },
        { link: { type: 'custom', label: 'Kontakt',        url: '/kontakt', newTab: false } },
        { link: { type: 'custom', label: 'Sitemap',        url: '/sitemap.xml', newTab: true } },
      ],
      sections: [
        // ── Brand
        {
          blockType: 'footerBrand',
          tagline: 'Kad sigurnost zahteva rešenje',
          description: 'Palisade d.o.o. je jedna od najvećih kompanija za kapije i ograde u Srbiji. Projektujemo, izrađujemo i montiramo — sa punom garancijom na rad i materijal.',
        },
        // ── Kapije
        {
          blockType: 'footerColumn',
          title: 'Kapije',
          links: [
            { link: { type: 'custom', label: 'Pešačke kapije',    url: '/kategorije/pesacke-kapije',    newTab: false } },
            { link: { type: 'custom', label: 'Dvokrilne kapije',  url: '/kategorije/dvokrilne-kapije',  newTab: false } },
            { link: { type: 'custom', label: 'Klizne kapije',     url: '/kategorije/klizne-kapije',     newTab: false } },
            { link: { type: 'custom', label: 'Samonosive kapije', url: '/kategorije/samonosive-kapije', newTab: false } },
            { link: { type: 'custom', label: 'Sve kapije →',      url: '/kategorije/kapije',            newTab: false } },
          ],
        },
        // ── Ograde
        {
          blockType: 'footerColumn',
          title: 'Ograde',
          links: [
            { link: { type: 'custom', label: '3D Panelne ograde',    url: '/kategorije/3d-panelne-ograde',    newTab: false } },
            { link: { type: 'custom', label: '2D Panelne ograde',    url: '/kategorije/2d-panelne-ograde',    newTab: false } },
            { link: { type: 'custom', label: 'Aluminijumske ograde', url: '/kategorije/aluminijumske-ograde', newTab: false } },
            { link: { type: 'custom', label: 'Sve ograde →',         url: '/kategorije/ograde',               newTab: false } },
          ],
        },
        // ── Contact
        {
          blockType: 'footerContact',
          title: 'Kontakt',
          phone: '+381 11 2960 574',
          email: 'info@palisada.rs',
          address: 'Zrenjaninski put 139E\n11000 Beograd, Srbija',
          workingHours: 'Ponedeljak–Petak\n08:00–16:00',
          mapLink: 'https://maps.google.com/?q=Zrenjaninski+put+139E+Beograd',
        },
        // ── Social
        {
          blockType: 'footerSocial',
          title: 'Pratite nas',
          profiles: [
            { platform: 'facebook',  url: 'https://facebook.com/palisade.rs' },
            { platform: 'instagram', url: 'https://instagram.com/palisade.rs' },
            { platform: 'youtube',   url: 'https://youtube.com/@palisadedoo' },
            { platform: 'linkedin',  url: 'https://linkedin.com/company/palisade-doo' },
          ],
        },
      ],
      bottomBar: {
        copyright: `© ${new Date().getFullYear()} Palisade d.o.o. Sva prava zadržana.`,
        legalLinks: [
          { link: { type: 'custom', label: 'Politika privatnosti', url: '/privatnost', newTab: false } },
          { link: { type: 'custom', label: 'Uslovi korišćenja',    url: '/uslovi',     newTab: false } },
        ],
      },
    } as any,
  })

  payload.logger.info('— Palisade seed complete! ✓')
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, { credentials: 'include', method: 'GET' })
  if (!res.ok) throw new Error(`Failed to fetch: ${url} (${res.status})`)
  const data = await res.arrayBuffer()
  const ext  = url.split('.').pop() || 'webp'
  const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg'
  return { name: url.split('/').pop() || `file.${ext}`, data: Buffer.from(data), mimetype: mime, size: data.byteLength }
}
