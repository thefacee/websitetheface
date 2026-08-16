import { createClient, isSupabaseConfigured } from './supabase/server';
import type { Product } from './supabase/types';
import { demoProducts } from './demo-products';
import type { Locale } from '@/i18n/config';

export async function getProducts(options?: {
  category?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<Product[]> {
  let items: Product[];

  if (!isSupabaseConfigured()) {
    items = demoProducts;
  } else {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: false })
        .order('created_at', { ascending: false });

      if (options?.featuredOnly) query = query.eq('is_featured', true);
      if (options?.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }
      if (options?.limit) query = query.limit(options.limit);

      const { data, error } = await query;
      if (error) throw error;
      return (data as Product[]) ?? [];
    } catch {
      items = demoProducts;
    }
  }

  let result = items;
  if (options?.featuredOnly) result = result.filter((p) => p.is_featured);
  if (options?.category && options.category !== 'all') {
    result = result.filter((p) => p.category === options.category);
  }
  if (options?.limit) result = result.slice(0, options.limit);
  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return demoProducts.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return (data as Product) ?? null;
  } catch {
    return demoProducts.find((p) => p.slug === slug) ?? null;
  }
}

export function localizedName(product: Product, locale: Locale): string {
  if (locale === 'ru') return product.name_ru || product.name_hy || product.name_en || '';
  if (locale === 'en') return product.name_en || product.name_hy || product.name_ru || '';
  return product.name_hy || product.name_ru || product.name_en || '';
}

export function localizedDescription(product: Product, locale: Locale): string {
  if (locale === 'ru') {
    return product.description_ru || product.description_hy || product.description_en || '';
  }
  if (locale === 'en') {
    return product.description_en || product.description_hy || product.description_ru || '';
  }
  return product.description_hy || product.description_ru || product.description_en || '';
}

/**
 * Материал в админке пишется свободным текстом («Травертин», «Travertine», «Տրավերտին»).
 * Известные камни показываем на языке страницы, остальное — как ввели.
 */
const MATERIALS: Record<string, { hy: string; ru: string; en: string }> = {
  travertine: { hy: 'Տրավերտին', ru: 'Травертин', en: 'Travertine' },
  травертин: { hy: 'Տրավերտին', ru: 'Травертин', en: 'Travertine' },
  tuff: { hy: 'Տուֆ', ru: 'Туф', en: 'Tuff' },
  туф: { hy: 'Տուֆ', ru: 'Туф', en: 'Tuff' },
  'black tuff': { hy: 'Սև տուֆ', ru: 'Чёрный туф', en: 'Black tuff' },
  'чёрный туф': { hy: 'Սև տուֆ', ru: 'Чёрный туф', en: 'Black tuff' },
  'черный туф': { hy: 'Սև տուֆ', ru: 'Чёрный туф', en: 'Black tuff' },
  basalt: { hy: 'Բազալտ', ru: 'Базальт', en: 'Basalt' },
  базальт: { hy: 'Բազալտ', ru: 'Базальт', en: 'Basalt' },
  marble: { hy: 'Մարմար', ru: 'Мрамор', en: 'Marble' },
  мрамор: { hy: 'Մարմար', ru: 'Мрамор', en: 'Marble' },
};

export function localizedMaterial(material: string | null, locale: Locale): string {
  if (!material) return '';
  return MATERIALS[material.trim().toLowerCase()]?.[locale] ?? material;
}

export function productImage(product: Product, index = 0): string {
  return product.images?.[index] || '/placeholder/piece-1.svg';
}
