import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'

import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Page, Post, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { publicAccess } from '@/access/publicAccess'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { checkRole } from '@/access/utilities'
import { getCollectionPath } from '@/utilities/getCollectionPath'

const generateTitle: GenerateTitle<Product | Page | Post> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Palisade` : 'Palisade'
}

const generateURL: GenerateURL<Product | Page | Post> = ({ collectionConfig, doc }) => {
  const url = getServerSideURL()

  return doc?.slug
    ? `${url}${getCollectionPath({ collection: collectionConfig?.slug, slug: doc.slug })}`
    : url
}

export const plugins: Plugin[] = [
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      access: {
        // Svako (anoniman posetilac) sme da pošalje upit; čitanje/izmena/brisanje samo admin.
        create: publicAccess,
        read: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      admin: {
        group: 'Sadržaj',
      },
    },
    formOverrides: {
      access: {
        // Javno čitanje: frontend (nelogovan) mora pročitati strukturu forme da bi je iscrtao.
        // Kreiranje/izmena/brisanje definicije forme ostaje samo za admina.
        read: publicAccess,
        create: isAdmin,
        update: isAdmin,
        delete: isAdmin,
      },
      admin: {
        group: 'Sadržaj',
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  ecommercePlugin({
    access: {
      adminOnlyFieldAccess,
      adminOrPublishedStatus,
      customerOnlyFieldAccess,
      isAdmin,
      isDocumentOwner,
    },
    customers: {
      slug: 'users',
    },
    orders: {
      ordersCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        access: {
          ...defaultCollection.access,
          // Allow anyone (guest, customer, admin) to place an order
          create: () => true,
          // Admin sees all; logged-in customer sees own orders; guest denied (reads via accessToken endpoint)
          read: ({ req }) => {
            if (req.user && checkRole(['admin'], req.user)) return true
            if (req.user?.id) return { customer: { equals: req.user.id } }
            return false
          },
        },
        admin: {
          ...defaultCollection.admin,
          group: 'Prodavnica',
        },
        fields: [
          ...defaultCollection.fields,
          {
            name: 'accessToken',
            type: 'text',
            unique: true,
            index: true,
            admin: {
              position: 'sidebar',
              readOnly: true,
            },
            hooks: {
              beforeValidate: [
                ({ value, operation }) => {
                  if (operation === 'create' || !value) {
                    return crypto.randomUUID()
                  }
                  return value
                },
              ],
            },
          },
        ],
      }),
    },
    payments: {
      paymentMethods: [
        stripeAdapter({
          secretKey: process.env.STRIPE_SECRET_KEY!,
          publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
          webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
        }),
      ],
    },
    products: {
      productsCollectionOverride: ProductsCollection,
      variants: {
        variantOptionsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            hidden: true,
          },
        }),
        variantTypesCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            hidden: true,
          },
        }),
        variantsCollectionOverride: ({ defaultCollection }) => ({
          ...defaultCollection,
          admin: {
            ...defaultCollection.admin,
            hidden: true,
          },
          fields: [
            ...defaultCollection.fields,
            {
              // RSD cena po varijaciji (integer dinari), kao i na proizvodu
              name: 'price',
              type: 'number',
              min: 0,
              admin: { description: 'Cena ove varijacije u RSD (dinari, integer).' },
            },
          ],
        }),
      },
    },
    addresses: {
      addressesCollectionOverride: ({ defaultCollection }) => ({
        ...defaultCollection,
        admin: {
          ...defaultCollection.admin,
          hidden: true,
        },
      }),
    },
  }),
]
