'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

/**
 * Изображение товара с переключателем «свет вкл/выкл».
 * Выключенный свет: тёплый полумрак — затемнение по краям, мягкое пятно
 * света на изделии, лёгкая тёплая подсветка. Включение — с микро-миганием
 * лампы (Web Animations API), чтобы выглядело живо и реалистично.
 */
export default function ProductLight({
  cover,
  hover,
  alt,
  priority = false,
  badgeLabel,
  badgeSold = false,
  lightLabel = 'Свет',
}: {
  cover: string;
  hover?: string;
  alt: string;
  priority?: boolean;
  badgeLabel?: string | null;
  badgeSold?: boolean;
  lightLabel?: string;
}) {
  const [lit, setLit] = useState(true);
  const imgRef = useRef<HTMLDivElement>(null);

  const toggle = (e: React.MouseEvent) => {
    // кнопка внутри ссылки — не даём перейти на страницу товара
    e.preventDefault();
    e.stopPropagation();
    const next = !lit;
    setLit(next);
    if (next && imgRef.current) {
      // мигание лампы при включении
      try {
        imgRef.current.animate(
          [
            { filter: 'brightness(0.5) saturate(0.85)' },
            { filter: 'brightness(1.35) saturate(1.06)', offset: 0.18 },
            { filter: 'brightness(0.78)', offset: 0.42 },
            { filter: 'brightness(1.18)', offset: 0.66 },
            { filter: 'brightness(0.95)', offset: 0.84 },
            { filter: 'brightness(1)' },
          ],
          { duration: 640, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
        );
      } catch {}
    }
  };

  return (
    <div className="grain relative aspect-[4/5] overflow-hidden bg-bone-dark">
      {/* фото (яркость гасится плавно при выключении света) */}
      <div
        ref={imgRef}
        className="absolute inset-0 transition-[filter] duration-700 ease-out"
        style={{
          filter: lit
            ? 'none'
            : 'brightness(0.5) contrast(1.06) saturate(0.82) sepia(0.12)',
        }}
      >
        <Image
          src={cover}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`img-zoom object-cover ${
            hover ? 'transition-opacity duration-700 group-hover:opacity-0' : ''
          }`}
        />
        {hover && (
          <Image
            src={hover}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            aria-hidden
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
      </div>

      {/* затемнение по краям — «пятно света» на изделии */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: lit ? 0 : 1,
          background:
            'radial-gradient(118% 86% at 50% 41%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.30) 54%, rgba(6,4,2,0.70) 84%)',
        }}
      />
      {/* тёплое свечение лампы на изделии */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen transition-opacity duration-700 ease-out"
        style={{
          opacity: lit ? 0 : 1,
          background:
            'radial-gradient(54% 42% at 50% 40%, rgba(255,178,92,0.24), rgba(255,148,58,0.06) 55%, rgba(0,0,0,0) 72%)',
        }}
      />

      {badgeLabel && (
        <span
          className={`absolute left-3 top-3 z-10 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] ${
            badgeSold ? 'bg-ink/85 text-bone' : 'bg-bone/85 text-ink'
          }`}
        >
          {badgeLabel}
        </span>
      )}

      {/* переключатель света */}
      <button
        type="button"
        onClick={toggle}
        aria-label={lightLabel}
        aria-pressed={!lit}
        title={lightLabel}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full ring-1 backdrop-blur-sm transition-all duration-300 active:scale-90 ${
          lit
            ? 'bg-black/25 text-amber-200 ring-amber-200/40 shadow-[0_0_16px_2px_rgba(255,190,90,0.5)]'
            : 'bg-black/45 text-bone/55 ring-white/15 hover:text-bone/80'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill={lit ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 18h6" fill="none" />
          <path d="M10 21h4" fill="none" />
          <path d="M12 3a6 6 0 0 0-3.8 10.65c.5.42.8 1.02.8 1.85h6c0-.83.3-1.43.8-1.85A6 6 0 0 0 12 3z" />
        </svg>
      </button>
    </div>
  );
}
