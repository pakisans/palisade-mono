type SupportedCollectionPath =
  | 'brands'
  | 'categories'
  | 'pages'
  | 'post-categories'
  | 'posts'
  | 'products'
  | 'tags'

export const getCollectionPath = ({
  collection,
  slug,
}: {
  collection?: string | null
  slug?: string | null
}) => {
  if (!slug) {
    return '/'
  }

  switch (collection as SupportedCollectionPath) {
    case 'products':
      return `/products/${slug}`
    case 'categories':
      return `/shop?category=${slug}`
    case 'brands':
      return `/brands/${slug}`
    case 'posts':
      return `/blog/${slug}`
    case 'post-categories':
      return `/blog/category/${slug}`
    case 'tags':
      return `/shop?tag=${slug}`
    case 'pages':
    default:
      return slug === 'home' ? '/' : `/${slug}`
  }
}
