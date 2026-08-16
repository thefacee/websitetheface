'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from './SetupNotice';
import type { Product } from '@/lib/supabase/types';

const CATEGORY_LABEL: Record<string, string> = {
  table: 'Стол',
  sculpture: 'Скульптура',
  accessory: 'Аксессуар',
  lighting: 'Свет',
};

const STATUS_LABEL: Record<string, string> = {
  available: 'В наличии',
  made_to_order: 'Под заказ',
  sold: 'Продан',
};

export default function ProductList() {
  const ready = isSupabaseReady();
  const [products, setProducts] = useState<Product[]>([]);
  const [newInquiries, setNewInquiries] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [only, setOnly] = useState<'all' | 'published' | 'hidden'>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!ready) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const [{ data, error: dbError }, counter] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .order('sort_order', { ascending: false })
          .order('created_at', { ascending: false }),
        supabase
          .from('inquiries')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
      ]);
      if (dbError) throw dbError;
      setProducts((data as Product[]) ?? []);
      setNewInquiries(counter.count ?? 0);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  }, [ready]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (only === 'published' && !product.is_published) return false;
      if (only === 'hidden' && product.is_published) return false;
      if (!q) return true;
      return [product.name_ru, product.name_hy, product.name_en, product.material, product.slug]
        .filter(Boolean)
        .some((value) => (value as string).toLowerCase().includes(q));
    });
  }, [products, query, only]);

  const title = (product: Product) => product.name_ru || product.name_hy || product.name_en || '—';

  async function togglePublished(product: Product) {
    setBusyId(product.id);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from('products')
      .update({ is_published: !product.is_published })
      .eq('id', product.id);
    if (dbError) setError(dbError.message);
    else {
      setProducts((prev) =>
        prev.map((row) =>
          row.id === product.id ? { ...row, is_published: !row.is_published } : row
        )
      );
    }
    setBusyId(null);
  }

  async function toggleFeatured(product: Product) {
    setBusyId(product.id);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from('products')
      .update({ is_featured: !product.is_featured })
      .eq('id', product.id);
    if (dbError) setError(dbError.message);
    else {
      setProducts((prev) =>
        prev.map((row) =>
          row.id === product.id ? { ...row, is_featured: !row.is_featured } : row
        )
      );
    }
    setBusyId(null);
  }

  /** Меняет местами вес сортировки с соседом — так товар двигается вверх/вниз по сайту. */
  async function move(product: Product, direction: -1 | 1) {
    const index = products.findIndex((row) => row.id === product.id);
    const neighbour = products[index + direction];
    if (!neighbour) return;

    setBusyId(product.id);
    const a = product.sort_order ?? 0;
    const b = neighbour.sort_order ?? 0;
    // если веса совпали, разводим их, иначе обмен ничего не изменит
    const nextA = a === b ? b + (direction === -1 ? 1 : -1) : b;
    const nextB = a === b ? a : a;

    const supabase = createClient();
    const [one, two] = await Promise.all([
      supabase.from('products').update({ sort_order: nextA }).eq('id', product.id),
      supabase.from('products').update({ sort_order: nextB }).eq('id', neighbour.id),
    ]);
    if (one.error || two.error) setError((one.error || two.error)!.message);
    else await load();
    setBusyId(null);
  }

  async function duplicate(product: Product) {
    setBusyId(product.id);
    const supabase = createClient();
    const copy = {
      ...product,
      slug: `${product.slug}-copy-${Math.random().toString(36).slice(2, 6)}`,
      name_ru: product.name_ru ? `${product.name_ru} (копия)` : null,
      name_hy: `${product.name_hy} (копия)`,
      is_published: false,
      is_featured: false,
    } as Partial<Product>;
    delete copy.id;
    delete copy.created_at;

    const { error: dbError } = await supabase.from('products').insert(copy);
    if (dbError) setError(dbError.message);
    else await load();
    setBusyId(null);
  }

  async function remove(product: Product) {
    if (!window.confirm(`Удалить «${title(product)}»? Это нельзя отменить.`)) return;
    setBusyId(product.id);
    const supabase = createClient();
    const { error: dbError } = await supabase.from('products').delete().eq('id', product.id);
    if (dbError) setError(dbError.message);
    else setProducts((prev) => prev.filter((row) => row.id !== product.id));
    setBusyId(null);
  }

  if (!ready) return <SetupNotice />;

  const published = products.filter((p) => p.is_published).length;

  return (
    <div>
      {/* ---- сводка ---- */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Всего товаров" value={loading ? '—' : products.length} />
        <Stat label="На сайте" value={loading ? '—' : published} />
        <Stat label="Скрыто" value={loading ? '—' : products.length - published} />
        <Link href="/admin/inquiries" className="block">
          <Stat
            label="Новые заявки"
            value={newInquiries === null ? '—' : newInquiries}
            accent={Boolean(newInquiries)}
          />
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl">Товары</h1>
        <Link href="/admin/products/new" className="btn btn-solid">
          + Новый товар
        </Link>
      </div>

      {/* ---- поиск и фильтр ---- */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          className="field max-w-xs flex-1"
          placeholder="Поиск по названию, материалу..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex gap-2">
          {(
            [
              ['all', 'Все'],
              ['published', 'На сайте'],
              ['hidden', 'Скрытые'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setOnly(key)}
              className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                only === key ? 'border-ink bg-ink text-bone' : 'border-ink/20 text-muted hover:border-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-6 border hairline bg-bone-dark p-4 text-sm text-clay-dark">
          {error} — проверьте настройки Supabase и выполненный schema.sql.
        </p>
      )}

      {loading && <p className="mt-10 text-muted">Загружаю...</p>}

      {!loading && products.length === 0 && !error && (
        <div className="mt-10 border border-dashed border-ink/20 p-12 text-center">
          <p className="font-display text-xl">Товаров пока нет</p>
          <p className="mt-2 text-sm text-muted">
            Нажмите «Новый товар», загрузите фото и заполните название.
          </p>
        </div>
      )}

      {!loading && products.length > 0 && visible.length === 0 && (
        <p className="mt-10 text-muted">Ничего не найдено.</p>
      )}

      <div className="mt-6 space-y-2">
        {visible.map((product, i) => (
          <div
            key={product.id}
            className={`flex flex-wrap items-center gap-4 border hairline bg-bone-dark p-3 transition-opacity ${
              busyId === product.id ? 'opacity-50' : ''
            } ${product.is_published ? '' : 'border-dashed'}`}
          >
            <div className="flex flex-col gap-0.5 text-muted">
              <button
                type="button"
                onClick={() => move(product, -1)}
                disabled={i === 0 || Boolean(query) || only !== 'all'}
                title="Выше на сайте"
                className="px-1 leading-none hover:text-ink disabled:opacity-25"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => move(product, 1)}
                disabled={i === visible.length - 1 || Boolean(query) || only !== 'all'}
                title="Ниже на сайте"
                className="px-1 leading-none hover:text-ink disabled:opacity-25"
              >
                ▼
              </button>
            </div>

            <div className="h-16 w-16 shrink-0 overflow-hidden bg-sand">
              {product.images?.[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-[10px] text-muted">
                  нет фото
                </span>
              )}
            </div>

            <div className="min-w-[200px] flex-1">
              <p className="font-display text-lg leading-tight">
                {title(product)}
                {product.is_featured && (
                  <span className="ml-2 align-middle text-[10px] uppercase tracking-[0.14em] text-clay">
                    ★ на главной
                  </span>
                )}
              </p>
              <p className="text-xs text-muted">
                {CATEGORY_LABEL[product.category] ?? product.category} ·{' '}
                {STATUS_LABEL[product.status] ?? product.status} ·{' '}
                {product.price
                  ? `${product.price.toLocaleString('ru-RU')} ${product.currency}`
                  : 'цена по запросу'}{' '}
                · {product.images?.length ?? 0} фото
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => togglePublished(product)}
                className={product.is_published ? 'text-ink' : 'text-muted'}
                title="Показывать на сайте"
              >
                {product.is_published ? '👁 На сайте' : '🚫 Скрыт'}
              </button>
              <button
                type="button"
                onClick={() => toggleFeatured(product)}
                className={product.is_featured ? 'text-clay-dark' : 'text-muted'}
                title="Показывать на главной"
              >
                {product.is_featured ? '★' : '☆'}
              </button>
              <Link href={`/admin/products/${product.id}`} className="underline">
                Изменить
              </Link>
              <button type="button" onClick={() => duplicate(product)} className="underline">
                Дублировать
              </button>
              <button
                type="button"
                onClick={() => remove(product)}
                className="text-clay-dark underline"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {(query || only !== 'all') && visible.length > 0 && (
        <p className="mt-4 text-xs text-muted">
          Порядок можно менять только без поиска и фильтра.
        </p>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`border hairline p-4 ${accent ? 'bg-ink text-bone' : 'bg-bone-dark'}`}
    >
      <p
        className={`text-[0.65rem] uppercase tracking-[0.16em] ${
          accent ? 'text-bone/70' : 'text-muted'
        }`}
      >
        {label}
      </p>
      <p className="mt-1 font-display text-3xl leading-none">{value}</p>
    </div>
  );
}
