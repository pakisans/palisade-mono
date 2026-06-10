import Link from 'next/link'

/**
 * Sticky two-tier category navigation for catalog + category pages.
 *
 *  Row 1 — glavne (parent) kategorije + "Svi proizvodi"
 *  Row 2 — kontekstualno: podkategorije aktivne grane (parent ili roditelj aktivnog deteta)
 *
 * Server component (čisti linkovi, bez client JS). Horizontalni scroll na mobilnom,
 * wrap na desktopu. activeSlug radi i za /proizvodi (?kategorija=) i /kategorije/[slug].
 */

function parentIdOf(category) {
  return typeof category?.parent === 'object' ? category.parent?.id : category?.parent
}

function orderParents(parents) {
  const preferred = ['kapije', 'ograde', 'automatizacija-kapija', 'kontrola-pristupa', 'visoka-sigurnost', 'oprema-i-dodaci']
  return [...parents].sort((a, b) => {
    const ai = preferred.indexOf(a.slug)
    const bi = preferred.indexOf(b.slug)
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    return String(a.title).localeCompare(String(b.title), 'sr')
  })
}

// ─── Pill ────────────────────────────────────────────────────────────────────

function Pill({ href, label, active, tone = 'parent' }) {
  const base = 'flex-shrink-0 inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1'

  const tones = {
    all: active
      ? 'h-9 px-4 text-[13px] bg-gray-950 text-white shadow-sm'
      : 'h-9 px-4 text-[13px] bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-950',
    parent: active
      ? 'h-9 px-4 text-[13px] bg-brand text-white shadow-brand-sm'
      : 'h-9 px-4 text-[13px] bg-white text-gray-800 border border-gray-200 hover:border-brand/45 hover:text-brand',
    child: active
      ? 'h-8 px-3.5 text-[12px] bg-brand text-white shadow-brand-sm'
      : 'h-8 px-3.5 text-[12px] bg-gray-50 text-gray-600 border border-gray-100 hover:bg-white hover:border-brand/40 hover:text-brand',
  }

  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={`${base} ${tones[tone]}`}>
      {label}
    </Link>
  )
}

// ─── Navigator ─────────────────────────────────────────────────────────────────

export default function CategoryNavigator({ categories, activeSlug = null, sticky = true }) {
  const docs = categories?.docs ?? categories ?? []
  if (!docs.length) return null

  const parents  = orderParents(docs.filter((c) => !parentIdOf(c)))
  const children = docs.filter((c) => parentIdOf(c))
  const kidsOf   = (pid) => children.filter((c) => parentIdOf(c) === pid)

  // Find active category + its branch
  const activeCat      = docs.find((c) => c.slug === activeSlug) || null
  const activeIsChild  = activeCat && parentIdOf(activeCat)
  const activeParentId = activeIsChild ? parentIdOf(activeCat) : (activeCat ? activeCat.id : null)
  const activeParent   = parents.find((p) => p.id === activeParentId) || null

  // Row 2 = children of active branch (only when a branch is active and has children)
  const branchKids = activeParent ? kidsOf(activeParent.id) : []

  return (
    <nav
      aria-label="Navigacija kroz kategorije"
      className={[
        sticky ? 'sticky top-[var(--header-height)] z-20' : '',
        'bg-white/95 backdrop-blur border-b border-gray-100 shadow-[0_4px_16px_-12px_rgba(15,23,42,0.4)]',
      ].join(' ')}
    >
      <div className="container-site">
        {/* Row 1 — main categories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5 -mx-1 px-1">
          <Pill href="/proizvodi" label="Svi proizvodi" active={!activeSlug} tone="all" />

          <span className="flex-shrink-0 w-px h-5 bg-gray-200 mx-0.5" aria-hidden="true" />

          {parents.map((parent) => (
            <Pill
              key={parent.id}
              href={`/kategorije/${parent.slug}`}
              label={parent.title}
              active={activeParent?.id === parent.id}
              tone="parent"
            />
          ))}
        </div>

        {/* Row 2 — contextual subcategories of active branch */}
        {branchKids.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2.5 -mx-1 px-1 animate-fade-in">
            <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 pr-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 2v5a2 2 0 002 2h6M7 6l3 3-3 3" />
              </svg>
              {activeParent.title}
            </span>
            <Pill
              href={`/kategorije/${activeParent.slug}`}
              label="Sve"
              active={activeSlug === activeParent.slug}
              tone="child"
            />
            {branchKids.map((kid) => (
              <Pill
                key={kid.id}
                href={`/kategorije/${kid.slug}`}
                label={kid.title}
                active={activeSlug === kid.slug}
                tone="child"
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
