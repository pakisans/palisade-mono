import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { categoryPath } from '@/lib/routes'
import ScrollReveal from '@/components/ui/ScrollReveal'

// ─── Ikonice po kategoriji ───────────────────────────────────────────────────

const I = (d) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
const ICONS = {
  kapije: I(<><path d="M3 21V9l9-5 9 5v12" /><path d="M2 21h20" /><path d="M7 21V11M12 21V10M17 21V11" /></>),
  ograde: I(<><path d="M5 21V8l2-2 2 2v13M15 21V8l2-2 2 2v13" /><path d="M3 12h18M3 16h18" /></>),
  'automatizacija-kapija': I(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>),
  'kontrola-pristupa': I(<><circle cx="8" cy="9" r="4" /><path d="M11 11l9 9M16 16l2-2M19 19l2-2" /></>),
  'visoka-sigurnost': I(<><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></>),
  'oprema-i-dodaci': I(<><path d="M15 6.5a4 4 0 00-5.3 5.3L4 17.5V20h2.5l5.7-5.7A4 4 0 0017.5 9l-2.4 2.4-2-2L15.5 7z" /></>),
}
const DEFAULT_ICON = I(<><path d="M3 3h7l11 11-7 7L3 10V3z" /><circle cx="7.5" cy="7.5" r="1.3" /></>)

const ORDER = {
  kapije: 1, ograde: 2, 'automatizacija-kapija': 3,
  'kontrola-pristupa': 4, 'visoka-sigurnost': 5, 'oprema-i-dodaci': 6,
}

const parentId = (c) =>
  c?.parent && typeof c.parent === 'object' ? c.parent.id : c?.parent ?? null

const Arrow = ({ className = 'h-4 w-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)

// Sve TOP-LEVEL kategorije (bez parent-a) + pregled podkategorija.
function topLevelServices(categories) {
  const docs = categories?.docs ?? categories ?? []
  if (!Array.isArray(docs) || docs.length === 0) return []
  return docs
    .filter((c) => !parentId(c))
    .sort((a, b) => (ORDER[a.slug] ?? 99) - (ORDER[b.slug] ?? 99))
    .map((cat) => ({
      title: cat.title,
      slug: cat.slug,
      href: categoryPath(cat),
      img: getMediaURL(cat.image),
      text: cat.description,
      children: docs.filter((c) => parentId(c) === cat.id).map((c) => c.title),
    }))
}

// ─── Velika (flagship) kartica sa slikom ───────────────────────────────────────

function FeatureCard({ item }) {
  const icon = ICONS[item.slug] || DEFAULT_ICON
  const subtitle = item.text || (item.children?.length ? item.children.slice(0, 4).join(' · ') : null)
  return (
    <Link
      href={item.href}
      aria-label={`Usluga: ${item.title}`}
      className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] bg-gray-900 ring-1 ring-black/5 transition-all duration-500 ease-spring hover:-translate-y-2 hover:ring-2 hover:ring-brand/60 hover:shadow-[0_30px_80px_-22px_rgba(143,198,64,0.55)] md:min-h-[400px]"
    >
      {item.img && (
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-[900ms] ease-spring group-hover:scale-[1.08]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/35 to-gray-950/5" />
      {/* Brand ton u dnu + shine sweep na hover */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
      <span
        className="pointer-events-none absolute -left-[40%] top-0 z-[2] h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
        aria-hidden="true"
      />

      {/* Icon badge */}
      <span className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-md ring-1 ring-white/20 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </span>

      <div className="relative z-10 p-6 md:p-8">
        <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          {item.title}
        </h3>
        {subtitle && (
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70 line-clamp-2">
            {subtitle}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-200 group-hover:bg-brand group-hover:ring-brand">
          Pogledajte ponudu
          <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 bg-brand transition-transform duration-400 ease-spring group-hover:scale-x-100" aria-hidden="true" />
    </Link>
  )
}

// ─── Kompaktna kartica (bez slike, ikonica) ────────────────────────────────────

function CompactCard({ item }) {
  const icon = ICONS[item.slug] || DEFAULT_ICON
  const subtitle = item.text || (item.children?.length ? item.children.slice(0, 3).join(' · ') : null)
  return (
    <Link
      href={item.href}
      aria-label={`Usluga: ${item.title}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-gray-100 transition-all duration-500 ease-spring hover:-translate-y-2 hover:ring-2 hover:ring-brand/50 hover:shadow-[0_26px_64px_-22px_rgba(143,198,64,0.42)]"
    >
      {/* Suptilan shine sweep */}
      <span
        className="pointer-events-none absolute -left-[40%] top-0 z-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-brand/12 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
        aria-hidden="true"
      />
      <div className="relative z-10 flex h-full flex-col">
        <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white [&>svg]:h-6 [&>svg]:w-6">
          {icon}
        </span>
        <h3 className="text-base font-extrabold tracking-tight text-gray-950 transition-colors duration-200 group-hover:text-brand">
          {item.title}
        </h3>
        {subtitle && (
          <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-gray-500">
            {subtitle}
          </p>
        )}
        <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 transition-colors duration-200 group-hover:text-brand">
          Pogledajte
          <Arrow className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

// ─── Sekcija ───────────────────────────────────────────────────────────────────

export default function Services({ block, categories }) {
  const source = block?.source || 'auto'

  const items =
    source === 'manual' && block?.items?.length
      ? block.items.map((it) => ({
          title: it.title, slug: it.slug, href: it.href || '#',
          img: getMediaURL(it.image), text: it.text, children: [],
        }))
      : topLevelServices(categories)

  if (items.length === 0) return null

  const featured = items.filter((i) => i.img)
  const rest = items.filter((i) => !i.img)

  return (
    <section className="section-y surface-soft" aria-labelledby="services-heading">
      <div className="container-site">
        <ScrollReveal className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow mb-4">{block?.eyebrow || 'Asortiman'}</span>
            <h2 id="services-heading" className="mt-4 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {block?.heading || 'Naše usluge'}
            </h2>
            {block?.intro && (
              <p className="mt-3 text-base leading-relaxed text-gray-500">{block.intro}</p>
            )}
          </div>
          <Link
            href="/proizvodi"
            className="inline-flex flex-shrink-0 items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-brand-700"
          >
            Svi proizvodi
            <Arrow className="h-4 w-4" />
          </Link>
        </ScrollReveal>

        {featured.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {featured.map((item) => (
              <ScrollReveal key={item.slug}>
                <FeatureCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${featured.length > 0 ? 'mt-4 md:mt-5' : ''}`}>
            {rest.map((item) => (
              <ScrollReveal key={item.slug}>
                <CompactCard item={item} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
