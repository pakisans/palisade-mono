import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'
import { revalidateHeader } from '@/hooks/revalidateShop'

export const Header: GlobalConfig = {
  slug: 'header',
  hooks: {
    afterChange: [revalidateHeader],
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Podešavanja',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'topBar',
      type: 'array',
      label: 'Top Bar Links',
      fields: [link({ appearances: false })],
      maxRows: 8,
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'subItems',
          type: 'array',
          fields: [link({ appearances: false })],
        },
      ],
      maxRows: 10,
    },
    {
      name: 'promoBanner',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'text',
          type: 'text',
          localized: true,
        },
        {
          ...link({ appearances: false, overrides: { name: 'link' } }),
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
