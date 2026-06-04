import type { Block } from 'payload'

export const FooterSocial: Block = {
  slug: 'footerSocial',
  interfaceName: 'FooterSocialBlock',
  labels: {
    singular: 'Footer Social',
    plural: 'Footer Social',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'profiles',
      type: 'array',
      maxRows: 10,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: ['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'youtube'],
              admin: {
                width: '40%',
              },
            },
            {
              name: 'url',
              type: 'text',
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
