import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import { revalidateFrontend } from '@/utilities/revalidateFrontend'

const SHOP_PATHS = ['/', '/proizvodi']

export const revalidateProducts: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc

  const tags = ['products']

  if (doc?.slug) tags.push(`product-${doc.slug}`)
  if (previousDoc?.slug) tags.push(`product-${previousDoc.slug}`)

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: SHOP_PATHS,
    tags,
  })

  return doc
}

export const revalidateProductsDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  const tags = ['products']
  if (doc?.slug) tags.push(`product-${doc.slug}`)

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: SHOP_PATHS,
    tags,
  })

  return doc
}

export const revalidateCategories: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc

  const tags = ['categories', 'products']
  if (doc?.slug) tags.push(`category-${doc.slug}`)
  if (previousDoc?.slug) tags.push(`category-${previousDoc.slug}`)

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: SHOP_PATHS,
    tags,
  })

  return doc
}

export const revalidateCategoriesDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  const tags = ['categories', 'products']
  if (doc?.slug) tags.push(`category-${doc.slug}`)

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: SHOP_PATHS,
    tags,
  })

  return doc
}

export const revalidateBrands: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc

  const tags = ['brands']
  if (doc?.slug) tags.push(`brand-${doc.slug}`)
  if (previousDoc?.slug) tags.push(`brand-${previousDoc.slug}`)

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: SHOP_PATHS,
    tags,
  })

  return doc
}

export const revalidateBrandsDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  const tags = ['brands']
  if (doc?.slug) tags.push(`brand-${doc.slug}`)

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: SHOP_PATHS,
    tags,
  })

  return doc
}

export const revalidateHeader: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: ['/'],
    tags: ['header'],
  })

  return doc
}

export const revalidateFooter: GlobalAfterChangeHook = async ({ doc, req }) => {
  if (req.context.disableRevalidate) return doc

  await revalidateFrontend({
    logger: req.payload.logger,
    paths: ['/'],
    tags: ['footer'],
  })

  return doc
}
