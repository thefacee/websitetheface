'use client';

import { useState } from 'react';

type Draft = {
  name_ru: string;
  name_hy: string;
  name_en: string;
  description_ru: string;
  description_hy: string;
  description_en: string;
  material: string;
  dimensions: string;
  weight_kg: string;
  price: string;
  currency: string;
  status: string;
  is_published: boolean;
  is_featured: boolean;
};

const STATUS_LABEL: Record<string, string> = {
  available: 'В наличии',
  made_to_order: 'Под заказ',
  sold: 'Продано',
};

const LANGS = ['ru', 'hy', 'en'] as const;

function money(price: string, currency: string) {
  const value = Number(price);
  if (!price || Number.isNaN(value)) return 'Цена по запросу';
  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '֏';
  return `${value.toLocaleString('ru-RU')} ${symbol}`;
}

/**
 * Показывает, как товар встанет на сайт, пока его ещё заполняют:
 * карточка каталога и верх страницы товара. Классы те же, что на витрине,
 * поэтому предпросмотр совпадает с настоящим видом.
 */
export default function ProductPreview({
  draft,
  images,
}: {
  draft: Draft;
  images: string[];
}) {
  const [lang, setLang] = useState<(typeof LANGS)[number]>('ru');
  const [view, setView] = useState<'card' | 'page'>('card');

  const pick = (ru: string, hy: string, en: string) =>
    lang === 'ru' ? ru || hy || en : lang === 'hy' ? hy || ru || en : en || ru || hy;

  const name = pick(draft.name_ru, draft.name_hy, draft.name_en);
  const description = pick(
    draft.description_ru,
    draft.description_hy,
    draft.description_en
  );
  const price = money(draft.price, draft.currency);
  const cover = images[0];

  const specs = [
    draft.material ? ['Материал', draft.material] : null,
    draft.dimensions ? ['Размеры', draft.dimensions] : null,
    draft.weight_kg ? ['Вес', `${draft.weight_kg} kg`] : null,
    ['Статус', STATUS_LABEL[draft.status] ?? draft.status],
  ].filter(Boolean) as Array<[string, string]>;

  return (
    <div className="border hairline bg-bone">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-4 py-3">
        <p className="kicker">Как это будет на сайте</p>
        <div className="flex gap-4 text-[11px]">
          <div className="flex gap-1">
            {LANGS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLang(item)}
                className={`px-2 py-1 uppercase tracking-wider transition-colors ${
                  lang === item ? 'bg-ink text-bone' : 'text-muted hover:text-ink'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {([['card', 'В каталоге'], ['page', 'Страница']] as const).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setView(key)}
                  className={`px-2 py-1 transition-colors ${
                    view === key ? 'bg-ink text-bone' : 'text-muted hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        {view === 'card' ? (
          <div className="mx-auto max-w-[260px]">
            <div className="grain relative aspect-[4/5] overflow-hidden bg-bone-dark">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-muted">
                  добавьте фото
                </span>
              )}
              {draft.status !== 'available' && (
                <span
                  className={`absolute left-3 top-3 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${
                    draft.status === 'sold' ? 'bg-ink/85 text-bone' : 'bg-bone/85 text-ink'
                  }`}
                >
                  {STATUS_LABEL[draft.status]}
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.1rem] leading-tight">
                {name || 'Без названия'}
              </h3>
              <span className="shrink-0 text-[0.78rem] text-muted">{price}</span>
            </div>
            {(draft.material || draft.dimensions) && (
              <p className="mt-0.5 truncate text-[0.72rem] uppercase tracking-[0.12em] text-muted">
                {[draft.material, draft.dimensions].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="grain relative aspect-[4/5] overflow-hidden bg-bone-dark">
              {cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-muted">
                  добавьте фото
                </span>
              )}
            </div>
            <div>
              <h1 className="display-md">{name || 'Без названия'}</h1>
              <p className="mt-3 text-[1.1rem] text-ink">{price}</p>
              {description && (
                <p className="mt-4 text-[0.9rem] leading-relaxed text-ink-soft">
                  {description.slice(0, 220)}
                  {description.length > 220 ? '…' : ''}
                </p>
              )}
              <dl className="mt-5 border-t hairline text-[0.8rem]">
                {specs.map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 border-b hairline py-2">
                    <dt className="uppercase tracking-[0.1em] text-muted">{label}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>
              {images.length > 1 && (
                <div className="mt-4 flex gap-2">
                  {images.slice(0, 5).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" className="h-10 w-10 object-cover opacity-70" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t hairline pt-4 text-[11px] text-muted">
          <span>{draft.is_published ? '👁 Показан на сайте' : '🚫 Скрыт от посетителей'}</span>
          <span>{draft.is_featured ? '★ Стоит на главной' : '☆ Только в каталоге'}</span>
          <span>{images.length} фото</span>
        </div>
      </div>
    </div>
  );
}
