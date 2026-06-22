import { NextResponse } from 'next/server'
import { searchContent, getMediaURL } from '@/lib/payload'
import { postPath, postType } from '@/lib/routes'

// Interni endpoint za live pretragu iz headera.
// NAMERNO van `/api/` — na produkciji nginx šalje `/api/*` na Payload backend,
// pa frontend ruta mora biti pod putanjom koju nginx prosleđuje frontendu (`/` → app2).
// Klijent (SearchOverlay) gađa /pretraga/suggest?q= (isti origin → bez CORS-a).
export const dynamic = 'force-dynamic'

export async function GET(request) {
  const q = (request.nextUrl.searchParams.get('q') || '').trim()
  if (q.length < 2) return NextResponse.json({ q, products: [], posts: [] })

  const { products, posts } = await searchContent(q, { limit: 6 })

  return NextResponse.json({
    q,
    products: products.map((p) => ({
      title: p.title,
      href: `/proizvodi/${p.slug}`,
      image: getMediaURL(p.gallery?.[0]?.image),
      price: p.price ?? 0,
      salePrice: p.salePrice ?? 0,
    })),
    posts: posts.map((p) => ({
      title: p.title,
      href: postPath(p),
      image: getMediaURL(p.featuredImage) || getMediaURL(p.meta?.image),
      type: postType(p),
    })),
  })
}
