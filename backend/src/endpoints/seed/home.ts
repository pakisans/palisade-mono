import type { Media } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  brandStoryBlock,
  contentColumnsBlock,
  ctaBlock,
  faqBlock,
  heading,
  paragraph,
  quoteBlock,
  richText,
  spacerBlock,
  statsBlock,
} from './richText'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const homePageData: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => ({
  slug: 'home',
  title: 'Naslovna',
  _status: 'published',
  hero: {
    type: 'highImpact',
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
          label: 'Naši projekti',
          url: '/blog',
        },
      },
    ],
    richText: richText(
      heading('Kapije i ograde po meri za Beograd i celu Srbiju', 'h1'),
      paragraph(
        'Vrhunski kvalitet, realne cene i profesionalna montaža. Projektujemo i izrađujemo kapije i ograde tačno po vašim merama — uz besplatno merenje i konsultaciju na terenu.',
      ),
    ),
  },
  layout: [
    statsBlock('Zašto izabrati Palisade?', [
      { value: '700+', label: 'Zadovoljnih kompanija' },
      { value: '20+', label: 'Godina iskustva' },
      { value: '98%', label: 'Zadovoljnih klijenata' },
      { value: '4.9/5', label: 'Ocena na Google-u' },
    ]),
    contentColumnsBlock([
      {
        size: 'oneThird',
        texts: [
          heading('Izrada po meri', 'h3'),
          paragraph(
            'Svaki projekat je jedinstven. Projektujemo i izrađujemo kapije i ograde tačno prema vašim merama i zahtevima, od aluminijuma do modernih panelnih sistema.',
          ),
        ],
      },
      {
        size: 'oneThird',
        texts: [
          heading('Profesionalna montaža', 'h3'),
          paragraph(
            'Tim iskusnih montera izvodi ugradnju brzo i precizno širom Srbije — Beograd, Novi Sad, Niš, Kragujevac. Puna garancija na rad i materijal.',
          ),
        ],
      },
      {
        size: 'oneThird',
        texts: [
          heading('Besplatno merenje', 'h3'),
          paragraph(
            'Dolazimo na lice mesta, izmerimo prostor, damo stručnu preporuku i pošaljemo ponudu — sve bez naknade i bez ikakve obaveze sa vaše strane.',
          ),
        ],
      },
    ]),
    brandStoryBlock({
      eyebrow: 'Ko smo mi',
      heading: 'Jedna od najvećih kompanija za kapije i ograde u Srbiji',
      description: [
        'Palisade d.o.o. je osnovana sa jasnom misijom — da svakom domaćinstvu i poslovnom objektu u Srbiji obezbedi kapije i ograde koje spajaju bezbednost, trajnost i estetiku.',
        'Verujemo da kvalitetna ograda nije samo fizička barijera, već i prvi utisak koji vaš prostor ostavlja na posetioce. Naši proizvodi su izrađeni od premium materijala sa antikorozivnom zaštitom i dostupni u svim RAL bojama.',
        'Klijenti nam veruju zbog individualnog pristupa svakom projektu, sopstvene produkcije u Beogradu i profesionalnog tima koji stoji iza svake ugradnje.',
      ],
      layout: 'image-right',
      stats: [
        { value: '700+', label: 'Kompanija koje su nam verovale' },
        { value: '20+', label: 'Godina u industriji' },
        { value: '80+', label: 'Google recenzija' },
        { value: '4.9/5', label: 'Prosečna ocena' },
      ],
      cta: { label: 'Saznajte više o nama', url: '/o-nama' },
    }),
    quoteBlock({
      text: 'Sarađujemo sa Palisade već više od 3 godine i uvek smo zadovoljni — od panelnih ograda do automatizovanih kapija. Profesionalnost, tačnost i kvalitet rada su na najvišem nivou.',
      author: 'Marko Nikolić',
      role: 'Logistički direktor, Frikom',
      rating: '5',
    }),
    quoteBlock({
      text: 'Ograda i ulazna kapija savršeno se uklapaju u arhitekturu kuće. Cena je bila fer, isporuka za 3 nedelje kako su obećali, a montaža obavljena za jedan dan. Preporučujem svima.',
      author: 'Milica Petrović',
      role: 'Vlasnica nekretnine, Dedinje, Beograd',
      rating: '5',
    }),
    faqBlock('Česta pitanja', [
      {
        question: 'Šta sve nudite od kapija i ograda?',
        answer: [
          'Izrađujemo pešačke kapije, dvokrilne kapije, klizne kapije i samonosive kapije. Od ograda nudimo 2D i 3D panelne ograde i aluminijumske ograde. Svi proizvodi su dostupni u različitim dimenzijama i RAL bojama.',
        ],
      },
      {
        question: 'Kolika je cena po tekućem metru?',
        answer: [
          'Cena zavisi od vrste proizvoda, materijala, dimenzija i lokacije montaže. Kontaktirajte nas za besplatnu procenu — dolazimo na merenje bez naknade i šaljemo ponudu isti dan.',
        ],
      },
      {
        question: 'Da li dolazite na merenje besplatno?',
        answer: [
          'Da, merenje i konsultacija su potpuno besplatni. Naš tim dolazi na lice mesta, izmeri prostor, da stručnu preporuku i sačini ponudu bez ikakve obaveze sa vaše strane.',
        ],
      },
      {
        question: 'Koliko traje izrada i montaža?',
        answer: [
          'Standardni rok isporuke je 7 do 30 radnih dana, u zavisnosti od složenosti projekta. Montaža se najčešće obavlja za jedan radni dan.',
        ],
      },
      {
        question: 'Da li pokrivate celu Srbiju?',
        answer: [
          'Da, naši monteri rade na celoj teritoriji Srbije. Redovno smo prisutni u Beogradu, Novom Sadu, Nišu i Kragujevcu, ali dolazimo i u ostale gradove po dogovoru.',
        ],
      },
    ]),
    spacerBlock('sm', true),
    ctaBlock({
      title: 'Zatražite besplatnu procenu danas',
      body: [
        'Popunite kontakt formu ili nas pozovite — odgovaramo u roku od 24 sata i šaljemo detaljan predračun prilagođen vašem projektu.',
      ],
      links: [
        { label: 'Zatražite ponudu', url: '/kontakt' },
        { appearance: 'outline', label: 'Pozovite nas', url: 'tel:+381652227007' },
      ],
    }),
  ],
  meta: {
    title: 'Kapije i ograde po meri Beograd | Palisade d.o.o.',
    description:
      'Palisade d.o.o. — izrada i montaža kapija i ograda u Beogradu i celoj Srbiji. Besplatno merenje, stručna konsultacija i profesionalna ugradnja sa garancijom.',
    image: metaImage,
  },
})
