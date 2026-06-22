'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useScrolled } from '@/hooks/useScrolled'
import { cn, resolveLink } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import { getMediaURL } from '@/lib/payload'
import { CATEGORY_BASE } from '@/lib/routes'
import SearchOverlay from '@/components/search/SearchOverlay'

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4a6 6 0 100 12A6 6 0 008 4zM18 18l-4-4" />
  </svg>
)

// Mobilna „box" ikonica — zaobljeni kvadrat sa brand borderom (hamburger / X).
const MenuBoxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="26" height="26" rx="7" stroke="#8FC640" strokeWidth="2" />
    <path d="M8 9H20" stroke="#54585B" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M8 14H20" stroke="#8FC640" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M8 19H20" stroke="#54585B" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)
const CloseBoxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="26" height="26" rx="7" stroke="#8FC640" strokeWidth="2" />
    <path d="M10 10L18 18" stroke="#54585B" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M18 10L10 18" stroke="#54585B" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)
const SearchBoxIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="26" height="26" rx="7" stroke="#8FC640" strokeWidth="2" />
    <circle cx="12.5" cy="12.5" r="4" stroke="#54585B" strokeWidth="2.2" />
    <path d="M16 16L20 20" stroke="#54585B" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

// ─── Category grouping (top categories + their children) ───────────────────────

const PARENT_ORDER = ['kapije', 'ograde', 'automatizacija-kapija', 'kontrola-pristupa', 'oprema-i-dodaci', 'visoka-sigurnost']
const parentIdOf = (c) => (typeof c?.parent === 'object' ? c.parent?.id : c?.parent)

function groupCategories(categories) {
  const docs = categories?.docs ?? categories ?? []
  if (!docs.length) return []
  const parents = docs.filter((c) => !parentIdOf(c))
  const childrenOf = (pid) => docs.filter((c) => parentIdOf(c) === pid)
  return parents
    .map((p) => ({ ...p, children: childrenOf(p.id) }))
    .sort((a, b) => {
      const ai = PARENT_ORDER.indexOf(a.slug)
      const bi = PARENT_ORDER.indexOf(b.slug)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ChevronDown = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l4 4 4-4" />
  </svg>
)
const MenuIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)
const CloseIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const ArrowRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
  </svg>
)

// ─── Logo ─────────────────────────────────────────────────────────────────────

function Logo({ data }) {
  const logoUrl = getMediaURL(data?.logo)
  const name    = data?.siteName || SITE_NAME

  return (
    <Link href="/" className="flex-shrink-0 flex items-center gap-2.5" aria-label={`${name} — Naslovna`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={name}
          width={160}
          height={44}
          className="h-9 w-auto object-contain"
          priority
        />
      ) : (
        <>
          {/* Brand mark */}
          <div className="w-8 h-8 rounded-[7px] bg-brand flex items-center justify-center shadow-brand-sm flex-shrink-0">
            <span className="text-white font-bold text-[15px] leading-none select-none">P</span>
          </div>
          {/* Wordmark */}
          <span className="font-display font-extrabold text-[17px] tracking-[-0.02em] text-gray-950 leading-none">
            {name.toUpperCase().split(' ')[0]}
            <span className="text-brand">.</span>
          </span>
        </>
      )}
    </Link>
  )
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

function Dropdown({ label, subItems, parentHref, isOpen, onClose }) {
  if (!subItems?.length) return null

  return (
    <div
      role="menu"
      aria-label={`${label} podmeni`}
      className={cn(
        // Position: anchored to the button, centered
        'absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2',
        'z-50 w-64',
        'bg-white rounded-2xl border border-gray-100/80',
        'shadow-[0_8px_40px_-8px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.06)]',
        'overflow-hidden',
        'transition-all duration-200 origin-top',
        isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-[0.97] -translate-y-1 pointer-events-none',
      )}
    >
      <ul className="py-1.5" role="list">
        {subItems.map((sub, i) => (
          <li key={i}>
            <Link
              href={sub.href}
              role="menuitem"
              onClick={onClose}
              target={sub.newTab ? '_blank' : undefined}
              rel={sub.newTab ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-3 mx-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand/[0.06] hover:text-gray-950 transition-colors duration-150"
            >
              <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-150">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </span>
              {sub.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mx-2 mb-1.5 px-4 py-2.5 bg-gray-50 rounded-xl flex items-center justify-between border-t border-gray-100 mt-1">
        <span className="text-xs text-gray-400">Sve kategorije</span>
        <Link
          href={parentHref}
          onClick={onClose}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-700 transition-colors"
        >
          Pogledaj sve
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// ─── Mega menu (all product categories) ────────────────────────────────────────

function MegaMenu({ groups, isOpen, onClose }) {
  if (!groups?.length) return null
  return (
    <div
      role="menu"
      aria-label="Kategorije proizvoda"
      className={cn(
        'absolute top-[calc(100%+8px)] left-0',
        'z-50 w-[min(820px,92vw)]',
        'bg-white rounded-2xl border border-gray-100/80',
        'shadow-[0_8px_40px_-8px_rgba(0,0,0,0.16),0_2px_8px_-2px_rgba(0,0,0,0.06)]',
        'overflow-hidden transition-all duration-200 origin-top',
        isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-[0.98] -translate-y-1 pointer-events-none',
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 p-6">
        {groups.map((cat) => (
          <div key={cat.id} className="min-w-0">
            <Link
              href={`${CATEGORY_BASE}/${cat.slug}`}
              onClick={onClose}
              className="group flex items-center gap-1.5 text-[13px] font-extrabold uppercase tracking-wide text-gray-950 hover:text-brand transition-colors"
            >
              {cat.title}
              <ArrowRightIcon className="w-3 h-3 text-brand opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
            <span className="mt-2 block h-px w-8 bg-brand/40" aria-hidden="true" />
            {cat.children?.length > 0 && (
              <ul className="mt-3 space-y-1.5" role="list">
                {cat.children.map((kid) => (
                  <li key={kid.id}>
                    <Link
                      href={`${CATEGORY_BASE}/${cat.slug}/${kid.slug}`}
                      onClick={onClose}
                      className="block text-[13px] text-gray-600 hover:text-brand hover:translate-x-0.5 transition-all duration-150"
                    >
                      {kid.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-100">
        <span className="text-xs text-gray-400">Sve kategorije i proizvodi</span>
        <Link
          href="/proizvodi"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-700 transition-colors"
        >
          Svi proizvodi
          <ArrowRightIcon className="w-3 h-3" />
        </Link>
      </div>
    </div>
  )
}

// ─── Desktop Nav ──────────────────────────────────────────────────────────────

function DesktopNav({ navItems, categories }) {
  const pathname = usePathname()
  const [active, setActive] = useState(null)
  const timer = useRef(null)

  const open     = useCallback((id) => { clearTimeout(timer.current); setActive(id) }, [])
  const close    = useCallback(() => { timer.current = setTimeout(() => setActive(null), 160) }, [])
  const closeNow = useCallback(() => { clearTimeout(timer.current); setActive(null) }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  if (!navItems?.length) return null

  return (
    <nav aria-label="Glavna navigacija" className="hidden lg:flex items-center gap-0.5">
      {navItems.map((rawItem, idx) => {
        const resolved    = resolveLink(rawItem?.link)
        const subItems    = (rawItem?.subItems ?? []).map((s) => resolveLink(s?.link)).filter(s => s.label)
        const hasChildren = subItems.length > 0
        const isActive    = pathname === resolved.href || (resolved.href !== '/' && resolved.href !== '#' && pathname.startsWith(resolved.href.split('?')[0]))
        const isOpen      = active === idx

        return (
          <div
            key={idx}
            className="relative"
            onMouseEnter={() => hasChildren && open(idx)}
            onMouseLeave={close}
          >
            {hasChildren ? (
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  'hover:bg-gray-100 hover:text-gray-950',
                  isActive ? 'text-gray-950' : 'text-gray-600',
                )}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => isOpen ? closeNow() : open(idx)}
              >
                {resolved.label}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
              </button>
            ) : (
              <Link
                href={resolved.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  'hover:bg-gray-100 hover:text-gray-950',
                  isActive ? 'text-gray-950' : 'text-gray-600',
                )}
              >
                {resolved.label}
              </Link>
            )}

            {hasChildren && (
              <Dropdown
                label={resolved.label}
                subItems={subItems}
                parentHref={resolved.href}
                isOpen={isOpen}
                onClose={closeNow}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

function MobileDrawer({ isOpen, onClose, data, ctaLink, categories }) {
  const pathname  = usePathname()
  const [expanded, setExpanded] = useState(null)
  const groups = groupCategories(categories)

  // Reset expanded on close
  useEffect(() => { if (!isOpen) setExpanded(null) }, [isOpen])

  // Close on navigation
  useEffect(() => { onClose() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-gray-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigacioni meni"
        id="mobile-nav-drawer"
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white flex flex-col lg:hidden',
          'shadow-2xl transition-transform duration-300 ease-spring',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[var(--header-height)] border-b border-gray-100 flex-shrink-0">
          <Logo data={data} />
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-950 hover:bg-gray-100 transition-colors"
            aria-label="Zatvori meni"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5" aria-label="Mobilna navigacija">
          {/* Categories — always shown as top-level items (independent of nav config) */}
          {groups.length > 0 && (
            <>
              <p className="px-4 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Kategorije
              </p>
              {groups.map((cat) => {
                const hasKids = cat.children?.length > 0
                const catKey = `cat-${cat.id}`
                const catOpen = expanded === catKey
                const catHref = `${CATEGORY_BASE}/${cat.slug}`
                return (
                  <div key={cat.id} className="mb-0.5">
                    <div
                      className={cn(
                        'flex items-center rounded-xl transition-colors',
                        catOpen ? 'bg-brand/[0.08]' : 'hover:bg-gray-100',
                      )}
                    >
                      <Link
                        href={catHref}
                        onClick={onClose}
                        className={cn('flex-1 px-4 py-3 text-sm font-semibold', catOpen ? 'text-brand-700' : 'text-gray-700')}
                      >
                        {cat.title}
                      </Link>
                      {hasKids && (
                        <button
                          type="button"
                          onClick={() => setExpanded(catOpen ? null : catKey)}
                          aria-expanded={catOpen}
                          aria-label={`${cat.title} podkategorije`}
                          className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-500"
                        >
                          <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', catOpen && 'rotate-180')} />
                        </button>
                      )}
                    </div>
                    {hasKids && (
                      <div className={cn('overflow-hidden transition-all duration-250 ease-spring', catOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                        <div className="ml-3 pl-3 border-l-2 border-gray-100 py-1 space-y-0.5 mt-0.5 mb-1">
                          {cat.children.map((kid) => (
                            <Link
                              key={kid.id}
                              href={`${CATEGORY_BASE}/${cat.slug}/${kid.slug}`}
                              onClick={onClose}
                              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-brand hover:bg-brand/[0.06] transition-colors"
                            >
                              <span className="w-1 h-1 rounded-full bg-brand/40 flex-shrink-0" />
                              {kid.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <Link
                href="/proizvodi"
                onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-3 mb-1 rounded-xl text-sm font-semibold text-brand hover:bg-brand/[0.06] transition-colors"
              >
                Svi proizvodi
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
              <div className="mx-4 my-2 border-t border-gray-100" />
            </>
          )}

          {(data?.navItems ?? []).map((rawItem, idx) => {
            const resolved    = resolveLink(rawItem?.link)
            const subItems    = (rawItem?.subItems ?? []).map((s) => resolveLink(s?.link)).filter(s => s.label)
            const hasChildren = subItems.length > 0
            const isActive    = pathname === resolved.href
            const isExpanded  = expanded === idx

            return (
              <div key={idx} className="mb-0.5">
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(isExpanded ? null : idx)}
                      className={cn(
                        'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                        isActive || isExpanded
                          ? 'bg-brand/[0.08] text-brand-700'
                          : 'text-gray-700 hover:bg-gray-100',
                      )}
                      aria-expanded={isExpanded}
                    >
                      {resolved.label}
                      <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                    </button>

                    {/* Sub items */}
                    <div className={cn(
                      'overflow-hidden transition-all duration-250 ease-spring',
                      isExpanded ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
                    )}>
                      <div className="ml-3 pl-3 border-l-2 border-gray-100 py-1 space-y-0.5 mt-0.5 mb-1">
                        {subItems.map((sub, si) => (
                          <Link
                            key={si}
                            href={sub.href}
                            onClick={onClose}
                            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:text-brand hover:bg-brand/[0.06] transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-brand/40 flex-shrink-0" />
                            {sub.label}
                          </Link>
                        ))}
                        <Link
                          href={resolved.href}
                          onClick={onClose}
                          className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-brand uppercase tracking-wider"
                        >
                          Svi {resolved.label.toLowerCase()}
                          <ArrowRightIcon className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={resolved.href}
                    onClick={onClose}
                    className={cn(
                      'flex px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                      isActive ? 'bg-brand/[0.08] text-brand-700' : 'text-gray-700 hover:bg-gray-100',
                    )}
                  >
                    {resolved.label}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer CTA */}
        <div className="flex-shrink-0 border-t border-gray-100 p-4 space-y-2.5">
          {ctaLink && (
            <Link href={ctaLink.href} onClick={onClose} className="btn btn-lg btn-primary w-full">
              {ctaLink.label}
            </Link>
          )}
          {/* Phone from topBar */}
          {(data?.topBar ?? []).filter(item => resolveLink(item?.link).href.startsWith('tel:')).map((item, i) => {
            const { href, label } = resolveLink(item?.link)
            return (
              <a key={i} href={href} className="flex items-center justify-center gap-2 w-full h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {label}
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ topBar }) {
  if (!topBar?.length) return null
  return (
    <div className="hidden md:block bg-gray-50 text-gray-500 text-[11px] font-medium tracking-wide border-b border-gray-100">
      <div className="container-site">
        <div className="flex items-center justify-end h-8 gap-6">
          <div className="flex items-center gap-5">
            {topBar.map((item, i) => {
              const { href, label, newTab } = resolveLink(item?.link)
              return (
                <a
                  key={i}
                  href={href}
                  target={newTab ? '_blank' : undefined}
                  rel={newTab ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 hover:text-gray-900 transition-colors duration-150"
                >
                  {label}
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────

function PromoBanner({ banner }) {
  const [visible, setVisible] = useState(true)
  if (!banner?.enabled || !banner?.text || !visible) return null

  const cta = banner.link ? resolveLink(banner.link) : null

  return (
    <div className="relative bg-brand text-white text-center py-2.5 px-12">
      <p className="text-[12px] font-semibold tracking-wide leading-none">
        {banner.text}
        {cta?.href && (
          <Link href={cta.href} className="ml-2 underline underline-offset-2 hover:no-underline opacity-90 hover:opacity-100">
            {cta.label} →
          </Link>
        )}
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded opacity-60 hover:opacity-100 hover:bg-white/20 transition-all"
        aria-label="Zatvori"
      >
        <CloseIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ─── Category bar (all top categories, always visible) ─────────────────────────

function CategoryBar({ categories }) {
  const groups = groupCategories(categories)
  const pathname = usePathname()
  const [active, setActive] = useState(null)
  const timer = useRef(null)
  const open = useCallback((id) => { clearTimeout(timer.current); setActive(id) }, [])
  const close = useCallback(() => { timer.current = setTimeout(() => setActive(null), 160) }, [])
  const closeNow = useCallback(() => { clearTimeout(timer.current); setActive(null) }, [])
  useEffect(() => () => clearTimeout(timer.current), [])

  if (!groups.length) return null

  return (
    <div className="hidden lg:block bg-white border-b border-gray-100 shadow-[0_2px_8px_-6px_rgba(15,23,42,0.25)]">
      <div className="container-site">
        <nav aria-label="Kategorije proizvoda" className="flex items-center gap-0.5 h-12">
          {groups.map((cat, idx) => {
            const hasKids = cat.children?.length > 0
            const href = `${CATEGORY_BASE}/${cat.slug}`
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            const isOpen = active === idx
            return (
              <div
                key={cat.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => hasKids && open(idx)}
                onMouseLeave={close}
              >
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-1.5 px-3 h-full text-[13px] font-semibold transition-colors',
                    isActive ? 'text-brand' : 'text-gray-700 hover:text-brand',
                  )}
                >
                  {cat.title}
                  {hasKids && <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />}
                </Link>

                {hasKids && (
                  <div
                    role="menu"
                    className={cn(
                      'absolute top-full left-0 z-50 w-60',
                      'bg-white rounded-2xl border border-gray-100/80',
                      'shadow-[0_8px_40px_-8px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.06)]',
                      'overflow-hidden transition-all duration-200 origin-top',
                      isOpen
                        ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-[0.97] -translate-y-1 pointer-events-none',
                    )}
                  >
                    <ul className="py-1.5" role="list">
                      {cat.children.map((kid) => (
                        <li key={kid.id}>
                          <Link
                            href={`${CATEGORY_BASE}/${cat.slug}/${kid.slug}`}
                            role="menuitem"
                            onClick={closeNow}
                            className="group flex items-center gap-3 mx-1.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand/[0.06] hover:text-gray-950 transition-colors duration-150"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand/40 group-hover:bg-brand flex-shrink-0 transition-colors" />
                            {kid.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mx-2 mb-1.5 px-4 py-2.5 bg-gray-50 rounded-xl flex items-center justify-between border-t border-gray-100 mt-1">
                      <span className="text-xs text-gray-400">Sve u kategoriji</span>
                      <Link href={href} onClick={closeNow} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-700 transition-colors">
                        Pogledaj sve
                        <ArrowRightIcon className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          <Link
            href="/proizvodi"
            className="ml-auto inline-flex items-center gap-1.5 px-3 h-full text-[13px] font-bold text-brand hover:text-brand-700 transition-colors"
          >
            Svi proizvodi
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </nav>
      </div>
    </div>
  )
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header({ data, categories }) {
  const scrolled  = useScrolled(12)
  const pathname  = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Globalni prečac: Cmd/Ctrl+K i "/" otvaraju pretragu (kad korisnik ne kuca u polje).
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key?.toLowerCase()
      const tag = (e.target?.tagName || '').toLowerCase()
      const typing = tag === 'input' || tag === 'textarea' || e.target?.isContentEditable
      if ((k === 'k' && (e.metaKey || e.ctrlKey)) || (k === '/' && !typing)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // CTA link: prefer promoBanner link, fallback to last topBar item that isn't tel/mailto
  const ctaLink = (() => {
    if (data?.promoBanner?.link) {
      const resolved = resolveLink(data.promoBanner.link)
      if (resolved.label && resolved.href !== '#') return resolved
    }
    const candidates = (data?.topBar ?? [])
      .map(item => resolveLink(item?.link))
      .filter(r => r.label && !r.href.startsWith('tel:') && !r.href.startsWith('mailto:'))
    return candidates.at(-1) ?? null
  })()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  useEffect(() => { setMobileOpen(false); setSearchOpen(false) }, [pathname])

  return (
    <header role="banner" className="sticky top-0 z-30">
      <TopBar topBar={data?.topBar} />
      <PromoBanner banner={data?.promoBanner} />

      {/* Main bar */}
      <div className={cn(
        'bg-white transition-all duration-300',
        scrolled ? 'shadow-header' : 'border-b border-gray-100',
      )}>
        <div className="container-site">
          <div className="flex items-center justify-between h-[var(--header-height)] gap-6">
            <Logo data={data} />
            <DesktopNav navItems={data?.navItems} categories={categories} />

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 h-9 pl-2.5 pr-3 rounded-lg text-sm text-gray-400 border border-gray-200 hover:border-brand/40 hover:text-gray-600 transition-colors"
                aria-label="Pretraga"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden xl:inline">Pretraga</span>
                <span className="hidden xl:inline ml-1 rounded border border-gray-200 px-1 text-[10px] font-semibold text-gray-400">⌘K</span>
              </button>

              {/* Phone link */}
              {(data?.topBar ?? []).filter(item => resolveLink(item?.link).href.startsWith('tel:')).slice(0, 1).map((item, i) => {
                const { href, label } = resolveLink(item?.link)
                return (
                  <a key={i} href={href} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-950 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100">
                    <svg className="w-3.5 h-3.5 text-brand flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="hidden xl:inline">{label}</span>
                  </a>
                )
              })}

              {/* CTA */}
              {ctaLink && (
                <Link href={ctaLink.href} className="btn btn-sm btn-primary">
                  {ctaLink.label}
                </Link>
              )}
            </div>

            {/* Mobile actions: search + meni (box stil + labela) */}
            <div className="lg:hidden flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg active:bg-gray-100 transition-colors"
                aria-label="Pretraga"
              >
                <SearchBoxIcon />
                <span className="text-[11px] font-medium leading-none text-[#54585B]">Traži</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg active:bg-gray-100 transition-colors"
                aria-label={mobileOpen ? 'Zatvori meni' : 'Otvori meni'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileOpen ? <CloseBoxIcon /> : <MenuBoxIcon />}
                <span className="text-[11px] font-medium leading-none text-[#54585B]">
                  {mobileOpen ? 'Zatvori' : 'Meni'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category bar — all top categories, always visible (desktop) */}
      <CategoryBar categories={categories} />

      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} data={data} ctaLink={ctaLink} categories={categories} />

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
