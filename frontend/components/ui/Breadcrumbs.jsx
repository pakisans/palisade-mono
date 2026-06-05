import Link from 'next/link'

const ChevronRight = () => (
  <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3l4 5-4 5" />
  </svg>
)

/**
 * items: [{ label, href }]  — last item = current page (no href needed)
 */
export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items.length) return null

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
                {i > 0 && <ChevronRight />}
                {isLast || !item.href ? (
                  <span className="text-gray-950 font-medium truncate max-w-[200px]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-gray-700 transition-colors duration-150 truncate max-w-[160px]"
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
