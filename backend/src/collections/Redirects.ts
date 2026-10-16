import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

import { adminOnly } from '@/access/adminOnly'

/**
 * Normalizuje putanju: skida domen (ako je nalepljen ceo URL), dodaje vodeći '/'
 * i skida završni '/', da '/tag/kapija/' i '/tag/kapija' budu ista redirekcija.
 */
const normalizePath = (value: unknown): string => {
  let v = String(value ?? '').trim()
  if (!v) return v
  if (/^https?:\/\//i.test(v)) {
    try {
      const u = new URL(v)
      v = u.pathname + u.search
    } catch {
      // ostavi kako jeste, validacija će prijaviti grešku
    }
  }
  if (!v.startsWith('/')) v = `/${v}`
  if (v.length > 1) v = v.replace(/\/+$/, '')
  return v
}

/** Isto kao normalizePath, ali spoljne URL-ove ostavlja netaknute (za poređenje from/to). */
const comparablePath = (value: unknown): string => {
  const v = String(value ?? '').trim()
  if (/^https?:\/\//i.test(v)) return v
  return normalizePath(v)
}

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  labels: {
    singular: 'Redirekcija',
    plural: 'Redirekcije',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: () => true,
    update: adminOnly,
  },
  admin: {
    group: 'Podešavanja',
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'type', 'createdAt'],
    description:
      'Preusmeravanja starih URL-ova na nove. Izmene se primenjuju na sajtu u roku od oko minut.',
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.from) data.from = normalizePath(data.from)
        if (typeof data?.to === 'string') data.to = data.to.trim()
        return data
      },
    ],
  },
  fields: [
    {
      name: 'from',
      label: 'Sa (stara putanja)',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Npr. /tag/kapija. Domen i završni "/" se automatski skidaju.',
      },
      validate: ((value) => {
        if (!value || typeof value !== 'string') return 'Obavezno polje.'
        if (!value.startsWith('/')) return 'Putanja mora počinjati sa "/".'
        if (value === '/') return 'Početna stranica ne može biti preusmerena.'
        return true
      }) as TextFieldSingleValidation,
    },
    {
      name: 'to',
      label: 'Na (nova putanja ili URL)',
      type: 'text',
      required: true,
      admin: {
        description: 'Npr. /kategorija/kapije/ ili pun URL (https://...).',
      },
      validate: ((value, { siblingData }) => {
        if (!value || typeof value !== 'string') return 'Obavezno polje.'
        if (!value.startsWith('/') && !/^https?:\/\//i.test(value)) {
          return 'Mora počinjati sa "/" ili "http(s)://".'
        }
        if (comparablePath(value) === comparablePath((siblingData as { from?: string })?.from)) {
          return 'Odredište ne može biti isto kao izvor (petlja).'
        }
        return true
      }) as TextFieldSingleValidation,
    },
    {
      name: 'type',
      label: 'Tip',
      type: 'select',
      required: true,
      defaultValue: '301',
      options: [
        { label: '301 (trajno)', value: '301' },
        { label: '302 (privremeno)', value: '302' },
      ],
    },
  ],
}
