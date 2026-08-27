'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Pos = { x: number; y: number };

const POS_KEY = 'theface-seal-pos';
const HINT_KEY = 'theface-seal-hint';
const SIZE = 118; // видимый размер печати, px

/**
 * Печать-стикер: «отклеивается» при захвате (приподнимается с тенью)
 * и перетаскивается мышью/пальцем в любое место страницы.
 * Позиция запоминается в браузере посетителя.
 */
export default function Sticker({ src, hint }: { src: string; hint?: string }) {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [lifted, setLifted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const dragging = useRef(false);
  const off = useRef<Pos>({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const w = window.innerWidth;
    let saved: Pos | null = null;
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {}
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      setPos({ x: Math.min(saved.x, Math.max(0, w - SIZE)), y: Math.max(0, saved.y) });
    } else {
      setPos(
        w >= 768
          ? { x: Math.round(w * 0.5 - SIZE / 2), y: 452 }
          : { x: w - SIZE - 16, y: 296 }
      );
    }
    try {
      if (!localStorage.getItem(HINT_KEY)) setShowHint(true);
    } catch {}
  }, []);

  const clamp = (p: Pos): Pos => {
    const doc = document.documentElement;
    const maxX = Math.max(0, (doc.scrollWidth || window.innerWidth) - SIZE);
    const maxY = Math.max(0, (doc.scrollHeight || window.innerHeight) - SIZE);
    return {
      x: Math.min(Math.max(0, p.x), maxX),
      y: Math.min(Math.max(0, p.y), maxY),
    };
  };

  const onDown = (e: React.PointerEvent) => {
    if (!pos) return;
    e.preventDefault();
    try {
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    } catch {}
    off.current = { x: e.pageX - pos.x, y: e.pageY - pos.y };
    dragging.current = true;
    setLifted(true);
    if (showHint) {
      setShowHint(false);
      try {
        localStorage.setItem(HINT_KEY, '1');
      } catch {}
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos(clamp({ x: e.pageX - off.current.x, y: e.pageY - off.current.y }));
  };

  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setLifted(false);
    setPos((p) => {
      if (p) {
        try {
          localStorage.setItem(POS_KEY, JSON.stringify(p));
        } catch {}
      }
      return p;
    });
  };

  if (!mounted || !pos) return null;

  return createPortal(
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label="The Face — Authentic & Unique"
      className="select-none"
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: SIZE,
        height: SIZE,
        zIndex: 30,
        touchAction: 'none',
        cursor: lifted ? 'grabbing' : 'grab',
        backgroundImage: `url(${src})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        transform: lifted ? 'scale(1.14) rotate(4deg)' : 'rotate(-7deg)',
        transition: 'transform .3s cubic-bezier(.2,.9,.3,1.35), filter .3s ease',
        filter: lifted
          ? 'drop-shadow(0 22px 26px rgba(24,16,6,.45))'
          : 'drop-shadow(0 9px 12px rgba(24,16,6,.30))',
        willChange: 'left, top, transform',
      }}
    >
      {showHint && hint && (
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: -30,
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            animation: 'seal-bob 1.6s ease-in-out infinite',
          }}
          className="rounded-full bg-ink/90 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-bone shadow-sm"
        >
          {hint}
        </span>
      )}
      <style>{`@keyframes seal-bob{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-4px)}}`}</style>
    </div>,
    document.body
  );
}
