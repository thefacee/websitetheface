'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import type { Dictionary } from '@/i18n/dictionaries';

const CATEGORIES = ['all', 'table', 'sculpture', 'accessory', 'lighting'] as const;

export default function CatalogFilters({
  dict,
  counts,
}: {
  dict: Dictionary;
  counts?: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'all';

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all') params.delete('category');
    else params.set('category', value);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const label = (key: string) =>
    key === 'all'
      ? dict.catalog.filters.all
      : dict.catalog.categories[key as keyof typeof dict.catalog.categories];

  // пустые категории не показываем — меню не должно врать
  const visible = CATEGORIES.filter((key) => key === 'all' || !counts || counts[key] > 0);

  return (
    <div className="no-scrollbar -mx-5 flex gap-7 overflow-x-auto border-b hairline px-5 md:mx-0 md:px-0">
      {visible.map((key) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            className={`group relative -mb-px whitespace-nowrap pb-3 text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
              isActive ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {label(key)}
            {counts && (
              <sup className="ml-1 text-[0.6rem] tracking-normal text-muted">
                {counts[key] ?? 0}
              </sup>
            )}
            <span
              className={`absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-300 ${
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
