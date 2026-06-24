import { getPage, getMediaURL } from '@/lib/payload'
import { SITE_URL } from '@/lib/constants'
import { metaTitle } from '@/lib/seo'
import ProjektiList from './ProjektiList'

export const revalidate = 3600

export async function generateMetadata() {
  const page = await getPage('projekti').catch(() => null)
  if (!page) return {}
  const { description, image } = page.meta ?? {}
  const title = await metaTitle(page.meta?.title, page.title)
  const imgUrl = getMediaURL(image)
  return {
    title: { absolute: title },
    description: description || undefined,
    alternates: { canonical: '/projekti/' },
    openGraph: {
      title,
      description: description || undefined,
      url: `${SITE_URL}/projekti/`,
      type: 'website',
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  }
}

export default async function ProjektiPage() {
  return <ProjektiList current={1} />
}
