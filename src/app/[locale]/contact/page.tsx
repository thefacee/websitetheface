import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import InquiryForm from '@/components/InquiryForm';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { site, whatsappLink } from '@/lib/site';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const typedLocale = locale as Locale;
  const dict = getDictionary(typedLocale);

  const channels = [
    { label: dict.contact.phone, value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    { label: dict.contact.whatsapp, value: site.phone, href: whatsappLink() },
    { label: dict.contact.email, value: site.email, href: `mailto:${site.email}` },
    { label: dict.contact.instagram, value: '@the.face_official', href: site.instagram },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-32 pt-32 md:px-10 md:pb-44 md:pt-44">
      <Reveal>
        <p className="kicker">{dict.contact.kicker}</p>
        <h1 className="display-lg mt-4">{dict.contact.title}</h1>
        <p className="lead mt-4 max-w-[46ch]">{dict.contact.subtitle}</p>
      </Reveal>

      <div className="mt-16 grid gap-14 md:grid-cols-[1fr_1.2fr] md:gap-20">
        <Reveal>
          <dl className="border-t hairline">
            {channels.map((channel) => (
              <div key={channel.label} className="border-b hairline py-5">
                <dt className="kicker">{channel.label}</dt>
                <dd className="mt-2">
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="link-underline font-display text-2xl"
                  >
                    {channel.value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 border hairline bg-bone-dark p-6">
            <p className="kicker">{dict.contact.b2b}</p>
            <p className="mt-3 text-sm text-ink-soft">{dict.contact.b2bText}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <InquiryForm dict={dict} locale={typedLocale} type="contact" />
        </Reveal>
      </div>
    </div>
  );
}
