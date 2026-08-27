'use client';

/**
 * Переключатель светлой/тёмной темы. Тема хранится в атрибуте data-theme
 * на <html> (его ставит скрипт в layout ещё до отрисовки) и в localStorage.
 * Иконка выбирается чистым CSS через dark:-вариант — без гидрационных рассинхронов.
 */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Светлая / тёмная тема"
      title="Светлая / тёмная тема"
      className={`inline-flex h-9 w-9 items-center justify-center text-muted transition-colors hover:text-ink ${className}`}
    >
      {/* Луна — видна в светлой теме (клик → тёмная) */}
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="dark:hidden"
        aria-hidden
      >
        <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
      </svg>
      {/* Солнце — видно в тёмной теме (клик → светлая) */}
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="hidden dark:block"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
