import type { Field } from 'payload'

export const seoGroup: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'SEO Title',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'SEO Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'SEO Image',
    },
  ],
}
