import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Страницы собираются на каждый запрос: товары, категории и тексты живут в базе,
 * и правка из админки должна быть видна сразу, без пересборки сайта.
 */
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
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader locale={typedLocale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={typedLocale} dict={dict} />
    </div>
  );
}
