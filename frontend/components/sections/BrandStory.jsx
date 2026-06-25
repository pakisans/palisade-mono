import Image from 'next/image';
import Link from 'next/link';
import { getMediaURL } from '@/lib/payload';
import { resolveLink } from '@/lib/utils';
import RichText from '@/components/ui/RichText';
import ScrollReveal from '@/components/ui/ScrollReveal';
import CountUp from '@/components/ui/CountUp';

function youtubeEmbed(url) {
  if (!url) return null;
  const id = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]+)/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

// Shared text column — eyebrow, heading, description, stats, CTA (light theme).
function TextContent({ block, stats, ctaLink, headingId }) {
  return (
    <>
      {block.eyebrow && (
        <ScrollReveal>
          <span className="eyebrow mb-5">{block.eyebrow}</span>
        </ScrollReveal>
      )}

      {block.heading && (
        <ScrollReveal delay={80}>
          <h1
            id={headingId}
            className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 md:text-4xl lg:text-5xl"
          >
            {block.heading}
          </h1>
        </ScrollReveal>
      )}

      {block.description && (
        <ScrollReveal delay={160}>
          <RichText
            content={block.description}
            className="mt-6 [&_p]:mb-3 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-gray-600 [&_ul]:mt-3 [&_ul]:space-y-2 [&_li]:text-gray-600"
          />
        </ScrollReveal>
      )}

      {stats.length > 0 && (
        <ScrollReveal delay={240}>
          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-gray-200 pt-10">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-extrabold tracking-tight text-brand">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-0.5 text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}

      {ctaLink?.href && ctaLink?.label ? (
        <ScrollReveal delay={320}>
          <div className="mt-8">
            <Link href={ctaLink.href} className="btn btn-primary">
              {ctaLink.label}
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth={1.75}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8h10M9 4l4 4-4 4"
                />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      ) : null}
    </>
  );
}

export default function BrandStory({ block }) {
  if (!block) return null;

  const layout = block.layout || 'image-right';
  const imageFit = block.imageFit || 'cover';
  const imgUrl = getMediaURL(block.media || block.image);
  const videoUrl = youtubeEmbed(block.videoUrl);
  const stats = block.stats ?? [];
  const ctaLink =
    block.cta?.url && block.cta?.label ? resolveLink(block.cta) : null;
  const isRight = layout === 'image-right';

  // ── FULL IMAGE / CONTAIN — immersive full-bleed image with text panel ─────────
  if (imageFit === 'contain' && imgUrl && !videoUrl) {
    return (
      <section
        className="relative overflow-hidden bg-white py-20 md:py-28"
        aria-labelledby="brand-story-heading"
      >
        {/* Full-bleed image on one side */}
        <div
          className={`absolute inset-y-0 ${isRight ? 'inset-x-0 lg:left-[44%]' : 'inset-x-0 lg:right-[44%]'} overflow-hidden`}
        >
          <Image
            src={imgUrl}
            alt={block.heading || 'Palisada'}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          {/* mobile: white veil so dark text stays readable */}
          <div className="absolute inset-0 bg-white/80 lg:hidden" />
          {/* desktop: fade from the white text side toward the image */}
          <div
            className={`absolute inset-0 hidden lg:block ${isRight ? 'bg-gradient-to-r from-white via-white/55 to-transparent' : 'bg-gradient-to-l from-white via-white/55 to-transparent'}`}
          />
          {/* brand edge accent on the image side */}
          <div
            className={`absolute inset-y-0 ${isRight ? 'right-0' : 'left-0'} w-1 bg-brand`}
            aria-hidden="true"
          />
        </div>

        <div className="container-site relative z-10">
          <div className={`flex ${isRight ? 'justify-start' : 'justify-end'}`}>
            <div className="w-full max-w-xl">
              <TextContent
                block={block}
                stats={stats}
                ctaLink={ctaLink}
                headingId="brand-story-heading"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── COVER (default) — split layout with image/video in a rounded panel ────────
  return (
    <section
      className="section-y surface-soft overflow-hidden"
      aria-labelledby="brand-story-heading"
    >
      <div className="container-site relative z-10">
        <div
          className={`flex flex-col ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
        >
          {/* Text side */}
          <div className="min-w-0 flex-1">
            <TextContent
              block={block}
              stats={stats}
              ctaLink={ctaLink}
              headingId="brand-story-heading"
            />
          </div>

          {/* Media side — video takes priority over image */}
          <ScrollReveal delay={100} className="w-full min-w-0 flex-1">
            <div className="relative aspect-video overflow-hidden rounded-3xl bg-gray-950 shadow-card-hover lg:aspect-[4/3]">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  title={block.heading || 'Palisada video'}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              ) : imgUrl ? (
                <Image
                  src={imgUrl}
                  alt={block.heading || 'Palisada'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand/20">
                    <span className="text-4xl font-extrabold text-brand">
                      P
                    </span>
                  </div>
                </div>
              )}
              {!videoUrl && (
                <div
                  className="absolute left-0 top-0 h-12 w-12"
                  aria-hidden="true"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-brand" />
                  <div className="absolute left-0 top-0 h-full w-1 bg-brand" />
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
