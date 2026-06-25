import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { resolveLink } from '@/lib/utils'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ImageFallback from '@/components/ui/ImageFallback'
import AboutVideo from './AboutVideo'

// Oboji deo naslova (accent) brand-zelenom.
function HeadingWithAccent({ heading, accent }) {
  if (!accent || !heading?.includes(accent)) return heading || null
  const [before, after] = heading.split(accent)
  return (
    <>
      {before}
      <span className="text-brand">{accent}</span>
      {after}
    </>
  )
}

const Briefcase = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
  </svg>
)

const DoubleChevron = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 7l5 5-5 5M12 7l5 5-5 5" />
  </svg>
)

// Tekstualni deo (eyebrow + naslov + bela kartica + CTA) — deli se između layouta.
function MissionText({ block, bullets, cta }) {
  return (
    <>
      {block.eyebrow && (
        <ScrollReveal>
          <span className="inline-flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-wider text-brand">
            <Briefcase />
            {block.eyebrow}
          </span>
        </ScrollReveal>
      )}

      {block.heading && (
        <ScrollReveal delay={80}>
          <h2
            id="about-mission-heading"
            className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-4xl"
          >
            <HeadingWithAccent heading={block.heading} accent={block.headingAccent} />
          </h2>
        </ScrollReveal>
      )}

      <ScrollReveal delay={160}>
        <div className="mt-7 rounded-3xl bg-white p-7 shadow-card ring-1 ring-gray-100 md:p-8">
          {block.cardTitle && (
            <p className="text-xl font-extrabold tracking-tight text-gray-950">{block.cardTitle}</p>
          )}
          {block.statement && (
            <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{block.statement}</p>
          )}
          {bullets.length > 0 && (
            <ul className="mt-5 space-y-3">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] font-medium text-gray-800">
                  <span className="mt-0.5 flex-shrink-0 text-brand">
                    <DoubleChevron />
                  </span>
                  {b.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </ScrollReveal>

      {cta && (
        <ScrollReveal delay={240}>
          <Link
            href={cta.href}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white shadow-brand-sm transition-colors hover:bg-brand-600"
          >
            {cta.label}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M9 7h8v8" />
            </svg>
          </Link>
        </ScrollReveal>
      )}
    </>
  )
}

export default function AboutMission({ block }) {
  if (!block) return null

  const hasVideo = Boolean(block.videoUrl)
  const imgUrl = getMediaURL(block.media)
  const bullets = block.bullets ?? []
  const cta = block.cta?.url && block.cta?.label ? resolveLink(block.cta) : null
  const mediaRight = block.mediaSide === 'right'
  const fullBleed = hasVideo && block.videoCover !== false

  // ── FULL COVER — video edge-to-edge na jednoj strani (kao full slika u Brand Story) ──
  if (fullBleed) {
    return (
      <section className="relative overflow-hidden bg-white py-16 md:py-24" aria-labelledby="about-mission-heading">
        <div className={`absolute inset-y-0 overflow-hidden ${mediaRight ? 'inset-x-0 lg:left-[46%]' : 'inset-x-0 lg:right-[46%]'}`}>
          <AboutVideo url={block.videoUrl} cover buttonSide={mediaRight ? 'right' : 'left'} />
          {/* mobilni: beli veo radi čitljivosti */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-white/85 lg:hidden" />
          {/* desktop: preliv ka tekstu */}
          <div className={`pointer-events-none absolute inset-0 z-[1] hidden lg:block ${mediaRight ? 'bg-gradient-to-r from-white via-white/55 to-transparent' : 'bg-gradient-to-l from-white via-white/55 to-transparent'}`} />
          {/* brand ivica */}
          <div className={`pointer-events-none absolute inset-y-0 z-[2] w-1 bg-brand ${mediaRight ? 'right-0' : 'left-0'}`} aria-hidden="true" />
        </div>

        <div className="container-site relative z-10">
          <div className={`flex ${mediaRight ? 'justify-start' : 'justify-end'}`}>
            <div className="w-full max-w-xl">
              <MissionText block={block} bullets={bullets} cta={cta} />
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── Split kartica (video/slika u zaobljenom panelu) ──
  return (
    <section className="section-y surface-soft overflow-hidden" aria-labelledby="about-mission-heading">
      <div className="container-site">
        <div className={`flex flex-col items-stretch gap-10 lg:gap-14 ${mediaRight ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
          <ScrollReveal className="w-full min-w-0 lg:w-[44%]">
            <div className="relative aspect-[4/5] min-h-[360px] w-full overflow-hidden rounded-3xl bg-gray-950 shadow-card-hover lg:h-full">
              {hasVideo ? (
                <AboutVideo url={block.videoUrl} cover={false} buttonSide="right" />
              ) : imgUrl ? (
                <Image src={imgUrl} alt={block.heading || 'Palisada'} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
              ) : (
                <ImageFallback dark />
              )}
              {!hasVideo && (
                <div className="absolute left-0 top-0 h-12 w-12" aria-hidden="true">
                  <div className="absolute left-0 top-0 h-1 w-full bg-brand" />
                  <div className="absolute left-0 top-0 h-full w-1 bg-brand" />
                </div>
              )}
            </div>
          </ScrollReveal>

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <MissionText block={block} bullets={bullets} cta={cta} />
          </div>
        </div>
      </div>
    </section>
  )
}
