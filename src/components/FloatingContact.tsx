'use client';

import { useEffect, useState } from 'react';

/**
 * Кнопка «написать» в углу экрана. Появляется после первого экрана,
 * чтобы не перекрывать заголовок, и прячется, когда человек уже в форме.
 */
export default function FloatingContact({
  whatsapp,
  label,
}: {
  whatsapp: string;
  label: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2.5 rounded-full bg-ink px-5 text-bone shadow-lg transition-all duration-500 hover:bg-clay-dark ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.3z" />
        <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.3-1.3-2.8-1.3-4.4 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.6 8.3-8.1 8.3z" />
      </svg>
      <span className="hidden text-[0.78rem] uppercase tracking-[0.1em] sm:inline">{label}</span>
    </a>
  );
}
