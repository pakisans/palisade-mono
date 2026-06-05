import Link from 'next/link'
import { resolveLink } from '@/lib/utils'
import RichText from '@/components/ui/RichText'

const styles = {
  info:    'bg-brand/[0.07] border-brand/20 text-gray-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  error:   'bg-red-50 border-red-200 text-red-900',
  success: 'bg-green-50 border-green-200 text-green-900',
}

export default function BannerBlock({ block }) {
  if (!block?.content && !block?.richText) return null

  const style  = styles[block.style] || styles.info
  const links  = (block.links ?? []).map(item => ({ ...resolveLink(item?.link), appearance: item?.link?.appearance }))

  return (
    <div className="container-site py-4">
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-4 rounded-2xl border ${style}`}>
        <div className="min-w-0">
          {block.richText ? (
            <RichText content={block.richText} className="[&_p]:text-sm [&_p]:leading-snug [&_strong]:font-bold" />
          ) : (
            <p className="text-sm font-medium">{block.content}</p>
          )}
        </div>
        {links.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {links.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="inline-flex items-center h-8 px-4 rounded-xl bg-brand text-white text-[12px] font-bold hover:bg-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
