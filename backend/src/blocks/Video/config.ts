import type { Block } from 'payload'

export const Video: Block = {
  slug: 'video',
  interfaceName: 'VideoBlock',
  labels: {
    singular: 'Video',
    plural: 'Videos',
  },
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
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'autoplay',
          type: 'checkbox',
          defaultValue: false,
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
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'caption',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
