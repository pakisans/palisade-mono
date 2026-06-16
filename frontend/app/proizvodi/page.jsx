import Link from "next/link";
import { getProducts, getCategories } from "@/lib/payload";
import { SITE_NAME } from "@/lib/constants";
import ProductGrid from "@/components/products/ProductGrid";
import Pagination from "@/components/ui/Pagination";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CategoryNavigator from "@/components/navigation/CategoryNavigator";

export const revalidate = 1800;

const PER_PAGE = 12;

export const metadata = {
  title: `Katalog kapija i ograda | ${SITE_NAME}`,
  description:
    "Kompletna ponuda: jednokrilne, dvokrilne, klizne i samonosive kapije, panelne i dekorativne ograde, automatizacija i kontrola pristupa. Sve dimenzije i RAL boje.",
  alternates: { canonical: "/proizvodi" },
};

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({ defaultValue }) {
  return (
    <form method="GET" action="/proizvodi" className="relative" role="search">
      <label htmlFor="pretraga" className="sr-only">
        Pretraži proizvode
      </label>
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        fill="none"
        viewBox="0 0 20 20"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 4a6 6 0 100 12A6 6 0 008 4zM18 18l-4-4"
        />
      </svg>
      <input
        id="pretraga"
        name="pretraga"
        type="search"
        defaultValue={defaultValue || ""}
        placeholder="Pretraži kapije i ograde..."
        className="w-full h-12 pl-11 pr-32 rounded-2xl border border-gray-200 bg-white text-sm text-gray-950 placeholder:text-gray-400 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-primary"
      >
        Pretraži
      </button>
    </form>
  );
}

// ─── Results header ───────────────────────────────────────────────────────────

function ResultsHeader({
  total,
  page,
  totalPages,
  search,
  activeSlug,
  categories,
}) {
  const category = (categories?.docs ?? []).find((c) => c.slug === activeSlug);

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Active filter badge */}
        {(activeSlug || search) && (
          <div className="flex items-center gap-2 flex-wrap">
            {category && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-brand/[0.08] border border-brand/20 text-brand text-[12px] font-semibold">
                {category.title}
                <Link
                  href="/proizvodi"
                  className="hover:text-brand-700"
                  aria-label="Ukloni filter kategorije"
                >
                  ×
                </Link>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-gray-100 border border-gray-200 text-gray-700 text-[12px] font-semibold">
                "{search}"
                <Link
                  href={activeSlug ? `/kategorija/${activeSlug}` : "/proizvodi"}
                  className="text-gray-400 hover:text-gray-700"
                  aria-label="Ukloni pretragu"
                >
                  ×
                </Link>
              </span>
            )}
          </div>
        )}
        <p className="text-sm text-gray-400">
          {total > 0 ? (
            <>
              <span className="font-semibold text-gray-950">{total}</span>{" "}
              {total === 1 ? "proizvod" : total < 5 ? "proizvoda" : "proizvoda"}
              {totalPages > 1 ? ` · strana ${page}/${totalPages}` : ""}
            </>
          ) : (
            "Nema pronađenih proizvoda"
          )}
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ search }) {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
        <svg
          className="w-8 h-8 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-950 mb-2">
        {search ? `Nema rezultata za "${search}"` : "Nema pronađenih proizvoda"}
      </h3>
      <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
        Pokušajte s drugom pretragom ili pogledajte sve kategorije.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href="/proizvodi"
          className="btn btn-primary"
        >
          Sve kategorije
        </Link>
        <Link
          href="/kontakt"
          className="inline-flex items-center h-10 px-5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Kontaktirajte nas
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductsPage({ searchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp?.stranica || "1"));
  const activeSlug = sp?.kategorija || null;
  const search = sp?.pretraga || null;

  const [productsData, categoriesData] = await Promise.all([
    getProducts({ page, limit: PER_PAGE, category: activeSlug, search }),
    getCategories(),
  ]);

  const totalPages = productsData?.totalPages ?? 1;
  const totalDocs = productsData?.totalDocs ?? 0;
  const docs = productsData?.docs ?? [];
  const basePath = "/proizvodi";

  return (
    <>
      {/* ─── Page header ─────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-site py-10 md:py-14">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-px bg-brand" aria-hidden="true" />
              <span className="text-brand text-[11px] font-bold uppercase tracking-[0.18em]">
                Katalog
              </span>
            </div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-950 tracking-tight leading-none">
                  Kapije i ograde
                </h1>
                <p className="text-gray-500 mt-2.5 text-base">
                  Kompletan katalog — po meri, u svim RAL bojama.
                </p>
              </div>
            </div>
            <SearchBar defaultValue={search} />
          </ScrollReveal>
        </div>
      </div>

      <CategoryNavigator categories={categoriesData} activeSlug={activeSlug} />

      {/* ─── Results ─────────────────────────────────────────── */}
      <div className="container-site py-8 md:py-12">
        <ResultsHeader
          total={totalDocs}
          page={page}
          totalPages={totalPages}
          search={search}
          activeSlug={activeSlug}
          categories={categoriesData}
        />

        {docs.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          <>
            <ProductGrid products={productsData} priority />
            <Pagination
              basePath={basePath}
              current={page}
              total={totalPages}
              keepParams={{
                ...(activeSlug ? { kategorija: activeSlug } : {}),
                ...(search ? { pretraga: search } : {}),
              }}
            />
          </>
        )}
      </div>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="container-site py-12">
          <ScrollReveal className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-extrabold text-xl text-gray-950">
                Ne nalazite šta tražite?
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Radimo i po individualnoj narudžbini — pišite nam.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="btn btn-primary flex-shrink-0"
            >
              Zatražite ponudu
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
