// Renders the homepage `layout` blocks in CMS order. Maps blockType → section component
// and passes shared data (categories/projects) to the blocks that need it.

import WhyUs from './WhyUs'
import BrandStory from './BrandStory'
import Services from './Services'
import ProjectsPreview from './ProjectsPreview'
import Testimonials from './Testimonials'
import ClientLogos from './ClientLogos'
import Stats from './Stats'
import FAQ from './FAQ'
import ContactCTA from './ContactCTA'
import MissionBlock from '@/components/blocks/MissionBlock'
import ContentBlock from '@/components/blocks/ContentBlock'
import VideoBlock from '@/components/blocks/VideoBlock'
import SpacerBlock from '@/components/blocks/SpacerBlock'
import BannerBlock from '@/components/blocks/BannerBlock'
import MediaBlockComponent from '@/components/blocks/MediaBlockComponent'
import ContactInfoBlock from '@/components/blocks/ContactInfoBlock'

const registry = {
  whyUs: WhyUs,
  brandStory: BrandStory,
  services: Services,
  projectsPreview: ProjectsPreview,
  testimonials: Testimonials,
  clientLogos: ClientLogos,
  stats: Stats,
  faq: FAQ,
  cta: ContactCTA,
  mission: MissionBlock,
  content: ContentBlock,
  video: VideoBlock,
  spacer: SpacerBlock,
  banner: BannerBlock,
  mediaBlock: MediaBlockComponent,
  contactInfo: ContactInfoBlock,
}

export default function HomeSections({ blocks = [], categories, projects }) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null
  return (
    <>
      {blocks.map((block, i) => {
        const Component = registry[block?.blockType]
        if (!Component) {
          if (process.env.NODE_ENV === 'development') console.warn(`[HomeSections] No component for: "${block?.blockType}"`)
          return null
        }
        const extra =
          block.blockType === 'services' ? { categories } : block.blockType === 'projectsPreview' ? { projects } : {}
        return <Component key={block.id || i} block={block} {...extra} />
      })}
    </>
  )
}
