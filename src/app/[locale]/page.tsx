import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import ProductCard from '@/components/ProductCard';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { getProducts } from '@/lib/products';
import { getContacts } from '@/lib/contacts';
import { getSettings, text } from '@/lib/settings';

// товары и тексты берутся из базы — страница собирается на каждый запрос
export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);
  const featured = await getProducts({ featuredOnly: true, limit: 3 });
  const site = await getContacts();
  const settings = await getSettings();

  // Тексты первого экрана можно переписать в админке, не трогая код.
  const hero = {
    kicker: text(settings, 'hero_kicker', typedLocale, dict.hero.kicker),
    title: text(settings, 'hero_title', typedLocale, dict.hero.title),
    accent: text(settings, 'hero_title_accent', typedLocale, dict.hero.titleAccent),
    subtitle: text(settings, 'hero_subtitle', typedLocale, dict.hero.subtitle),
  };
  const marquee = text(settings, 'marquee', typedLocale, dict.marquee);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      {/* высота = экран минус бегущая строка, чтобы она была видна без прокрутки */}
      <section className="relative grid grid-cols-1 md:h-[calc(100svh-52px)] md:min-h-[620px] md:grid-cols-[1.05fr_1fr]">
        {/* text side */}
        <div className="order-2 flex flex-col justify-center px-5 pb-20 pt-14 md:order-1 md:pb-24 md:pl-10 md:pr-14 md:pt-[68px] lg:pl-[max(2.5rem,calc((100vw-1400px)/2))]">
          <Reveal>
            <p className="kicker">{hero.kicker}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="display-xl mt-7 max-w-[13ch] text-balance">
              {hero.title}
              <span className="mt-1 block italic text-clay-dark">{hero.accent}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="lead mt-8 max-w-[42ch]">{hero.subtitle}</p>
          </Reveal>
          <Reveal delay={340}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/${locale}/catalog`} className="btn btn-solid">
                {dict.hero.cta}
              </Link>
              <Link href={`/${locale}/custom`} className="btn btn-ghost">
                {dict.hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* image side */}
        <div className="grain relative order-1 h-[58svh] overflow-hidden bg-bone-dark md:order-2 md:h-full">
          <Image
            src="/media/face-table-2.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-[center_58%]"
          />
          <div className="absolute inset-y-0 left-0 hidden w-32 bg-gradient-to-r from-bone to-transparent md:block" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bone/70 to-transparent md:hidden" />
        </div>
      </section>

      <Marquee text={marquee} />

      {/* ---------------- FEATURED ---------------- */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="kicker">{dict.featured.kicker}</p>
              <h2 className="display-lg mt-4 max-w-[14ch]">{dict.featured.title}</h2>
              <p className="lead mt-4 max-w-[42ch]">{dict.featured.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/catalog`}
              className="link-underline text-[0.8rem] uppercase tracking-[0.16em]"
            >
              {dict.featured.all} →
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product, i) => (
            <Reveal key={product.id} delay={i * 90}>
              <ProductCard
                product={product}
                locale={typedLocale}
                dict={dict}
                priority={i === 0}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PHILOSOPHY ---------------- */}
      <section className="border-y hairline bg-bone-dark">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 md:grid-cols-2 md:px-10 md:py-32">
          <Reveal className="order-2 md:order-1">
            <div className="grain relative aspect-[4/5] overflow-hidden bg-sand">
              <Image
                src="/media/carousel-3.jpg"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={120} className="order-1 flex flex-col justify-center md:order-2">
            <p className="kicker">{dict.philosophy.kicker}</p>
            <h2 className="display-lg mt-4 max-w-[16ch]">{dict.philosophy.title}</h2>
            <p className="lead mt-6 max-w-[52ch]">{dict.philosophy.body}</p>

            <dl className="mt-12 grid gap-8 sm:grid-cols-2">
              {dict.philosophy.points.map((point) => (
                <div key={point.title}>
                  <dt className="font-display text-xl">{point.title}</dt>
                  <dd className="mt-2 text-sm text-muted">{point.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="kicker">{dict.process.kicker}</p>
          <h2 className="display-lg mt-4 max-w-[16ch]">{dict.process.title}</h2>
        </Reveal>

        <ol className="mt-14 border-t hairline">
          {dict.process.steps.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 60}>
              <div className="grid grid-cols-[auto_1fr] gap-6 border-b hairline py-8 md:grid-cols-[80px_320px_1fr] md:gap-10 md:py-10">
                <span className="font-display text-2xl text-clay">{step.n}</span>
                <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
                <p className="col-span-2 max-w-[52ch] text-sm text-muted md:col-span-1">
                  {step.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------------- CUSTOM CTA ---------------- */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <div className="grain absolute inset-0 opacity-30">
          <Image
            src="/media/carousel-6.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 py-28 text-center md:px-10 md:py-40">
          <Reveal>
            <p className="kicker text-bone/60">{dict.custom.kicker}</p>
            <h2 className="display-lg mx-auto mt-5 max-w-[18ch] text-bone">
              {dict.custom.title}
            </h2>
            <p className="lead mx-auto mt-6 max-w-[48ch] text-bone/75">
              {dict.custom.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/custom`}
                className="btn bg-bone text-ink hover:bg-clay hover:text-ink"
              >
                {dict.hero.ctaSecondary}
              </Link>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn border-bone/35 text-bone hover:bg-bone hover:text-ink"
              >
                Instagram
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
