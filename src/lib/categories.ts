import { createClient, isSupabaseConfigured } from './supabase/server';
import type { Locale } from '@/i18n/config';

export type Category = {
  id: string;
  slug: string;
  name_ru: string;
  name_hy: string | null;
  name_en: string | null;
  sort_order: number;
  is_visible: boolean;
};

/** Пока таблицы categories нет (миграция не выполнена) — работаем на этом списке. */
export const FALLBACK_CATEGORIES: Category[] = [
  { id: 'table', slug: 'table', name_ru: 'Столы', name_hy: 'Սեղաններ', name_en: 'Tables', sort_order: 100, is_visible: true },
  { id: 'sculpture', slug: 'sculpture', name_ru: 'Скульптуры', name_hy: 'Քանդակներ', name_en: 'Sculptures', sort_order: 90, is_visible: true },
  { id: 'accessory', slug: 'accessory', name_ru: 'Аксессуары', name_hy: 'Աքսեսուարներ', name_en: 'Accessories', sort_order: 80, is_visible: true },
  { id: 'lighting', slug: 'lighting', name_ru: 'Свет', name_hy: 'Լույս', name_en: 'Lighting', sort_order: 70, is_visible: true },
];

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return FALLBACK_CATEGORIES;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: false });
    if (error) throw error;
    const list = (data as Category[]) ?? [];
    return list.length > 0 ? list : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export function categoryName(category: Category, locale: Locale): string {
  if (locale === 'hy') return category.name_hy || category.name_ru;
  if (locale === 'en') return category.name_en || category.name_ru;
  return category.name_ru;
}
