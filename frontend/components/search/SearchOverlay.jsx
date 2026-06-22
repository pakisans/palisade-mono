'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

const TYPE_BADGE = {
  savet: { label: 'Savet', cls: 'bg-brand/10 text-brand' },
  projekat: { label: 'Projekat', cls: 'bg-gray-100 text-gray-600' },
}

function Thumb({ src, alt }) {
  return (
    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
      {src ? (
        // plain img — male sličice u listi, ne treba next/image optimizacija
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ''} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4 3 3 5-5 4 4M4 6h16v12H4z" />
        </svg>
      )}
    </span>
  )
}

function Row({ item, idx, active, onHover, onPick }) {
  const ref = useRef(null)
  const isActive = idx === active
  useEffect(() => {
    if (isActive) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [isActive])
  const hasSale = item.kind === 'product' && item.salePrice > 0 && item.salePrice < item.price
  return (
    <button
      ref={ref}
      type="button"
      onMouseEnter={() => onHover(idx)}
      onClick={() => onPick(item.href)}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-brand/[0.07]' : 'hover:bg-gray-50'}`}
    >
      <Thumb src={item.image} alt={item.title} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-950">{item.title}</span>
        {item.kind === 'product' ? (
          item.price > 0 ? (
            <span className="text-[13px] font-medium text-gray-500">
              {hasSale ? formatPrice(item.salePrice) : formatPrice(item.price)}
            </span>
          ) : (
            <span className="text-[13px] text-gray-400">Cena na upit</span>
          )
        ) : (
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TYPE_BADGE[item.type]?.cls ?? 'bg-gray-100 text-gray-600'}`}>
            {TYPE_BADGE[item.type]?.label ?? 'Sadržaj'}
          </span>
        )}
      </span>
      <svg className={`h-4 w-4 flex-shrink-0 transition-opacity ${isActive ? 'text-brand opacity-100' : 'text-gray-300 opacity-0'}`} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </button>
  )
}

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const [data, setData] = useState({ products: [], posts: [] })
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef(null)
  const router = useRouter()

  useEffect(() => setMounted(true), [])

  // Reset + fokus + scroll lock pri otvaranju
  useEffect(() => {
    if (!open) return
    setActive(0)
    const t = setTimeout(() => inputRef.current?.focus(), 40)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [open])

  // Debounce-ovan fetch
  useEffect(() => {
    if (!open) return
    const term = q.trim()
    if (term.length < 2) {
      setData({ products: [], posts: [] })
      setLoading(false)
      return
    }
    setLoading(true)
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/pretraga/suggest/?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        const json = await res.json()
        setData({ products: json.products ?? [], posts: json.posts ?? [] })
        setActive(0)
      } catch {
        /* abort / network */
      } finally {
        setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q, open])

  const flat = [
    ...data.products.map((p) => ({ ...p, kind: 'product' })),
    ...data.posts.map((p) => ({ ...p, kind: 'post' })),
  ]

  const go = useCallback(
    (href) => {
      onClose()
      router.push(href)
    },
    [onClose, router],
  )

  const showAll = () => {
    const term = q.trim()
    if (term.length >= 2) go(`/pretraga/?q=${encodeURIComponent(term)}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') return onClose()
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[active]) go(flat[active].href)
      else showAll()
    }
  }

  if (!mounted || !open) return null

  const term = q.trim()
  const hasResults = flat.length > 0

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:pt-[10vh]" role="dialog" aria-modal="true" aria-label="Pretraga sajta">
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />

      <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-fade-up">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4">
          <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 4a6 6 0 100 12A6 6 0 008 4zM18 18l-4-4" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="Pretraži proizvode, savete, projekte…"
            className="h-14 flex-1 bg-transparent text-base text-gray-950 placeholder:text-gray-400 focus:outline-none"
            aria-label="Unesite pojam za pretragu"
          />
          {loading && (
            <svg className="h-4 w-4 flex-shrink-0 animate-spin text-brand" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <button type="button" onClick={onClose} className="hidden flex-shrink-0 rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 sm:block" aria-label="Zatvori">
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {term.length < 2 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">Unesite bar 2 slova za pretragu.</p>
          ) : !hasResults && !loading ? (
            <p className="px-4 py-10 text-center text-sm text-gray-500">
              Nema rezultata za „<span className="font-semibold text-gray-700">{term}</span>".
            </p>
          ) : (
            <>
              {data.products.length > 0 && (
                <section className="py-1.5">
                  <p className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Proizvodi</p>
                  {data.products.map((p, i) => (
                    <Row key={`p-${p.href}`} item={{ ...p, kind: 'product' }} idx={i} active={active} onHover={setActive} onPick={go} />
                  ))}
                </section>
              )}
              {data.posts.length > 0 && (
                <section className="border-t border-gray-50 py-1.5">
                  <p className="px-4 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Saveti i projekti</p>
                  {data.posts.map((p, i) => (
                    <Row key={`s-${p.href}`} item={{ ...p, kind: 'post' }} idx={data.products.length + i} active={active} onHover={setActive} onPick={go} />
                  ))}
                </section>
              )}
            </>
          )}
        </div>

        {/* Show all */}
        {term.length >= 2 && (
          <button
            type="button"
            onClick={showAll}
            className="flex items-center justify-center gap-1.5 border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm font-semibold text-brand hover:bg-gray-100 transition-colors"
          >
            Prikaži sve rezultate za „{term}"
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        )}
      </div>
    </div>,
    document.body,
  )
}
