import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getCategories,
  getProduct,
  getProducts,
  getProductVariants,
  getInquiryForm,
  getMediaURL,
} from "@/lib/payload";
import ProductInquiry from "@/components/products/ProductInquiry";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { categoryPath } from "@/lib/routes";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import RichText from "@/components/ui/RichText";
import ScrollReveal from "@/components/ui/ScrollReveal";
import CategoryNavigator from "@/components/navigation/CategoryNavigator";

export const revalidate = 1800;

// ─── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const data = await getProducts({ limit: 200 }).catch(() => null);
  return (data?.docs ?? []).map((p) => ({ slug: p.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug).catch(() => null);
  if (!product) return {};

  const title = product.meta?.title || `${product.title} | ${SITE_NAME}`;
  const description =
    product.meta?.description ||
    `${product.title} — pregledajte detalje, specifikacije i zatražite ponudu.`;
  const imgUrl =
    getMediaURL(product.meta?.image) ||
    getMediaURL(product.gallery?.[0]?.image);

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/proizvodi/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/proizvodi/${slug}`,
      ...(imgUrl ? { images: [{ url: imgUrl }] } : {}),
    },
  };
}

// ─── Structured data ──────────────────────────────────────────────────────────

function ProductSchema({ product }) {
  const images = (product.gallery ?? [])
    .map((g) => getMediaURL(g?.image))
    .filter(Boolean);

  const brand = typeof product.brand === "object" ? product.brand : null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/proizvodi/${product.slug}`,
    name: product.title,
    description: product.meta?.description || "",
    ...(images.length ? { image: images } : {}),
    ...(brand
      ? { brand: { "@type": "Brand", name: brand.title } }
      : {
          brand: { "@type": "Brand", name: SITE_NAME },
        }),
    offers: {
      "@type": "Offer",
      priceCurrency: "RSD",
      price: product.price > 0 ? String(product.price) : "0",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
    ...(product.categories?.length
      ? {
          category: product.categories
            .map((c) => (typeof c === "object" ? c.title : ""))
            .filter(Boolean)
            .join(" > "),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Price block ───────────────────────────────────────────────────────────────

function PriceBlock({ price, salePrice }) {
  const hasPrice = price > 0;
  const hasSale = salePrice > 0 && salePrice < price;
  const discount = hasSale ? Math.round((1 - salePrice / price) * 100) : 0;

  if (!hasPrice) {
    return (
      <div className="flex items-center gap-3 py-4 border-y border-gray-100">
        <span className="text-xl font-bold text-gray-400">Cena na upit</span>
        <span className="text-sm text-gray-400">
          — kontaktirajte nas za ponudu
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-3 py-4 border-y border-gray-100">
      {hasSale ? (
        <>
          <span className="text-3xl font-extrabold text-brand tracking-tight">
            {formatPrice(salePrice)}
          </span>
          <span className="text-lg font-medium text-gray-400 line-through">
            {formatPrice(price)}
          </span>
          <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-brand/[0.1] text-brand text-[11px] font-bold">
            -{discount}%
          </span>
        </>
      ) : (
        <span className="text-3xl font-extrabold text-brand tracking-tight">
          {formatPrice(price)}
        </span>
      )}
    </div>
  );
}

// ─── CTA Block ─────────────────────────────────────────────────────────────────

function ProductCTA({ title }) {
  const msg = encodeURIComponent(`Zanima me više o proizvodu: ${title}`);
  return (
    <div className="space-y-3 pt-2">
      <Link
        href={`/kontakt?proizvod=${msg}`}
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-600 transition-all duration-200 shadow-brand-sm hover:shadow-brand"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 20 20"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        Zatražite ponudu
      </Link>
      <a
        href="tel:+381112960574"
        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
      >
        <svg
          className="w-4 h-4 text-brand"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
        Pozovite nas
      </a>
    </div>
  );
}

// ─── Highlights ────────────────────────────────────────────────────────────────

function Highlights({ highlights }) {
  if (!highlights?.length) return null;
  return (
    <ul className="space-y-2" aria-label="Ključne karakteristike">
      {highlights.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
          <svg
            className="w-4 h-4 text-brand flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">{item.label}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Specifications ────────────────────────────────────────────────────────────

function Specifications({ specifications }) {
  if (!specifications?.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <table className="w-full text-sm" aria-label="Specifikacije">
        <tbody>
          {specifications.map((spec, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-4 py-3 font-semibold text-gray-700 w-2/5 border-r border-gray-100">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-gray-600">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tabs (Description / Specs) ────────────────────────────────────────────────

function ProductTabs({ description, specifications }) {
  const hasDes = description?.root?.children?.length > 0;
  const hasSpec = specifications?.length > 0;
  if (!hasDes && !hasSpec) return null;

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {hasDes && (
          <div>
            <h2 className="text-xl font-extrabold text-gray-950 mb-5">
              Opis proizvoda
            </h2>
            <RichText
              content={description}
              className="[&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-gray-950 [&_h3]:text-base [&_h3]:font-bold [&_ul]:list-none [&_li]:flex [&_li]:gap-2 [&_li]:text-gray-600 [&_li]:mb-1"
            />
          </div>
        )}
        {hasSpec && (
          <div>
            <h2 className="text-xl font-extrabold text-gray-950 mb-5">
              Specifikacije
            </h2>
            <Specifications specifications={specifications} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Related products ──────────────────────────────────────────────────────────

function RelatedProducts({ products }) {
  if (!products?.length) return null;
  const docs = products.filter((p) => typeof p === "object" && p.slug);
  if (!docs.length) return null;

  return (
    <section
      className="mt-16 pt-10 border-t border-gray-100"
      aria-labelledby="related-heading"
    >
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8">
          <h2
            id="related-heading"
            className="text-2xl font-extrabold text-gray-950 tracking-tight"
          >
            Srodni proizvodi
          </h2>
          <Link
            href="/proizvodi"
            className="text-sm font-semibold text-brand hover:text-brand-700 transition-colors"
          >
            Svi proizvodi →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {docs.slice(0, 4).map((product, i) => (
            <ScrollReveal key={product.id || i} delay={i * 60}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const [product, categoriesData] = await Promise.all([
    getProduct(slug),
    getCategories(),
  ]);

  if (!product) notFound();

  // Variable products: load variants + the inquiry form (shown after selection).
  const [variants, inquiryForm] = await Promise.all([
    product.enableVariants ? getProductVariants(product.id).catch(() => []) : Promise.resolve([]),
    getInquiryForm().catch(() => null),
  ]);

  // Resolve categories for breadcrumbs
  const categories = (product.categories ?? [])
    .map((c) => (typeof c === "object" ? c : null))
    .filter(Boolean);

  const primaryCat = categories[0];
  const parentCat =
    typeof primaryCat?.parent === "object" ? primaryCat.parent : null;

  const breadcrumbs = [
    { label: "Naslovna", href: "/" },
    { label: "Proizvodi", href: "/proizvodi" },
    ...(parentCat
      ? [{ label: parentCat.title, href: categoryPath(parentCat) }]
      : []),
    ...(primaryCat
      ? [{ label: primaryCat.title, href: categoryPath(primaryCat) }]
      : []),
    { label: product.title },
  ];

  const brand = typeof product.brand === "object" ? product.brand : null;
  const relatedProducts = (product.relatedProducts ?? []).filter(
    (p) => typeof p === "object",
  );

  return (
    <>
      <ProductSchema product={product} />

      <div className="container-site py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-8" />
        <div className="mb-8 -mx-4 sm:mx-0">
          <CategoryNavigator
            categories={categoriesData}
            activeSlug={primaryCat?.slug}
            title="Još kategorija"
            sticky={false}
            compact
            contained={false}
          />
        </div>

        {/* Main product layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-28">
            <ProductGallery
              gallery={product.gallery ?? []}
              title={product.title}
            />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category + Brand */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={categoryPath(cat)}
                  className="inline-flex items-center h-7 px-3 rounded-lg bg-brand/[0.08] text-brand text-[11px] font-bold uppercase tracking-wider hover:bg-brand/15 transition-colors"
                >
                  {cat.title}
                </Link>
              ))}
              {brand && (
                <span className="inline-flex items-center h-7 px-3 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider">
                  {brand.title}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Highlights */}
            {product.highlights?.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Ključne karakteristike
                </p>
                <Highlights highlights={product.highlights} />
              </div>
            )}

            {/* Variants + price + inquiry form (form shows only after a variation is selected) */}
            <ProductInquiry product={product} variants={variants} form={inquiryForm} />

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: "📐", text: "Izrada po meri" },
                { icon: "🔧", text: "Ugradnja u Srbiji" },
                { icon: "✅", text: "Garancija na rad" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <span className="text-lg mb-1" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-gray-600 leading-tight">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {product.tags.map((tag, i) => {
                  const t = typeof tag === "object" ? tag : null;
                  if (!t) return null;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center h-6 px-2.5 rounded-full border border-gray-200 text-[11px] text-gray-500 font-medium"
                    >
                      {t.title}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Description + Specs */}
        <ProductTabs
          description={product.description}
          specifications={product.specifications}
        />

        {/* Related products */}
        <RelatedProducts products={relatedProducts} />
      </div>

      {/* CTA strip */}
      <div className="bg-gray-50 border-t border-gray-100 mt-16">
        <div className="container-site py-12">
          <ScrollReveal className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-extrabold text-2xl text-gray-950 tracking-tight">
                Zainteresovani ste?
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Pošaljite nam upit i odgovaramo u roku od 24h.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="flex-shrink-0 inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-600 transition-colors shadow-brand-sm hover:shadow-brand"
            >
              Zatražite ponudu
              <svg
                className="w-4 h-4"
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
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
