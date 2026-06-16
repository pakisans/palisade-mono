import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Recenzije', plural: 'Recenzije' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, admin: { width: '40%' } },
        { name: 'heading', type: 'text', localized: true, admin: { width: '60%' } },
      ],
    },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Recenzija', plural: 'Recenzije' },
      fields: [
        { name: 'text', type: 'textarea', localized: true, required: true },
        {
          type: 'row',
          fields: [
            { name: 'author', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'role', type: 'text', localized: true, admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'avatar', type: 'upload', relationTo: 'media', admin: { width: '60%', description: 'Logo firme ili foto (opciono).' } },
            {
              name: 'rating',
              type: 'select',
              defaultValue: '5',
              admin: { width: '40%' },
              options: [
                { label: '5', value: '5' },
                { label: '4', value: '4' },
                { label: '3', value: '3' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
