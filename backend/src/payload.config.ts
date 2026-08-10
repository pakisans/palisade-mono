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

/**
 * SMTP lozinka.
 *
 * U produkciji stiže kao `SMTP_PASS_B64` (base64), zato što se `backend/.env`
 * učitava preko docker compose `env_file` — specijalni znaci ($, #, ", `) u
 * plain vrednosti umeju da budu interpolirani ili odsečeni, pa se lozinka
 * tiho pokvari i autentikacija pada bez ikakve poruke. Base64 nema nijedan
 * takav znak. `SMTP_PASS` ostaje podržan za lokalni razvoj.
 */
const resolveSmtpPass = (): string | undefined => {
  const b64 = process.env.SMTP_PASS_B64
  if (b64) return Buffer.from(b64, 'base64').toString('utf8')
  return process.env.SMTP_PASS
}

/** Pun nodemailer kontekst greške — sam `message` je najčešće beskoristan. */
const describeSmtpError = (err: any): string =>
  `code=${err?.code} responseCode=${err?.responseCode} command=${err?.command} response=${err?.response} message=${err?.message || err}`

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
        const smtpPort = Number(process.env.SMTP_PORT) || 465
        const smtpSecure = smtpPort === 465 // 465 = SSL, 587 = STARTTLS
        const base = await nodemailerAdapter({
          defaultFromName: process.env.SMTP_FROM_NAME || 'Palisada',
          defaultFromAddress: process.env.SMTP_USER || 'office@palisada.rs',
          // Proveri kredencijale pri startu — adapter samo loguje grešku
          // (`Error verifying Nodemailer transport`) i NE puca, pa je bezbedno.
          // Bez ovoga pogrešna lozinka nema nikakav signal dok neko ne pošalje formu.
          skipVerify: false,
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: smtpPort,
            secure: smtpSecure,
            auth: { user: process.env.SMTP_USER, pass: resolveSmtpPass() },
            pool: true, // reuse konekcije → brže sledeće slanje
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 20000,
          },
        })
        return (deps: any) => {
          const adapter = base(deps)
          const log = deps?.payload?.logger

          log?.info?.(
            `SMTP konfigurisan — ${process.env.SMTP_HOST}:${smtpPort} (secure=${smtpSecure}) kao ${process.env.SMTP_USER}, lozinka iz ${process.env.SMTP_PASS_B64 ? 'SMTP_PASS_B64' : 'SMTP_PASS'}`,
          )

          return {
            ...adapter,
            // Ne blokiraj HTTP odgovor — pošalji u pozadini, ishod loguj.
            sendEmail: (message: any) => {
              Promise.resolve()
                .then(() => adapter.sendEmail(message))
                .then((info: any) =>
                  log?.info?.(
                    `SMTP poslato → ${message?.to} (messageId=${info?.messageId}, accepted=${info?.accepted}, rejected=${info?.rejected})`,
                  ),
                )
                .catch((err: any) =>
                  log?.error?.(`SMTP slanje nije uspelo (to=${message?.to}) — ${describeSmtpError(err)}`),
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
