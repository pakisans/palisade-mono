import { cn } from '@/lib/utils'

export default function Container({ children, className, as: Tag = 'div', narrow = false }) {
  return (
    <Tag className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', narrow ? 'max-w-4xl' : 'max-w-7xl', className)}>
      {children}
    </Tag>
  )
}
