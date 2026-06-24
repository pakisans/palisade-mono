import { getAdvicePosts, getPage } from "@/lib/payload";
import { SITE_URL } from "@/lib/constants";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import AdviceCardClassic from "@/components/advice/AdviceCardClassic";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Pagination from "@/components/ui/Pagination";

export const PAGE_SIZE = 9;
const CLOSING_BLOCKS = new Set(["faq", "cta", "spacer"]);

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

// Deljeni listing — koristi ga i /saveti (current=1) i /saveti/page/[n].
export default async function SavetiList({ current = 1 }) {
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

      <BlockRenderer blocks={beforeBlocks} />

      <section
        className="bg-white pt-10 pb-16 md:pt-14 md:pb-20"
        aria-labelledby="advice-heading"
      >
        <div className="container-site">
          <ScrollReveal className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            {/* <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
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
            </div> */}
            <h1
              id="advice-heading"
              className="text-3xl font-extrabold tracking-tight text-gray-950 md:text-5xl"
            >
              <span className="">
                Novosti i saveti iz sveta kapija i ograda
              </span>
              {/* <span>- saveti i novosti</span> */}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
              Stručni vodiči, praktični saveti i novosti iz sveta kapija i
              ograda — kako da izaberete materijal, vrstu ograde i kapije,
              automatizaciju i opremu, RAL boje, i kako da održavate sve to da
              traje godinama.
            </p>
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
              <Pagination
                basePath="/saveti"
                current={current}
                total={totalPages}
              />
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
