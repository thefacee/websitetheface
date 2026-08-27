'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export default function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { href: `/${locale}/catalog`, label: dict.nav.catalog },
    { href: `/${locale}/custom`, label: dict.nav.custom },
    { href: `/${locale}/story`, label: dict.nav.story },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? 'bg-bone/90 backdrop-blur-md border-b hairline'
            : 'border-b border-transparent'
        }`}
      >
        {/* Мягкая подложка под шапкой — чтобы меню, язык и тема читались
            над видео/светлыми фото. Цвет подстраивается под тему (bone). */}
        {!(scrolled || open) && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bone/95 via-bone/50 to-transparent"
          />
        )}
        <div className="relative mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 md:px-10">
          <Link
            href={`/${locale}`}
            aria-label="The Face"
            className="flex items-center gap-2.5"
          >
            <Image
              src="/media/logo-mark.png"
              alt=""
              width={255}
              height={240}
              priority
              className="h-9 w-auto md:h-10"
            />
            <span className="font-display text-[1.2rem] tracking-[0.2em] uppercase md:text-[1.35rem]">
              The&nbsp;Face
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`link-underline text-[0.8rem] tracking-[0.08em] transition-colors ${
                  pathname === link.href ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <LanguageSwitcher current={locale} />
            </div>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? 'translate-y-[3px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-ink transition-transform duration-300 ${
                  open ? '-translate-y-[3px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-bone transition-all duration-500 lg:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-12 pt-28">
          <nav className="flex flex-col gap-1">
            {links.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="display-md border-b hairline py-5"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between">
            <LanguageSwitcher current={locale} />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
