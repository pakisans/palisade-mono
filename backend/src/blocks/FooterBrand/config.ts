import type { Block } from 'payload'

export const FooterBrand: Block = {
  slug: 'footerBrand',
  interfaceName: 'FooterBrandBlock',
  labels: {
    singular: 'Footer Brand',
    plural: 'Footer Brand',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
}
