import type { Block } from 'payload'

export const Mission: Block = {
  slug: 'mission',
  interfaceName: 'MissionBlock',
  labels: {
    singular: 'Misija',
    plural: 'Misija',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, admin: { width: '40%' } },
        { name: 'heading', type: 'text', localized: true, admin: { width: '60%' } },
      ],
    },
    {
      name: 'statement',
      type: 'textarea',
      localized: true,
      admin: { description: 'Glavna izjava o misiji (jedan do dva pasusa).' },
    },
    {
      name: 'values',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Vrednost', plural: 'Vrednosti' },
      admin: { description: 'Stubovi / vrednosti (ikona + naslov + opis).' },
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'shield',
          options: [
            { label: 'Štit (sigurnost)', value: 'shield' },
            { label: 'Sjaj (estetika)', value: 'sparkles' },
            { label: 'Trajnost (sat)', value: 'clock' },
            { label: 'Alat (usluga)', value: 'wrench' },
            { label: 'Nagrada / garancija', value: 'award' },
            { label: 'Ljudi / tim', value: 'users' },
            { label: 'Kvačica', value: 'check' },
          ],
        },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}
