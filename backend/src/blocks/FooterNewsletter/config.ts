import type { Block } from 'payload'

export const FooterNewsletter: Block = {
  slug: 'footerNewsletter',
  interfaceName: 'FooterNewsletterBlock',
  labels: {
    singular: 'Footer Newsletter',
    plural: 'Footer Newsletters',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'buttonLabel',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'privacyNote',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
