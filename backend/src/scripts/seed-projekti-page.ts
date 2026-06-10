/**
 * Seeds (or updates) ONLY the CMS `projekti` page — the sections/design that
 * the frontend `/projekti` route renders. Project cards themselves are pulled
 * live from `gotovi-projekti` posts, so this page contains no project gallery.
 *
 * Idempotent: updates the existing `projekti` page if present, else creates it.
 * Hero/meta image is reused from an existing project's featured image (no new
 * media is uploaded).
 *
 * Usage:  pnpm seed:projekti-page
 */

import config from '@payload-config'
import { getPayload } from 'payload'

import { projectsPageData } from '../endpoints/seed/projects-page'

async function main() {
  console.log('🚀 Inicijalizacija Payload-a...')
  const payload = await getPayload({ config })

  // Reuse an existing image for hero/meta — prefer a real project's featured image.
  let image: any = null
  const proj = await payload.find({
    collection: 'posts',
    where: {
      'categories.slug': { equals: 'gotovi-projekti' },
      _status: { equals: 'published' },
    },
    sort: '-publishedOn',
    depth: 1,
    limit: 1,
  })
  image = proj.docs[0]?.featuredImage ?? null

  if (!image) {
    const anyMedia = await payload.find({ collection: 'media', limit: 1 })
    image = anyMedia.docs[0] ?? null
  }
  if (!image) {
    console.warn('⚠ Nema dostupne slike u CMS-u — hero/meta će biti bez slike.')
  } else {
    console.log(`✓ Koristim sliku za hero/meta (id: ${image.id})`)
  }

  const data = projectsPageData({ heroImage: image, metaImage: image }) as any

  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'projekti' } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data })
    console.log(`✓ Ažurirana postojeća stranica "projekti" (id: ${existing.docs[0].id})`)
  } else {
    const created = await payload.create({ collection: 'pages', data })
    console.log(`+ Kreirana stranica "projekti" (id: ${created.id})`)
  }

  console.log('✅ Gotovo.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
