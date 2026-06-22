import { redirect } from 'next/navigation'
import { getPage } from '@/lib/payload'
import SavetiList from '../../SavetiList'

export const revalidate = 3600

function pageNum(n) {
  const num = parseInt(Array.isArray(n) ? n[0] : n, 10)
  return Number.isFinite(num) ? num : 1
}

export async function generateMetadata({ params }) {
  const { n } = await params
  const current = pageNum(n)
  const page = await getPage('saveti').catch(() => null)
  const base = page?.meta?.title || 'Saveti | Palisada d.o.o.'
  return {
    title: { absolute: `${base} — strana ${current}` },
    alternates: { canonical: `/saveti/page/${current}/` },
  }
}

export default async function SavetiPaged({ params }) {
  const { n } = await params
  const current = pageNum(n)
  if (current < 2) redirect('/saveti') // strana 1 → kanonska /saveti
  return <SavetiList current={current} />
}
