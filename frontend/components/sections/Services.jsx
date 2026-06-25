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

// ─── Banner top-level kategorije ────────────────────────────────────────────────

function CategoryBanner({ group }) {
  const icon = ICONS[group.slug] || DEFAULT_ICON
  return (
    <div className="relative min-h-[180px] overflow-hidden bg-gray-900 md:min-h-[220px]">
      {group.img ? (
        <Image
          src={group.img}
          alt={group.title}
          fill
          className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
          sizes="100vw"
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

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/45 to-gray-950/15" aria-hidden="true" />
      <span
        className="pointer-events-none absolute -left-[40%] top-0 z-[2] h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
        aria-hidden="true"
      />

      <Link href={group.href} aria-label={`Usluga: ${group.title}`} className="absolute inset-0 z-[1]" />

      <div className="pointer-events-none relative z-10 flex h-full min-h-[180px] items-center justify-between gap-4 p-6 md:min-h-[220px] md:px-8">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20 backdrop-blur-md [&>svg]:h-6 [&>svg]:w-6">
            {icon}
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
              Usluga
            </span>
            <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
              {group.title}
            </h3>
          </div>
        </div>
        <span className="hidden flex-shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors duration-200 group-hover:bg-brand group-hover:ring-brand sm:inline-flex">
          Pogledajte sve
          <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  )
}

// ─── Kartica podkategorije (mali thumb ili inicijal + naslov) ───────────────────

function SubCard({ sub }) {
  return (
    <Link
      href={sub.href}
      className="group/sub flex items-center gap-3 rounded-2xl bg-gray-50 p-3 ring-1 ring-transparent transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-white hover:ring-brand/40 hover:shadow-[0_16px_40px_-18px_rgba(143,198,64,0.42)]"
    >
      <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {sub.img ? (
          <Image src={sub.img} alt={sub.title} fill className="object-cover" sizes="48px" />
        ) : (
          <ImageFallback markClassName="w-2/3 opacity-50" />
        )}
      </span>
      <span className="min-w-0 flex-1 text-sm font-bold leading-tight text-gray-800 transition-colors duration-200 group-hover/sub:text-brand">
        {sub.title}
      </span>
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors duration-200 group-hover/sub:bg-brand group-hover/sub:text-white">
        <Arrow className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

// ─── Grupa: banner + podkategorije ispod ────────────────────────────────────────

function CategoryGroup({ group, span = '', subCols = 'sm:grid-cols-2 lg:grid-cols-3' }) {
  const subs = group.children ?? []
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-gray-100 shadow-card transition-all duration-500 ease-spring hover:-translate-y-1 hover:shadow-card-hover hover:ring-brand/25 ${span}`}
    >
      <CategoryBanner group={group} />
      {subs.length > 0 && (
        <div className={`grid grid-cols-1 gap-3 p-4 md:p-5 ${subCols}`}>
          {subs.map((sub) => (
            <SubCard key={sub.slug} sub={sub} />
          ))}
        </div>
      )}
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

        {/* Bento — puna širina za mnogo podk. (oprema) i bez podk. (visoka sigurnost,
            kao slim band); ostale pola-pola. Čisto se poređa po redosledu. */}
        <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {groups.map((group) => {
            const n = (group.children ?? []).length
            const layout =
              n >= 5
                ? { span: 'sm:col-span-2 lg:col-span-6', subCols: 'sm:grid-cols-2 lg:grid-cols-3' }
                : n === 0
                  ? { span: 'sm:col-span-2 lg:col-span-6', subCols: '' }
                  : { span: 'sm:col-span-1 lg:col-span-3', subCols: 'sm:grid-cols-2' }
            return (
              <CategoryGroup
                key={group.slug}
                group={group}
                span={layout.span}
                subCols={layout.subCols}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
