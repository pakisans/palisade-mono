# Palisade — Backend (Payload CMS)

Payload CMS 3.80.0 sa ecommerce pluginom. Služi kao CMS, API i admin panel.

## Stack

| Stvar           | Verzija / detalj                    |
|-----------------|-------------------------------------|
| Payload         | 3.80.0                              |
| Next.js         | 16.2.1                              |
| DB adapter      | `@payloadcms/db-postgres` 3.80.0    |
| Plugins         | ecommerce, seo, form-builder        |
| Payments        | Stripe via `stripeAdapter`          |
| Language        | TypeScript                          |
| Package manager | pnpm@10.32.1                        |

## Pokretanje

```bash
pnpm install
pnpm dev                        # dev server na :3000 (externally :3001)
pnpm build && pnpm start
pnpm generate:types             # regeneriši payload-types.ts nakon izmjena sheme
pnpm payload migrate:fresh      # briši i ponovo kreira sve tabele (dev)
pnpm payload migrate:create     # kreiraj novu migraciju
pnpm payload migrate            # primijeni migracije
```

## .env (minimalno)

```
DATABASE_URL=postgresql://appuser:apppassword@localhost:5433/palisade
PAYLOAD_SECRET=some-random-secret
PREVIEW_SECRET=some-random-preview-secret
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOKS_SIGNING_SECRET=whsec_...
```

---

## Arhitekturne odluke (ne mijenjaj bez razloga)

1. **Lokalizacija** — `sr` default, `en` sekundarni. Tekstualna polja imaju `localized: true`. Cijene, slugovi, kuponi NISU lokalizovani.
2. **Cijene** — integer RSD dinari. 1999 = 1.999 RSD. `priceInUSD` od ecommerce plugina ostaje netaknut (Stripe).
3. **Flexible content** — `flexibleContent()` factory iz `src/fields/flexibleContent.ts`. Koristiti na svim kolekcijama.
4. **Products** — `CollectionOverride` pattern via ecommerce plugin. Ne pretvarati u standalone kolekciju.
5. **Admin jezik** — sve grupe i labele na srpskom.

---

## Admin grupe

| Grupa         | Šta sadrži                                      |
|---------------|-------------------------------------------------|
| `Prodavnica`  | Products, Brands, Tags, Coupons, Orders         |
| `Sadržaj`     | Pages, Posts, PostCategories, Media, Forms      |
| `Podešavanja` | Header, Footer, Markets                         |
| `Korisnici`   | Users                                           |

---

## Kolekcije (`src/collections/`)

| Slug              | Fajl                            | Napomena                             |
|-------------------|---------------------------------|--------------------------------------|
| `products`        | `Products/index.ts`             | CollectionOverride, ecommerce plugin |
| `categories`      | `Categories.ts`                 | Hijerarhijske (parent field)         |
| `brands`          | `Brands.ts`                     |                                      |
| `tags`            | `Tags.ts`                       |                                      |
| `coupons`         | `Coupons.ts`                    |                                      |
| `posts`           | `Posts/index.ts`                | Blog, drafts + autosave              |
| `post-categories` | `PostCategories.ts`             | Blog kategorije                      |
| `pages`           | `Pages/index.ts`                | CMS stranice, drafts                 |
| `markets`         | `Markets.ts`                    | Distributori / tržišta               |
| `media`           | `Media.ts`                      |                                      |
| `users`           | `Users/index.ts`                |                                      |

---

## Globali (`src/globals/`)

| Slug     | Fajl          |
|----------|---------------|
| `header` | `Header.ts`   |
| `footer` | `Footer.ts`   |

---

## Blokovi (`src/blocks/`)

Registruju se u `src/fields/flexibleContent.ts`.

**Content blokovi** (dostupni na stranicama, postovima, proizvodima):
`Banner`, `CallToAction`, `Content`, `MediaBlock`, `Carousel`, `ThreeItemGrid`,
`ArchiveBlock`, `Quote`, `FAQ`, `Stats`, `Video`, `Spacer`, `BrandStory`, `Ambassador`, `Code`, `Form`

**Footer blokovi** (samo Footer global):
`FooterBrand`, `FooterColumn`, `FooterText`, `FooterContact`, `FooterSocial`, `FooterNewsletter`

---

## Ključni fajlovi

| Fajl                                      | Svrha                                              |
|-------------------------------------------|----------------------------------------------------|
| `src/payload.config.ts`                   | Glavni config — kolekcije, globali, lokalizacija   |
| `src/plugins/index.ts`                    | Ecommerce, SEO, form-builder + Orders override     |
| `src/fields/flexibleContent.ts`           | Factory za content blokove                         |
| `src/fields/price.ts`                     | Reusable RSD price polja                           |
| `src/fields/seo.ts`                       | Manual SEO group (za kolekcije bez plugin-seo)     |
| `src/collections/Products/index.ts`       | CollectionOverride za Products                     |
| `src/hooks/revalidateShop.ts`             | ISR revalidacija na Next.js frontendu              |

---

## Česte greške

**TypeScript na `CollectionOverride`** — import mora biti `from '@payloadcms/plugin-ecommerce/types'`, ne iz `payload`.

**Slug se ne generiše** — `title` polje mora biti popunjeno.

**Lokalizovana polja prazna na `en`** — normalno uz `fallback: true`, vraća srpski.

**`defaultCollection.fields` undefined** — spread tek unutar tabova, ne na top levelu fields arraya.

**Blok se ne pojavljuje u CMS-u** — provjeri da je importovan u `flexibleContent.ts` i dodan u odgovarajući blok-set.

**Migracije se ne primjenjuju** — `pnpm payload migrate:fresh` za čistu bazu u developmentu.
