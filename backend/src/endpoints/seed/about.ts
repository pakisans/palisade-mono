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
  hero: {
    type: 'lowImpact',
    media: heroImage,
    links: [],
    richText: richText(
      heading('Spoj vrhunskog kvaliteta i moderne estetike', 'h1'),
      paragraph(
        'Osiguravamo vaš prostor ogradama i kapijama koje traju generacijama. Upoznajte tim iza Palisade d.o.o.',
      ),
    ),
  },
  layout: [
    brandStoryBlock({
      eyebrow: 'Naša misija',
      heading: 'Bezbednost i estetika — bez kompromisa',
      description: [
        'Palisade d.o.o. je osnovana sa jasnom misijom — da svakom domaćinstvu i poslovnom objektu u Srbiji obezbedi kapije i ograde koje spajaju bezbednost, trajnost i estetiku.',
        'Godinama gradimo poverenje sa klijentima, od individualnih domaćinstava do velikih kompanija poput LIDL-a, Coca-Cole, Idee i Frikoma. Svaki projekat tretiramo sa istim stepenom pažnje i profesionalnosti.',
        'Sopstvena produkcija u Beogradu nam daje potpunu kontrolu kvaliteta — od odabira materijala do finalnog proizvoda koji stiže do vas.',
      ],
      layout: 'image-right',
      stats: [
        { value: '700+', label: 'Kompanija klijenata' },
        { value: '20+', label: 'Godina iskustva' },
        { value: '80+', label: 'Google recenzija' },
        { value: '4.9/5', label: 'Prosečna ocena' },
      ],
      cta: { label: 'Kontaktirajte nas', url: '/kontakt' },
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
