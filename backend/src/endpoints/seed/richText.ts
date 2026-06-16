type RichTextNode = any

const baseRoot = (children: RichTextNode[]) =>
  ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
}) as any

const textNode = (text: string): RichTextNode =>
  ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
}) as any

export const paragraph = (text: string): RichTextNode =>
  ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
}) as any

export const heading = (text: string, tag: 'h1' | 'h2' | 'h3' | 'h4' = 'h2'): RichTextNode =>
  ({
  type: 'heading',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  version: 1,
}) as any

export const bulletList = (items: string[]): RichTextNode =>
  ({
  type: 'list',
  children: items.map((item, index) => ({
    type: 'listitem',
    children: [textNode(item)],
    direction: 'ltr',
    format: '',
    indent: 0,
    value: index + 1,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  version: 1,
}) as any

export const richText = (...children: RichTextNode[]) => baseRoot(children)

export const contentColumnsBlock = (
  columns: Array<{ size?: 'oneThird' | 'half' | 'twoThirds' | 'full'; texts: RichTextNode[] }>,
) =>
  ({
  blockType: 'content',
  columns: columns.map((column) => ({
    size: column.size || 'full',
    richText: richText(...column.texts),
  })),
}) as any

export const quoteBlock = ({
  author,
  role,
  text,
  rating = '5',
}: {
  author: string
  role?: string
  text: string
  rating?: '5' | '4' | '3'
}) =>
  ({
  blockType: 'quote',
  author,
  role,
  text,
  rating,
}) as any

export const faqBlock = (
  headingText: string,
  items: Array<{ question: string; answer: string[] }>,
) =>
  ({
  blockType: 'faq',
  heading: headingText,
  items: items.map((item) => ({
    question: item.question,
    answer: richText(...item.answer.map((paragraphText) => paragraph(paragraphText))),
  })),
}) as any

export const statsBlock = (headingText: string, items: Array<{ label: string; value: string }>) =>
  ({
  blockType: 'stats',
  heading: headingText,
  items,
}) as any

export const missionBlock = ({
  eyebrow,
  heading,
  statement,
  values,
}: {
  eyebrow?: string
  heading: string
  statement: string
  values: Array<{ icon?: string; title: string; text?: string }>
}) =>
  ({
  blockType: 'mission',
  eyebrow,
  heading,
  statement,
  values: values.map((v) => ({ icon: v.icon ?? 'check', title: v.title, text: v.text })),
}) as any

export const whyUsBlock = ({
  eyebrow,
  heading,
  items,
}: {
  eyebrow?: string
  heading: string
  items: Array<{ icon?: string; title: string; text?: string }>
}) =>
  ({ blockType: 'whyUs', eyebrow, heading, items: items.map((i) => ({ icon: i.icon ?? 'check', title: i.title, text: i.text })) }) as any

export const servicesBlock = ({
  eyebrow,
  heading,
  intro,
  source = 'auto',
  items = [],
}: {
  eyebrow?: string
  heading: string
  intro?: string
  source?: 'auto' | 'manual'
  items?: Array<{ image?: any; title: string; href?: string; text?: string }>
}) => ({ blockType: 'services', eyebrow, heading, intro, source, items }) as any

export const projectsPreviewBlock = ({
  eyebrow,
  heading,
  intro,
  ctaLabel = 'Svi projekti',
  limit = 4,
}: {
  eyebrow?: string
  heading: string
  intro?: string
  ctaLabel?: string
  limit?: number
}) => ({ blockType: 'projectsPreview', eyebrow, heading, intro, ctaLabel, limit }) as any

export const testimonialsBlock = ({
  eyebrow,
  heading,
  intro,
  items,
}: {
  eyebrow?: string
  heading: string
  intro?: string
  items: Array<{ text: string; author: string; role?: string; avatar?: any; rating?: string }>
}) =>
  ({ blockType: 'testimonials', eyebrow, heading, intro, items: items.map((i) => ({ ...i, rating: i.rating ?? '5' })) }) as any

export const clientLogosBlock = ({
  heading,
  logos = [],
}: {
  heading?: string
  logos?: Array<{ image: any; name?: string }>
}) => ({ blockType: 'clientLogos', heading: heading ?? 'Preko 700 firmi ogradila je PALISADA', logos }) as any

export const spacerBlock = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md', showDivider = false) =>
  ({
  blockType: 'spacer',
  size,
  showDivider,
}) as any

export const ctaBlock = ({
  body,
  links,
  title,
}: {
  body: string[]
  links: Array<{ appearance?: 'default' | 'outline'; label: string; url: string }>
  title: string
}) =>
  ({
  blockType: 'cta',
  richText: richText(heading(title, 'h2'), ...body.map((text) => paragraph(text))),
  links: links.map((link) => ({
    link: {
      type: 'custom',
      appearance: link.appearance || 'default',
      label: link.label,
      url: link.url,
    },
  })),
}) as any

export const videoBlock = ({
  caption,
  platform = 'youtube',
  url,
}: {
  caption?: string
  platform?: 'youtube' | 'vimeo' | 'direct'
  url: string
}) =>
  ({
  blockType: 'video',
  caption,
  platform,
  url,
  autoplay: false,
}) as any

export const brandStoryBlock = ({
  eyebrow,
  heading: headingText,
  description,
  layout = 'image-right',
  imageFit = 'cover',
  image,
  stats,
  cta,
}: {
  eyebrow?: string
  heading: string
  description: string[]
  layout?: 'image-right' | 'image-left'
  imageFit?: 'cover' | 'contain'
  image?: any
  stats?: Array<{ value: string; label: string }>
  cta?: { label: string; url: string }
}) =>
  ({
  blockType: 'brandStory',
  layout,
  imageFit,
  eyebrow,
  heading: headingText,
  description: richText(...description.map((t) => paragraph(t))),
  ...(image ? { image } : {}),
  stats: stats || [],
  cta: cta || { label: '', url: '' },
}) as any
