import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Reveal from '@/components/Reveal';
import CustomForm from '@/components/CustomForm';
import { isLocale, type Locale } from '@/i18n/config';
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
    title: `${dict.custom.title} — The Face`,
    description: dict.custom.subtitle,
    alternates: {
      canonical: `/${locale}/custom`,
      languages: { hy: '/hy/custom', ru: '/ru/custom', en: '/en/custom' },
    },
  };
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pt-32 md:px-10 md:pt-44">
        <Reveal>
          <p className="kicker">{dict.custom.kicker}</p>
          <h1 className="display-lg mt-4 max-w-[16ch]">{dict.custom.title}</h1>
          <p className="lead mt-6 max-w-[50ch]">{dict.custom.subtitle}</p>
        </Reveal>
      </section>

      <section className="mx-auto mt-16 max-w-[1400px] px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1fr_1.15fr] md:gap-20">
          <Reveal>
            <p className="kicker mb-8">{dict.custom.steps}</p>
            <ol className="border-t hairline">
              {dict.custom.stepsList.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-5 border-b hairline py-5 text-sm text-ink-soft"
                >
                  <span className="font-display text-lg text-clay">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>

            <div className="grain relative mt-10 aspect-[4/3] overflow-hidden bg-bone-dark">
              <Image
                src="/media/carousel-6.png"
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-[center_60%]"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border hairline bg-bone-dark p-6 md:p-10">
              <CustomForm dict={dict} locale={typedLocale} />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="h-28 md:h-40" />
    </>
  );
}
