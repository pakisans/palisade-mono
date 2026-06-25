import Image from 'next/image'
import Link from 'next/link'
import { getMediaURL } from '@/lib/payload'
import { categoryPath, CATEGORY_BASE } from '@/lib/routes'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ImageFallback from '@/components/ui/ImageFallback'

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

// Asimetrični bento za top-level kartice (4-col grid, ORDER redosled):
// kapije = veliki feature (2×2), ograde/visoka/oprema = široke (2×1),
// automatizacija/kontrola = male (1×1) → čisto popunjava 4×3.
const BENTO_SPAN = {
  kapije: 'sm:col-span-2 sm:row-span-2',
  ograde: 'sm:col-span-2',
  'visoka-sigurnost': 'sm:col-span-2',
  'oprema-i-dodaci': 'sm:col-span-2',
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
      // Podkategorije kao klikabilni linkovi (sve usluge).
      children: docs
        .filter((c) => parentId(c) === cat.id)
        .map((c) => ({
          title: c.title,
          slug: c.slug,
          href: `${CATEGORY_BASE}/${cat.slug}/${c.slug}/`,
          img: getMediaURL(c.image),
        })),
    }))
}

// ─── Glavna kartica (top-level kategorija) ──────────────────────────────────────

function TopCard({ group, span = '' }) {
  const icon = ICONS[group.slug] || DEFAULT_ICON
  const big = span.includes('row-span-2')
  return (
    <Link
      href={group.href}
      aria-label={`Usluga: ${group.title}`}
      className={`group relative flex h-full min-h-[240px] flex-col justify-end overflow-hidden rounded-3xl bg-gray-900 ring-1 ring-black/5 transition-all duration-500 ease-spring hover:-translate-y-2 hover:ring-2 hover:ring-brand/55 hover:shadow-[0_28px_74px_-24px_rgba(143,198,64,0.5)] ${span}`}
    >
      {group.img ? (
        <Image
          src={group.img}
          alt={group.title}
          fill
          className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d5557] via-[#143f43] to-gray-950" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(143,198,64,0.18) 1px, transparent 0)',
              backgroundSize: '26px 26px',
            }}
            aria-hidden="true"
          />
          <span className="absolute -bottom-8 -right-6 h-44 w-44 text-white/10 [&>svg]:h-full [&>svg]:w-full" aria-hidden="true">
            {icon}
          </span>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/35 to-gray-950/5" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />
      <span
        className="pointer-events-none absolute -left-[40%] top-0 z-[2] h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
        aria-hidden="true"
      />

      <span className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-md [&>svg]:h-5 [&>svg]:w-5">
        {icon}
      </span>

      <div className="relative z-10 p-5 md:p-6">
        <h3
          className={`font-extrabold tracking-tight text-white ${big ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'}`}
        >
          {group.title}
        </h3>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/85 transition-colors duration-200 group-hover:text-white">
          Pogledajte ponudu
          <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

// ─── Direktorijum podkategorija (grupisano po roditelju) ────────────────────────

// Foto kartica podkategorije (slika ili brand-mark placeholder).
function SubImageCard({ sub }) {
  return (
    <Link
      href={sub.href}
      className="group/sc block overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm transition-all duration-300 ease-spring hover:-translate-y-1 hover:ring-brand/40 hover:shadow-[0_18px_44px_-18px_rgba(143,198,64,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {sub.img ? (
          <Image
            src={sub.img}
            alt={sub.title}
            fill
            className="object-cover transition-transform duration-500 ease-spring group-hover/sc:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <ImageFallback markClassName="w-2/5 opacity-40" />
        )}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 bg-brand transition-transform duration-300 ease-spring group-hover/sc:scale-x-100" aria-hidden="true" />
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <h4 className="text-sm font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover/sc:text-brand">
          {sub.title}
        </h4>
        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors duration-200 group-hover/sc:bg-brand group-hover/sc:text-white">
          <Arrow className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

// Grupa podkategorija po roditelju — naslov + foto kartice.
function SubGroup({ group }) {
  const icon = ICONS[group.slug] || DEFAULT_ICON
  if (!group.children?.length) return null
  return (
    <div>
      <Link href={group.href} className="group/h mb-5 inline-flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand [&>svg]:h-5 [&>svg]:w-5">
          {icon}
        </span>
        <h3 className="text-lg font-extrabold tracking-tight text-gray-950 transition-colors duration-200 group-hover/h:text-brand">
          {group.title}
        </h3>
        <Arrow className="h-4 w-4 text-gray-300 transition-all duration-200 group-hover/h:translate-x-1 group-hover/h:text-brand" />
      </Link>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {group.children.map((sub) => (
          <SubImageCard key={sub.slug} sub={sub} />
        ))}
      </div>
    </div>
  )
}

// ─── Sekcija ───────────────────────────────────────────────────────────────────

export default function Services({ block, categories }) {
  const source = block?.source || 'auto'

  const groups =
    source === 'manual' && block?.items?.length
      ? block.items.map((it) => ({
          title: it.title,
          slug: it.slug || it.title,
          href: it.href || '#',
          img: getMediaURL(it.image),
          children: [],
        }))
      : topLevelServices(categories)

  if (groups.length === 0) return null

  const withSubs = groups.filter((g) => (g.children ?? []).length > 0)

  return (
    <section className="section-y surface-soft" aria-labelledby="services-heading">
      <div className="container-site">
        <ScrollReveal className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
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

        {/* Deo 1 — glavnih 6 (top-level) kategorija u asimetričnom bento rasporedu */}
        <div className="grid grid-cols-1 gap-5 sm:auto-rows-[220px] sm:grid-cols-2 lg:auto-rows-[250px] lg:grid-cols-4 lg:gap-6">
          {groups.map((group) => (
            <TopCard key={group.slug} group={group} span={BENTO_SPAN[group.slug] || ''} />
          ))}
        </div>

        {/* Deo 2 — podkategorije, grupisane po roditelju (da ima smisla) */}
        {withSubs.length > 0 && (
          <div className="mt-14 border-t border-gray-200/70 pt-12 md:mt-16">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-6 bg-brand" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                Sve podkategorije
              </span>
            </div>
            <div className="space-y-10 md:space-y-12">
              {withSubs.map((group) => (
                <SubGroup key={group.slug} group={group} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
