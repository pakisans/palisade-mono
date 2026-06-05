const heights = {
  xs: 'h-6',
  sm: 'h-10',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-32',
}

export default function SpacerBlock({ block }) {
  const h = heights[block?.size] || heights.md
  return (
    <div className={h} role="separator" aria-hidden="true">
      {block?.showDivider && <div className="h-full flex items-center"><div className="w-full border-t border-gray-100" /></div>}
    </div>
  )
}
