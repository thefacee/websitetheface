import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { getProducts } from '@/lib/products';
import { site } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = ['', '/catalog', '/custom', '/story', '/contact'];
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${site.url}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.7,
      });
    }
  }

  try {
    const products = await getProducts();
    for (const locale of locales) {
      for (const product of products) {
        entries.push({
          url: `${site.url}/${locale}/catalog/${product.slug}`,
          lastModified: new Date(product.created_at),
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  } catch {
    // ignore — sitemap still valid with static routes
  }

  return entries;
}
