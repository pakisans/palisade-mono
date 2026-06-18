import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'

import { adminOnly } from '@/access/adminOnly'

export const Media: CollectionConfig = {
  admin: {
    group: 'Sadržaj',
  },
  slug: 'media',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // process.cwd() je stabilan i u dev-u (backend/) i u produkciji (/app) —
    // `dirname` iz import.meta.url se u Next production buildu razreši unutar .next/
    // pa pokazuje na pogrešan folder → 404 na slikama. Zato cwd.
    staticDir: path.resolve(process.cwd(), 'public/media'),
  },
}
