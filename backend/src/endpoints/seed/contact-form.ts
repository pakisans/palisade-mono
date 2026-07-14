import { RequiredDataFromCollectionSlug } from 'payload'

export const contactFormData: () => RequiredDataFromCollectionSlug<'forms'> = () => ({
  title: 'Forma za ponudu',
  confirmationType: 'message',
  confirmationMessage: {
    root: {
      type: 'root',
      children: [
        {
          type: 'heading',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Hvala na upitu!',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          tag: 'h2',
          version: 1,
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Vaš upit je uspešno primljen. Kontaktiraćemo vas u roku od 24 sata sa detaljnom ponudom.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  },
  emails: [
    {
      emailFrom: '"Palisada" <office@palisada.rs>',
      emailTo: 'office@palisada.rs',
      message: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Novi upit za ponudu je primljen putem kontakt forme na sajtu:',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  // {{*:table}} = form-builder ispisuje sva poslata polja kao HTML tabelu
                  text: '{{*:table}}',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
      subject: 'Novi upit za ponudu — Palisade',
    },
  ],
  fields: [
    {
      name: 'ime-prezime',
      blockName: 'ime-prezime',
      blockType: 'text',
      label: 'Ime i prezime',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'Email adresa',
      required: true,
      width: 50,
    },
    {
      name: 'telefon',
      blockName: 'telefon',
      blockType: 'text',
      label: 'Broj telefona',
      required: false,
      width: 50,
    },
    {
      name: 'detalji',
      blockName: 'detalji',
      blockType: 'textarea',
      label: 'Detalji projekta (vrsta, dimenzije, lokacija...)',
      required: true,
      width: 100,
    },
  ],
  redirect: undefined,
  submitButtonLabel: 'Pošalji upit',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
})
