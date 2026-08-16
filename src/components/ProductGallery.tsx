'use client';

import { useState } from 'react';

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const list = images.length > 0 ? images : ['/media/face-table-2.png'];
  const [active, setActive] = useState(0);

  const go = (step: number) =>
    setActive((prev) => (prev + step + list.length) % list.length);

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row md:gap-4">
      {list.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:w-20 md:shrink-0 md:flex-col md:overflow-visible">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square w-20 shrink-0 overflow-hidden bg-bone-dark transition-all duration-300 ${
                i === active ? 'opacity-100 ring-1 ring-ink' : 'opacity-50 hover:opacity-90'
              }`}
              aria-label={`${alt} — ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="grain group relative aspect-[4/5] flex-1 overflow-hidden bg-bone-dark">
        {list.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${src}-${i}`}
            src={src}
            alt={i === active ? alt : ''}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="←"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-bone/80 text-ink opacity-0 transition-opacity duration-300 hover:bg-bone group-hover:opacity-100"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="→"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-bone/80 text-ink opacity-0 transition-opacity duration-300 hover:bg-bone group-hover:opacity-100"
            >
              →
            </button>
            <span className="absolute bottom-3 right-3 bg-bone/80 px-2 py-1 text-[10px] tracking-[0.14em] text-ink">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
