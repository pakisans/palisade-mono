'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CATEGORY_BASE } from '@/lib/routes'

/**
 * Kategorijska navigacija za katalog + kategorijske stranice.
 *
 *  Desktop (lg+) — dvoredne pilule: Red 1 = glavne kategorije, Red 2 = podkategorije aktivne grane.
 *  Mobile (<lg)  — „drill-down" birač: dugme sa trenutnom kategorijom → panel sa granama →
 *                  tap na granu uđe u njene podkategorije (sa „nazad"). User-friendly, krupni tapovi.
 *  SEO           — uz vidljivi UI uvek se renderuje i kompletno stablo SVIH kategorija
 *                  (`sr-only <nav>`), tako da su svi linkovi uvek u DOM-u i krauleru dostupni.
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

// ─── Pill (desktop) ─────────────────────────────────────────────────────────────

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

const Chevron = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
  </svg>
)

// ─── Mobile drill-down picker ────────────────────────────────────────────────────

function MobilePicker({ parents, kidsOf, activeCat, activeParent }) {
  const [open, setOpen] = useState(false)
  // null = prikaz glavnih kategorija; id = prikaz podkategorija te grane
  const [view, setView] = useState(activeParent?.id ?? null)

  const currentLabel = activeCat?.title || 'Sve kategorije'
  const viewParent = parents.find((p) => p.id === view) || null
  const viewKids = viewParent ? kidsOf(viewParent.id) : []

  const close = () => { setOpen(false); setView(activeParent?.id ?? null) }

  return (
    <div className="py-2.5">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 h-12 px-4 rounded-xl bg-white border border-gray-200 text-left active:scale-[0.99] transition-transform"
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">Kategorija</span>
            <span className="text-sm font-bold text-gray-950 truncate leading-tight mt-0.5">{currentLabel}</span>
          </span>
        </span>
        <Chevron className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden animate-fade-in">
          {view === null ? (
            <ul className="max-h-[60vh] overflow-y-auto py-1" role="list">
              <li>
                <Link
                  href="/proizvodi"
                  onClick={close}
                  aria-current={!activeCat ? 'page' : undefined}
                  className={`flex items-center justify-between gap-2 h-12 px-4 text-sm font-semibold ${!activeCat ? 'text-brand bg-brand/[0.06]' : 'text-gray-800'} active:bg-gray-50`}
                >
                  Svi proizvodi
                </Link>
              </li>
              {parents.map((p) => {
                const kids = kidsOf(p.id)
                const isActive = activeParent?.id === p.id
                return (
                  <li key={p.id} className="border-t border-gray-50">
                    <div className="flex items-stretch">
                      <Link
                        href={`${CATEGORY_BASE}/${p.slug}`}
                        onClick={close}
                        aria-current={activeCat?.slug === p.slug ? 'page' : undefined}
                        className={`flex-1 flex items-center h-12 px-4 text-sm font-semibold ${isActive ? 'text-brand' : 'text-gray-800'} active:bg-gray-50 min-w-0`}
                      >
                        <span className="truncate">{p.title}</span>
                      </Link>
                      {kids.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setView(p.id)}
                          aria-label={`Otvori podkategorije: ${p.title}`}
                          className="flex items-center justify-center w-12 border-l border-gray-100 text-gray-400 active:bg-gray-50"
                        >
                          <Chevron className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Back */}
              <button
                type="button"
                onClick={() => setView(null)}
                className="flex items-center gap-2 w-full h-11 px-4 text-[13px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 active:bg-gray-50"
              >
                <Chevron className="w-4 h-4 rotate-180" />
                {viewParent?.title}
              </button>
              <ul className="py-1" role="list">
                <li>
                  <Link
                    href={`${CATEGORY_BASE}/${viewParent.slug}`}
                    onClick={close}
                    aria-current={activeCat?.slug === viewParent.slug ? 'page' : undefined}
                    className={`flex items-center h-12 px-4 text-sm font-semibold ${activeCat?.slug === viewParent.slug ? 'text-brand bg-brand/[0.06]' : 'text-gray-800'} active:bg-gray-50`}
                  >
                    Sve u „{viewParent.title}"
                  </Link>
                </li>
                {viewKids.map((kid) => (
                  <li key={kid.id} className="border-t border-gray-50">
                    <Link
                      href={`${CATEGORY_BASE}/${viewParent.slug}/${kid.slug}`}
                      onClick={close}
                      aria-current={activeCat?.slug === kid.slug ? 'page' : undefined}
                      className={`flex items-center h-12 px-4 text-sm ${activeCat?.slug === kid.slug ? 'text-brand font-semibold bg-brand/[0.06]' : 'text-gray-600'} active:bg-gray-50`}
                    >
                      {kid.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Navigator ─────────────────────────────────────────────────────────────────

export default function CategoryNavigator({
  categories,
  activeSlug = null,
  sticky = true,
  title = null,
  compact = false,
  contained = true,
}) {
  const docs = categories?.docs ?? categories ?? []
  if (!docs.length) return null

  const parents  = orderParents(docs.filter((c) => !parentIdOf(c)))
  const children = docs.filter((c) => parentIdOf(c))
  const kidsOf   = (pid) => children.filter((c) => parentIdOf(c) === pid)

  const activeCat      = docs.find((c) => c.slug === activeSlug) || null
  const activeIsChild  = activeCat && parentIdOf(activeCat)
  const activeParentId = activeIsChild ? parentIdOf(activeCat) : (activeCat ? activeCat.id : null)
  const activeParent   = parents.find((p) => p.id === activeParentId) || null
  const branchKids     = activeParent ? kidsOf(activeParent.id) : []

  return (
    <nav
      aria-label="Navigacija kroz kategorije"
      className={[
        sticky ? 'sticky top-[var(--header-height)] z-20' : '',
        'bg-white/95 backdrop-blur border-b border-gray-100 shadow-[0_4px_16px_-12px_rgba(15,23,42,0.4)]',
      ].join(' ')}
    >
      <div className={contained ? 'container-site' : 'px-4'}>
        {title && (
          <p className="pt-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">{title}</p>
        )}

        {/* ─── DESKTOP (lg+): dvoredne pilule ─────────────────────────── */}
        <div className="hidden lg:block">
          <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide ${compact ? 'py-2' : 'py-2.5'} -mx-1 px-1`}>
            <Pill href="/proizvodi" label="Svi proizvodi" active={!activeSlug} tone="all" />
            <span className="flex-shrink-0 w-px h-5 bg-gray-200 mx-0.5" aria-hidden="true" />
            {parents.map((parent) => (
              <Pill
                key={parent.id}
                href={`${CATEGORY_BASE}/${parent.slug}`}
                label={parent.title}
                active={activeParent?.id === parent.id}
                tone="parent"
              />
            ))}
          </div>

          {branchKids.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2.5 -mx-1 px-1 animate-fade-in">
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 pr-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 2v5a2 2 0 002 2h6M7 6l3 3-3 3" />
                </svg>
                {activeParent.title}
              </span>
              <Pill
                href={`${CATEGORY_BASE}/${activeParent.slug}`}
                label="Sve"
                active={activeSlug === activeParent.slug}
                tone="child"
              />
              {branchKids.map((kid) => (
                <Pill
                  key={kid.id}
                  href={`${CATEGORY_BASE}/${activeParent.slug}/${kid.slug}`}
                  label={kid.title}
                  active={activeSlug === kid.slug}
                  tone="child"
                />
              ))}
            </div>
          )}
        </div>

        {/* ─── MOBILE (<lg): drill-down birač ─────────────────────────── */}
        <div className="lg:hidden">
          <MobilePicker parents={parents} kidsOf={kidsOf} activeCat={activeCat} activeParent={activeParent} />
        </div>
      </div>

      {/* ─── SEO: kompletno stablo svih kategorija, uvek u DOM-u ─────────── */}
      <nav aria-label="Sve kategorije" className="sr-only">
        <ul>
          <li><Link href="/proizvodi">Svi proizvodi</Link></li>
          {parents.map((p) => (
            <li key={p.id}>
              <Link href={`${CATEGORY_BASE}/${p.slug}`}>{p.title}</Link>
              {kidsOf(p.id).length > 0 && (
                <ul>
                  {kidsOf(p.id).map((k) => (
                    <li key={k.id}>
                      <Link href={`${CATEGORY_BASE}/${p.slug}/${k.slug}`}>{k.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </nav>
  )
}
