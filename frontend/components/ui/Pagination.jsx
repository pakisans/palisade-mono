import Link from 'next/link'
import { cn } from '@/lib/utils'

const ChevronLeft = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 3L6 8l4 5" />
  </svg>
)
const ChevronRight = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l4 5-4 5" />
  </svg>
)

/**
 * Builds a clean URL preserving existing query params.
 * Page 1 → removes the page param (clean canonical URL).
 * keepParams: existing params to preserve (e.g. { kategorija: 'kapije', pretraga: 'eurofence' })
 * pageParam: name of the page query param (default 'stranica')
 */
function buildUrl(basePath, pageNum, keepParams, pageParam) {
  const params = new URLSearchParams()

  Object.entries(keepParams).forEach(([key, val]) => {
    if (val != null && val !== '') params.set(key, String(val))
  })

  // Page 1 = clean URL without page param
  if (pageNum > 1) {
    params.set(pageParam, String(pageNum))
  }

  const qs = params.toString()
  return `${basePath}${qs ? `?${qs}` : ''}`
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

/**
 * Props:
 *   basePath    — URL bez query stringa, e.g. "/proizvodi" ili "/kategorije/kapije"
 *   current     — trenutna stranica (1-based), čita se iz searchParams na server strani
 *   total       — ukupan broj stranica
 *   pageParam   — ime query parametra za stranicu (default: 'stranica')
 *   keepParams  — ostali query parametri koje treba sačuvati (e.g. { kategorija, pretraga })
 */
export default function Pagination({
  basePath,
  current,
  total,
  pageParam  = 'stranica',
  keepParams = {},
}) {
  if (!total || total <= 1) return null

  const pages = buildPageNumbers(current, total)
  const url   = (n) => buildUrl(basePath, n, keepParams, pageParam)

  const prevDisabled = current <= 1
  const nextDisabled = current >= total

  return (
    <nav aria-label="Paginacija" className="flex items-center justify-center gap-1.5 py-10">
      {/* Previous */}
      {prevDisabled ? (
        <span
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold text-gray-300 border border-gray-100 cursor-not-allowed select-none"
          aria-disabled="true"
        >
          <ChevronLeft />
          Prethodna
        </span>
      ) : (
        <Link
          href={url(current - 1)}
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors"
          aria-label="Prethodna strana"
        >
          <ChevronLeft />
          Prethodna
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-10 h-10 flex items-center justify-center text-sm text-gray-400 select-none"
              aria-hidden="true"
            >
              ···
            </span>
          ) : (
            <Link
              key={page}
              href={url(page)}
              aria-label={`Strana ${page}`}
              aria-current={page === current ? 'page' : undefined}
              className={cn(
                'w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-150',
                page === current
                  ? 'bg-brand text-white shadow-brand-sm pointer-events-none'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950',
              )}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {/* Next */}
      {nextDisabled ? (
        <span
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold text-gray-300 border border-gray-100 cursor-not-allowed select-none"
          aria-disabled="true"
        >
          Sledeća
          <ChevronRight />
        </span>
      ) : (
        <Link
          href={url(current + 1)}
          className="flex items-center gap-1.5 h-10 px-4 rounded-xl text-sm font-semibold text-gray-600 hover:text-gray-950 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors"
          aria-label="Sledeća strana"
        >
          Sledeća
          <ChevronRight />
        </Link>
      )}
    </nav>
  )
}
