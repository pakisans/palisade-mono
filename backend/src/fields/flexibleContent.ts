import type { Block, Field } from 'payload'

import { Ambassador } from '@/blocks/Ambassador/config'
import { Archive } from '@/blocks/ArchiveBlock/config'
import { Banner } from '@/blocks/Banner/config'
import { BrandStory } from '@/blocks/BrandStory/config'
import { CallToAction } from '@/blocks/CallToAction/config'
import { Carousel } from '@/blocks/Carousel/config'
import { Code } from '@/blocks/Code/config'
import { Content } from '@/blocks/Content/config'
import { FAQ } from '@/blocks/FAQ/config'
import { FormBlock } from '@/blocks/Form/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { Quote } from '@/blocks/Quote/config'
import { Spacer } from '@/blocks/Spacer/config'
import { Stats } from '@/blocks/Stats/config'
import { ThreeItemGrid } from '@/blocks/ThreeItemGrid/config'
import { Video } from '@/blocks/Video/config'

export const defaultContentBlocks: Block[] = [
  Ambassador,
  BrandStory,
  Banner,
  CallToAction,
  Content,
  MediaBlock,
  Carousel,
  ThreeItemGrid,
  Archive,
  Code,
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
