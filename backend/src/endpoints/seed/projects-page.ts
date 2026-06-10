import type { Media } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  contentColumnsBlock,
  ctaBlock,
  faqBlock,
  heading,
  paragraph,
  richText,
  spacerBlock,
  statsBlock,
} from './richText'

type ProjectsArgs = {
  heroImage: Media
  metaImage: Media
}

/**
 * CMS content for the `/projekti` page (sections/design only).
 *
 * The actual project cards are rendered dynamically by the frontend from posts
 * in the `gotovi-projekti` category — so this page intentionally contains NO
 * project "gallery" blocks. The frontend injects the live grid between the
 * intro content and the closing FAQ/CTA.
 */
export const projectsPageData: (args: ProjectsArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => ({
  slug: 'projekti',
  title: 'Gotovi projekti',
  _status: 'published',
  hero: {
    type: 'mediumImpact',
    media: heroImage,
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Zatražite ponudu',
          url: '/kontakt',
        },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Pogledajte kategorije',
          url: '/kategorije/kapije',
        },
      },
    ],
    richText: richText(
      heading('Gotovi projekti kapija i ograda', 'h1'),
      paragraph(
        'Pogledajte kapije i ograde koje smo projektovali, izradili i montirali širom Srbije — od porodičnih kuća i stambenih objekata do poslovnih i industrijskih kompleksa.',
      ),
    ),
  },
  layout: [
    statsBlock('Zašto baš mi', [
      { value: '700+', label: 'Realizovanih projekata' },
      { value: '20+', label: 'Godina iskustva' },
      { value: 'Srbija', label: 'Pokrivenost montažom' },
      { value: 'RAL', label: 'Boje i završna obrada po izboru' },
    ]),
    contentColumnsBlock([
      {
        size: 'half',
        texts: [
          heading('Svako rešenje po meri objekta', 'h2'),
          paragraph(
            'Svaki teren ima drugačiju širinu otvora, podlogu, nagib i način korišćenja. Zato svaki projekat počinjemo izlaskom na lice mesta, merenjem i predlogom rešenja prilagođenog vašem objektu i budžetu.',
          ),
        ],
      },
      {
        size: 'half',
        texts: [
          heading('Sve iz jedne ruke', 'h2'),
          paragraph(
            'Kapiju, ogradu, stubove, ispune, automatiku i RAL boju usklađujemo u jedan sistem. Preuzimamo projektovanje, proizvodnju, isporuku i montažu — uz garanciju na izradu i ugradnju.',
          ),
        ],
      },
    ]),
    spacerBlock('sm', true),
    faqBlock('Česta pitanja o projektima', [
      {
        question: 'Da li izlazite na teren pre izrade ponude?',
        answer: [
          'Da. Dolazimo na lice mesta, uzimamo mere i proveravamo uslove za montažu (podloga, nagib, priključci za automatiku). Tek nakon toga šaljemo preciznu ponudu.',
        ],
      },
      {
        question: 'Koliko traje izrada i montaža?',
        answer: [
          'Rok zavisi od tipa kapije ili ograde i dužine, ali za većinu projekata izrada i montaža se završavaju u dogovorenom terminu nakon potvrde ponude i mera.',
        ],
      },
      {
        question: 'Da li radite montažu širom Srbije?',
        answer: [
          'Da. Isporuku i montažu radimo na celoj teritoriji Srbije, a po dogovoru i šire.',
        ],
      },
    ]),
    ctaBlock({
      title: 'Želite ovakav projekat na svom objektu?',
      body: [
        'Pošaljite nam fotografije lokacije i približne mere. Odgovaramo u roku od 24 sata i predlažemo rešenje, izlazimo na merenje i šaljemo ponudu.',
      ],
      links: [
        { label: 'Pošaljite upit', url: '/kontakt' },
        { appearance: 'outline', label: 'Pogledajte kapije', url: '/kategorije/kapije' },
      ],
    }),
  ],
  meta: {
    title: 'Gotovi projekti kapija i ograda | Palisade',
    description:
      'Galerija realizovanih projekata: kapije, panelne i aluminijumske ograde, automatizacija i kontrola pristupa. Pogledajte naše radove širom Srbije.',
    image: metaImage,
  },
})
