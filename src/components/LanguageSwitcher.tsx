'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;

  const swap = (locale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/') || `/${locale}`;
  };

  return (
    <div className="flex items-center gap-3 text-[11px] tracking-[0.18em]">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={swap(locale)}
          className={
            locale === current
              ? 'text-ink font-medium'
              : 'text-muted hover:text-ink transition-colors'
          }
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}
