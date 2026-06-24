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
      label: 'Slika hero-a',
      admin: {
        description: 'Opciono. Dostupno na svakom hero-u osim „None".',
        condition: (_, { type } = {}) => Boolean(type) && type !== 'none',
      },
      relationTo: 'media',
    },
    {
      name: 'mediaStyle',
      type: 'select',
      defaultValue: 'standard',
      label: 'Prikaz slike',
      options: [
        { label: 'Standardno (mala slika sa strane, fokus na tekst)', value: 'standard' },
        { label: 'Full cover (slika preko celog hero-a)', value: 'cover' },
      ],
      admin: {
        description:
          'Standardno: slika sa strane, svetla pozadina. Full cover: slika ispunjava ceo hero (tamni preliv, beli tekst) — kao Brand Story.',
        condition: (_, { type, media } = {}) =>
          Boolean(type) && type !== 'none' && Boolean(media),
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
