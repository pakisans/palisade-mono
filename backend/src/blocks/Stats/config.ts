import type { Block } from 'payload'

export const Stats: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats',
    plural: 'Stats',
  },
  fields: [
    { name: 'label', type: 'text', localized: true },
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                width: '40%',
              },
            },
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              admin: {
                width: '60%',
              },
            },
          ],
        },
      ],
    },
  ],
}
