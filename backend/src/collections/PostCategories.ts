import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { flexibleContent } from '@/fields/flexibleContent'
import { seoGroup } from '@/fields/seo'

export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Sadržaj',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
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
              description: 'Optional landing page content for this blog category.',
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
