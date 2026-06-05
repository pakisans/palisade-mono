'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useScrolled } from '@/hooks/useScrolled'
import { cn, resolveLink } from '@/lib/utils'
import { SITE_NAME } from '@/lib/constants'
import { getMediaURL } from '@/lib/payload'

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

// ─── Desktop Nav ──────────────────────────────────────────────────────────────

function DesktopNav({ navItems }) {
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

function MobileDrawer({ isOpen, onClose, data, ctaLink }) {
  const pathname  = usePathname()
  const [expanded, setExpanded] = useState(null)

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
            <Link
              href={ctaLink.href}
              onClick={onClose}
              className="flex items-center justify-center w-full h-12 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-600 transition-colors shadow-brand-sm"
            >
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
    <div className="hidden md:block bg-gray-950 text-gray-500 text-[11px] font-medium tracking-wide">
      <div className="container-site">
        <div className="flex items-center justify-between h-8 gap-6">
          <div className="flex items-center gap-5">
            {topBar.map((item, i) => {
              const { href, label, newTab } = resolveLink(item?.link)
              return (
                <a
                  key={i}
                  href={href}
                  target={newTab ? '_blank' : undefined}
                  rel={newTab ? 'noopener noreferrer' : undefined}
                  className="hover:text-gray-200 transition-colors duration-150"
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

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function Header({ data }) {
  const scrolled  = useScrolled(12)
  const pathname  = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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

  useEffect(() => { setMobileOpen(false) }, [pathname])

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
            <DesktopNav navItems={data?.navItems} />

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-2.5 flex-shrink-0">
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
                <Link
                  href={ctaLink.href}
                  className="inline-flex items-center h-9 px-5 rounded-xl bg-brand text-white text-[13px] font-bold tracking-tight hover:bg-brand-600 transition-all duration-200 shadow-brand-sm hover:shadow-brand"
                >
                  {ctaLink.label}
                </Link>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-700 hover:text-gray-950 hover:bg-gray-100 transition-colors"
              aria-label={mobileOpen ? 'Zatvori meni' : 'Otvori meni'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} data={data} ctaLink={ctaLink} />
    </header>
  )
}
