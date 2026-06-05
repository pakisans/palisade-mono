import { cn } from '@/lib/utils'

const variants = {
  brand:  'bg-brand-50 text-brand-700 border border-brand-100',
  slate:  'bg-slate-100 text-slate-700 border border-slate-200',
  dark:   'bg-slate-900 text-white',
  green:  'bg-green-50 text-green-700 border border-green-100',
}

export default function Badge({ children, variant = 'slate', className }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
