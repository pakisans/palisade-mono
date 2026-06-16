import Link from 'next/link'

const ChevronRight = ({ dark }) => (
  <svg className={`w-3.5 h-3.5 flex-shrink-0 ${dark ? 'text-white/40' : 'text-gray-300'}`} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l4 5-4 5" />
  </svg>
)

/**
 * items: [{ label, href }]  — last item = current page (no href needed)
 * variant: 'light' (default, dark text for light bg) | 'dark' (light text for dark hero)
 */
export default function Breadcrumbs({ items = [], className = '', variant = 'light' }) {
  if (!items.length) return null
  const dark = variant === 'dark'

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL || ''}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Navigacija stranica" className={className}>
        <ol className="flex items-center flex-wrap gap-1.5 text-sm" role="list">
          {items.map((item, i) => {
            const isLast = i === items.length - 1
            return (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight dark={dark} />}
                {isLast || !item.href ? (
                  <span className={`font-semibold truncate max-w-[200px] ${dark ? 'text-white' : 'text-gray-950'}`} aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors duration-150 truncate max-w-[160px] ${dark ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-gray-700'}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
