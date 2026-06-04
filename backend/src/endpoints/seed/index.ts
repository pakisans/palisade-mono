import type { CollectionSlug, File, GlobalSlug, Payload, PayloadRequest } from 'payload'

import { aboutPageData } from './about'
import { createBlogPostsSeed } from './blog-posts'
import { contactFormData } from './contact-form'
import { contactPageData } from './contact-page'
import { homePageData } from './home'

const collections: CollectionSlug[] = [
  'categories',
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

export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('— Seeding Palisade database...')

  // ——— 1. Clear globals ———
  payload.logger.info('— Clearing globals...')
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data:
          global === 'footer'
            ? { navItems: [], sections: [], bottomBar: { copyright: '', legalLinks: [] } }
            : { navItems: [], promoBanner: { enabled: false } },
        depth: 0,
        context: { disableRevalidate: true },
      } as any),
    ),
  )

  // ——— 2. Clear collections ———
  payload.logger.info('— Clearing collections...')
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection]?.config?.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  // ——— 3. Upload placeholder image ———
  payload.logger.info('— Uploading placeholder image...')
  const heroBuffer = await fetchFileByURL(
    'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-hero1.webp',
  )
  const postBuffer = await fetchFileByURL(
    'https://raw.githubusercontent.com/payloadcms/payload/refs/heads/main/templates/website/src/endpoints/seed/image-post1.webp',
  )

  const [heroImage, postImage] = await Promise.all([
    payload.create({
      collection: 'media',
      data: { alt: 'Kapije i ograde — Palisade d.o.o.' },
      file: heroBuffer,
    }),
    payload.create({
      collection: 'media',
      data: { alt: 'Palisade blog' },
      file: postBuffer,
    }).catch(() =>
      payload.create({
        collection: 'media',
        data: { alt: 'Palisade blog' },
        file: heroBuffer,
      }),
    ),
  ])

  // ——— 4. Product categories (hierarchical) ———
  payload.logger.info('— Seeding product categories...')

  const [kapijeCat, ogradeCat] = await Promise.all([
    payload.create({ collection: 'categories', data: { title: 'Kapije', slug: 'kapije' } }),
    payload.create({ collection: 'categories', data: { title: 'Ograde', slug: 'ograde' } }),
  ])

  await Promise.all([
    payload.create({
      collection: 'categories',
      data: { title: 'Pešačke kapije', slug: 'pesacke-kapije', parent: kapijeCat.id },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Dvokrilne kapije', slug: 'dvokrilne-kapije', parent: kapijeCat.id },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Klizne kapije', slug: 'klizne-kapije', parent: kapijeCat.id },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Samonosive kapije', slug: 'samonosive-kapije', parent: kapijeCat.id },
    }),
    payload.create({
      collection: 'categories',
      data: { title: '2D Panelne ograde', slug: '2d-panelne-ograde', parent: ogradeCat.id },
    }),
    payload.create({
      collection: 'categories',
      data: { title: '3D Panelne ograde', slug: '3d-panelne-ograde', parent: ogradeCat.id },
    }),
    payload.create({
      collection: 'categories',
      data: { title: 'Aluminijumske ograde', slug: 'aluminijumske-ograde', parent: ogradeCat.id },
    }),
  ])

  // ——— 5. Blog post categories ———
  payload.logger.info('— Seeding blog post categories...')

  const [savetiCat, vodiciCat, projektiCat] = await Promise.all([
    payload.create({
      collection: 'post-categories',
      data: {
        title: 'Saveti',
        slug: 'saveti',
        description: 'Stručni saveti o ogradama, kapijama, materijalima i bojama.',
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

  // ——— 6. Contact form ———
  payload.logger.info('— Seeding contact form...')
  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData(),
  })

  // ——— 7. Pages ———
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
      data: aboutPageData({ heroImage, metaImage: heroImage }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm, heroImage, metaImage: heroImage }),
    }),
  ])

  // ——— 8. Blog posts ———
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

  if (createdPosts.length >= 2) {
    await Promise.all([
      payload.update({
        collection: 'posts',
        id: createdPosts[0].id,
        data: { relatedPosts: [createdPosts[1].id, createdPosts[2]?.id].filter(Boolean) },
      }),
      payload.update({
        collection: 'posts',
        id: createdPosts[1].id,
        data: { relatedPosts: [createdPosts[0].id] },
      }),
    ])
  }

  // ——— 9. Header global ———
  payload.logger.info('— Seeding header...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      siteName: 'Palisade d.o.o.',
      topBar: [
        {
          link: {
            type: 'custom',
            label: '+381 11 2960 574',
            url: 'tel:+381112960574',
          },
        },
        {
          link: {
            type: 'custom',
            label: 'info@palisada.rs',
            url: 'mailto:info@palisada.rs',
          },
        },
      ],
      navItems: [
        {
          link: { type: 'custom', label: 'Naslovna', url: '/' },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'O nama', url: '/o-nama' },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'Kapije', url: '/shop?category=kapije' },
          subItems: [
            { link: { type: 'custom', label: 'Pešačke kapije', url: '/shop?category=pesacke-kapije' } },
            { link: { type: 'custom', label: 'Dvokrilne kapije', url: '/shop?category=dvokrilne-kapije' } },
            { link: { type: 'custom', label: 'Klizne kapije', url: '/shop?category=klizne-kapije' } },
            { link: { type: 'custom', label: 'Samonosive kapije', url: '/shop?category=samonosive-kapije' } },
          ],
        },
        {
          link: { type: 'custom', label: 'Ograde', url: '/shop?category=ograde' },
          subItems: [
            { link: { type: 'custom', label: '2D Panelne ograde', url: '/shop?category=2d-panelne-ograde' } },
            { link: { type: 'custom', label: '3D Panelne ograde', url: '/shop?category=3d-panelne-ograde' } },
            { link: { type: 'custom', label: 'Aluminijumske ograde', url: '/shop?category=aluminijumske-ograde' } },
          ],
        },
        {
          link: { type: 'custom', label: 'Saveti', url: '/blog' },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'Gotovi projekti', url: '/blog?category=gotovi-projekti' },
          subItems: [],
        },
        {
          link: { type: 'custom', label: 'Kontakt', url: '/kontakt' },
          subItems: [],
        },
      ],
      promoBanner: {
        enabled: true,
        text: 'Besplatno merenje i konsultacija na terenu — kontaktirajte nas danas!',
        link: {
          type: 'custom',
          label: 'Zatražite ponudu',
          url: '/kontakt',
        },
      },
    } as any,
  })

  // ——— 10. Footer global ———
  payload.logger.info('— Seeding footer...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      sections: [
        {
          blockType: 'footerBrand',
          tagline: 'Kad sigurnost zahteva rešenje',
          description:
            'Palisade d.o.o. je jedna od najvećih i najpouzdanijih kompanija za kapije i ograde u Srbiji. Projektujemo, izrađujemo i montiramo — sa punom garancijom.',
        },
        {
          blockType: 'footerColumn',
          title: 'Kapije',
          links: [
            { link: { type: 'custom', label: 'Pešačke kapije', url: '/shop?category=pesacke-kapije' } },
            { link: { type: 'custom', label: 'Dvokrilne kapije', url: '/shop?category=dvokrilne-kapije' } },
            { link: { type: 'custom', label: 'Klizne kapije', url: '/shop?category=klizne-kapije' } },
            { link: { type: 'custom', label: 'Samonosive kapije', url: '/shop?category=samonosive-kapije' } },
          ],
        },
        {
          blockType: 'footerColumn',
          title: 'Ograde',
          links: [
            { link: { type: 'custom', label: '2D Panelne ograde', url: '/shop?category=2d-panelne-ograde' } },
            { link: { type: 'custom', label: '3D Panelne ograde', url: '/shop?category=3d-panelne-ograde' } },
            { link: { type: 'custom', label: 'Aluminijumske ograde', url: '/shop?category=aluminijumske-ograde' } },
          ],
        },
        {
          blockType: 'footerContact',
          title: 'Kontakt',
          phone: '+381 11 2960 574',
          email: 'info@palisada.rs',
          address: 'Zrenjaninski put 139E\n11000 Beograd, Srbija',
          workingHours: 'Ponedeljak–Petak\n08:00–16:00',
          mapLink: 'https://maps.google.com/?q=Zrenjaninski+put+139E+Beograd',
        },
        {
          blockType: 'footerSocial',
          title: 'Pratite nas',
          profiles: [
            { platform: 'facebook', url: 'https://facebook.com/palisade' },
            { platform: 'instagram', url: 'https://instagram.com/palisade' },
            { platform: 'youtube', url: 'https://youtube.com/@palisade' },
            { platform: 'linkedin', url: 'https://linkedin.com/company/palisade' },
          ],
        },
      ],
      navItems: [
        { link: { type: 'custom', label: 'Naslovna', url: '/' } },
        { link: { type: 'custom', label: 'O nama', url: '/o-nama' } },
        { link: { type: 'custom', label: 'Saveti', url: '/blog' } },
        { link: { type: 'custom', label: 'Kontakt', url: '/kontakt' } },
      ],
      bottomBar: {
        copyright: `© ${new Date().getFullYear()} Palisade d.o.o. Sva prava zadržana.`,
        legalLinks: [
          { link: { type: 'custom', label: 'Politika privatnosti', url: '/privatnost' } },
          { link: { type: 'custom', label: 'Uslovi korišćenja', url: '/uslovi' } },
        ],
      },
    } as any,
  })

  payload.logger.info('— Palisade seed complete!')
}

async function fetchFileByURL(url: string): Promise<File> {
  const res = await fetch(url, { credentials: 'include', method: 'GET' })
  if (!res.ok) {
    throw new Error(`Failed to fetch file from ${url}, status: ${res.status}`)
  }
  const data = await res.arrayBuffer()
  const ext = url.split('.').pop() || 'webp'
  const mime = ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg'
  return {
    name: url.split('/').pop() || `file-${Date.now()}.${ext}`,
    data: Buffer.from(data),
    mimetype: mime,
    size: data.byteLength,
  }
}
