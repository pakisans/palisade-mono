import { redirect } from 'next/navigation'
import { ProizvodiList } from '../../page'

export const revalidate = 1800

function pageNum(n) {
  const num = parseInt(Array.isArray(n) ? n[0] : n, 10)
  return Number.isFinite(num) ? num : 1
}

export async function generateMetadata({ params }) {
  const { n } = await params
  const current = pageNum(n)
  return {
    title: `Katalog kapija i ograda — strana ${current}`,
    alternates: { canonical: `/proizvodi/page/${current}/` },
  }
}

export default async function ProductsPaged({ params, searchParams }) {
  const { n } = await params
  const sp = await searchParams
  const current = pageNum(n)
  if (current < 2) redirect('/proizvodi')
  return (
    <ProizvodiList
      current={current}
      activeSlug={sp?.kategorija || null}
      search={sp?.pretraga || null}
    />
  )
}
