import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import Marquee from '@/components/Marquee';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export const dynamic = 'force-dynamic';

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
          <div className="grain relative aspect-[16/9] overflow-hidden bg-bone-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/gallery-1.png"
              alt=""
              className="h-full w-full object-cover object-[center_65%]"
            />
          </div>
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
