import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

// On-demand ISR revalidacija.
// Poziva je backend (Payload afterChange/afterDelete hookovi → revalidateFrontend)
// preko interne Docker mreže: POST http://app2:3000/api/revalidate
//   header: x-revalidate-secret: <REVALIDATE_SECRET>
//   body:   { paths?: string[], tags?: string[] }
export const dynamic = 'force-dynamic'

export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET
  if (secret) {
    const provided = request.headers.get('x-revalidate-secret')
    if (provided !== secret) {
      return NextResponse.json(
        { revalidated: false, error: 'Invalid secret' },
        { status: 401 },
      )
    }
  }

  let body = {}
  try {
    body = await request.json()
  } catch {
    body = {}
  }

  const tags = Array.isArray(body?.tags) ? body.tags.filter(Boolean) : []
  const paths = Array.isArray(body?.paths) ? body.paths.filter(Boolean) : []
  // layoutPaths → revalidira ceo podstablo (sve stranice pod tom putanjom)
  const layoutPaths = Array.isArray(body?.layoutPaths)
    ? body.layoutPaths.filter(Boolean)
    : []

  for (const tag of tags) revalidateTag(tag)
  for (const path of paths) revalidatePath(path)
  for (const path of layoutPaths) revalidatePath(path, 'layout')

  return NextResponse.json({
    revalidated: true,
    tags,
    paths,
    layoutPaths,
    now: Date.now(),
  })
}
