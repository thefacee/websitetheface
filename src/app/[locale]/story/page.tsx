import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

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
    title: `${dict.story.title} — The Face`,
    description: dict.story.lead,
    alternates: {
      canonical: `/${locale}/story`,
      languages: { hy: '/hy/story', ru: '/ru/story', en: '/en/story' },
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-10 md:pt-44">
        <Reveal>
          <p className="kicker">{dict.story.kicker}</p>
          <h1 className="display-xl mt-5">{dict.story.title}</h1>
          <p className="mt-8 max-w-[30ch] font-display text-2xl italic leading-snug text-clay-dark md:text-3xl">
            {dict.story.lead}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <figure className="mx-auto max-w-[520px]">
            <div className="overflow-hidden border hairline bg-white shadow-[0_28px_70px_-30px_rgba(38,30,20,0.5)]">
              <Image
                src="/media/certificate.jpg"
                alt={`${dict.story.title} — ${dict.story.certificate}`}
                width={1024}
                height={1536}
                sizes="(max-width: 768px) 92vw, 520px"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-5 text-center text-xs uppercase tracking-[0.18em] text-muted">
              {dict.story.certificate}
            </figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-[760px] px-5 md:px-10">
        {dict.story.body.map((paragraph, i) => (
          <Reveal key={i} delay={i * 90}>
            <p className="lead mb-8">{paragraph}</p>
          </Reveal>
        ))}

        <Reveal delay={200}>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/catalog`} className="btn btn-solid">
              {dict.hero.cta}
            </Link>
            <Link href={`/${locale}/contact`} className="btn btn-ghost">
              {dict.nav.contact}
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="mt-28 md:mt-40">
        <Marquee text={dict.marquee} />
      </div>
    </>
  );
}
