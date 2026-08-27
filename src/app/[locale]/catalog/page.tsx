import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import CatalogFilters from '@/components/CatalogFilters';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProducts } from '@/lib/products';
import { categoryName, getCategories } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return {
    title: `${dict.catalog.title} — The Face`,
    description: dict.catalog.subtitle,
    alternates: {
      canonical: `/${locale}/catalog`,
      languages: { hy: '/hy/catalog', ru: '/ru/catalog', en: '/en/catalog' },
    },
  };
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const [all, categories] = await Promise.all([getProducts(), getCategories()]);

  const counts = all.reduce<Record<string, number>>((acc, product) => {
    acc[product.category] = (acc[product.category] ?? 0) + 1;
    return acc;
  }, {});

  // Категории приходят из админки; показываем все видимые (даже пустые).
  // Скрытые (is_visible=false) в меню не выводим.
  const tabs = categories
    .filter((item) => item.is_visible)
    .map((item) => ({ slug: item.slug, label: categoryName(item, typedLocale) }));

  // Каталог всегда показывает ОДНУ категорию — никакого смешанного вида.
  // По умолчанию открывается первая категория.
  const activeCategory =
    category && tabs.some((t) => t.slug === category) ? category : tabs[0]?.slug ?? null;

  const products = activeCategory
    ? all.filter((p) => p.category === activeCategory)
    : all;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <p className="kicker">{dict.nav.catalog}</p>
            <h1 className="display-lg mt-3">{dict.catalog.title}</h1>
          </div>
          <p className="max-w-[38ch] text-sm text-muted md:text-right">
            {dict.catalog.subtitle}
          </p>
        </div>
      </Reveal>

      <div className="mt-10 md:mt-12">
        <Suspense fallback={<div className="h-9 border-b hairline" />}>
          <CatalogFilters tabs={tabs} counts={counts} active={activeCategory ?? undefined} />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="py-24 text-center text-muted">{dict.catalog.empty}</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 4) * 70}>
              <ProductCard
                product={product}
                locale={typedLocale}
                dict={dict}
                priority={i < 4}
              />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
