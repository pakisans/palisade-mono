import { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import { revalidateProducts, revalidateProductsDelete } from '@/hooks/revalidateShop'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { flexibleContent } from '@/fields/flexibleContent'
import { priceFields } from '@/fields/price'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import {
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  BlocksField,
  CheckboxField,
  DefaultDocumentIDType,
  Field,
  GroupField,
  RelationshipField,
  RowField,
  TabsField,
  TextareaField,
  TextField,
  Where,
  slugField,
} from 'payload'

const localizeField = <T extends Field>(field: T): T => {
  if ('name' in field && ['title', 'description'].includes(String(field.name))) {
    return {
      ...field,
      localized: true,
    }
  }

  return field
}

const pluginSidebarFieldNames = new Set([
  'inventory',
  'enableVariants',
  'variantTypes',
  'priceInUSDEnabled',
  'priceInUSD',
  '_status',
])

const isPluginSidebarField = (field: Field) =>
  'name' in field && typeof field.name === 'string' && pluginSidebarFieldNames.has(field.name)

const isProductTabsField = (field: Field): field is TabsField => field.type === 'tabs'
const isProductBlocksField = (field: Field): field is BlocksField =>
  field.type === 'blocks' && 'name' in field && field.name === 'layout'
const isProductRelationshipField = (field: Field): field is RelationshipField =>
  field.type === 'relationship' && 'name' in field && typeof field.name === 'string'
const isProductCheckboxField = (field: Field): field is CheckboxField =>
  field.type === 'checkbox' && 'name' in field && typeof field.name === 'string'
const isProductTextField = (field: Field): field is TextField =>
  field.type === 'text' && 'name' in field && typeof field.name === 'string'
const isProductTextareaField = (field: Field): field is TextareaField =>
  field.type === 'textarea' && 'name' in field && typeof field.name === 'string'
const isProductRowField = (field: Field): field is RowField => field.type === 'row'

const updateDefaultProductField = (field: Field): Field => {
  if (isPluginSidebarField(field)) {
    return {
      ...field,
      admin: {
        ...field.admin,
        position: 'sidebar',
      },
    } as Field
  }

  if (isProductTextField(field) && field.name === 'title') {
    return {
      ...field,
      localized: true,
      required: true,
    }
  }

  if (isProductTextareaField(field) && ['shortDescription', 'description'].includes(field.name)) {
    return {
      ...field,
      localized: true,
    }
  }

  if (isProductCheckboxField(field) && field.name === 'priceInUSDEnabled') {
    return {
      ...field,
      admin: {
        ...field.admin,
        description: 'Keep enabled when you want Stripe USD pricing available.',
      },
    }
  }

  if (isProductBlocksField(field)) {
    return flexibleContent({
      name: 'layout',
      label: 'Layout',
      initCollapsed: true,
    })
  }

  if (isProductRelationshipField(field) && field.name === 'categories') {
    return {
      ...field,
      admin: {
        ...field.admin,
        position: 'sidebar',
        sortOptions: {
          categories: 'title',
        },
      },
    } as Field
  }

  if (isProductTabsField(field)) {
    return {
      ...field,
      tabs: field.tabs.map((tab) => {
        const tabFields = tab.fields.map(updateDefaultProductField)

        if (tab.label === 'Content') {
          return {
            ...tab,
            fields: tabFields.map(localizeField),
          }
        }

        return {
          ...tab,
          fields: tabFields,
        }
      }),
    }
  }

  if (isProductRowField(field)) {
    return {
      ...field,
      fields: field.fields.map(updateDefaultProductField),
    }
  }

  return field
}

export const ProductsCollection: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  hooks: {
    ...defaultCollection?.hooks,
    afterChange: [...(defaultCollection?.hooks?.afterChange ?? []), revalidateProducts],
    afterDelete: [...(defaultCollection?.hooks?.afterDelete ?? []), revalidateProductsDelete],
  },
  admin: {
    ...defaultCollection?.admin,
    group: 'Prodavnica',
    defaultColumns: ['title', 'price', '_status', 'categories'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'products',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'products',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    ...defaultCollection?.defaultPopulate,
    title: true,
    slug: true,
    variantOptions: true,
    variants: true,
    enableVariants: true,
    gallery: true,
    priceInUSD: true,
    inventory: true,
    meta: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: false,
              required: false,
              localized: true,
            },
            {
              name: 'gallery',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'variantOption',
                  type: 'relationship',
                  relationTo: 'variantOptions',
                  hasMany: true,
                  admin: {
                    condition: (data) => {
                      return data?.enableVariants === true && data?.variantTypes?.length > 0
                    },
                  },
                  filterOptions: ({ data }) => {
                    if (data?.enableVariants && data?.variantTypes?.length) {
                      const variantTypeIDs = data.variantTypes.map((item: any) => {
                        if (typeof item === 'object' && item?.id) {
                          return item.id
                        }
                        return item
                      }) as DefaultDocumentIDType[]

                      if (variantTypeIDs.length === 0)
                        return {
                          variantType: {
                            in: [],
                          },
                        }

                      const query: Where = {
                        variantType: {
                          in: variantTypeIDs,
                        },
                      }

                      return query
                    }

                    return {
                      variantType: {
                        in: [],
                      },
                    }
                  },
                },
              ],
            },
            flexibleContent({ name: 'layout', label: 'Layout' }),
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'badges',
              type: 'array',
              labels: {
                singular: 'Badge',
                plural: 'Badges',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: 'highlights',
              type: 'array',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: 'specifications',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      localized: true,
                      required: true,
                      admin: {
                        width: '40%',
                      },
                    },
                    {
                      name: 'value',
                      type: 'text',
                      localized: true,
                      required: true,
                      admin: {
                        width: '60%',
                      },
                    },
                  ],
                },
              ],
            },
          ],
          label: 'Details',
        },
        {
          fields: [
            ...priceFields,
            ...defaultCollection.fields.map(updateDefaultProductField),
          ],
          label: 'Pricing',
        },
        {
          fields: [
            {
              name: 'relatedProducts',
              type: 'relationship',
              filterOptions: ({ id }) => {
                if (id) {
                  return {
                    id: {
                      not_in: [id],
                    },
                  }
                }

                // ID comes back as undefined during seeding so we need to handle that case
                return {
                  id: {
                    exists: true,
                  },
                }
              },
              hasMany: true,
              relationTo: 'products',
            },
            {
              name: 'brand',
              type: 'relationship',
              relationTo: 'brands',
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
            {
              name: 'upsell',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
            },
            {
              name: 'crossSell',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
            },
          ],
          label: 'Relationships',
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
    {
      name: 'categories',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'categories',
    },
    {
      name: 'visibility',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      defaultValue: 'catalog',
      options: [
        { label: 'Catalog & Search', value: 'catalog' },
        { label: 'Catalog Only', value: 'catalogOnly' },
        { label: 'Search Only', value: 'searchOnly' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },
    slugField(),
  ],
})
