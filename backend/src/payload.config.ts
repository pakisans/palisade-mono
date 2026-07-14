import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import {
  BoldFeature,
  EXPERIMENTAL_TableFeature,
  IndentFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from '@/collections/Categories'
import { PostCategories } from '@/collections/PostCategories'
import { Posts } from '@/collections/Posts'
import { Brands } from '@/collections/Brands'
import { Coupons } from '@/collections/Coupons'
import { Markets } from '@/collections/Markets'
import { Media } from '@/collections/Media'
import { Pages } from '@/collections/Pages'
import { Tags } from '@/collections/Tags'
import { Users } from '@/collections/Users'
import { Clients } from '@/globals/Clients'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Settings } from '@/globals/Settings'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  // cors: [
  //   'http://46.225.222.58',
  //   // process.env.PAYLOAD_PUBLIC_SERVER_URL,
  //   // process.env.NEXT_PUBLIC_SERVER_URL,
  // ].filter(Boolean) as string[],
  // csrf: [
  //   'http://localhost:3000',
  //   'http://localhost:3001',
  //   'http://46.225.222.58',
  //   'http://46.225.222.58:3001',
  //   process.env.PAYLOAD_PUBLIC_SERVER_URL,
  //   process.env.NEXT_PUBLIC_SERVER_URL,
  // ].filter(Boolean) as string[],
  cors: '*',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Pages,
    Posts,
    Categories,
    PostCategories,
    Brands,
    Tags,
    Coupons,
    Markets,
    Media,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  editor: lexicalEditor({
    features: () => {
      return [
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        OrderedListFeature(),
        UnorderedListFeature(),
        LinkFeature({
          enabledCollections: ['pages'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: ({ linkType }) => linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),
        IndentFeature(),
        EXPERIMENTAL_TableFeature(),
      ]
    },
  }),
  // SMTP (Hostinger) — mailovi sa kontakt forme idu preko office@palisada.rs.
  // Aktivira se samo ako je SMTP_HOST postavljen; inače fallback na konzolu.
  // Slanje je FIRE-AND-FORGET (u pozadini) da submit forme ne čeka SMTP —
  // form-builder šalje mail u afterChange hook-u koji Payload await-uje.
  email: process.env.SMTP_HOST
    ? (async () => {
        const base = await nodemailerAdapter({
          defaultFromName: process.env.SMTP_FROM_NAME || 'Palisada',
          defaultFromAddress: process.env.SMTP_USER || 'office@palisada.rs',
          skipVerify: true,
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: (Number(process.env.SMTP_PORT) || 465) === 465, // 465 = SSL, 587 = STARTTLS
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
            pool: true, // reuse konekcije → brže sledeće slanje
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
          },
        })
        return (deps: any) => {
          const adapter = base(deps)
          return {
            ...adapter,
            // Ne blokiraj HTTP odgovor — pošalji u pozadini, greške samo loguj.
            sendEmail: (message: any) => {
              Promise.resolve()
                .then(() => adapter.sendEmail(message))
                .catch((err: any) =>
                  deps?.payload?.logger?.error?.(`SMTP slanje nije uspelo: ${err?.message || err}`),
                )
              return Promise.resolve({ messageId: 'queued', accepted: [], rejected: [] } as any)
            },
          }
        }
      })()
    : undefined,
  endpoints: [],
  globals: [Header, Footer, Clients, Settings],
  localization: {
    locales: [
      {
        code: 'sr',
        label: 'Srpski',
      },
      {
        code: 'en',
        label: 'English',
      },
    ],
    defaultLocale: 'sr',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Sharp is now an optional dependency -
  // if you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // sharp,
})
