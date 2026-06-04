import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RichText } from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
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
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = await queryPostBySlug(slug)

  if (!post) {
    return notFound()
  }

  return generateMeta({ doc: post })
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params
  const post = await queryPostBySlug(slug)

  if (!post) {
    return notFound()
  }

  const featuredImage =
    typeof post.featuredImage === 'object' ? (post.featuredImage as Media) : undefined
  const categories =
    post.categories?.filter((category): category is PostCategory => typeof category === 'object') || []
  const relatedPosts =
    post.relatedPosts?.filter((relatedPost): relatedPost is Post => typeof relatedPost === 'object') || []

  return (
    <article className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Link className="mb-6 inline-flex text-sm text-primary/70 hover:text-primary" href="/blog">
          Nazad na blog
        </Link>

        {categories.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
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

        <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p> : null}

        {featuredImage?.url ? (
          <div className="mt-8 overflow-hidden rounded-3xl border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={featuredImage.alt || post.title}
              className="h-full w-full object-cover"
              src={featuredImage.url}
            />
          </div>
        ) : null}

        <div className="mt-10">
          <RichText data={post.content} />
        </div>
      </div>

      {post.layout?.length ? (
        <div className="mt-12">
          <RenderBlocks blocks={post.layout} />
        </div>
      ) : null}

      {relatedPosts.length ? (
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-6 text-2xl font-semibold">Povezani postovi</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                className="rounded-2xl border p-5 transition hover:bg-accent"
                href={`/blog/${relatedPost.slug}`}
                key={relatedPost.id}
              >
                <h3 className="text-xl font-medium">{relatedPost.title}</h3>
                {relatedPost.excerpt ? (
                  <p className="mt-2 text-muted-foreground">{relatedPost.excerpt}</p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  )
}

const queryPostBySlug = async (slug: string) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
        ...(draft ? [] : [{ _status: { equals: 'published' } }]),
      ],
    },
  })

  return result.docs[0] || null
}
