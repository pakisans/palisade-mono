import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const FAQ: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          localized: true,
          required: true,
          editor: lexicalEditor({
            features: () => [
              BoldFeature(),
              ItalicFeature(),
              OrderedListFeature(),
              UnorderedListFeature(),
              LinkFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
