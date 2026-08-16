'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from './SetupNotice';

type Category = {
  id: string;
  slug: string;
  name_ru: string;
  name_hy: string | null;
  name_en: string | null;
  sort_order: number;
  is_visible: boolean;
};

const EMPTY = { slug: '', name_ru: '', name_hy: '', name_en: '', sort_order: 0 };

function slugify(input: string) {
  const map: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
    й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
    у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ы: 'y', э: 'e',
    ю: 'yu', я: 'ya', ь: '', ъ: '',
  };
  return input
    .toLowerCase()
    .split('')
    .map((c) => (map[c] !== undefined ? map[c] : c))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export default function CategoryList() {
  const ready = isSupabaseReady();
  const [items, setItems] = useState<Category[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({ ...EMPTY });
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!ready) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const [cats, products] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order', { ascending: false }),
        supabase.from('products').select('category'),
      ]);
      if (cats.error) throw cats.error;
      setItems((cats.data as Category[]) ?? []);

      const map: Record<string, number> = {};
      for (const row of (products.data as { category: string }[]) ?? []) {
        map[row.category] = (map[row.category] ?? 0) + 1;
      }
      setCounts(map);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — выполните supabase/migration-02.sql в SQL Editor.`
          : 'Не удалось загрузить категории'
      );
    } finally {
      setLoading(false);
    }
  }, [ready]);

  useEffect(() => {
    load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const name = draft.name_ru.trim();
    if (!name) {
      setError('Впишите название категории по-русски.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      slug: draft.slug.trim() || slugify(draft.name_en || name) || `cat-${Date.now()}`,
      name_ru: name,
      name_hy: draft.name_hy.trim() || null,
      name_en: draft.name_en.trim() || null,
      sort_order: Number(draft.sort_order) || 0,
    };

    const supabase = createClient();
    const { error: dbError } = editing
      ? await supabase.from('categories').update(payload).eq('id', editing.id)
      : await supabase.from('categories').insert(payload);

    if (dbError) setError(dbError.message);
    else {
      setDraft({ ...EMPTY });
      setEditing(null);
      await load();
    }
    setSaving(false);
  }

  async function toggleVisible(item: Category) {
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from('categories')
      .update({ is_visible: !item.is_visible })
      .eq('id', item.id);
    if (dbError) setError(dbError.message);
    else
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, is_visible: !row.is_visible } : row))
      );
  }

  async function remove(item: Category) {
    const used = counts[item.slug] ?? 0;
    if (used > 0) {
      setError(
        `В категории «${item.name_ru}» ${used} товар(ов). Сначала переведите их в другую категорию.`
      );
      return;
    }
    if (!window.confirm(`Удалить категорию «${item.name_ru}»?`)) return;
    const supabase = createClient();
    const { error: dbError } = await supabase.from('categories').delete().eq('id', item.id);
    if (dbError) setError(dbError.message);
    else setItems((prev) => prev.filter((row) => row.id !== item.id));
  }

  function startEdit(item: Category) {
    setEditing(item);
    setDraft({
      slug: item.slug,
      name_ru: item.name_ru,
      name_hy: item.name_hy ?? '',
      name_en: item.name_en ?? '',
      sort_order: item.sort_order,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!ready) return <SetupNotice />;

  return (
    <div>
      <h1 className="font-display text-3xl">Категории</h1>
      <p className="mt-1 max-w-[60ch] text-sm text-muted">
        Разделы каталога. В меню на сайте показываются только видимые категории,
        в которых есть хотя бы один товар.
      </p>

      {/* ---- добавление и правка ---- */}
      <form onSubmit={save} className="mt-8 border hairline bg-bone-dark p-5">
        <p className="kicker">{editing ? 'Изменить категорию' : 'Новая категория'}</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="field-label">Русский *</label>
            <input
              className="field"
              value={draft.name_ru}
              onChange={(e) => setDraft({ ...draft, name_ru: e.target.value })}
              placeholder="Например: Лампы"
            />
          </div>
          <div>
            <label className="field-label">Հայերեն</label>
            <input
              className="field"
              value={draft.name_hy}
              onChange={(e) => setDraft({ ...draft, name_hy: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">English</label>
            <input
              className="field"
              value={draft.name_en}
              onChange={(e) => setDraft({ ...draft, name_en: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Порядок (больше — левее)</label>
            <input
              className="field"
              type="number"
              value={draft.sort_order}
              onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-solid" disabled={saving}>
            {saving ? 'Сохраняю...' : editing ? 'Сохранить' : 'Добавить'}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEditing(null);
                setDraft({ ...EMPTY });
              }}
            >
              Отмена
            </button>
          )}
          {editing && (
            <span className="text-xs text-muted">
              Адрес раздела: /catalog?category={editing.slug}
            </span>
          )}
        </div>
      </form>

      {error && (
        <p className="mt-6 border hairline bg-bone-dark p-4 text-sm text-clay-dark">{error}</p>
      )}

      {loading && <p className="mt-8 text-muted">Загружаю...</p>}

      <div className="mt-8 space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex flex-wrap items-center gap-4 border hairline bg-bone-dark p-3 ${
              item.is_visible ? '' : 'border-dashed opacity-70'
            }`}
          >
            <div className="min-w-[200px] flex-1">
              <p className="font-display text-lg leading-tight">{item.name_ru}</p>
              <p className="text-xs text-muted">
                {[item.name_hy, item.name_en].filter(Boolean).join(' · ') || 'переводов нет'} ·{' '}
                {counts[item.slug] ?? 0} товар(ов)
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => toggleVisible(item)}
                className={item.is_visible ? 'text-ink' : 'text-muted'}
              >
                {item.is_visible ? '👁 Видна' : '🚫 Скрыта'}
              </button>
              <button type="button" onClick={() => startEdit(item)} className="underline">
                Изменить
              </button>
              <button
                type="button"
                onClick={() => remove(item)}
                className="text-clay-dark underline"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && !error && (
        <p className="mt-8 text-muted">Категорий нет — добавьте первую сверху.</p>
      )}
    </div>
  );
}
