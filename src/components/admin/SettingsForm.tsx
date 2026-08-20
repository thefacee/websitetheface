'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from './SetupNotice';

type Row = { key: string; value_ru: string; value_hy: string; value_en: string };

/** Одно значение на все языки: телефон, почта, ссылка. */
const CONTACT_FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: 'contact_phone', label: 'Телефон', hint: 'Как показывать: +374 XX XXX XXX' },
  {
    key: 'contact_whatsapp',
    label: 'WhatsApp',
    hint: 'Только цифры с кодом страны, без плюса: 374XXXXXXXX',
  },
  { key: 'contact_email', label: 'Email' },
  { key: 'contact_instagram', label: 'Instagram', hint: 'Полная ссылка на профиль' },
];

/** Тексты на трёх языках. Пустое поле = остаётся то, что зашито в сайте. */
const TEXT_FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: 'hero_kicker', label: 'Надпись над заголовком', hint: 'THE FACE — SCULPTED SILENCE' },
  { key: 'hero_title', label: 'Заголовок на главной' },
  { key: 'hero_title_accent', label: 'Вторая строка заголовка', hint: 'Показывается курсивом' },
  { key: 'hero_subtitle', label: 'Подпись под заголовком' },
  { key: 'marquee', label: 'Бегущая строка' },
  { key: 'footer_tagline', label: 'Строка в подвале' },
  { key: 'contact_address', label: 'Адрес мастерской', hint: 'Необязательно' },
];

const ALL_KEYS = [...CONTACT_FIELDS, ...TEXT_FIELDS].map((f) => f.key);

export default function SettingsForm() {
  const ready = isSupabaseReady();
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!ready) {
      setLoading(false);
      return;
    }
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase.from('settings').select('*');
      if (dbError) throw dbError;

      const map: Record<string, Row> = {};
      for (const key of ALL_KEYS) map[key] = { key, value_ru: '', value_hy: '', value_en: '' };
      for (const row of (data as Row[]) ?? []) {
        map[row.key] = {
          key: row.key,
          value_ru: row.value_ru ?? '',
          value_hy: row.value_hy ?? '',
          value_en: row.value_en ?? '',
        };
      }
      setRows(map);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} — выполните supabase/migration-02.sql в SQL Editor.`
          : 'Не удалось загрузить настройки'
      );
    } finally {
      setLoading(false);
    }
  }, [ready]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (key: string, field: keyof Omit<Row, 'key'>, value: string) => {
    setSaved(false);
    setRows((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  async function save() {
    setSaving(true);
    setError('');
    try {
      const supabase = createClient();
      const payload = ALL_KEYS.map((key) => ({
        key,
        value_ru: rows[key]?.value_ru || null,
        value_hy: rows[key]?.value_hy || null,
        value_en: rows[key]?.value_en || null,
        updated_at: new Date().toISOString(),
      }));
      const { error: dbError } = await supabase
        .from('settings')
        .upsert(payload, { onConflict: 'key' });
      if (dbError) throw dbError;
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? `Не удалось сохранить: ${err.message}` : 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  }

  if (!ready) return <SetupNotice />;
  if (loading) return <p className="text-muted">Загружаю настройки...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl">Настройки сайта</h1>
      <p className="mt-1 max-w-[62ch] text-sm text-muted">
        Меняется на сайте сразу после сохранения, пересобирать ничего не нужно.
        Пустое поле означает «оставить то, что написано в сайте по умолчанию».
      </p>

      {/* ---- контакты ---- */}
      <section className="mt-10">
        <p className="kicker">Контакты</p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {CONTACT_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="field-label">{field.label}</label>
              <input
                className="field"
                value={rows[field.key]?.value_ru ?? ''}
                onChange={(e) => update(field.key, 'value_ru', e.target.value)}
              />
              {field.hint && <p className="mt-1 text-[11px] text-muted">{field.hint}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* живой предпросмотр первого экрана */}
      <section className="mt-12">
        <p className="kicker">Как выглядит первый экран сайта</p>
        <div className="mt-4 border hairline bg-bone-dark p-6 md:p-8">
          <p className="kicker">{rows.hero_kicker?.value_ru || 'THE FACE — SCULPTED SILENCE'}</p>
          <h2 className="display-md mt-4 max-w-[16ch]">
            {rows.hero_title?.value_ru || 'Камень становится формой'}
            <span className="mt-1 block italic text-clay-dark">
              {rows.hero_title_accent?.value_ru || 'Форма — присутствием'}
            </span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-sm text-ink-soft">
            {rows.hero_subtitle?.value_ru ||
              'Каменные столы и скульптуры ручной работы из Армении.'}
          </p>
          <p className="mt-5 border-t hairline pt-3 text-[11px] uppercase tracking-[0.16em] text-muted">
            {rows.marquee?.value_ru || 'РУЧНАЯ РАБОТА · АРМЕНИЯ · НАТУРАЛЬНЫЙ КАМЕНЬ'}
          </p>
        </div>
        <p className="mt-2 text-[11px] text-muted">
          Показан русский вариант. Пустое поле — на сайте останется текст по умолчанию.
        </p>
      </section>

      {/* ---- тексты ---- */}
      <section className="mt-12">
        <p className="kicker">Тексты</p>
        <div className="mt-5 space-y-8">
          {TEXT_FIELDS.map((field) => (
            <div key={field.key}>
              <p className="text-sm">{field.label}</p>
              {field.hint && <p className="text-[11px] text-muted">{field.hint}</p>}
              <div className="mt-2 grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label">Русский</label>
                  <input
                    className="field"
                    value={rows[field.key]?.value_ru ?? ''}
                    onChange={(e) => update(field.key, 'value_ru', e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">Հայերեն</label>
                  <input
                    className="field"
                    value={rows[field.key]?.value_hy ?? ''}
                    onChange={(e) => update(field.key, 'value_hy', e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label">English</label>
                  <input
                    className="field"
                    value={rows[field.key]?.value_en ?? ''}
                    onChange={(e) => update(field.key, 'value_en', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="mt-8 border hairline bg-bone-dark p-4 text-sm text-clay-dark">{error}</p>
      )}

      <div className="sticky bottom-0 mt-10 flex items-center gap-4 border-t hairline bg-bone/95 py-4 backdrop-blur-sm">
        <button type="button" onClick={save} className="btn btn-solid" disabled={saving}>
          {saving ? 'Сохраняю...' : 'Сохранить'}
        </button>
        {saved && <span className="text-xs text-muted">Сохранено — обновите сайт в соседней вкладке</span>}
      </div>
    </div>
  );
}
