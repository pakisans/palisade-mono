import type { Block } from 'payload'

import { link } from '@/fields/link'

export const FooterColumn: Block = {
  slug: 'footerColumn',
  interfaceName: 'FooterColumnBlock',
  labels: {
    singular: 'Footer Column',
    plural: 'Footer Columns',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 12,
      fields: [link({ appearances: false })],
    },
  ],
}
