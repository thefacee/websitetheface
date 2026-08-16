import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import InquiryForm from '@/components/InquiryForm';
import Reveal from '@/components/Reveal';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import {
  getProductBySlug,
  getProducts,
  localizedDescription,
  localizedMaterial,
  localizedName,
} from '@/lib/products';
import { formatPrice } from '@/lib/site';
import { getContacts, telLink, waLink } from '@/lib/contacts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const name = localizedName(product, locale as Locale);
  const image = product.images?.[0];
  return {
    title: `${name} — The Face`,
    description: localizedDescription(product, locale as Locale).slice(0, 160),
    openGraph: image ? { images: [image] } : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const name = localizedName(product, typedLocale);
  const description = localizedDescription(product, typedLocale);
  const price = formatPrice(product.price, product.currency);

  const site = await getContacts();
  const related = (await getProducts({ limit: 5 }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const specs = [
    product.material
      ? { label: dict.product.material, value: localizedMaterial(product.material, typedLocale) }
      : null,
    product.dimensions ? { label: dict.product.dimensions, value: product.dimensions } : null,
    product.weight_kg ? { label: dict.product.weight, value: `${product.weight_kg} kg` } : null,
    { label: dict.product.status, value: dict.catalog.status[product.status] },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-24 md:px-10 md:pb-32 md:pt-32">
      <Link
        href={`/${locale}/catalog`}
        className="link-underline text-[0.72rem] uppercase tracking-[0.16em] text-muted"
      >
        ← {dict.product.back}
      </Link>

      <div className="mt-6 grid gap-10 md:mt-8 md:grid-cols-[1.15fr_1fr] md:items-start md:gap-16">
        {/* галерея прокручивается вместе со страницей, панель заказа — прилипает */}
        <ProductGallery images={product.images ?? []} alt={name} />

        <div className="md:sticky md:top-24">
          <h1 className="display-md">{name}</h1>

          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="text-[1.15rem] tracking-[0.02em] text-ink">
              {price ?? dict.catalog.priceOnRequest}
            </p>
            {product.status !== 'available' && (
              <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                {dict.catalog.status[product.status]}
              </span>
            )}
          </div>

          {description && <p className="mt-6 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink-soft">{description}</p>}

          <dl className="mt-8 border-t hairline">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between gap-6 border-b hairline py-3 text-[0.85rem]"
              >
                <dt className="uppercase tracking-[0.12em] text-muted">{spec.label}</dt>
                <dd className="text-right">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            {site.whatsapp && (
              <a
                href={waLink(
                  site.whatsapp,
                  `${name} — ${site.url}/${locale}/catalog/${product.slug}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-solid"
              >
                WhatsApp
              </a>
            )}
            {site.phone && (
              <a href={telLink(site.phone)} className="btn btn-ghost">
                {site.phone}
              </a>
            )}
          </div>

          <details className="group mt-8 border-t hairline pt-6">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[0.72rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink">
              {product.price ? dict.product.order : dict.product.askPrice}
              <span className="transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <div className="mt-6">
              <InquiryForm
                dict={dict}
                locale={typedLocale}
                type="product"
                productId={product.id}
                productTitle={name}
                compact
              />
            </div>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 border-t hairline pt-12 md:mt-32">
          <Reveal>
            <h2 className="font-display text-2xl">{dict.product.related}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
            {related.map((item, i) => (
              <Reveal key={item.id} delay={i * 70}>
                <ProductCard product={item} locale={typedLocale} dict={dict} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
