import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Prodavnica',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      localized: false,
      position: undefined,
    }),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
