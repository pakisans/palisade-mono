import type { Block } from 'payload'

export const Spacer: Block = {
  slug: 'spacer',
  interfaceName: 'SpacerBlock',
  labels: {
    singular: 'Spacer',
    plural: 'Spacers',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'md',
          options: ['xs', 'sm', 'md', 'lg', 'xl'],
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'showDivider',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            style: {
              alignSelf: 'flex-end',
            },
            width: '50%',
          },
        },
      ],
    },
  ],
}
