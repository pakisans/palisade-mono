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
  stats,
  cta,
}: {
  eyebrow?: string
  heading: string
  description: string[]
  layout?: 'image-right' | 'image-left'
  imageFit?: 'cover' | 'contain'
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
  stats: stats || [],
  cta: cta || { label: '', url: '' },
}) as any
