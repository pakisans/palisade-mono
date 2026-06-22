import { getPage, getMediaURL } from '@/lib/payload'
import { SITE_URL } from '@/lib/constants'
import SavetiList from './SavetiList'

export const revalidate = 3600

export async function generateMetadata() {
  const page = await getPage('saveti').catch(() => null)
  const title = page?.meta?.title || 'Saveti - Kapije i ograde po meri Beograd | Palisada d.o.o.'
  const description =
    page?.meta?.description ||
    'Saveti Palisada kapije i ograde: korisni tekstovi o izboru materijala, automatizaciji, RAL bojama i održavanju ograda i kapija.'
  const imgUrl = getMediaURL(page?.meta?.image)

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/saveti/' },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/saveti/`,
      type: 'website',
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  }
}

export default async function SavetiPage() {
  return <SavetiList current={1} />
}
