import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import { localizedMaterial, localizedName, productImage } from '@/lib/products';
import { formatPrice } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export default function ProductCard({
  product,
  locale,
  dict,
  priority = false,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const price = formatPrice(product.price, product.currency);
  const cover = productImage(product);
  // второе фото проявляется при наведении — без JS, только CSS
  const hover = product.images?.[1];

  return (
    <Link href={`/${locale}/catalog/${product.slug}`} className="group block">
      <div className="grain relative aspect-[4/5] overflow-hidden bg-bone-dark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={localizedName(product, locale)}
          loading={priority ? 'eager' : 'lazy'}
          className={`img-zoom h-full w-full object-cover ${
            hover ? 'transition-opacity duration-700 group-hover:opacity-0' : ''
          }`}
        />
        {hover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hover}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        {product.status !== 'available' && (
          <span
            className={`absolute left-3 top-3 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${
              product.status === 'sold' ? 'bg-ink/85 text-bone' : 'bg-bone/85 text-ink'
            }`}
          >
            {dict.catalog.status[product.status]}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[1.05rem] leading-tight">
          {localizedName(product, locale)}
        </h3>
        <span className="shrink-0 text-[0.75rem] tabular-nums text-muted">
          {price ?? dict.catalog.priceOnRequest}
        </span>
      </div>
      {(product.material || product.dimensions) && (
        <p className="mt-0.5 truncate text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          {[localizedMaterial(product.material, locale), product.dimensions]
            .filter(Boolean)
            .join(' · ')}
        </p>
      )}
    </Link>
  );
}
