import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateFrontend } from '@/utilities/revalidateFrontend'

// Forma se koristi na pocetnoj (CTA) i na svim stranicama proizvoda, pa uz tag
// 'forms' osvezavamo i celo stablo od '/'. Izmene forme su retke, pa je to jeftino.
async function revalidate(req: Parameters<CollectionAfterChangeHook>[0]['req']) {
  if (req.context.disableRevalidate) return
  await revalidateFrontend({
    logger: req.payload.logger,
    tags: ['forms'],
    layoutPaths: ['/'],
  })
}

export const revalidateForms: CollectionAfterChangeHook = async ({ doc, req }) => {
  await revalidate(req)
  return doc
}

export const revalidateFormsDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  await revalidate(req)
  return doc
}
