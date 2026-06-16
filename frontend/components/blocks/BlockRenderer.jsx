// Generic dispatcher: maps Payload `layout` blocks → React components.
// Reuses premium section components where they exist (cta, faq, stats, brandStory)
// and dedicated block components for the rest. Consecutive `mediaBlock`s are grouped
// into a premium MediaGallery (grid + fullscreen lightbox).

import { getMediaURL } from '@/lib/payload'

import ContentBlock from './ContentBlock'
import QuoteBlock from './QuoteBlock'
import BannerBlock from './BannerBlock'
import SpacerBlock from './SpacerBlock'
import VideoBlock from './VideoBlock'
import FormBlock from './FormBlock'
import ContactInfoBlock from './ContactInfoBlock'
import MissionBlock from './MissionBlock'
import MediaGallery from './MediaGallery'

import ContactCTA from '@/components/sections/ContactCTA'
import FAQ from '@/components/sections/FAQ'
import Stats from '@/components/sections/Stats'
import BrandStory from '@/components/sections/BrandStory'

// Map blockType (= Payload block slug) → component
const registry = {
  content:    ContentBlock,
  quote:      QuoteBlock,
  banner:     BannerBlock,
  spacer:     SpacerBlock,
  video:      VideoBlock,
  formBlock:  FormBlock,
  contactInfo: ContactInfoBlock,
  mission:    MissionBlock,
  cta:        ContactCTA,
  faq:        FAQ,
  stats:      Stats,
  brandStory: BrandStory,
}

export default function BlockRenderer({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  const out = []
  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]

    // Group consecutive media blocks into one premium gallery.
    if (block?.blockType === 'mediaBlock') {
      const images = []
      while (i < blocks.length && blocks[i]?.blockType === 'mediaBlock') {
        const b = blocks[i]
        const url = getMediaURL(b?.media)
        if (url) {
          const alt = typeof b?.media === 'object' ? b.media?.alt : ''
          images.push({ url, alt: alt || '', caption: b?.caption || '' })
        }
        i++
      }
      if (images.length) out.push(<MediaGallery key={`gallery-${i}`} images={images} />)
      continue
    }

    const Component = registry[block?.blockType]
    if (Component) {
      out.push(<Component key={block.id || `${block.blockType}-${i}`} block={block} />)
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`[BlockRenderer] No component for blockType: "${block?.blockType}"`)
    }
    i++
  }

  return <>{out}</>
}
