import Image from 'next/image';
import Link from 'next/link';
import { getMediaURL } from '@/lib/payload';
import { resolveHeroLink } from '@/lib/utils';
import RichText from '@/components/ui/RichText';
import CountUp from '@/components/ui/CountUp';

const Arrow = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 16 16"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8h10M9 4l4 4-4 4"
    />
  </svg>
);

// CTA — primary (brand) or glass outline (for the dark hero).
function HeroCTA({ link }) {
  if (!link) return null;
  const { href, label, appearance } = link;
  if (appearance === 'outline') {
    return (
      <Link
        href={href}
        className="btn btn-lg border border-white/30 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-gray-950"
      >
        {label}
        <Arrow />
      </Link>
    );
  }
  return (
    <Link href={href} className="btn btn-lg btn-primary">
      {label}
      <Arrow />
    </Link>
  );
}

// ─── Hero — cinematic full-bleed (premium first impression) ─────────────────────

export default function Hero({ hero }) {
  if (!hero || hero.type === 'none') return null;

  const imgUrl = getMediaURL(hero?.media);
  const links = (hero?.links ?? []).map(resolveHeroLink).filter(Boolean);
  const hasContent = hero?.richText?.root?.children?.length > 0;
  const stats = hero?.stats ?? [];
  const trust = (hero?.trust ?? []).map((t) => t.text).filter(Boolean);
  const eyebrow = hero?.eyebrow;

  return (
    <section
      className="relative isolate flex h-[calc(100svh-var(--header-height))] min-h-[560px] flex-col overflow-hidden bg-gray-950 lg:h-[calc(100svh-var(--header-height)-3rem)]"
      aria-label="Uvod"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt="Palisade — kapije i ograde"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
        )}
        {/* Cinematic overlays — darken left (text) + bottom (stats), keep image visible right */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-gray-950/30" />
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center">
        <div className="container-site py-6 sm:py-8">
          <div className="max-w-[45rem]">
            {eyebrow && (
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">{eyebrow}</span>
              </div>
            )}

            {hasContent && (
              <div className="animate-fade-up opacity-0 [animation-delay:100ms]">
                <RichText
                  content={hero.richText}
                  className="[&_h1]:text-4xl [&_h1]:md:text-5xl [&_h1]:lg:text-display-md [&_h1]:font-extrabold [&_h1]:leading-[1.05] [&_h1]:tracking-[-0.03em] [&_h1]:text-balance [&_h1]:text-white [&_h1]:mb-0 [&_strong]:text-brand [&_p]:mt-4 [&_p]:max-w-xl [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-relaxed [&_p]:text-gray-300"
                />
              </div>
            )}

            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3 animate-fade-up opacity-0 [animation-delay:250ms]">
                {links.map((link, i) => (
                  <HeroCTA key={i} link={link} />
                ))}
              </div>
            )}

            {trust.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 animate-fade-up opacity-0 [animation-delay:350ms]">
              {trust.map((t, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/85"
                >
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand">
                    <svg
                      className="h-2.5 w-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar — glass strip at the bottom */}
      {stats.length > 0 && (
        <div className="relative border-t border-white/10 bg-white/[0.04] backdrop-blur-md">
          <div className="container-site">
            <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="px-4 py-4 text-center md:px-8 md:py-5">
                  <p className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-widest text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
