import Link from 'next/link';
import Image from 'next/image';
import { getMediaURL } from '@/lib/payload';
import ImageFallback from '@/components/ui/ImageFallback';
import { formatPrice } from '@/lib/utils';
import { categoryPath } from '@/lib/routes';

export default function ProductCard({ product, priority = false }) {
  const gallery = product.gallery ?? [];
  const imgUrl = getMediaURL(gallery[0]?.image);
  const href = `/proizvodi/${product.slug}`;
  const price = product.price ?? 0;
  const salePrice = product.salePrice ?? 0;
  const hasSale = salePrice > 0 && salePrice < price;
  const hasPrice = price > 0;

  const category = (product.categories ?? [])
    .map((c) => (typeof c === 'object' ? c : null))
    .filter(Boolean)[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl card card-hover">
      {/* ─── Image ─────────────────────────────────────────────── */}
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className="block relative overflow-hidden aspect-[4/3] bg-gray-50"
      >
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={product.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 ease-spring group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <ImageFallback />
        )}

        {/* Sale badge */}
        {hasSale && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-brand text-white text-[10px] font-extrabold tracking-wide shadow-brand-sm">
              -{Math.round((1 - salePrice / price) * 100)}%
            </span>
          </div>
        )}

        {/* Hover overlay: "Pogledaj" CTA */}
        <div className="absolute inset-0 bg-gray-950/0 group-hover:bg-gray-950/20 transition-colors duration-300 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-white text-gray-950 text-[12px] font-bold shadow-lg translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-spring">
            Pogledaj detalje
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

        {/* Brand accent — bottom line reveals on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-spring"
          aria-hidden="true"
        />
      </Link>

      {/* ─── Content ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category chip */}
        {category && (
          <Link
            href={categoryPath(category)}
            className="self-start mb-2 inline-flex items-center h-5 py-4 px-2 rounded-md bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:bg-brand/[0.08] hover:text-brand transition-colors"
          >
            {category.title}
          </Link>
        )}

        {/* Title */}
        <Link href={href} className="flex-1 min-h-[2.5rem]">
          <h3 className="font-bold text-[15px] text-gray-950 leading-snug line-clamp-2 group-hover:text-brand transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            {hasPrice ? (
              <>
                <span className="font-extrabold text-[17px] text-brand leading-none">
                  {formatPrice(hasSale ? salePrice : price)}
                </span>
                {hasSale && (
                  <span className="text-[12px] text-gray-400 line-through leading-none">
                    {formatPrice(price)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[13px] font-semibold text-gray-400 italic">
                Cena na upit
              </span>
            )}
          </div>

          <Link
            href={href}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-brand hover:text-white transition-all duration-200 flex-shrink-0"
            aria-label={`Pogledaj ${product.title}`}
          >
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
          </Link>
        </div>
      </div>
    </article>
  );
}
