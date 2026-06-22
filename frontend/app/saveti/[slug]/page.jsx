import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAdvicePost,
  getAdvicePosts,
  getAdjacentAdvicePosts,
  getMediaURL,
} from "@/lib/payload";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import RichText from "@/components/ui/RichText";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import AdviceCardClassic from "@/components/advice/AdviceCardClassic";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  const data = await getAdvicePosts({ limit: 24 }).catch(() => null);
  return (data?.docs ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getAdvicePost(slug).catch(() => null);
  if (!post) return {};

  // Strip any pre-baked "| Palisade" suffix so we don't double the brand.
  const cleanTitle = (post.meta?.title || post.title || "").replace(/\s*\|\s*Palisade.*$/i, "").trim() || post.title;
  const title = `${cleanTitle} | ${SITE_NAME}`;
  const description =
    post.meta?.description ||
    post.excerpt ||
    `Saveti Palisada — ${post.title}.`;
  const imgUrl =
    getMediaURL(post.meta?.image) || getMediaURL(post.featuredImage);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/saveti/${slug}/` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/saveti/${slug}/`,
      type: "article",
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  };
}

export default async function AdviceDetailPage({ params }) {
  const { slug } = await params;
  const post = await getAdvicePost(slug);
  if (!post) notFound();

  const imgUrl = getMediaURL(post.featuredImage);
  const { prev, next } = await getAdjacentAdvicePosts(slug).catch(() => ({
    prev: null,
    next: null,
  }));
  const adjacent = [
    prev && { label: "Prethodni savet", post: prev, isPrev: true },
    next && { label: "Sledeći savet", post: next, isPrev: false },
  ].filter(Boolean);

  const breadcrumbs = [
    { label: "Naslovna", href: "/" },
    { label: "Saveti", href: "/saveti" },
    { label: post.title },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || "",
    url: `${SITE_URL}/saveti/${slug}`,
    ...(imgUrl ? { image: imgUrl } : {}),
    ...(post.publishedOn ? { datePublished: post.publishedOn } : {}),
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="relative overflow-hidden bg-[#143f43]">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt=""
            fill
            priority
            className="object-cover opacity-25"
            sizes="100vw"
          />
        )}
        <div
          className="absolute inset-0 bg-[linear-gradient(143deg,rgba(30,138,138,0.48)_0%,rgba(20,63,67,0.98)_52%,rgba(30,138,138,0.68)_100%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 container-site py-16 md:py-24">
          <Breadcrumbs items={breadcrumbs} variant="dark" className="mb-7" />
          <p className="mb-4 text-sm font-semibold text-brand-100">
            Palisada kapije i ograde
          </p>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {post.excerpt}
            </p>
          )}
          {post.publishedOn && (
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/55">
              {formatDate(post.publishedOn)}
            </p>
          )}
        </div>
      </section>

      {imgUrl && (
        <div className="container-site relative z-10 -mt-10 md:-mt-16">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-card ring-1 ring-black/5">
              <Image
                src={imgUrl}
                alt={post.featuredImage?.alt || post.title}
                width={post.featuredImage?.width || 1536}
                height={post.featuredImage?.height || 1024}
                priority
                className="h-auto w-full"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </div>
          </ScrollReveal>
        </div>
      )}

      {post.content?.root?.children?.length > 0 && (
        <section className="section-y-sm">
          <div className="container-narrow">
            <ScrollReveal>
              <RichText
                content={post.content}
                className="[&_a]:font-semibold [&_a]:text-brand [&_a]:underline-offset-4 [&_a:hover]:underline [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-gray-950 [&_h2]:md:text-3xl [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-950 [&_li]:gap-2 [&_li]:text-gray-600 [&_p]:mb-5 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-gray-600 [&_ul]:space-y-2"
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {post.layout?.length > 0 && <BlockRenderer blocks={post.layout} />}

      {adjacent.length > 0 && (
        <section
          className="section-y-sm border-t border-gray-100 bg-gray-50"
          aria-labelledby="related-advice"
        >
          <div className="container-site">
            <ScrollReveal className="mb-8 flex items-end justify-between">
              <h2
                id="related-advice"
                className="text-2xl font-extrabold tracking-tight text-gray-950"
              >
                Još saveta
              </h2>
              <Link
                href="/saveti"
                className="text-sm font-semibold text-brand transition-colors hover:text-brand-700"
              >
                Svi saveti →
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {adjacent.map(({ label, post: item, isPrev }, i) => (
                <ScrollReveal key={item.id} delay={i * 80}>
                  <p
                    className={`mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${isPrev ? "" : "sm:justify-end"}`}
                  >
                    {isPrev && <span aria-hidden="true">←</span>}
                    {label}
                    {!isPrev && <span aria-hidden="true">→</span>}
                  </p>
                  <AdviceCardClassic post={item} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-gray-100 bg-white">
        <div className="container-site py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="text-xl font-extrabold text-gray-950">
                Potrebna vam je preporuka za kapiju ili ogradu?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Pošaljite nam dimenzije i fotografiju prostora, pa ćemo
                predložiti najbolje rešenje.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="inline-flex h-12 flex-shrink-0 items-center gap-2 rounded-xl bg-brand px-8 text-sm font-bold text-white shadow-brand-sm transition-colors hover:bg-brand-600"
            >
              Zatražite ponudu
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
