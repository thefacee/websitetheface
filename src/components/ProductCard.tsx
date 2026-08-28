import Link from 'next/link';
import type { Product } from '@/lib/supabase/types';
import { localizedMaterial, localizedName, productImage } from '@/lib/products';
import { formatPrice } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import ProductLight from './ProductLight';

const LIGHT_LABEL: Record<Locale, string> = {
  hy: 'Լույս',
  ru: 'Свет',
  en: 'Light',
};

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
      <ProductLight
        cover={cover}
        hover={hover}
        alt={localizedName(product, locale)}
        priority={priority}
        badgeLabel={
          product.status !== 'available' ? dict.catalog.status[product.status] : null
        }
        badgeSold={product.status === 'sold'}
        lightLabel={LIGHT_LABEL[locale]}
      />

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
