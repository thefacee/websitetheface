export default function Marquee({ text }: { text: string }) {
  const items = Array.from({ length: 4 });
  return (
    <div className="marquee border-y hairline py-4">
      {[0, 1].map((track) => (
        <div className="marquee__track" key={track} aria-hidden={track === 1}>
          {items.map((_, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.3em] text-muted"
            >
              {text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
