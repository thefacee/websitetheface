'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from './SetupNotice';
import ProductPreview from './ProductPreview';
import type { Product, ProductCategory, ProductStatus } from '@/lib/supabase/types';

const MAX_IMAGE_MB = 8;

/** Запасной список — если миграция с таблицей categories ещё не выполнена. */
const FALLBACK_CATEGORIES: { value: string; label: string }[] = [
  { value: 'table', label: 'Столы' },
  { value: 'sculpture', label: 'Скульптуры' },
  { value: 'accessory', label: 'Аксессуары' },
  { value: 'lighting', label: 'Свет' },
];

const STATUSES: { value: ProductStatus; label: string }[] = [
  { value: 'available', label: 'В наличии' },
  { value: 'made_to_order', label: 'Под заказ' },
  { value: 'sold', label: 'Продан' },
];

const EMPTY = {
  slug: '',
  name_hy: '',
  name_ru: '',
  name_en: '',
  description_hy: '',
  description_ru: '',
  description_en: '',
  category: 'table' as ProductCategory,
  material: '',
  dimensions: '',
  weight_kg: '',
  price: '',
  currency: 'AMD',
  status: 'available' as ProductStatus,
  is_featured: false,
  is_published: true,
  sort_order: '0',
};

function slugify(input: string) {
  const map: Record<string, string> = {
    ա: 'a', բ: 'b', գ: 'g', դ: 'd', ե: 'e', զ: 'z', է: 'e', ը: 'y', թ: 't', ժ: 'zh',
    ի: 'i', լ: 'l', խ: 'kh', ծ: 'ts', կ: 'k', հ: 'h', ձ: 'dz', ղ: 'gh', ճ: 'ch', մ: 'm',
    յ: 'y', ն: 'n', շ: 'sh', ո: 'o', չ: 'ch', պ: 'p', ջ: 'j', ռ: 'r', ս: 's', վ: 'v',
    տ: 't', ր: 'r', ց: 'ts', ւ: 'v', փ: 'p', ք: 'k', օ: 'o', ֆ: 'f', և: 'ev',
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e',
    ю: 'yu', я: 'ya', ь: '', ъ: '',
  };
  return input
    .toLowerCase()
    .split('')
    .map((char) => (map[char] !== undefined ? map[char] : char))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default function ProductForm({ productId }: { productId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(Boolean(productId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();
        if (dbError) throw dbError;
        const product = data as Product;
        setForm({
          slug: product.slug ?? '',
          name_hy: product.name_hy ?? '',
          name_ru: product.name_ru ?? '',
          name_en: product.name_en ?? '',
          description_hy: product.description_hy ?? '',
          description_ru: product.description_ru ?? '',
          description_en: product.description_en ?? '',
          category: product.category,
          material: product.material ?? '',
          dimensions: product.dimensions ?? '',
          weight_kg: product.weight_kg?.toString() ?? '',
          price: product.price?.toString() ?? '',
          currency: product.currency ?? 'AMD',
          status: product.status,
          is_featured: product.is_featured,
          is_published: product.is_published,
          sort_order: product.sort_order?.toString() ?? '0',
        });
        setImages(product.images ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Load failed');
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // список категорий тянем из базы — его редактирует сам владелец в /admin/categories
  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from('categories')
          .select('slug, name_ru, sort_order')
          .order('sort_order', { ascending: false });
        if (dbError) throw dbError;
        const list = (data as { slug: string; name_ru: string }[]) ?? [];
        if (list.length > 0) {
          setCategories(list.map((row) => ({ value: row.slug, label: row.name_ru })));
        }
      } catch {
        // таблицы ещё нет — остаёмся на запасном списке
      }
    })();
  }, []);

  // Ctrl+S сохраняет, как в любом редакторе
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        document.getElementById('product-save')?.click();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // предупреждаем, если уходят со страницы с несохранёнными правками
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const set = (key: keyof typeof form) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setDirty(true);
    setForm((prev) => ({ ...prev, [key]: value } as typeof prev));
  };

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    await uploadFiles(Array.from(e.target.files ?? []));
    e.target.value = '';
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    const tooBig = files.find((file) => file.size > MAX_IMAGE_MB * 1024 * 1024);
    if (tooBig) {
      setError(
        `«${tooBig.name}» весит больше ${MAX_IMAGE_MB} МБ. Уменьшите фото и загрузите снова.`
      );
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: files.length });
    setError('');
    try {
      const supabase = createClient();
      const uploaded: string[] = [];
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file, { cacheControl: '31536000', upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        uploaded.push(data.publicUrl);
        setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
      }
      setImages((prev) => [...prev, ...uploaded]);
      setDirty(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Не удалось загрузить фото: ${err.message}`
          : 'Не удалось загрузить фото'
      );
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    setDirty(true);
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    setDirty(true);
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name_ru.trim() && !form.name_hy.trim()) {
      setError('Заполните название хотя бы на одном языке.');
      return;
    }
    setSaving(true);
    setError('');

    const slug =
      form.slug.trim() ||
      slugify(form.name_en || form.name_ru || form.name_hy) ||
      `piece-${Date.now()}`;

    const payload = {
      slug,
      name_hy: form.name_hy.trim() || form.name_ru.trim(),
      name_ru: form.name_ru.trim() || null,
      name_en: form.name_en.trim() || null,
      description_hy: form.description_hy.trim() || null,
      description_ru: form.description_ru.trim() || null,
      description_en: form.description_en.trim() || null,
      category: form.category,
      material: form.material.trim() || null,
      dimensions: form.dimensions.trim() || null,
      weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
      price: form.price ? Number(form.price) : null,
      currency: form.currency || 'AMD',
      status: form.status,
      images,
      is_featured: form.is_featured,
      is_published: form.is_published,
      sort_order: Number(form.sort_order) || 0,
    };

    try {
      const supabase = createClient();
      if (productId) {
        const { error: dbError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', productId);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase.from('products').insert(payload);
        if (dbError) throw dbError;
      }
      setDirty(false);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? `Не удалось сохранить: ${err.message}` : 'Не удалось сохранить'
      );
    } finally {
      setSaving(false);
    }
  }

  if (!isSupabaseReady()) return <SetupNotice />;
  if (loading) return <p className="text-muted">Загружаю товар...</p>;

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
      <div className="space-y-10">
      <h1 className="font-display text-3xl">
        {productId ? 'Редактировать товар' : 'Новый товар'}
      </h1>

      {/* ---- IMAGES ---- */}
      <section>
        <p className="kicker mb-4">Фотографии</p>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const dropped = Array.from(e.dataTransfer.files).filter((f) =>
              f.type.startsWith('image/')
            );
            uploadFiles(dropped);
          }}
          className={`grid grid-cols-3 gap-3 rounded-sm p-1 transition-colors sm:grid-cols-5 ${
            dragOver ? 'bg-sand ring-1 ring-ink' : ''
          }`}
        >
          {images.map((src, i) => (
            <div key={src} className="group relative aspect-square overflow-hidden bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 bg-ink/80 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-bone">
                  Главное
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-ink/70 px-1 py-0.5 text-[11px] text-bone opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => moveImage(i, -1)}>
                  ←
                </button>
                <button type="button" onClick={() => removeImage(i)}>
                  ✕
                </button>
                <button type="button" onClick={() => moveImage(i, 1)}>
                  →
                </button>
              </div>
            </div>
          ))}

          <label className="flex aspect-square cursor-pointer items-center justify-center border border-dashed border-ink/30 text-center text-xs text-muted hover:border-ink">
            {uploading
              ? `${progress.done} / ${progress.total}`
              : images.length === 0
                ? '+ Фото'
                : '+ Добавить'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-muted">
          Первое фото — главное, второе показывается при наведении в каталоге.
          Стрелками меняйте порядок, ✕ удаляет. Файлы можно просто перетащить сюда
          мышкой. До {MAX_IMAGE_MB} МБ на файл.
        </p>
        {uploading && (
          <div className="mt-3 h-px w-full bg-ink/10">
            <div
              className="h-px bg-ink transition-all duration-300"
              style={{
                width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
              }}
            />
          </div>
        )}
      </section>

      {/* ---- NAMES ---- */}
      <section className="space-y-6">
        <p className="kicker">Название</p>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <label className="field-label">Русский *</label>
            <input className="field" value={form.name_ru} onChange={set('name_ru')} />
          </div>
          <div>
            <label className="field-label">Հայերեն</label>
            <input className="field" value={form.name_hy} onChange={set('name_hy')} />
          </div>
          <div>
            <label className="field-label">English</label>
            <input className="field" value={form.name_en} onChange={set('name_en')} />
          </div>
        </div>
      </section>

      {/* ---- DESCRIPTIONS ---- */}
      <section className="space-y-6">
        <p className="kicker">Описание</p>
        <div>
          <label className="field-label">Русский</label>
          <textarea
            className="field"
            value={form.description_ru}
            onChange={set('description_ru')}
          />
        </div>
        <div>
          <label className="field-label">Հայերեն</label>
          <textarea
            className="field"
            value={form.description_hy}
            onChange={set('description_hy')}
          />
        </div>
        <div>
          <label className="field-label">English</label>
          <textarea
            className="field"
            value={form.description_en}
            onChange={set('description_en')}
          />
        </div>
      </section>

      {/* ---- DETAILS ---- */}
      <section className="space-y-6">
        <p className="kicker">Характеристики</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="field-label">Категория</label>
            <select className="field" value={form.category} onChange={set('category')}>
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Статус</label>
            <select className="field" value={form.status} onChange={set('status')}>
              {STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Материал (Травертин / Туф ...)</label>
            <input className="field" value={form.material} onChange={set('material')} />
          </div>
          <div>
            <label className="field-label">Размеры (70 × 50 × 45 см)</label>
            <input className="field" value={form.dimensions} onChange={set('dimensions')} />
          </div>
          <div>
            <label className="field-label">Вес (кг)</label>
            <input
              className="field"
              type="number"
              step="0.1"
              value={form.weight_kg}
              onChange={set('weight_kg')}
            />
          </div>
          <div>
            <label className="field-label">Порядок (больше число — выше в списке)</label>
            <input
              className="field"
              type="number"
              value={form.sort_order}
              onChange={set('sort_order')}
            />
          </div>
          <div>
            <label className="field-label">Цена (пусто = «цена по запросу»)</label>
            <input
              className="field"
              type="number"
              step="1"
              value={form.price}
              onChange={set('price')}
            />
          </div>
          <div>
            <label className="field-label">Валюта</label>
            <select className="field" value={form.currency} onChange={set('currency')}>
              <option value="AMD">AMD ֏</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="field-label">Адрес страницы (заполнится сам)</label>
            <input className="field" value={form.slug} onChange={set('slug')} />
          </div>
        </div>

        <div className="flex flex-wrap gap-8 pt-2">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={set('is_featured')}
              className="h-4 w-4"
            />
            Показывать на главной
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={set('is_published')}
              className="h-4 w-4"
            />
            Опубликован
          </label>
        </div>
      </section>

      {error && (
        <p className="border hairline bg-bone-dark p-4 text-sm text-clay-dark">{error}</p>
      )}

      </div>

      {/* правая колонка: то же, что увидит покупатель */}
      <aside className="xl:sticky xl:top-6">
        <ProductPreview draft={form} images={images} />
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Обновляется на лету, пока вы печатаете. На сайте это появится после
          «Сохранить».
        </p>
      </aside>

      <div className="sticky bottom-0 xl:col-span-2 -mx-5 flex flex-wrap items-center gap-3 border-t hairline bg-bone/95 px-5 py-4 backdrop-blur-sm md:-mx-8 md:px-8">
        <button id="product-save" type="submit" className="btn btn-solid" disabled={saving || uploading}>
          {saving ? 'Сохраняю...' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={() => {
            if (dirty && !window.confirm('Изменения не сохранены. Уйти со страницы?')) return;
            setDirty(false);
            router.push('/admin');
          }}
          className="btn btn-ghost"
        >
          Отмена
        </button>

        {uploading && <span className="text-xs text-muted">Загружаю фото...</span>}
        {!uploading && dirty && (
          <span className="text-xs text-clay-dark">Есть несохранённые изменения</span>
        )}

        {productId && form.slug && (
          <a
            href={`/ru/catalog/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-muted underline hover:text-ink"
          >
            Открыть на сайте ↗
          </a>
        )}
      </div>
    </form>
  );
}
