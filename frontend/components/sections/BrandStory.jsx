import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { resolveLink } from '@/lib/utils'
import RichText from '@/components/ui/RichText'
import ScrollReveal from '@/components/ui/ScrollReveal'

function youtubeEmbed(url) {
  if (!url) return null
  const id = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]+)/)?.[1]
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export default function BrandStory({ block }) {
  if (!block) return null

  const layout    = block.layout || 'image-right'
  const imgUrl    = getMediaURL(block.media || block.image)
  const videoUrl  = youtubeEmbed(block.videoUrl)
  const stats     = block.stats ?? []
  const ctaLink   = block.cta ? resolveLink(block.cta) : null
  const isRight   = layout === 'image-right'

  return (
    <section className="section-y surface-soft overflow-hidden" aria-labelledby="brand-story-heading">
      <div className="container-site relative z-10">
        <div className={`flex flex-col ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>

          {/* Text side */}
          <div className="flex-1 min-w-0">
            {block.eyebrow && (
              <ScrollReveal>
                <span className="eyebrow mb-5">{block.eyebrow}</span>
              </ScrollReveal>
            )}

            {block.heading && (
              <ScrollReveal delay={80}>
                <h2 id="brand-story-heading" className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-950 tracking-tight leading-tight mt-4">
                  {block.heading}
                </h2>
              </ScrollReveal>
            )}

            {block.description && (
              <ScrollReveal delay={160}>
                <RichText
                  content={block.description}
                  className="mt-6 [&_p]:text-gray-600 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-3"
                />
              </ScrollReveal>
            )}

            {stats.length > 0 && (
              <ScrollReveal delay={240}>
                <div className="grid grid-cols-2 gap-4 mt-10 pt-10 border-t border-gray-200">
                  {stats.map((stat, i) => (
                    <div key={i}>
                      <p className="text-3xl font-extrabold text-brand tracking-tight">{stat.value}</p>
                      <p className="text-sm text-gray-500 mt-0.5 font-medium">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {ctaLink && (
              <ScrollReveal delay={320}>
                <div className="mt-8">
                  <Link
                    href={ctaLink.href}
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-brand text-white text-sm font-bold hover:bg-brand-600 transition-colors shadow-brand-sm hover:shadow-brand"
                  >
                    {ctaLink.label}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Media side — video embed takes priority over image */}
          <ScrollReveal delay={100} className="flex-1 min-w-0 w-full">
            <div className="relative aspect-video lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-card-hover bg-gray-950">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  title={block.heading || 'Palisade video'}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : imgUrl ? (
                <Image src={imgUrl} alt={block.heading || 'Palisade'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-brand/20 flex items-center justify-center">
                    <span className="text-4xl font-extrabold text-brand">P</span>
                  </div>
                </div>
              )}
              {!videoUrl && (
                <div className="absolute top-0 left-0 w-12 h-12" aria-hidden="true">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
