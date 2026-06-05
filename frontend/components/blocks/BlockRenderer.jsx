// Generic dispatcher: maps Payload `layout` blocks → React components.
// Reuses premium section components where they exist (cta, faq, stats, brandStory)
// and dedicated block components for the rest.

import ContentBlock from './ContentBlock'
import QuoteBlock from './QuoteBlock'
import BannerBlock from './BannerBlock'
import SpacerBlock from './SpacerBlock'
import MediaBlockComponent from './MediaBlockComponent'
import VideoBlock from './VideoBlock'
import FormBlock from './FormBlock'

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
  mediaBlock: MediaBlockComponent,
  video:      VideoBlock,
  formBlock:  FormBlock,
  cta:        ContactCTA,
  faq:        FAQ,
  stats:      Stats,
  brandStory: BrandStory,
}

export default function BlockRenderer({ blocks }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        const Component = registry[block?.blockType]
        if (!Component) {
          // Unknown / not-yet-implemented block type — skip gracefully
          if (process.env.NODE_ENV === 'development') {
            console.warn(`[BlockRenderer] No component for blockType: "${block?.blockType}"`)
          }
          return null
        }
        return <Component key={block.id || `${block.blockType}-${i}`} block={block} />
      })}
    </>
  )
}
