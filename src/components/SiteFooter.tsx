import Link from 'next/link';
import { site } from '@/lib/site';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export default function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links = [
    { href: `/${locale}/catalog`, label: dict.nav.catalog },
    { href: `/${locale}/custom`, label: dict.nav.custom },
    { href: `/${locale}/story`, label: dict.nav.story },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="border-t hairline bg-bone-dark">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-[1.6rem] uppercase tracking-[0.22em]">
              The&nbsp;Face
            </div>
            <p className="mt-4 max-w-xs font-display text-lg italic text-muted">
              {dict.footer.tagline}
            </p>
            <p className="mt-6 kicker">{dict.footer.madeIn}</p>
          </div>

          <div>
            <p className="kicker mb-5">{dict.footer.nav}</p>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-ink-soft hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="kicker mb-5">{dict.footer.contacts}</p>
            <ul className="space-y-3 text-sm text-ink-soft">
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="link-underline">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline">
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-8 text-[11px] tracking-[0.12em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} The Face. {dict.footer.rights}.
          </span>
          <Link href="/admin" className="link-underline uppercase">
            {dict.nav.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
