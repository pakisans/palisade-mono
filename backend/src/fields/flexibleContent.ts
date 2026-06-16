import type { Block, Field } from 'payload'

import { Ambassador } from '@/blocks/Ambassador/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { Banner } from '@/blocks/Banner/config'
import { BrandStory } from '@/blocks/BrandStory/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Carousel } from '@/blocks/Carousel/config'
import { ClientLogos } from '@/blocks/ClientLogos/config'
import { Code } from '@/blocks/Code/config'
import { ContactInfo } from '@/blocks/ContactInfo/config'
import { Content } from '@/blocks/Content/config'
import { FAQ } from '@/blocks/FAQ/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Mission } from '@/blocks/Mission/config'
import { ProjectsPreview } from '@/blocks/ProjectsPreview/config'
import { Quote } from '@/blocks/Quote/config'
import { Services } from '@/blocks/Services/config'
import { Spacer } from '@/blocks/Spacer/config'
import { Stats } from '@/blocks/Stats/config'
import { Testimonials } from '@/blocks/Testimonials/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { Video } from '@/blocks/Video/config'
import { WhyUs } from '@/blocks/WhyUs/config'

export const defaultContentBlocks: Block[] = [
  Ambassador,
  BrandStory,
  Banner,
  CallToAction,
  Content,
  Mission,
  WhyUs,
  Services,
  ProjectsPreview,
  Testimonials,
  ClientLogos,
  MediaBlock,
  Carousel,
  ThreeItemGrid,
  Archive,
  Code,
  ContactInfo,
  FormBlock,
  Quote,
  FAQ,
  Stats,
  Video,
  Spacer,
]

export const allContentBlocks = defaultContentBlocks

type FlexibleContentOptions = {
  name?: string
  label?: string
  blocks?: Block[]
  maxRows?: number
  description?: string
  initCollapsed?: boolean
}

export const flexibleContent = (options: FlexibleContentOptions = {}): Field => {
  const {
    name = 'content',
    label = 'Content',
    blocks = defaultContentBlocks,
    maxRows = 20,
    description,
    initCollapsed = true,
  } = options

  return {
    name,
    label,
    type: 'blocks',
    blocks,
    maxRows,
    admin: {
      description,
      initCollapsed,
    },
  }
}
