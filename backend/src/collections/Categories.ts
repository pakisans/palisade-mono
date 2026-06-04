import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { flexibleContent } from '@/fields/flexibleContent'
import { seoGroup } from '@/fields/seo'
import { revalidateCategories, revalidateCategoriesDelete } from '@/hooks/revalidateShop'

export const Categories: CollectionConfig = {
  slug: 'categories',
  hooks: {
    afterChange: [revalidateCategories],
    afterDelete: [revalidateCategoriesDelete],
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Sadržaj',
    defaultColumns: ['title', 'slug', 'parent', 'updatedAt'],
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
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'parent',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            flexibleContent({
              description: 'Optional landing page content for this category.',
            }),
          ],
        },
        {
          label: 'SEO',
          fields: [seoGroup],
        },
      ],
    },
  ],
}
