import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  getCategory,
  getCategories,
  getProducts,
  getMediaURL,
} from "@/lib/payload";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { CATEGORY_BASE, categoryPath } from "@/lib/routes";
import ProductGrid from "@/components/products/ProductGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CategoryNavigator from "@/components/navigation/CategoryNavigator";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 3600;

const PER_PAGE = 12;

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const data = await getCategories().catch(() => null);
  const docs = data?.docs ?? [];
  const byId = Object.fromEntries(docs.map((c) => [c.id, c]));
  return docs.map((c) => {
    const parentSlug =
      typeof c.parent === "object" ? c.parent?.slug : byId[c.parent]?.slug;
    return { slug: parentSlug ? [parentSlug, c.slug] : [c.slug] };
  });
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug: segs } = await params;
  const slug = Array.isArray(segs) ? segs[segs.length - 1] : segs;
  const category = await getCategory(slug).catch(() => null);
  if (!category) return {};
  const title = category.meta?.title || `${category.title} | ${SITE_NAME}`;
  const description =
    category.meta?.description ||
    category.description ||
    `Pogledajte sve ${category.title.toLowerCase()} — Palisade d.o.o.`;
  const imgUrl = getMediaURL(category.image);
  const canonical = categoryPath(category);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  };
}

// ─── Structured data ──────────────────────────────────────────────────────────

function CategorySchema({ category, products }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description || "",
    url: `${SITE_URL}${categoryPath(category)}`,
    ...(getMediaURL(category.image)
      ? { image: getMediaURL(category.image) }
      : {}),
    hasPart: (products?.docs ?? []).map((p) => ({
      "@type": "Product",
      name: p.title,
      url: `${SITE_URL}/proizvodi/${p.slug}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Hero (shared) ────────────────────────────────────────────────────────────

const HERO_TRUST = ["Izrada po meri", "Profesionalna montaža", "Garancija na rad"];

function CategoryHero({ category, breadcrumbs, parent }) {
  const imgUrl = getMediaURL(category.image);

  return (
    <section className="relative bg-white overflow-hidden border-b border-gray-100">
      {/* Soft brand wash + dot grid backdrop */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-brand/[0.04] to-white"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(143,198,64,0.12) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      <div className="container-site py-14 md:py-20">
        <Breadcrumbs items={breadcrumbs} className="mb-8" />
        <div
          className={imgUrl ? "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center" : ""}
        >
          <div className="max-w-2xl">
            {parent && (
              <Link
                href={categoryPath(parent)}
                className="inline-flex items-center gap-2 text-brand text-[11px] font-bold uppercase tracking-[0.18em] mb-4 hover:opacity-80 transition-opacity"
              >
                <span className="w-5 h-px bg-brand" aria-hidden="true" />
                {parent.title}
              </Link>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.05]">
              {category.title}
            </h1>
            {category.description && (
              <p className="mt-4 text-base md:text-lg text-gray-500 leading-relaxed max-w-xl">
                {category.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2.5">
              {HERO_TRUST.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600"
                >
                  <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-brand/15">
                    <svg
                      className="h-2.5 w-2.5 text-brand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {imgUrl && (
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card-hover bg-gray-100">
              <Image
                src={imgUrl}
                alt={category.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-0 left-0 w-12 h-12" aria-hidden="true">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
                <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Subcategory showcase (for PARENT categories) ─────────────────────────────

function SubcategoryShowcase({ subcategories, parentSlug }) {
  if (!subcategories?.length) return null;

  return (
    <section
      className="section-y-sm bg-white"
      aria-labelledby="subcategories-heading"
    >
      <div className="container-site">
        <ScrollReveal className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-6 h-px bg-brand" aria-hidden="true" />
            <span className="text-brand text-[11px] font-bold uppercase tracking-[0.18em]">
              Podkategorije
            </span>
          </div>
          <h2
            id="subcategories-heading"
            className="text-2xl md:text-3xl font-extrabold text-gray-950 tracking-tight mt-2"
          >
            Izaberite tip
          </h2>
        </ScrollReveal>

        <div
          className={`grid gap-5 ${subcategories.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : subcategories.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}
        >
          {subcategories.map((sub, i) => {
            const imgUrl = getMediaURL(sub.image);
            return (
              <ScrollReveal key={sub.id} delay={i * 70}>
                <Link
                  href={`${CATEGORY_BASE}/${parentSlug}/${sub.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white hover:border-brand/30 hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 ease-spring hover:-translate-y-0.5"
                  aria-label={`Kategorija: ${sub.title}`}
                >
                  {/* Image */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-gray-50">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={sub.title}
                        fill
                        className="object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-4xl font-extrabold text-gray-200">
                          {sub.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    {/* Bottom brand line */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-spring"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[16px] text-gray-950 leading-snug group-hover:text-brand transition-colors duration-200">
                        {sub.title}
                      </h3>
                      {sub.description && (
                        <p className="text-[13px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                          {sub.description}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-all duration-200">
                      <svg
                        className="w-3.5 h-3.5"
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
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Sibling nav (for CHILD categories) ───────────────────────────────────────

function SiblingNav({ siblings, currentSlug, parentSlug }) {
  if (!siblings?.length) return null;
  return (
    <div className="sticky top-[var(--header-height)] z-20 bg-white border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.06)]">
      <div className="container-site">
        <nav
          aria-label="Podkategorije"
          className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 -mx-1 px-1"
        >
          {parentSlug && (
            <Link
              href={`${CATEGORY_BASE}/${parentSlug}`}
              className="flex-shrink-0 inline-flex items-center h-8 px-3 rounded-full text-[12px] font-semibold border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-950 transition-colors"
            >
              ← Sve
            </Link>
          )}
          {siblings.map((sib) => {
            const isActive = sib.slug === currentSlug;
            return (
              <Link
                key={sib.id}
                href={`${CATEGORY_BASE}/${parentSlug}/${sib.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex-shrink-0 inline-flex items-center h-8 px-3.5 rounded-full text-[12px] font-semibold border transition-all duration-150 whitespace-nowrap ${
                  isActive
                    ? "bg-brand text-white border-brand shadow-brand-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-brand/40 hover:text-brand"
                }`}
              >
                {sib.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

// ─── Products section ─────────────────────────────────────────────────────────

function ProductsSection({ products, category, page, totalPages }) {
  const totalDocs = products?.totalDocs ?? 0;

  return (
    <section className="section-y-sm" aria-labelledby="products-heading">
      <div className="container-site">
        <ScrollReveal className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2
              id="products-heading"
              className="text-2xl font-extrabold text-gray-950 tracking-tight"
            >
              Proizvodi
            </h2>
            {totalDocs > 0 && (
              <p className="text-sm text-gray-400 mt-1">
                {totalDocs}{" "}
                {totalDocs === 1
                  ? "proizvod"
                  : totalDocs < 5
                    ? "proizvoda"
                    : "proizvoda"}{" "}
                u ovoj kategoriji
              </p>
            )}
          </div>
          <Link
            href="/proizvodi"
            className="text-sm font-semibold text-brand hover:text-brand-700 transition-colors"
          >
            Svi proizvodi →
          </Link>
        </ScrollReveal>

        {totalDocs === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-950 mb-2">
              Nema dostupnih proizvoda
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Kontaktirajte nas — radimo po individualnoj narudžbini.
            </p>
            <Link
              href="/kontakt"
              className="btn btn-primary"
            >
              Zatražite ponudu
            </Link>
          </div>
        ) : (
          <>
            <ProductGrid products={products} priority />
            <Pagination
              basePath={categoryPath(category)}
              current={page}
              total={totalPages}
            />
          </>
        )}
      </div>
    </section>
  );
}

// ─── CTA strip ────────────────────────────────────────────────────────────────

function CategoryCTA({ categoryTitle }) {
  return (
    <div className="bg-gray-50 border-t border-gray-100">
      <div className="container-site py-12">
        <ScrollReveal className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-extrabold text-xl text-gray-950">
              Ne nalazite pravu opciju?
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Pravimo {categoryTitle.toLowerCase()} po vašim tačnim merama i
              zahtevima.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/kontakt" className="btn btn-primary">
              Zatražite ponudu
            </Link>
            <Link href="/proizvodi" className="btn btn-outline">
              Svi proizvodi
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params, searchParams }) {
  const { slug: segs } = await params;
  const segments = Array.isArray(segs) ? segs : [segs];
  const slug = segments[segments.length - 1];
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.stranica || "1"));

  const [category, allCategories, productsData] = await Promise.all([
    getCategory(slug),
    getCategories(),
    getProducts({ category: slug, page, limit: PER_PAGE }),
  ]);

  if (!category) notFound();

  // Canonical (nested, singular) — redirect any non-canonical path (e.g. flat child
  // /kategorija/<child>) so we serve exactly the palisada.rs URL. Skip when paginating.
  const canonical = categoryPath(category);
  if (!sp?.stranica && `${CATEGORY_BASE}/${segments.join("/")}` !== canonical) {
    permanentRedirect(canonical);
  }

  const allDocs = allCategories?.docs ?? [];

  // Resolve parent
  const parent =
    typeof category.parent === "object" && category.parent?.id
      ? allDocs.find((c) => c.id === category.parent.id) || category.parent
      : null;

  const isParent = !parent;

  // Children of THIS category (if parent)
  const children = isParent
    ? allDocs.filter(
        (c) =>
          (typeof c.parent === "object" ? c.parent?.id : null) === category.id,
      )
    : [];

  // Siblings (same parent, if child)
  const siblings = !isParent
    ? allDocs.filter(
        (c) =>
          (typeof c.parent === "object" ? c.parent?.id : null) === parent?.id,
      )
    : [];

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Naslovna", href: "/" },
    { label: "Kategorije", href: "/proizvodi" },
    ...(parent
      ? [{ label: parent.title, href: categoryPath(parent) }]
      : []),
    { label: category.title },
  ];

  return (
    <>
      <CategorySchema category={category} products={productsData} />

      {/* Hero */}
      <CategoryHero
        category={category}
        breadcrumbs={breadcrumbs}
        parent={parent}
      />

      {/* Constant contextual navigation (sticky) — handles sibling/subcategory nav */}
      <CategoryNavigator categories={allCategories} activeSlug={slug} />

      {/* PARENT: visual subcategory showcase + any products */}
      {isParent ? (
        <>
          {children.length > 0 && (
            <SubcategoryShowcase subcategories={children} parentSlug={category.slug} />
          )}
          {(productsData?.totalDocs ?? 0) > 0 && (
            <div
              className={
                children.length > 0 ? "bg-gray-50 border-t border-gray-100" : ""
              }
            >
              <ProductsSection
                products={productsData}
                category={category}
                page={page}
                totalPages={productsData?.totalPages ?? 1}
              />
            </div>
          )}
        </>
      ) : (
        /* CHILD: products (sibling nav handled by CategoryNavigator above) */
        <ProductsSection
          products={productsData}
          category={category}
          page={page}
          totalPages={productsData?.totalPages ?? 1}
        />
      )}

      {/* Landing content scraped from the source site — below products
          (intro / advantages / gallery / FAQ) */}
      {Array.isArray(category.content) && category.content.length > 0 && (
        <BlockRenderer blocks={category.content} />
      )}

      <CategoryCTA categoryTitle={category.title} />
    </>
  );
}
