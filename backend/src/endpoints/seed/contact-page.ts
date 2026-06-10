import type { Form, Media } from '@/payload-types'

import { RequiredDataFromCollectionSlug } from 'payload'

import {
  contentColumnsBlock,
  faqBlock,
  heading,
  paragraph,
  richText,
  spacerBlock,
  statsBlock,
} from './richText'

type ContactArgs = {
  contactForm: Form
  heroImage: Media
  metaImage: Media
}

export const contactPageData: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
  heroImage,
  metaImage,
}) => ({
  slug: 'kontakt',
  title: 'Kontakt',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    media: heroImage,
    links: [
      {
        link: {
          type: 'custom',
          appearance: 'default',
          label: 'Pošalji upit',
          url: '#contact-form',
        },
      },
    ],
    richText: richText(
      heading('Zatražite ponudu', 'h1'),
      paragraph(
        'Javite se i šaljemo vam ponudu još danas. Pošaljite detalje projekta za brži i precizniji odgovor.',
      ),
    ),
  },
  layout: [
    contentColumnsBlock([
      {
        size: 'half',
        texts: [
          heading('Prodaja i novi projekti', 'h2'),
          paragraph(
            'Trebate kapiju ili ogradu za stambeni ili poslovni objekat? Kontaktirajte nas i naš tim će vam pomoći da pronađete optimalno rešenje za vaš prostor i budžet.',
          ),
        ],
      },
      {
        size: 'half',
        texts: [
          heading('Servis i tehnička podrška', 'h2'),
          paragraph(
            'Ako ste već naš klijent i potrebna vam je servisna intervencija, zamena delova ili imate pitanje o garanciji — tu smo. Reagujemo u roku od jednog radnog dana.',
          ),
        ],
      },
    ]),
    statsBlock('Brzi pregled', [
      { value: '<24h', label: 'Rok za odgovor na upit' },
      { value: 'Besplatno', label: 'Merenje na terenu' },
      { value: '7–30', label: 'Dana rok isporuke' },
      { value: 'Srbija', label: 'Pokrivenost montažom' },
    ]),
    {
      blockType: 'formBlock',
      form: contactForm.id,
      enableIntro: true,
      introContent: richText(
        heading('Pošaljite nam detalje projekta', 'h3'),
        paragraph(
          'Što više detalja nam date (vrsta objekta, dimenzije, vrsta kapije/ograde), to brže i preciznije možemo sačiniti ponudu.',
        ),
      ),
    },
    spacerBlock('sm', true),
    faqBlock('Česta pitanja pre nego što pišete', [
      {
        question: 'Da li je merenje zaista besplatno?',
        answer: [
          'Da, u potpunosti. Naš tim dolazi na adresu, izmeri prostor i izradi ponudu — bez ikakve naknade i bez obaveze sa vaše strane.',
        ],
      },
      {
        question: 'Koliko brzo mogu dobiti ponudu?',
        answer: [
          'Ako nam pošaljete detalje projekta putem forme, odgovaramo u roku od 24 sata. Za hitne slučajeve dostupni smo i telefonski radnim danima od 08:00 do 16:00.',
        ],
      },
      {
        question: 'Radite li van Beograda?',
        answer: [
          'Da, naši monteri pokrivaju celu Srbiju. Redovno smo prisutni u Beogradu, Novom Sadu, Nišu i Kragujevcu, a po dogovoru dolazimo i u ostale gradove.',
        ],
      },
      {
        question: 'Kako mogu da ubrzam dobijanje ponude?',
        answer: [
          'Navedite vrstu kapije ili ograde, približne dimenzije prostora, lokaciju ugradnje i materijal (ako imate preferencije). Što više detalja, to brže i preciznije sačinimo predračun.',
        ],
      },
    ]),
  ],
  meta: {
    title: 'Kontakt | Zatražite ponudu — Palisade d.o.o.',
    description:
      'Kontaktirajte Palisade d.o.o. za besplatno merenje i ponudu za kapije i ograde. Odgovaramo u roku od 24 sata. Pokrivamo celu Srbiju.',
    image: metaImage,
  },
})
