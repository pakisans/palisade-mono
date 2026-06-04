import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOnly,
    update: adminOnly,
  },
  admin: {
    group: 'Prodavnica',
    useAsTitle: 'code',
    defaultColumns: ['code', 'active', 'type', 'value', 'updatedAt'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            style: {
              alignSelf: 'flex-end',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'fixed',
          options: [
            { label: 'Percentage', value: 'percentage' },
            { label: 'Fixed', value: 'fixed' },
          ],
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'value',
          type: 'number',
          min: 0,
          required: true,
          admin: {
            step: 1,
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'minimumOrderAmount',
          type: 'number',
          min: 0,
          admin: {
            step: 1,
            width: '50%',
          },
        },
        {
          name: 'usageLimit',
          type: 'number',
          min: 1,
          admin: {
            step: 1,
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startsAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
        {
          name: 'endsAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
        step: 1,
      },
    },
    {
      name: 'targetProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'targetCategories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
}
