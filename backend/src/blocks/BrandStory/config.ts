import type { Block } from 'payload'
import { lexicalEditor, BoldFeature, ItalicFeature, LinkFeature, UnorderedListFeature } from '@payloadcms/richtext-lexical'

export const BrandStory: Block = {
  slug: 'brandStory',
  interfaceName: 'BrandStoryBlock',
  labels: { singular: 'Brand Story', plural: 'Brand Stories' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'layout',
          type: 'select',
          defaultValue: 'image-right',
          options: [
            { label: 'Text left / Image right', value: 'image-right' },
            { label: 'Image left / Text right', value: 'image-left' },
          ],
          admin: { width: '33%' },
        },
        {
          name: 'imageFit',
          type: 'select',
          defaultValue: 'cover',
          options: [
            { label: 'Cropped / Cover', value: 'cover' },
            { label: 'Full Image / Contain', value: 'contain' },
          ],
          admin: {
            width: '33%',
            description: 'Cover crops the image to fill the frame. Contain shows the full image on a dark background — ideal for product shots.',
          },
        },
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: { width: '34%', placeholder: 'e.g. Our Story' },
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
      name: 'description',
      type: 'richText',
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: () => [BoldFeature(), ItalicFeature(), UnorderedListFeature(), LinkFeature()],
      }),
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'Optional YouTube URL — if set, a video embed replaces the image (e.g. CEO/company video).',
        placeholder: 'https://www.youtube.com/watch?v=…',
      },
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Up to 4 key figures displayed in a 2×2 grid' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '33%', placeholder: 'e.g. 10,000+' },
            },
            {
              name: 'label',
              type: 'text',
              localized: true,
              required: true,
              admin: { width: '67%', placeholder: 'e.g. Customers worldwide' },
            },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      admin: { description: 'Optional button below the text' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'e.g. Explore Our Products' },
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
