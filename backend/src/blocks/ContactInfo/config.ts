import type { Block } from 'payload'

export const ContactInfo: Block = {
  slug: 'contactInfo',
  interfaceName: 'ContactInfoBlock',
  labels: { singular: 'Kontakt info', plural: 'Kontakt info' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      defaultValue: 'Kontakt info',
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { width: '50%', placeholder: '+381 65 222 7007' } },
        {
          name: 'whatsapp',
          type: 'text',
          admin: { width: '50%', placeholder: 'https://wa.me/381652227007' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'text', admin: { width: '50%', placeholder: 'office@palisada.rs' } },
        {
          name: 'address',
          type: 'text',
          localized: true,
          admin: { width: '50%', placeholder: 'Zrenjaninski put 139E, Beograd' },
        },
      ],
    },
    {
      name: 'mapUrl',
      type: 'text',
      admin: { description: 'Google Maps link za adresu (opciono).' },
    },
  ],
}
