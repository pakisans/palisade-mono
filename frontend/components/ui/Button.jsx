import Link from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  primary:   'bg-brand text-white hover:bg-brand-600 shadow-brand-sm hover:shadow-brand active:scale-[0.98]',
  secondary: 'bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-card active:scale-[0.98]',
  outline:   'border-2 border-brand text-brand hover:bg-brand hover:text-white active:scale-[0.98]',
  outline_dark: 'border border-white/20 text-white hover:bg-white/10 hover:border-white/40 active:scale-[0.98]',
  ghost:     'text-gray-700 hover:text-gray-950 hover:bg-gray-100',
  dark:      'bg-gray-950 text-white hover:bg-gray-900 active:scale-[0.98]',
}

const sizes = {
  sm:  'h-9  px-4   text-xs  gap-1.5 rounded-lg  font-semibold',
  md:  'h-11 px-5   text-sm  gap-2   rounded-xl   font-semibold',
  lg:  'h-12 px-7   text-sm  gap-2   rounded-xl   font-semibold',
  xl:  'h-14 px-10  text-base gap-2.5 rounded-2xl font-bold',
}

export default function Button({ children, href, variant = 'primary', size = 'md', className, icon, iconPosition = 'right', external, disabled, type = 'button', onClick, ...rest }) {
  const cls = cn(
    'inline-flex items-center justify-center tracking-tight transition-all duration-200 ease-spring',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none select-none',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      {icon && iconPosition === 'left'  && <span className="flex-shrink-0 -ml-0.5">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0 -mr-0.5">{icon}</span>}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} {...rest}>
      {content}
    </button>
  )
}
