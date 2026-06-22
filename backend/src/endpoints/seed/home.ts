import type { Media } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  brandStoryBlock,
  clientLogosBlock,
  ctaBlock,
  faqBlock,
  heading,
  paragraph,
  projectsPreviewBlock,
  richText,
  servicesBlock,
  statsBlock,
  testimonialsBlock,
  whyUsBlock,
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
        link: { type: 'custom', appearance: 'default', label: 'Zatražite ponudu', url: '/kontakt' },
      },
      {
        link: {
          type: 'custom',
          appearance: 'outline',
          label: 'Pogledajte kategorije',
          url: '/kategorija/kapije',
        },
      },
    ],
    eyebrow: 'Premium kapije i ograde',
    richText: richText(
      heading('Kapije i ograde po meri za Beograd i celu Srbiju', 'h1'),
      paragraph(
        'Vrhunski kvalitet, realne cene i profesionalna montaža. Projektujemo i izrađujemo kapije i ograde tačno po vašim merama — uz besplatno merenje i konsultaciju na terenu.',
      ),
    ),
    stats: [
      { value: '700+', label: 'klijenata' },
      { value: '20+', label: 'godina iskustva' },
      { value: '4.9', label: 'Google ocena' },
      { value: '<24h', label: 'odgovor na upit' },
    ],
    trust: [
      { text: 'Besplatno merenje' },
      { text: 'Ugradnja po celoj Srbiji' },
      { text: 'Garancija na rad i materijal' },
    ],
  },
  layout: [
    // 1 — Logoi klijenata (logoe puni `pnpm seed:home`)
    clientLogosBlock({ heading: 'Preko 700 firmi ogradila je PALISADA' }),

    // 2 — Zašto baš Palisada
    whyUsBlock({
      eyebrow: 'Zašto baš Palisada',
      heading: 'Sve na jednom mestu — od ideje do montaže',
      items: [
        {
          icon: 'wrench',
          title: 'Izrada po meri',
          text: 'Projektujemo i izrađujemo tačno po vašim merama — od aluminijuma do modernih panelnih sistema.',
        },
        {
          icon: 'truck',
          title: 'Montaža širom Srbije',
          text: 'Iskusni monteri ugrađuju brzo i precizno — Beograd, Novi Sad, Niš, Kragujevac i šire.',
        },
        {
          icon: 'ruler',
          title: 'Besplatno merenje',
          text: 'Dolazimo na teren, izmerimo prostor i pošaljemo ponudu isti dan — bez naknade i obaveze.',
        },
        {
          icon: 'award',
          title: 'Garancija na rad',
          text: 'Puna garancija na materijal i ugradnju, uz antikorozivnu zaštitu i sve RAL boje.',
        },
      ],
    }),

    // 3 — Ko smo mi (+ video)
    brandStoryBlock({
      eyebrow: 'Ko smo mi',
      heading: 'Jedna od najvećih kompanija za kapije i ograde u Srbiji',
      description: [
        'Palisada d.o.o. je osnovana sa jasnom misijom — da svakom domaćinstvu i poslovnom objektu u Srbiji obezbedi kapije i ograde koje spajaju bezbednost, trajnost i estetiku.',
        'Naši proizvodi su izrađeni od premium materijala sa antikorozivnom zaštitom i dostupni u svim RAL bojama. Iza svake ugradnje stoji profesionalan tim i sopstvena produkcija u Beogradu.',
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

    // 4 — Naše usluge (iz kategorija)
    servicesBlock({
      eyebrow: 'Šta radimo',
      heading: 'Naše usluge',
      intro:
        'Kompletna ponuda kapija, ograda, automatizacije i kontrole pristupa — po meri vašeg objekta.',
      source: 'auto',
    }),

    // 5 — Realizovani projekti
    projectsPreviewBlock({
      eyebrow: 'Realizovano',
      heading: 'Projekti na koje smo ponosni',
      intro:
        'Pogledajte deo realizovanih kapija i ograda širom Srbije — od porodičnih kuća do velikih kompleksa.',
      ctaLabel: 'Svi projekti',
      limit: 4,
    }),

    // 6 — Statistika
    statsBlock('Palisade u brojevima', [
      { value: '700+', label: 'Zadovoljnih kompanija' },
      { value: '20+', label: 'Godina iskustva' },
      { value: '98%', label: 'Zadovoljnih klijenata' },
      { value: '4.9/5', label: 'Ocena na Google-u' },
    ]),

    // 7 — Recenzije (avatare/logoe puni `pnpm seed:home`)
    testimonialsBlock({
      eyebrow: 'Klijenti o nama',
      heading: 'Šta kažu naši klijenti',
      intro:
        'Preko 700 zadovoljnih klijenata širom Srbije — od porodičnih kuća do velikih industrijskih kompleksa.',
      items: [
        {
          text: 'Palisada nam je postavila panelnu ogradu oko celog magacinskog kompleksa na Zrenjaninskom putu. Sve je završeno u dogovorenom roku, a kvalitet materijala i ugradnje je izuzetan. Kapija sa automatikom radi besprekorno.',
          author: 'Marko Petrović',
          role: 'Direktor logistike',
        },
        {
          text: 'Tražili smo ogradu i kapiju za porodičnu kuću na Dedinju. Palisada je došla na merenje, predložila dizajn koji se savršeno uklapa u fasadu i isporučila sve u roku od tri nedelje. Odlična komunikacija i fer cena.',
          author: 'Jelena Stanković',
          role: 'Vlasnica kuće, Beograd',
        },
        {
          text: 'Kao firma, sarađujemo sa Palisadom na više projekata godišnje. Panelne ograde i ulazne kapije uvek stignu na vreme, kvalitet je konstantan. Posebno cenimo kompletnu uslugu – od merenja do montaže.',
          author: 'Dragan Jovanović',
          role: 'Direktor firme',
        },
        {
          text: 'Angažovali smo Palisadu za ograđivanje školskog dvorišta u Novom Beogradu. Ceo proces je bio profesionalan – od ponude do montaže. Ograda je čvrsta, bezbedna i izgleda moderno.',
          author: 'Ana Nikolić',
          role: 'Direktorka škole, Novi Beograd',
        },
      ],
    }),

    // 8 — FAQ
    faqBlock('Česta pitanja', [
      {
        question: 'Šta sve nudite od kapija i ograda?',
        answer: [
          'Izrađujemo jednokrilne, dvokrilne, klizne i samonosive kapije. Od ograda nudimo panelne i dekorativne ograde, automatizaciju i kontrolu pristupa. Svi proizvodi su dostupni u različitim dimenzijama i RAL bojama.',
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
          'Da, merenje i konsultacija su potpuno besplatni. Naš tim dolazi na lice mesta, izmeri prostor, da stručnu preporuku i sačini ponudu bez ikakve obaveze.',
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
          'Da, naši monteri rade na celoj teritoriji Srbije. Redovno smo prisutni u Beogradu, Novom Sadu, Nišu i Kragujevcu, a dolazimo i u ostale gradove po dogovoru.',
        ],
      },
    ]),

    // 9 — CTA
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
    title: 'Kapije i ograde po meri Beograd | Palisada d.o.o.',
    description:
      'Palisada d.o.o. — izrada i montaža kapija i ograda u Beogradu i celoj Srbiji. Besplatno merenje, stručna konsultacija i profesionalna ugradnja sa garancijom.',
    image: metaImage,
  },
})
