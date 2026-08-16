import { createClient, isSupabaseConfigured } from './supabase/server';
import type { Locale } from '@/i18n/config';

export type SettingRow = {
  key: string;
  value_ru: string | null;
  value_hy: string | null;
  value_en: string | null;
};

export type Settings = Record<string, SettingRow>;

/** Настройки редактируются в /admin/settings. Пустое поле = берём значение из кода. */
export async function getSettings(): Promise<Settings> {
  if (!isSupabaseConfigured()) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;
    const map: Settings = {};
    for (const row of (data as SettingRow[]) ?? []) map[row.key] = row;
    return map;
  } catch {
    return {};
  }
}

/** Текст на языке страницы; если админ его не заполнил — fallback из словаря. */
export function text(
  settings: Settings,
  key: string,
  locale: Locale,
  fallback: string
): string {
  const row = settings[key];
  if (!row) return fallback;
  const value =
    locale === 'hy' ? row.value_hy : locale === 'en' ? row.value_en : row.value_ru;
  return value?.trim() || fallback;
}

/** Одно значение без переводов: телефон, почта, ссылка. */
export function plain(settings: Settings, key: string, fallback: string): string {
  return settings[key]?.value_ru?.trim() || fallback;
}
