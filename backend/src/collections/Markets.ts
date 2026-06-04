import type { CollectionConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'

export const Markets: CollectionConfig = {
  slug: 'markets',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Podešavanja',
    useAsTitle: 'label',
    defaultColumns: ['label', 'countryCode', 'url', 'active'],
    description: 'Markets / distributors displayed in the Country Gate popup on the website.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Market name',
          required: true,
          admin: { width: '50%', placeholder: 'e.g. Serbia, Croatia / EU...' },
        },
        {
          name: 'flag',
          type: 'text',
          label: 'Flag (emoji)',
          required: true,
          admin: {
            width: '25%',
            placeholder: '🇷🇸',
            components: {
              Field: '@/components/admin/FlagPicker#FlagPicker',
            },
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Active',
          defaultValue: true,
          admin: { width: '25%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'countryCode',
          type: 'text',
          label: 'Country code(s)',
          required: true,
          admin: {
            width: '40%',
            description: 'ISO 3166-1 alpha-2 codes separated by commas. e.g. RS or HR,AT,DE,FR',
            placeholder: 'RS',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Distributor URL',
          required: true,
          admin: {
            width: '60%',
            placeholder: 'https://www.ogistra-nutrition-shop.com',
          },
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display order',
      defaultValue: 0,
      admin: {
        description:
          'Lower number = displayed first. Recommended markets should be placed at the top.',
      },
    },
  ],
}
