import type { Block } from 'payload'

export const ClientLogos: Block = {
  slug: 'clientLogos',
  interfaceName: 'ClientLogosBlock',
  labels: { singular: 'Logoi klijenata', plural: 'Logoi klijenata' },
  fields: [
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Preko 700 firmi ogradila je PALISADA' },
    {
      name: 'logos',
      type: 'array',
      labels: { singular: 'Logo', plural: 'Logoi' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', required: true, admin: { width: '60%' } },
            { name: 'name', type: 'text', admin: { width: '40%' } },
          ],
        },
      ],
    },
  ],
}
