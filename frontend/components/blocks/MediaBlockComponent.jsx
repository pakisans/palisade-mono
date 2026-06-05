import Image from 'next/image'
import { getMediaURL } from '@/lib/payload'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function MediaBlockComponent({ block }) {
  const imgUrl = getMediaURL(block?.media)
  const caption = block?.caption || (typeof block?.media === 'object' ? block?.media?.alt : null)

  if (!imgUrl) return null

  const position = block?.position || 'fullscreen'

  return (
    <ScrollReveal>
      <figure className={position === 'fullscreen' ? 'w-full' : 'container-site py-4'}>
        <div className={`relative overflow-hidden rounded-2xl bg-gray-100 ${position === 'fullscreen' ? '' : ''}`}>
          <Image
            src={imgUrl}
            alt={caption || ''}
            width={1600}
            height={900}
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
        {caption && (
          <figcaption className="text-center text-xs text-gray-400 mt-3 px-4">{caption}</figcaption>
        )}
      </figure>
    </ScrollReveal>
  )
}
