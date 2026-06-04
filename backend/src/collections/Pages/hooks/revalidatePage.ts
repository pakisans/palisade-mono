import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Page } from '../../../payload-types'
import { revalidateFrontend } from '@/utilities/revalidateFrontend'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const paths: string[] = []
    const tags: string[] = ['pages']

    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
      paths.push(path)
      tags.push(`page-${doc.slug}`)
    }

    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`
      paths.push(oldPath)
      tags.push(`page-${previousDoc.slug}`)
    }

    void revalidateFrontend({
      logger: payload.logger,
      paths,
      tags,
    })
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    const tags = ['pages']
    if (doc?.slug) tags.push(`page-${doc.slug}`)

    void revalidateFrontend({
      logger: payload.logger,
      paths: [path],
      tags,
    })
  }

  return doc
}
