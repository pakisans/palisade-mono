import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'

import type { Media, Post, PostCategory } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest posts and updates.',
}

export default async function BlogIndexPage() {
  const payload = await getPayload({ config: configPromise })

  const [postsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      draft: false,
      limit: 24,
      overrideAccess: false,
      sort: '-publishedOn',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'post-categories',
      depth: 0,
      draft: false,
      limit: 50,
      overrideAccess: false,
      sort: 'title',
    }),
  ])

  const posts = postsResult.docs
  const categories = categoriesResult.docs

  return (
    <div className="container py-12">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary/60">Blog</p>
          <h1 className="text-4xl font-semibold tracking-tight">Novosti, saveti i priče</h1>
          <p className="mt-3 text-muted-foreground">
            WordPress-style pregled objava, sa kategorijama i čistim editorial tokom rada.
          </p>
        </div>
        {categories.length ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                className="rounded-full border px-4 py-2 text-sm transition hover:bg-accent"
                href={`/blog/category/${category.slug}`}
                key={category.id}
              >
                {category.title}
              </Link>
            ))}
          </div>
        ) : null}
      </div>

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>Nema objavljenih postova.</p>
      )}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const image = typeof post.featuredImage === 'object' ? (post.featuredImage as Media) : null
  const categories =
    post.categories?.filter((category): category is PostCategory => typeof category === 'object') || []

  return (
    <article className="overflow-hidden rounded-2xl border bg-card">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-[16/10] bg-muted">
          {image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={image.alt || post.title} className="h-full w-full object-cover" src={image.url} />
          ) : null}
        </div>
      </Link>
      <div className="space-y-4 p-6">
        {categories.length ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                className="text-xs uppercase tracking-[0.2em] text-primary/60"
                href={`/blog/category/${category.slug}`}
                key={category.id}
              >
                {category.title}
              </Link>
            ))}
          </div>
        ) : null}
        <div>
          <h2 className="text-2xl font-semibold">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          {post.excerpt ? <p className="mt-3 text-muted-foreground">{post.excerpt}</p> : null}
        </div>
      </div>
    </article>
  )
}
