import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from './linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { description: 'Mala oznaka iznad naslova (npr. „Premium kapije i ograde").' },
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'mediaStyle',
      type: 'select',
      defaultValue: 'standard',
      label: 'Prikaz slike',
      options: [
        { label: 'Standardno (tamni preliv, fokus na tekst)', value: 'standard' },
        { label: 'Full cover (slika preko celog, lakši preliv)', value: 'cover' },
      ],
      admin: {
        description:
          'Standardno: jak tamni gradijent, slika u pozadini iza teksta. Full cover: slika ispunjava ceo hero i dominira, blaži preliv samo radi čitljivosti.',
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'stats',
      type: 'array',
      label: 'Statistika (traka)',
      maxRows: 4,
      admin: { description: 'Brojevi u dnu hero-a (npr. 700+ / klijenata).' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '40%' } },
            { name: 'label', type: 'text', localized: true, required: true, admin: { width: '60%' } },
          ],
        },
      ],
    },
    {
      name: 'trust',
      type: 'array',
      label: 'Trust stavke',
      maxRows: 4,
      admin: { description: 'Kratke garancije (npr. Besplatno merenje).' },
      fields: [{ name: 'text', type: 'text', localized: true, required: true }],
    },
  ],
  label: false,
}
