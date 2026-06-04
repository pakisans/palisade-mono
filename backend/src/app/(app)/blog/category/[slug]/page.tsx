import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Media, Post, PostCategory } from '@/payload-types'

type Args = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await payload.find({
    collection: 'post-categories',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return categories.docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const category = await queryCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  return {
    title: category.seo?.title || category.title,
    description: category.seo?.description || category.description || '',
  }
}

export default async function BlogCategoryPage({ params }: Args) {
  const { slug } = await params
  const category = await queryCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  const payload = await getPayload({ config: configPromise })
  const postsResult = await payload.find({
    collection: 'posts',
    depth: 1,
    draft: false,
    limit: 24,
    overrideAccess: false,
    sort: '-publishedOn',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          categories: {
            in: [category.id],
          },
        },
      ],
    },
  })

  const posts = postsResult.docs
  const image = typeof category.image === 'object' ? (category.image as Media) : undefined

  return (
    <div className="container py-12">
      <Link className="mb-6 inline-flex text-sm text-primary/70 hover:text-primary" href="/blog">
        Nazad na blog
      </Link>

      <div className="mb-10 grid gap-6 rounded-3xl border p-8 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-primary/60">Blog kategorija</p>
          <h1 className="text-4xl font-semibold tracking-tight">{category.title}</h1>
          {category.description ? <p className="mt-4 text-muted-foreground">{category.description}</p> : null}
        </div>
        {image?.url ? (
          <div className="overflow-hidden rounded-2xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={image.alt || category.title} className="h-full w-full object-cover" src={image.url} />
          </div>
        ) : null}
      </div>

      {category.content?.length ? (
        <div className="mb-12">
          <RenderBlocks blocks={category.content} />
        </div>
      ) : null}

      {posts.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <CategoryPostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p>Nema objava u ovoj kategoriji.</p>
      )}
    </div>
  )
}

function CategoryPostCard({ post }: { post: Post }) {
  const image = typeof post.featuredImage === 'object' ? (post.featuredImage as Media) : undefined

  return (
    <Link className="overflow-hidden rounded-2xl border bg-card" href={`/blog/${post.slug}`}>
      <div className="aspect-[16/10] bg-muted">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={image.alt || post.title} className="h-full w-full object-cover" src={image.url} />
        ) : null}
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold">{post.title}</h2>
        {post.excerpt ? <p className="mt-3 text-muted-foreground">{post.excerpt}</p> : null}
      </div>
    </Link>
  )
}

const queryCategoryBySlug = async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'post-categories',
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: false,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return (result.docs[0] as PostCategory | undefined) || null
}
