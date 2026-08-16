'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') return null;

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  const links = [
    { href: '/admin', label: 'Товары' },
    { href: '/admin/categories', label: 'Категории' },
    { href: '/admin/settings', label: 'Настройки' },
    { href: '/admin/inquiries', label: 'Заявки' },
  ];

  return (
    <header className="border-b hairline bg-bone-dark">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 md:px-8">
        <Link href="/admin" className="font-display text-lg uppercase tracking-[0.18em]">
          The Face
        </Link>
        <nav className="flex gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ? 'text-ink underline' : 'text-muted hover:text-ink'
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-5 text-sm">
          <Link href="/" target="_blank" className="text-muted hover:text-ink">
            Сайт ↗
          </Link>
          <button type="button" onClick={signOut} className="text-muted hover:text-ink">
            Выйти
          </button>
        </div>
      </div>
    </header>
  );
}
