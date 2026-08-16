'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export type FilterTab = { slug: string; label: string };

export default function CatalogFilters({
  tabs,
  counts,
}: {
  tabs: FilterTab[];
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

  if (tabs.length <= 1) return null;

  return (
    <div className="no-scrollbar -mx-5 flex gap-7 overflow-x-auto border-b hairline px-5 md:mx-0 md:px-0">
      {tabs.map((tab) => {
        const isActive = active === tab.slug;
        return (
          <button
            key={tab.slug}
            type="button"
            onClick={() => select(tab.slug)}
            className={`group relative -mb-px whitespace-nowrap pb-3 text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 ${
              isActive ? 'text-ink' : 'text-muted hover:text-ink'
            }`}
          >
            {tab.label}
            {counts && (
              <sup className="ml-1 text-[0.6rem] tracking-normal text-muted">
                {counts[tab.slug] ?? 0}
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
