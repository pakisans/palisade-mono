import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Post } from '@/payload-types'
import { revalidateFrontend } from '@/utilities/revalidateFrontend'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({ doc, previousDoc, req }) => {
  if (!req.context.disableRevalidate) {
    const paths = ['/blog']
    const tags = ['posts']

    if (doc._status === 'published') {
      paths.push(`/blog/${doc.slug}`)
      tags.push(`post-${doc.slug}`)
    }

    if (previousDoc?._status === 'published' && previousDoc.slug !== doc.slug) {
      paths.push(`/blog/${previousDoc.slug}`)
      tags.push(`post-${previousDoc.slug}`)
    }

    void revalidateFrontend({
      logger: req.payload.logger,
      paths,
      tags,
    })
  }

  return doc
}

export const revalidatePostDelete: CollectionAfterDeleteHook<Post> = ({ doc, req }) => {
  if (!req.context.disableRevalidate && doc?.slug) {
    void revalidateFrontend({
      logger: req.payload.logger,
      paths: ['/blog', `/blog/${doc.slug}`],
      tags: ['posts', `post-${doc.slug}`],
    })
  }

  return doc
}
