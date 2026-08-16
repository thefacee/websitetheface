import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Face — Sculpted Silence. Living Stone.',
  description:
    'Handcrafted stone tables and sculptures from Armenia. Every piece is carved by hand from a single block.',
};

const FONT_HREF =
  'https://fonts.googleapis.com/css2' +
  '?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400' +
  '&family=Inter:wght@300;400;500' +
  '&family=Noto+Serif+Armenian:wght@300;400;500' +
  '&family=Noto+Sans+Armenian:wght@300;400;500' +
  '&display=swap';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const lang = headerList.get('x-locale') || 'hy';

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href={FONT_HREF} />
      </head>
      <body>{children}</body>
    </html>
  );
}
