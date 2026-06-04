import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const FooterText: Block = {
  slug: 'footerText',
  interfaceName: 'FooterTextBlock',
  labels: {
    singular: 'Footer Text',
    plural: 'Footer Text',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'content',
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
}
