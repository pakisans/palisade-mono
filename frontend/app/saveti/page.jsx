import Link from "next/link";
import { getAdvicePosts, getPage, getMediaURL } from "@/lib/payload";
import { SITE_URL } from "@/lib/constants";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import AdviceCardClassic from "@/components/advice/AdviceCardClassic";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const revalidate = 3600;

const PAGE_SIZE = 9;
const CLOSING_BLOCKS = new Set(["faq", "cta", "spacer"]);

export async function generateMetadata() {
  const page = await getPage("saveti").catch(() => null);
  const title =
    page?.meta?.title ||
    "Saveti - Kapije i ograde po meri Beograd | Palisada d.o.o.";
  const description =
    page?.meta?.description ||
    "Saveti Palisada kapije i ograde: korisni tekstovi o izboru materijala, automatizaciji, RAL bojama i održavanju ograda i kapija.";
  const imgUrl = getMediaURL(page?.meta?.image);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/saveti" },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/saveti`,
      type: "website",
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  };
}

function AdviceSchema({ posts }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Saveti",
    url: `${SITE_URL}/saveti`,
    hasPart: (posts ?? []).map((post) => ({
      "@type": "Article",
      headline: post.title,
      url: `${SITE_URL}/saveti/${post.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function SavetiPage({ searchParams }) {
  const sp = await searchParams;
  const current = Math.max(1, parseInt(sp?.page ?? "1", 10) || 1);

  const [page, postsRes] = await Promise.all([
    getPage("saveti").catch(() => null),
    getAdvicePosts({ page: current, limit: PAGE_SIZE }).catch(() => null),
  ]);

  const posts = postsRes?.docs ?? [];
  const total = postsRes?.totalDocs ?? 0;
  const totalPages =
    postsRes?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));

  const layout = Array.isArray(page?.layout) ? page.layout : [];
  let injectIdx = layout.findIndex((b) => CLOSING_BLOCKS.has(b?.blockType));
  if (injectIdx === -1) injectIdx = layout.length;
  const beforeBlocks = layout
    .slice(0, injectIdx)
    .filter((b) => b?.blockType !== "mediaBlock");
  const afterBlocks = layout
    .slice(injectIdx)
    .filter((b) => b?.blockType !== "mediaBlock");

  return (
    <>
      <AdviceSchema posts={posts} />

      <section className="relative overflow-hidden bg-[#143f43]">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_28%),linear-gradient(143deg,rgba(30,138,138,0.42)_0%,rgba(20,63,67,0.98)_52%,rgba(30,138,138,0.58)_100%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 container-site py-20 md:py-28">
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white md:text-6xl">
            Saveti
          </h1>
        </div>
      </section>

      <BlockRenderer blocks={beforeBlocks} />

      <section className="section-y bg-white" aria-labelledby="advice-heading">
        <div className="container-site">
          <ScrollReveal className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand/10"
                aria-hidden="true"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M50.7 58.5 0 160h208V32H93.7C75.5 32 58.9 42.3 50.7 58.5ZM240 160h208L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240v128Zm208 32H0v224c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V192Z" />
                </svg>
              </span>
              Palisada kapije i ograde
            </div>
            <h2
              id="advice-heading"
              className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-5xl"
            >
              <span className="text-brand">Ograde i kapije </span>
              <span>- saveti i novosti</span>
            </h2>
          </ScrollReveal>

          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
                {posts.map((post, i) => (
                  <ScrollReveal
                    key={post.id}
                    delay={Math.min(i % 3, 2) * 80}
                    className="h-full"
                  >
                    <AdviceCardClassic post={post} priority={i < 3} />
                  </ScrollReveal>
                ))}
              </div>
              <Pagination current={current} totalPages={totalPages} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-sm font-semibold text-gray-600">
                Saveti trenutno nisu dostupni.
              </p>
            </div>
          )}
        </div>
      </section>

      <BlockRenderer blocks={afterBlocks} />
    </>
  );
}

function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

function Pagination({ current, totalPages }) {
  if (totalPages <= 1) return null;
  const href = (p) => (p === 1 ? "/saveti" : `/saveti?page=${p}`);
  const items = pageWindow(current, totalPages);

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-2"
      aria-label="Stranice"
    >
      <PageLink href={href(current - 1)} disabled={current <= 1}>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 8H3M7 12 3 8l4-4"
          />
        </svg>
      </PageLink>

      {items.map((it, i) =>
        it === "…" ? (
          <span
            key={`e${i}`}
            className="px-2 text-sm text-gray-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <Link
            key={it}
            href={href(it)}
            aria-current={it === current ? "page" : undefined}
            className={
              it === current
                ? "inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-brand px-3 text-sm font-bold text-white"
                : "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand"
            }
          >
            {it}
          </Link>
        ),
      )}

      <PageLink href={href(current + 1)} disabled={current >= totalPages}>
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 16 16"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8h10M9 4l4 4-4 4"
          />
        </svg>
      </PageLink>
    </nav>
  );
}

function PageLink({ href, disabled, children }) {
  if (disabled) {
    return (
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 text-gray-300"
        aria-disabled="true"
      >
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition-colors hover:border-brand hover:text-brand"
    >
      {children}
    </Link>
  );
}
