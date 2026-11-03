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

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

// Poziv - primarni CTA na pocetnoj (kad postoji telefon).
export function PhoneCTA({ phone }) {
  return (
    <a href={phone.href} className="btn btn-lg btn-primary">
      <PhoneIcon />
      {phone.localLabel || phone.label}
    </a>
  );
}

const isContactHref = (href) => /^\/kontakt\/?$/.test(href || '');

// CTA - primary (brand), glass outline (dark hero) ili secondary (zeleni okvir,
// kad je poziv primarni). Link ka /kontakt se na pocetnoj pretvara u skok na formu.
function HeroCTA({ link, secondary, hasForm }) {
  if (!link) return null;
  const { label, appearance } = link;
  const toForm = hasForm && isContactHref(link.href);
  const href = toForm ? '#kontakt-forma' : link.href;
  const LinkTag = toForm ? 'a' : Link;

  const className = secondary
    ? 'btn btn-lg border-2 border-brand text-white transition-colors hover:bg-brand'
    : appearance === 'outline'
      ? 'btn btn-lg border border-white/30 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-gray-950'
      : 'btn btn-lg btn-primary';

  return (
    <LinkTag href={href} className={className}>
      {label}
      <Arrow />
    </LinkTag>
  );
}

// ─── Hero - cinematic full-bleed (premium first impression) ─────────────────────

export default function Hero({ hero, phone, hasForm = false }) {
  if (!hero || hero.type === 'none') return null;

  const imgUrl = getMediaURL(hero?.media);
  const coverStyle = hero?.mediaStyle === 'cover'; // full cover vs standardni tamni preliv
  const links = (hero?.links ?? []).map(resolveHeroLink).filter(Boolean);
  const hasContent = hero?.richText?.root?.children?.length > 0;
  const stats = hero?.stats ?? [];
  const trust = (hero?.trust ?? []).map((t) => t.text).filter(Boolean);
  const eyebrow = hero?.eyebrow;

  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[480px] flex-col overflow-hidden bg-gray-950 lg:h-[calc(100svh-var(--header-height)-3rem)] lg:min-h-[560px]"
      aria-label="Uvod"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt="Palisada - kapije i ograde"
            fill
            priority
            quality={90}
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
        )}
        {coverStyle ? (
          // Full cover - slika dominira; samo blagi preliv s dna/levo radi čitljivosti teksta
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/25 to-gray-950/35" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/55 via-transparent to-transparent" />
          </>
        ) : (
          // Standardno - jak kinematski preliv (zatamni levo za tekst + dno za statistiku)
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-gray-950/30" />
          </>
        )}
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center">
        <div className="container-site py-6 sm:py-8">
          <div className="max-w-[45rem]">
            {eyebrow && (
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm animate-fade-in">
                <span className="h-2 w-2 rounded-full bg-brand" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  {eyebrow}
                </span>
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

            {(links.length > 0 || phone?.href) && (
              <div className="mt-6 flex flex-wrap items-center gap-3 animate-fade-up opacity-0 [animation-delay:250ms]">
                {phone?.href && <PhoneCTA phone={phone} />}
                {links.map((link, i) => (
                  <HeroCTA key={i} link={link} secondary={!!phone?.href} hasForm={hasForm} />
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

      {/* Stats bar - glass strip at the bottom */}
      {stats.length > 0 && (
        <div className="relative border-t border-white/10 bg-white/[0.04] backdrop-blur-md">
          <div className="container-site">
            {/* gap-px + grid bg = čiste hairline linije i za 2×2 (mobilni) i za 1×4 (desktop);
                ćelije se rastežu na istu visinu po redu, pa neravne labele ne kvare poravnanje */}
            <div className="grid grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col justify-center px-3 py-3.5 text-center md:px-8 md:py-5"
                >
                  <p className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-gray-300 sm:text-[11px] sm:tracking-widest">
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
