import { useMemo } from "react";

const COLORS = ["var(--rust)", "var(--foreground)", "var(--warning)", "var(--signal)"];

/** One-shot confetti burst. Re-mount (change key) to fire again. */
export function Confetti({ count = 90 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        x: (Math.random() - 0.5) * 900,
        y: -(Math.random() * 520 + 180),
        r: Math.random() * 900 - 450,
        d: Math.random() * 0.25,
        w: 6 + Math.random() * 6,
        c: COLORS[i % COLORS.length],
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.i}
          className="confetti-piece absolute"
          style={{
            width: p.w,
            height: p.w * 0.45,
            background: p.c,
            animationDelay: `${p.d}s`,
            ["--cx" as string]: `${p.x}px`,
            ["--cy" as string]: `${p.y}px`,
            ["--cr" as string]: `${p.r}deg`,
          }}
        />
      ))}
    </div>
  );
}
