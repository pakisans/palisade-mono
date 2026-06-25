import type { Block } from 'payload'

/**
 * „O nama" sekcija (misija) — video sa strane + bela kartica sa misijom i bullet-ima.
 * Kao Brand Story na slici, ali bez statistike i sa videom umesto slike.
 */
export const AboutMission: Block = {
  slug: 'aboutMission',
  interfaceName: 'AboutMissionBlock',
  labels: { singular: 'O nama — misija (video)', plural: 'O nama — misija (video)' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'mediaSide',
          type: 'select',
          defaultValue: 'left',
          label: 'Strana videa',
          options: [
            { label: 'Video levo / tekst desno', value: 'left' },
            { label: 'Video desno / tekst levo', value: 'right' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: { width: '50%', placeholder: 'npr. Upoznajte Palisadu' },
        },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Naslov sekcije.' },
    },
    {
      name: 'headingAccent',
      type: 'text',
      localized: true,
      admin: {
        description:
          'Deo naslova koji se boji brand-zelenom (mora se nalaziti u naslovu). npr. „Beogradu i Srbiji".',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video (YouTube URL)',
      admin: {
        description: 'YouTube URL — prikazuje se video umesto slike (sam se pušta, bez zvuka).',
        placeholder: 'https://www.youtube.com/watch?v=…',
      },
    },
    {
      name: 'videoCover',
      type: 'checkbox',
      label: 'Full cover video',
      defaultValue: true,
      admin: {
        description:
          'Uključeno: video prekriva ceo okvir (crop sa strana). Isključeno: ceo video uklopljen (16:9, sa crnim ivicama gore/dole).',
        condition: (_, { videoUrl } = {}) => Boolean(videoUrl),
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Slika (fallback ako nema videa)',
    },
    {
      name: 'cardTitle',
      type: 'text',
      localized: true,
      defaultValue: 'Naša misija',
      label: 'Naslov kartice',
    },
    {
      name: 'statement',
      type: 'textarea',
      localized: true,
      required: true,
      label: 'Tekst misije',
    },
    {
      name: 'bullets',
      type: 'array',
      label: 'Stavke (bullet)',
      maxRows: 6,
      fields: [{ name: 'text', type: 'text', localized: true, required: true }],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Dugme',
      admin: { description: 'Opciono dugme ispod kartice.' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: 'npr. Kontakt i informacije' },
            },
            { name: 'url', type: 'text', admin: { width: '50%', placeholder: '/kontakt' } },
          ],
        },
      ],
    },
  ],
}
