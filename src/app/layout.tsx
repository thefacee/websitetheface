import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import {
  Cormorant_Garamond,
  Inter,
  Noto_Serif_Armenian,
  Noto_Sans_Armenian,
} from 'next/font/google';
import './globals.css';

/**
 * Шрифты собираются вместе с сайтом: без обращения к Google при загрузке
 * страницы — быстрее первый экран и не зависим от чужого сервера.
 */
const display = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display-latin',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500'],
  variable: '--font-body-latin',
  display: 'swap',
});

const displayAm = Noto_Serif_Armenian({
  subsets: ['armenian'],
  weight: ['300', '400', '500'],
  variable: '--font-display-am',
  display: 'swap',
});

const bodyAm = Noto_Sans_Armenian({
  subsets: ['armenian'],
  weight: ['300', '400', '500'],
  variable: '--font-body-am',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'The Face — Sculpted Silence. Living Stone.',
  description:
    'Handcrafted stone tables and sculptures from Armenia. Every piece is carved by hand from a single block.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const lang = headerList.get('x-locale') || 'hy';

  return (
    <html
      lang={lang}
      className={`${display.variable} ${body.variable} ${displayAm.variable} ${bodyAm.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Ставим тему до отрисовки — без мигания светлого при загрузке тёмной. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
