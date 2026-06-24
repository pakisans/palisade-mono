import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { revalidateSettings } from '@/hooks/revalidateShop'

/**
 * Globalna podešavanja sajta — jedan izvor istine za identitet sajta i SEO osnove.
 * `siteName` se koristi kao sufiks u svim meta naslovima ("<naslov> | <siteName>"),
 * a `siteUrl` kao baza za kanonske URL-ove, OG i sitemap.
 */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Podešavanja sajta',
  access: {
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Podešavanja',
  },
  hooks: {
    afterChange: [revalidateSettings],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      label: 'Naziv sajta (brend)',
      required: true,
      defaultValue: 'Palisada d.o.o.',
      admin: {
        description:
          'Koristi se kao sufiks u svim meta naslovima: „<naslov stranice> | <naziv sajta>".',
      },
    },
    {
      name: 'siteUrl',
      type: 'text',
      label: 'URL sajta',
      required: true,
      defaultValue: 'https://palisada.rs',
      admin: {
        description: 'Bazni URL (bez završne kose crte). Koristi se za kanonske URL-ove, OG i sitemap.',
      },
    },
    {
      name: 'defaultTitle',
      type: 'text',
      label: 'Podrazumevani naslov (početna / fallback)',
      localized: true,
      defaultValue: 'Kapije i ograde po meri',
    },
    {
      name: 'defaultDescription',
      type: 'textarea',
      label: 'Podrazumevani meta opis',
      localized: true,
    },
    {
      name: 'defaultOgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Podrazumevana OG slika',
    },
  ],
}
