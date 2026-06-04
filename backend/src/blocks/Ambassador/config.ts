import type { Block } from 'payload'
import { lexicalEditor, BoldFeature, ItalicFeature, LinkFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'

export const Ambassador: Block = {
  slug: 'ambassador',
  interfaceName: 'AmbassadorBlock',
  labels: { singular: 'Ambassador', plural: 'Ambassadors' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'media-right',
          options: [
            { label: 'Text left / Video right', value: 'media-right' },
            { label: 'Video left / Text right', value: 'media-left' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: { width: '50%', placeholder: 'e.g. Official Ambassador' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
      admin: { placeholder: 'e.g. World Champion Powerlifter' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: () => [BoldFeature(), ItalicFeature(), UnorderedListFeature(), LinkFeature()],
      }),
    },
    {
      name: 'video',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              defaultValue: 'youtube',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Direct', value: 'direct' },
              ],
              admin: { width: '30%' },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: { width: '70%', placeholder: 'https://youtube.com/watch?v=...' },
            },
          ],
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional — shown as fallback if video cannot be embedded' },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      admin: { description: 'Optional button below the description' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'e.g. Shop Collection' },
            },
            {
              name: 'url',
              type: 'text',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
  ],
}
