import type { Media } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  brandStoryBlock,
  contentColumnsBlock,
  ctaBlock,
  faqBlock,
  heading,
  missionBlock,
  paragraph,
  quoteBlock,
  richText,
  statsBlock,
} from './richText'

type AboutArgs = {
  heroImage: Media
  metaImage: Media
}

export const aboutPageData: (args: AboutArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => ({
  slug: 'o-nama',
  title: 'O nama',
  _status: 'published',
  // Bez velikog hero-a — stranica počinje BrandStory blokom (samo tanka breadcrumb+H1 traka).
  hero: {
    type: 'none',
    media: heroImage,
    links: [],
  },
  layout: [
    brandStoryBlock({
      eyebrow: 'O nama',
      heading: 'Spoj vrhunskog kvaliteta i moderne estetike',
      description: [
        'Osiguravamo vaš prostor ogradama i kapijama koje traju generacijama. Palisade d.o.o. projektuje, izrađuje i montira kapije i ograde po meri — sa punom garancijom na rad i materijal.',
        'Iza svakog projekta stoji sopstvena produkcija u Beogradu i tim koji svaki posao tretira sa istom pažnjom — od porodične kuće do velikog industrijskog kompleksa.',
      ],
      layout: 'image-right',
      imageFit: 'contain',
      image: heroImage,
      stats: [
        { value: '700+', label: 'Kompanija klijenata' },
        { value: '20+', label: 'Godina iskustva' },
        { value: '80+', label: 'Google recenzija' },
        { value: '4.9/5', label: 'Prosečna ocena' },
      ],
      cta: { label: 'Kontaktirajte nas', url: '/kontakt' },
    }),
    missionBlock({
      eyebrow: 'Naša misija',
      heading: 'Kvalitetna ograda je prvi utisak vašeg objekta',
      statement:
        'Palisada d.o.o. osnovana je sa jasnom misijom – pružiti svakom domu i poslovnom objektu u Srbiji kapije i ograde koje kombinuju sigurnost, trajnost i estetiku. Verujemo da kvalitetna ograda nije samo fizička barijera, već prvi utisak koji vaš objekat ostavlja na svakog posetioca.',
      values: [
        { icon: 'shield', title: 'Sigurnost', text: 'Robusni materijali i precizna ugradnja za maksimalnu zaštitu doma i poslovnog objekta.' },
        { icon: 'clock', title: 'Trajnost', text: 'Toplo cinkovanje i plastifikacija — otpornost na koroziju i lep izgled decenijama.' },
        { icon: 'sparkles', title: 'Estetika', text: 'Dizajn po meri koji se uklapa u arhitekturu i podiže vrednost vašeg objekta.' },
        { icon: 'wrench', title: 'Kompletna usluga', text: 'Od besplatnog merenja i izrade do montaže i automatizacije — sve na jednom mestu.' },
      ],
    }),
    statsBlock('Palisade u brojevima', [
      { value: '700+', label: 'Zadovoljnih kompanija' },
      { value: '20+', label: 'Godina prisustva na tržištu' },
      { value: '4.9/5', label: 'Ocena na Google-u' },
      { value: '7–30', label: 'Dana rok isporuke' },
    ]),
    contentColumnsBlock([
      {
        size: 'oneThird',
        texts: [
          heading('Individualni pristup', 'h3'),
          paragraph(
            'Nijedan projekat nije isti. Svaki klijent dobija rešenje prilagođeno njegovim merama, zahtevima i budžetu — bez kompromisa u kvalitetu.',
          ),
        ],
      },
      {
        size: 'oneThird',
        texts: [
          heading('Sopstvena produkcija', 'h3'),
          paragraph(
            'Sve izrađujemo u sopstvenom pogonu u Beogradu. Kontrola kvaliteta na svakom koraku — od sirovine do ugradnje na terenu.',
          ),
        ],
      },
      {
        size: 'oneThird',
        texts: [
          heading('Pokrivenost Srbije', 'h3'),
          paragraph(
            'Montiramo širom Srbije — Beograd, Novi Sad, Niš, Kragujevac i šire. Puna garancija na rad i materijal uz stručnu podršku.',
          ),
        ],
      },
    ]),
    quoteBlock({
      text: 'Palisade je jedina firma kojoj smo dali poverenje za više projekata zaredom — i nikad nismo bili razočarani. Kvalitet, rokovi i komunikacija su uvek na nivou.',
      author: 'Stefan Jovanović',
      role: 'Direktor kompanije, dugogodišnji partner',
      rating: '5',
    }),
    quoteBlock({
      text: 'Ograde za školsko dvorište su postavljene stručno i brzo, a deca su odmah bila oduševljena modernim izgledom. Preporučujemo Palisade svim institucijama.',
      author: 'Ana Đorđević',
      role: 'Direktorka škole, Novi Beograd',
      rating: '5',
    }),
    faqBlock('Najčešća pitanja o saradnji sa Palisade', [
      {
        question: 'Da li radite samo u Beogradu?',
        answer: [
          'Ne. Beograd je naša baza, ali projekte kapija i ograda izvodimo širom Srbije. Za veće objekte i serijske montaže dogovaramo dinamiku izlaska na teren unapred.',
        ],
      },
      {
        question: 'Kako kontrolišete kvalitet pre montaže?',
        answer: [
          'Svaki element se proverava kroz dimenzije, zavarene spojeve, zaštitu od korozije i završnu plastifikaciju. Tek nakon interne kontrole proizvod se priprema za transport i ugradnju.',
        ],
      },
      {
        question: 'Da li radite i za firme i za privatne klijente?',
        answer: [
          'Da. Radimo dvorišne kapije i ograde za kuće, ali i panelne sisteme, kapije i kompleksna ograđivanja za poslovne, industrijske i javne objekte.',
        ],
      },
      {
        question: 'Šta treba pripremiti pre prvog razgovora?',
        answer: [
          'Dovoljno je da imate približnu lokaciju, vrstu objekta i okvirnu dužinu ograde ili širinu otvora za kapiju. Ako imate fotografije terena, one dodatno ubrzavaju procenu.',
        ],
      },
    ]),
    ctaBlock({
      title: 'Radimo zajedno?',
      body: [
        'Bez obzira da li imate tačne mere ili samo ideju — pozovite nas ili pošaljite upit. Dolazimo na merenje besplatno i dajemo vam ponudu isti dan.',
      ],
      links: [
        { label: 'Pošaljite upit', url: '/kontakt' },
        { appearance: 'outline', label: 'Pogledajte naše proizvode', url: '/proizvodi' },
      ],
    }),
  ],
  meta: {
    title: 'O nama | Palisade d.o.o.',
    description:
      'Saznajte više o Palisade d.o.o. — jednoj od najvećih i najpouzdanijih kompanija za kapije i ograde u Srbiji. Više od 20 godina iskustva, 700+ zadovoljnih klijenata.',
    image: metaImage,
  },
})
