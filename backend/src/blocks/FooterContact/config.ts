import type { Block } from 'payload'

export const FooterContact: Block = {
  slug: 'footerContact',
  interfaceName: 'FooterContactBlock',
  labels: {
    singular: 'Footer Contact',
    plural: 'Footer Contacts',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'workingHours',
          type: 'textarea',
          localized: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'mapLink',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
