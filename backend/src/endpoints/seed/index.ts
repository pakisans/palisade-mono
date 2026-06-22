import type { CollectionSlug, File, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { aboutPageData } from './about'
import { createBlogPostsSeed } from './blog-posts'
import { CATEGORY_CONTENT } from './category-content'
import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'
import { projectsPageData } from './projects-page'

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

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
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

  // ——— 3. Upload mapped seed images ────────────────────────────────────────────
  payload.logger.info('— Uploading mapped seed images...')
  const mediaSources = {
    hero: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/3D-panelne-ograde00003-scaled.jpeg',
      alt: 'Montaža 3D panelne ograde i kapija po meri',
    },
    about: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/Prodajni-salon-kapija-i-ograda-Palisada-07.webp',
      alt: 'Prodajni i izložbeni salon Palisade za kapije i ograde',
    },
    contact: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/02/170.jpg',
      alt: 'Palisade kapije i ograde - kontakt i ponuda',
    },
    pesacke: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/pesacka-kapija-00001-scaled.jpeg',
      alt: 'Pešačka kapija po meri za dvorište',
    },
    dvokrilne: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/dvokrilne-kapije-00003.jpeg',
      alt: 'Dvokrilna kapija po meri sa čeličnom konstrukcijom',
    },
    klizne: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/klizne-kapije-00004.jpeg',
      alt: 'Klizna kapija po meri za ulaz u dvorište',
    },
    samonosive: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/samonosive-kapije-00003-scaled.jpeg',
      alt: 'Samonosiva kapija bez šine u tlu',
    },
    panel3d: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/3D-panelne-ograde00001.jpeg',
      alt: '3D panelna ograda sa V pregibima',
    },
    panel2d: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/2D-panelne-ograde00003-scaled.jpeg',
      alt: '2D panelna ograda sa stubovima i spojnicama',
    },
    aluminijumske: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/aluminijumske-ograde00003-scaled.jpeg',
      alt: 'Aluminijumska ograda po meri bez održavanja',
    },
    blogAluminijum: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/aluminijumska-ograda-palisada.webp',
      alt: 'Aluminijumska ograda Palisade za poređenje materijala',
    },
    blogAutomatika: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/automatizovane-pesacke-kapije-1.webp',
      alt: 'Automatizovana pešačka kapija sa kontrolom pristupa',
    },
    blogRal: {
      url: 'https://kapije-ograde.rs/wp-content/uploads/2026/03/RAL-Boje-za-Kapije-i-Ograde.webp',
      alt: 'RAL paleta boja za kapije i ograde',
    },
  }

  const mediaEntries = await Promise.all(
    Object.entries(mediaSources).map(async ([key, source]) => {
      const file = await fetchFileByURL(source.url)
      const media = await payload.create({
        collection: 'media',
        data: { alt: source.alt },
        file,
      })
      return [key, media] as const
    }),
  )

  const mediaByKey = Object.fromEntries(mediaEntries)
  const heroImage = mediaByKey.hero
  const aboutImage = mediaByKey.about
  const contactImage = mediaByKey.contact
  const categoryContent = (slug: string, image: any) => {
    const content = CATEGORY_CONTENT[slug]
    if (!content) return {}

    return {
      description: content.intro,
      content: content.blocks || [],
      meta: {
        title: content.seoTitle,
        description: content.seoDescription,
        image: image.id,
      },
    }
  }

  // ——— 4. Product categories (hierarchical) ────────────────────────────────────
  payload.logger.info('— Seeding product categories...')

  const [kapijeCat, ogradeCat] = await Promise.all([
    payload.create({
      collection: 'categories',
      data: {
        title: 'Kapije',
        slug: 'kapije',
        image: heroImage.id,
        ...categoryContent('kapije', heroImage),
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Ograde',
        slug: 'ograde',
        image: mediaByKey.panel3d.id,
        ...categoryContent('ograde', mediaByKey.panel3d),
      },
    }),
  ])

  // Subcategories mirror the real palisada.rs taxonomy:
  //   Kapije → Jednokrilne, Dvokrilne, Klizne, Samonosive
  //   Ograde → Dekorativne, Panelne
  await Promise.all([
    payload.create({
      collection: 'categories',
      data: {
        title: 'Jednokrilne kapije',
        slug: 'jednokrilne-kapije',
        parent: kapijeCat.id,
        image: mediaByKey.pesacke.id,
        ...categoryContent('jednokrilne-kapije', mediaByKey.pesacke),
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Dvokrilne kapije',
        slug: 'dvokrilne-kapije',
        parent: kapijeCat.id,
        image: mediaByKey.dvokrilne.id,
        ...categoryContent('dvokrilne-kapije', mediaByKey.dvokrilne),
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Klizne kapije',
        slug: 'klizne-kapije',
        parent: kapijeCat.id,
        image: mediaByKey.klizne.id,
        ...categoryContent('klizne-kapije', mediaByKey.klizne),
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Samonosive kapije',
        slug: 'samonosive-kapije',
        parent: kapijeCat.id,
        image: mediaByKey.samonosive.id,
        ...categoryContent('samonosive-kapije', mediaByKey.samonosive),
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Dekorativne ograde',
        slug: 'dekorativne-ograde',
        parent: ogradeCat.id,
        image: mediaByKey.panel2d.id,
        ...categoryContent('dekorativne-ograde', mediaByKey.panel2d),
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Panelne ograde',
        slug: 'panelne-ograde',
        parent: ogradeCat.id,
        image: mediaByKey.panel3d.id,
        ...categoryContent('panelne-ograde', mediaByKey.panel3d),
      },
    }),
  ])

  // ——— 5. Blog post categories ─────────────────────────────────────────────────
  payload.logger.info('— Seeding blog post categories...')

  const [savetiCat, vodiciCat, projektiCat] = await Promise.all([
    payload.create({
      collection: 'post-categories',
      data: {
        title: 'Saveti',
        slug: 'saveti',
        description: 'Stručni saveti o ogradama, kapijama, materijalima i RAL bojama.',
      },
    }),
    payload.create({
      collection: 'post-categories',
      data: {
        title: 'Vodiči',
        slug: 'vodici',
        description: 'Detaljni vodiči za odabir, kupovinu i ugradnju kapija i ograda.',
      },
    }),
    payload.create({
      collection: 'post-categories',
      data: {
        title: 'Gotovi projekti',
        slug: 'gotovi-projekti',
        description: 'Pregled završenih projekata — kapije, ograde i kompleksne ugradnje.',
      },
    }),
  ])

  // ——— 6. Contact form ──────────────────────────────────────────────────────────
  payload.logger.info('— Seeding contact form...')
  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData(),
  })

  // ——— 7. Pages ─────────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding pages...')
  await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: homePageData({ heroImage, metaImage: heroImage }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: aboutPageData({ heroImage: aboutImage, metaImage: aboutImage }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm, heroImage: contactImage, metaImage: contactImage }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: projectsPageData({
        heroImage: mediaByKey.panel3d,
        metaImage: mediaByKey.panel3d,
      }),
    }),
  ])

  // ——— 8. Blog posts ────────────────────────────────────────────────────────────
  payload.logger.info('— Seeding blog posts...')
  const postDataList = createBlogPostsSeed({
    heroImage: mediaByKey.blogAluminijum,
    images: {
      aluminijum: mediaByKey.blogAluminijum,
      automatika: mediaByKey.blogAutomatika,
      ral: mediaByKey.blogRal,
    },
    categories: { saveti: savetiCat, vodici: vodiciCat, projekti: projektiCat },
  })

  const createdPosts = []
  for (const postData of postDataList) {
    const post = await payload.create({ collection: 'posts', depth: 0, data: postData })
    createdPosts.push(post)
  }

  // Sequential to prevent PostgreSQL deadlock on posts_rels
  if (createdPosts.length >= 2) {
    await payload.update({
      collection: 'posts',
      id: createdPosts[0].id,
      data: { relatedPosts: [createdPosts[1].id, createdPosts[2]?.id].filter(Boolean) },
    })
    await payload.update({
      collection: 'posts',
      id: createdPosts[1].id,
      data: { relatedPosts: [createdPosts[0].id, createdPosts[2]?.id].filter(Boolean) },
    })
    if (createdPosts[2]) {
      await payload.update({
        collection: 'posts',
        id: createdPosts[2].id,
        data: { relatedPosts: [createdPosts[0].id, createdPosts[1].id] },
      })
    }
  }

  // ——— 9. Header global ─────────────────────────────────────────────────────────
  payload.logger.info('— Seeding header global...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      siteName: 'Palisada d.o.o.',
      topBar: [
        {
          link: {
            type: 'custom',
            label: '+381 11 2960 574',
            url: 'tel:+381112960574',
            newTab: false,
          },
        },
        {
          link: {
            type: 'custom',
            label: 'info@palisada.rs',
            url: 'mailto:info@palisada.rs',
            newTab: false,
          },
        },
        { link: { type: 'custom', label: 'Pon–Pet: 08:00–16:00', url: '/kontakt', newTab: false } },
      ],
      // "Proizvodi" renders a mega-menu (all top categories) in the header — code-driven.
      navItems: [
        { link: { type: 'custom', label: 'Naslovna', url: '/', newTab: false }, subItems: [] },
        {
          link: { type: 'custom', label: 'Proizvodi', url: '/proizvodi', newTab: false },
          subItems: [],
        },
        { link: { type: 'custom', label: 'O nama', url: '/o-nama', newTab: false }, subItems: [] },
        { link: { type: 'custom', label: 'Saveti', url: '/saveti', newTab: false }, subItems: [] },
        {
          link: { type: 'custom', label: 'Projekti', url: '/projekti', newTab: false },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'Kontakt', url: '/kontakt', newTab: false },
          subItems: [],
        },
      ],
      promoBanner: {
        enabled: false,
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
        { link: { type: 'custom', label: 'Naslovna', url: '/', newTab: false } },
        { link: { type: 'custom', label: 'O nama', url: '/o-nama', newTab: false } },
        { link: { type: 'custom', label: 'Projekti', url: '/projekti', newTab: false } },
        { link: { type: 'custom', label: 'Saveti', url: '/saveti', newTab: false } },
        { link: { type: 'custom', label: 'Kontakt', url: '/kontakt', newTab: false } },
        { link: { type: 'custom', label: 'Sitemap', url: '/sitemap.xml', newTab: true } },
      ],
      sections: [
        // ── Brand
        {
          blockType: 'footerBrand',
          tagline: 'Kad sigurnost zahteva rešenje',
          description:
            'Palisada d.o.o. je jedna od najvećih kompanija za kapije i ograde u Srbiji. Projektujemo, izrađujemo i montiramo — sa punom garancijom na rad i materijal.',
        },
        // Sve kategorije (sa podkategorijama) prikazuju se u footeru DINAMIČKI
        // (Footer komponenta čita kategorije iz baze) — nema potrebe za ručnim kolonama.
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
            { platform: 'facebook', url: 'https://facebook.com/palisada.rs' },
            { platform: 'instagram', url: 'https://instagram.com/palisada.rs' },
            { platform: 'youtube', url: 'https://youtube.com/@palisadadoo' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/palisada-doo' },
          ],
        },
      ],
      bottomBar: {
        copyright: `© ${new Date().getFullYear()} Palisada d.o.o. Sva prava zadržana.`,
        // Sadržaj ovih stranica puni `pnpm scrape:legal` (skida sa palisada.rs).
        legalLinks: [
          {
            link: {
              type: 'custom',
              label: 'Politika privatnosti',
              url: '/politika-privatnosti',
              newTab: false,
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Pravila o kolačićima',
              url: '/pravila-o-kolacicima',
              newTab: false,
            },
          },
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
  const ext = url.split('.').pop() || 'webp'
  const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg'
  return {
    name: url.split('/').pop() || `file.${ext}`,
    data: Buffer.from(data),
    mimetype: mime,
    size: data.byteLength,
  }
}
