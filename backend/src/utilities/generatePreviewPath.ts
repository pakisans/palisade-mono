import { PayloadRequest } from 'payload'

import { getCollectionPath } from './getCollectionPath'

type Props = {
  collection:
    | 'brands'
    | 'categories'
    | 'pages'
    | 'post-categories'
    | 'posts'
    | 'products'
    | 'tags'
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path: getCollectionPath({ collection, slug }),
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
