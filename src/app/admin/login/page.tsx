'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient, isSupabaseReady } from '@/lib/supabase/client';
import SetupNotice from '@/components/admin/SetupNotice';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) throw authError;
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message === 'Invalid login credentials'
            ? 'Неверный email или пароль.'
            : err.message
          : 'Не удалось войти'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseReady()) return <SetupNotice />;

  return (
    <div className="mx-auto max-w-sm pt-24">
      <h1 className="font-display text-3xl">The Face — Admin</h1>
      <p className="mt-2 text-sm text-muted">
        Войдите тем email и паролем, который вы создали в Supabase.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <div>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p className="text-sm text-clay-dark">{error}</p>}

        <button type="submit" className="btn btn-solid w-full" disabled={loading}>
          {loading ? '...' : 'Войти'}
        </button>

        <Link
          href="/admin/reset"
          className="block text-center text-xs text-muted underline hover:text-ink"
        >
          Забыли пароль?
        </Link>
      </form>
    </div>
  );
}
