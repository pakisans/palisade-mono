import type { Block } from 'payload'

export const Services: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: { singular: 'Usluge / kategorije', plural: 'Usluge / kategorije' },
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
      name: 'source',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Automatski (iz kategorija)', value: 'auto' },
        { label: 'Ručno (stavke ispod)', value: 'manual' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 8,
      admin: { condition: (_, { source } = {}) => source === 'manual' },
      labels: { singular: 'Usluga', plural: 'Usluge' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text', localized: true, required: true, admin: { width: '50%' } },
            { name: 'href', type: 'text', admin: { width: '50%' } },
          ],
        },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}
