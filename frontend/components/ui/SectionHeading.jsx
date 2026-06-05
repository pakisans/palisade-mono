import { cn } from '@/lib/utils'

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  light = false,
  className,
}) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cn(
          'text-xs font-bold uppercase tracking-[0.15em] mb-3',
          light ? 'text-brand-300' : 'text-brand',
        )}>
          {eyebrow}
        </p>
      )}

      <div className={cn('flex items-center gap-3 mb-4', align === 'center' && 'justify-center')}>
        {align !== 'center' && (
          <span className="w-10 h-0.5 bg-brand flex-shrink-0" aria-hidden="true" />
        )}
        <h2 className={cn(
          'font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight',
          light ? 'text-white' : 'text-slate-900',
        )}>
          {title}
        </h2>
      </div>

      {description && (
        <p className={cn(
          'text-base md:text-lg leading-relaxed',
          light ? 'text-slate-300' : 'text-slate-500',
        )}>
          {description}
        </p>
      )}
    </div>
  )
}
