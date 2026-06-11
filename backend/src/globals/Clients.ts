import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Logos of companies that trusted Palisade — shown in the homepage / about
 * "Preko 700 firmi" carousel. Populated by the scrape:site script.
 */
export const Clients: GlobalConfig = {
  slug: 'clients',
  label: 'Klijenti (logoi)',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Podešavanja',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      defaultValue: 'Preko 700 firmi ogradila je PALISADA',
    },
    {
      name: 'logos',
      type: 'array',
      label: 'Logoi',
      labels: { singular: 'Logo', plural: 'Logoi' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          admin: { placeholder: 'npr. Lidl' },
        },
      ],
    },
  ],
}
