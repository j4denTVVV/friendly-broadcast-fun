import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** One full rattle cycle — keep in sync with the door keyframes in styles.css. */
const CYCLE_MS = 6400;
const BEATS_PER_CYCLE = 3;

const BARS = "repeating-linear-gradient(90deg, color-mix(in oklab, var(--steel) 92%, transparent) 0 9px, transparent 9px 52px)";

export function BreakoutDoor({ className }: { className?: string }) {
  const [impacts, setImpacts] = useState(0);
  const [fury, setFury] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setImpacts((n) => n + BEATS_PER_CYCLE), CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const status =
    impacts >= 12 ? "CONTAINMENT FAILING" : impacts >= 6 ? "BLOCK AGITATED" : "RESTLESS INSIDE";

  return (
    <div
      className={cn("ps-door ps-door-steel ps-door-alarm corner-marks grain relative select-none", className)}
      data-fury={fury ? "true" : "false"}
      onPointerEnter={() => setFury(true)}
      onPointerLeave={() => setFury(false)}
      onPointerDown={() => setFury(true)}
    >
      <div className="ps-door-hazard h-3 w-full" />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.24em] text-rust uppercase">
          Cell block C — main gate
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-rust" />
          {status}
        </span>
      </div>

      <div className="ps-door-slab relative min-h-[19rem] overflow-hidden sm:min-h-[22rem]">
        {/* the figure pressing against the gate */}
        <div className="ps-door-figure flex items-end justify-center">
          <div className="relative h-[68%] w-[34%] max-w-[13rem]">
            <div className="absolute inset-x-[26%] top-0 h-[26%] rounded-t-full bg-[oklch(0.09_0_0)] shadow-[0_0_28px_6px_color-mix(in_oklab,var(--rust)_22%,transparent)]" />
            <div className="absolute inset-x-0 bottom-0 h-[64%] rounded-t-[46%] bg-[oklch(0.09_0_0)]" />
            <div className="absolute inset-x-[30%] top-[4%] h-[16%] rounded-full bg-[color-mix(in_oklab,var(--rust)_28%,transparent)] blur-[3px]" />
          </div>
        </div>

        {/* the bars */}
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{ backgroundImage: BARS }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/55 via-transparent to-background/80" />

        {/* claw gouges forced into the steel */}
        <div className="ps-door-scratch pointer-events-none absolute inset-0">
          {[
            "left-[16%] top-[22%] h-[52%] w-[3px] rotate-[9deg]",
            "left-[22%] top-[26%] h-[46%] w-[2px] rotate-[6deg]",
            "left-[27%] top-[30%] h-[38%] w-[3px] rotate-[12deg]",
            "right-[18%] top-[28%] h-[48%] w-[3px] -rotate-[8deg]",
            "right-[24%] top-[34%] h-[40%] w-[2px] -rotate-[11deg]",
          ].map((pos) => (
            <span
              key={pos}
              className={cn(
                "absolute block bg-gradient-to-b from-transparent via-foreground/70 to-transparent",
                "shadow-[0_0_12px_2px_color-mix(in_oklab,var(--rust)_45%,transparent)]",
                pos,
              )}
            />
          ))}
        </div>

        {/* impact light + the steel flexing outward */}
        <div className="ps-door-bulge" />
        <div className="ps-door-flash" />

        {/* heavy slide bolt, rattling in its track */}
        <div className="ps-door-bolt pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-16 w-40 border-2 border-border bg-background/85">
            <div className="absolute inset-y-[30%] left-2 right-2 rounded-full bg-steel/70" />
            <div className="absolute inset-y-[30%] left-2 w-1/2 rounded-full bg-rust/70 shadow-[0_0_14px_2px_color-mix(in_oklab,var(--rust)_45%,transparent)]" />
            <div className="absolute -left-1 -top-1 h-3 w-3 rounded-full border border-border bg-card" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border border-border bg-card" />
            <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full border border-border bg-card" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-border bg-card" />
          </div>
        </div>

        <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-display text-lg tracking-[0.3em] text-foreground/70 uppercase sm:text-2xl">
          Do not approach the gate
        </p>
      </div>

      <div className="grid grid-cols-2 gap-px border-t border-border bg-border sm:grid-cols-4">
        {[
          ["Impacts logged", String(impacts).padStart(3, "0")],
          ["Last impact", "0.4s ago"],
          ["Gate integrity", "61%"],
          ["Hold", "NOT SECURE"],
        ].map(([k, v]) => (
          <div key={k} className="bg-card px-4 py-3">
            <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase">{k}</p>
            <p className="mt-1.5 font-mono text-xs tracking-[0.18em] text-foreground">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
