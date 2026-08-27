import Link from 'next/link';
import Image from 'next/image';
import { getContacts, telLink } from '@/lib/contacts';
import { getSettings, text } from '@/lib/settings';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

export default async function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const site = await getContacts();
  const settings = await getSettings();
  const tagline = text(settings, 'footer_tagline', locale, dict.footer.tagline);
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
            <Image
              src="/media/logo-mark.png"
              alt=""
              width={255}
              height={240}
              className="h-16 w-auto"
            />
            <div className="mt-4 font-display text-[1.6rem] uppercase tracking-[0.22em]">
              The&nbsp;Face
            </div>
            <p className="mt-4 max-w-xs font-display text-lg italic text-muted">
              {tagline}
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
              {site.phone && (
                <li>
                  <a href={telLink(site.phone)} className="link-underline">
                    {site.phone}
                  </a>
                </li>
              )}
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
