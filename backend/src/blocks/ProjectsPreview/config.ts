import type { Block } from 'payload'

export const ProjectsPreview: Block = {
  slug: 'projectsPreview',
  interfaceName: 'ProjectsPreviewBlock',
  labels: { singular: 'Pregled projekata', plural: 'Pregled projekata' },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, admin: { width: '40%' } },
        { name: 'heading', type: 'text', localized: true, admin: { width: '60%' } },
      ],
    },
    { name: 'intro', type: 'textarea', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', localized: true, defaultValue: 'Svi projekti', admin: { width: '60%' } },
        { name: 'limit', type: 'number', defaultValue: 4, min: 2, max: 8, admin: { width: '40%' } },
      ],
    },
  ],
}
