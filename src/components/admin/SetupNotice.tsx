export default function SetupNotice() {
  return (
    <div className="mx-auto max-w-xl border hairline bg-bone-dark p-8">
      <h1 className="font-display text-2xl">База данных не подключена</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Админка работает на Supabase — без ключей она не может ни читать товары,
        ни сохранять их. Сайт при этом открывается и показывает демо-товары.
      </p>
      <ol className="mt-6 space-y-3 text-sm text-ink-soft">
        <li>
          <span className="text-muted">1.</span> Создайте проект на{' '}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            supabase.com
          </a>{' '}
          (регион Frankfurt).
        </li>
        <li>
          <span className="text-muted">2.</span> SQL Editor → выполните файл{' '}
          <code className="bg-sand px-1.5 py-0.5 text-xs">supabase/schema.sql</code>.
        </li>
        <li>
          <span className="text-muted">3.</span> Project Settings → API → скопируйте
          <code className="mx-1 bg-sand px-1.5 py-0.5 text-xs">Project URL</code> и
          <code className="mx-1 bg-sand px-1.5 py-0.5 text-xs">anon public</code> в файл{' '}
          <code className="bg-sand px-1.5 py-0.5 text-xs">.env.local</code>.
        </li>
        <li>
          <span className="text-muted">4.</span> Authentication → Users → Add user
          (ваш email и пароль, галочка Auto Confirm).
        </li>
        <li>
          <span className="text-muted">5.</span> Перезапустите{' '}
          <code className="bg-sand px-1.5 py-0.5 text-xs">npm run dev</code>.
        </li>
      </ol>
      <p className="mt-6 text-xs text-muted">
        Подробнее — файл SETUP-RU.md в папке проекта.
      </p>
    </div>
  );
}
