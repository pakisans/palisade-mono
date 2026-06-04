import type { Block } from 'payload'

export const Quote: Block = {
  slug: 'quote',
  interfaceName: 'QuoteBlock',
  labels: {
    singular: 'Quote',
    plural: 'Quotes',
  },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'rating',
          type: 'select',
          admin: {
            width: '50%',
          },
          options: [
            { label: '5', value: '5' },
            { label: '4', value: '4' },
            { label: '3', value: '3' },
          ],
        },
      ],
    },
  ],
}
