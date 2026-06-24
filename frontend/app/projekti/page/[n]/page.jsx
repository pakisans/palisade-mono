import { redirect } from 'next/navigation'
import { getPage } from '@/lib/payload'
import ProjektiList from '../../ProjektiList'

export const revalidate = 3600

function pageNum(n) {
  const num = parseInt(Array.isArray(n) ? n[0] : n, 10)
  return Number.isFinite(num) ? num : 1
}

export async function generateMetadata({ params }) {
  const { n } = await params
  const current = pageNum(n)
  const page = await getPage('projekti').catch(() => null)
  const base = page?.meta?.title || page?.title || 'Projekti'
  return {
    title: `${base} — strana ${current}`,
    alternates: { canonical: `/projekti/page/${current}/` },
  }
}

export default async function ProjektiPaged({ params }) {
  const { n } = await params
  const current = pageNum(n)
  if (current < 2) redirect('/projekti')
  return <ProjektiList current={current} />
}
