import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { isLocale, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getContacts } from '@/lib/contacts';

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
    alternates: {
      canonical: `/${locale}`,
      languages: { hy: '/hy', ru: '/ru', en: '/en' },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: 'website',
      locale,
      images: ['/media/face-table-only.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: ['/media/face-table-only.png'],
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
  const contacts = await getContacts();

  // Разметка для поиска: кто мы, чем занимаемся, как связаться.
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Face',
    description: dict.meta.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    email: contacts.email || undefined,
    telephone: contacts.phone || undefined,
    sameAs: contacts.instagram ? [contacts.instagram] : undefined,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AM',
      addressLocality: contacts.address || 'Yerevan',
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <SiteHeader locale={typedLocale} dict={dict} />
      <main className="flex-1">{children}</main>
      <SiteFooter locale={typedLocale} dict={dict} />
    </div>
  );
}
