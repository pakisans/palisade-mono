import Link from 'next/link';
import { resolveLink } from '@/lib/utils';
import RichText from '@/components/ui/RichText';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactCTA({ block }) {
  if (!block) return null;
  const links = (block.links ?? []).map((item) => ({
    ...resolveLink(item?.link),
    appearance: item?.link?.appearance,
  }));

  return (
    <section
      className="section-y bg-brand overflow-hidden relative"
      aria-labelledby="cta-heading"
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container-site relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/80 mb-5">
              <span className="w-6 h-px bg-white/60" />
              Kontaktirajte nas
            </span>
          </ScrollReveal>

          {block.richText && (
            <ScrollReveal delay={80}>
              <RichText
                content={block.richText}
                className="[&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:lg:text-5xl [&_h2]:font-extrabold [&_h2]:text-white [&_h2]:tracking-tight [&_h2]:leading-tight [&_h2]:mt-4 [&_p]:text-white/90 [&_p]:text-base [&_p]:leading-relaxed [&_p]:mt-4"
              />
            </ScrollReveal>
          )}

          {links.length > 0 && (
            <ScrollReveal delay={200}>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                {links.map((link, i) => {
                  const isPrimary =
                    link.appearance === 'default' ||
                    !link.appearance ||
                    i === 0;
                  return isPrimary ? (
                    <Link
                      key={i}
                      href={link.href}
                      className="btn btn-lg btn-white"
                    >
                      {link.label}
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
                    </Link>
                  ) : (
                    <Link
                      key={i}
                      href={link.href}
                      className="inline-flex items-center gap-2 h-12 px-8 rounded-xl border border-white/40 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/70 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </ScrollReveal>
          )}

          {/* Trust signals */}
          <ScrollReveal delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-10 border-t border-white/20 text-xs text-white/80 font-medium uppercase tracking-wider">
              {[
                'Besplatno merenje',
                'Ugradnja po Srbiji',
                'Garancija na rad',
                'Odgovor u 24h',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
