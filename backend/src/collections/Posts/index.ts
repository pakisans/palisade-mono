import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnly } from '@/access/adminOnly'
import { flexibleContent } from '@/fields/flexibleContent'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { revalidatePost, revalidatePostDelete } from './hooks/revalidatePost'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: adminOrPublishedStatus,
    update: adminOnly,
  },
  admin: {
    group: 'Sadržaj',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedOn', '_status'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'posts',
          req,
          slug: data?.slug,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'posts',
        req,
        slug: data?.slug as string,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField(),
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }

            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
              required: true,
            },
            flexibleContent({
              name: 'layout',
              label: 'Layout',
              maxRows: 60, // project galleries can hold many image blocks
            }),
          ],
        },
        {
          label: 'Relationships',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'post-categories',
              hasMany: true,
              required: true,
            },
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'posts',
              hasMany: true,
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                return {
                  id: {
                    exists: true,
                  },
                }
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                localized: true,
              },
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({
              overrides: {
                localized: true,
              },
            }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 50,
  },
}
