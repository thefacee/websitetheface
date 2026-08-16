import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'The Face — Admin',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bone">
      <AdminNav />
      <div className="mx-auto max-w-[1200px] px-5 py-10 md:px-8">{children}</div>
    </div>
  );
}
