'use client'

import type { DefaultCellComponentProps } from 'payload'

const MAX = 60

/** Ćelija liste: skraćen tekst, ceo tekst u tooltipu. */
export const TruncateCell = ({ cellData }: DefaultCellComponentProps) => {
  const text = String(cellData ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return <span style={{ opacity: 0.4 }}>-</span>
  const short = text.length > MAX ? `${text.slice(0, MAX).trimEnd()}…` : text
  return <span title={text}>{short}</span>
}

export default TruncateCell
