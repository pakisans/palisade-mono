import type { Block } from 'payload'

const ICON_OPTIONS = [
  { label: 'Kvačica', value: 'check' },
  { label: 'Štit (sigurnost)', value: 'shield' },
  { label: 'Lenjir (merenje)', value: 'ruler' },
  { label: 'Kamion (montaža)', value: 'truck' },
  { label: 'Alat (izrada)', value: 'wrench' },
  { label: 'Nagrada / garancija', value: 'award' },
  { label: 'Sat (rok)', value: 'clock' },
  { label: 'Sjaj (estetika)', value: 'sparkles' },
  { label: 'Ljudi / tim', value: 'users' },
]

export const WhyUs: Block = {
  slug: 'whyUs',
  interfaceName: 'WhyUsBlock',
  labels: { singular: 'Zašto mi', plural: 'Zašto mi' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, admin: { width: '40%' } },
        { name: 'heading', type: 'text', localized: true, admin: { width: '60%' } },
      ],
    },
    {
      name: 'items',
      type: 'array',
      maxRows: 6,
      labels: { singular: 'Stavka', plural: 'Stavke' },
      fields: [
        { name: 'icon', type: 'select', defaultValue: 'check', options: ICON_OPTIONS },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
  ],
}
