import { useEffect, useState } from "react";
import { playSfx } from "@/lib/sfx";
import { createPortal } from "react-dom";
import rust from "@/assets/texture-rust.jpg";
import { isAdminView } from "@/lib/roster";

type Phase = "idle" | "closing" | "scanning" | "opening";

const normalLines = [
  "> INITIATING ACCESS REQUEST",
  "> CLEARANCE LEVEL: VISITOR",
  "> SCANNING...",
  "> AUTHORIZATION GRANTED",
];

// "Who's inside?" — the gate resists before it gives way.
const hardLines = [
  "> INITIATING ACCESS REQUEST",
  "> CLEARANCE LEVEL: VISITOR",
  "> LOCK JAMMED — ACCESS DENIED",
  "> FORCING BOLT...",
  "> BOLT RESISTING...",
  "> OVERRIDE ACCEPTED",
];

/** Cinematic security-door transition. `hard` makes the gate rattle and resist. */
export function DoorTransition({
  active,
  onComplete,
  hard = false,
}: {
  active: boolean;
  onComplete: () => void;
  hard?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [admin, setAdmin] = useState(false);
  const lines = hard ? hardLines : normalLines;
  useEffect(() => setAdmin(isAdminView()), [active]);

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      setStep(0);
      return;
    }
    const gap = hard ? 420 : 300;
    setPhase("closing");
    playSfx("clank");
    setStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("scanning"), 700));
    lines.forEach((_, i) => timers.push(setTimeout(() => setStep(i + 1), 800 + i * gap)));
    const openAt = 800 + lines.length * gap + 250;
    timers.push(
      setTimeout(() => {
        setPhase("opening");
        playSfx(hard ? "reveal" : "clank");
        onComplete();
      }, openAt),
    );
    timers.push(setTimeout(() => setPhase("idle"), openAt + 1400));
    return () => timers.forEach(clearTimeout);
  }, [active, onComplete, hard, lines]);

  if (phase === "idle") return null;

  const shut = phase === "closing" || phase === "scanning";
  const rattling = hard && phase === "scanning";
  const denied = hard && step >= 3 && step < lines.length;

  const doorBase =
    "absolute inset-y-0 w-1/2 bg-background transition-transform duration-[1100ms] ease-[cubic-bezier(0.8,0,0.15,1)] overflow-hidden";

  const Door = ({ side }: { side: "left" | "right" }) => (
    <div
      className={`${doorBase} ${side === "left" ? "left-0 border-r" : "right-0 border-l"} border-rust-deep/70 ${
        phase === "closing" ? `gate-close-${side}` : ""
      } ${rattling ? (side === "left" ? "gate-rattle-l" : "gate-rattle-r") : ""}`}
      style={{
        transform: shut ? "translateX(0)" : side === "left" ? "translateX(-101%)" : "translateX(101%)",
        backgroundImage: `linear-gradient(${side === "left" ? 90 : 270}deg, rgba(0,0,0,0.8), rgba(0,0,0,0.35)), url(${rust})`,
        backgroundSize: "cover",
      }}
    >
      {/* bars */}
      <div className="absolute inset-0 flex justify-around px-6 opacity-60">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="h-full w-2 bg-gradient-to-r from-black/70 via-foreground/15 to-black/70" />
        ))}
      </div>
      {/* hazard strip */}
      <div className="absolute inset-x-0 top-[46%] h-6 opacity-80 [background:repeating-linear-gradient(-45deg,var(--rust)_0_14px,#0b0b0b_14px_28px)]" />
      {/* bolt */}
      <div
        className={`absolute top-[46%] h-6 w-10 -translate-y-0 bg-foreground/80 shadow-[0_0_18px_var(--rust)] ${
          side === "left" ? "right-0" : "left-0"
        } ${rattling ? "gate-bolt" : ""}`}
      />
    </div>
  );

  return createPortal(
    <div className={`fixed inset-0 z-[100] ${rattling ? "gate-quake" : ""}`} aria-hidden>
      <Door side="left" />
      <Door side="right" />
      {phase === "opening" ? <div className="gate-flash pointer-events-none absolute inset-0" /> : null}
      {phase === "scanning" ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`panel corner-marks gate-panel w-[min(92vw,28rem)] p-6 ${denied ? "gate-panel-denied" : ""}`}
          >
            <div className="mb-4 h-px w-full animate-sweep bg-gradient-to-r from-transparent via-rust to-transparent" />
            {lines.slice(0, step).map((l) => {
              const isLevel = l.includes("CLEARANCE LEVEL");
              const isBad = l.includes("DENIED") || l.includes("RESISTING");
              const tone = isLevel && admin ? "text-success" : isBad ? "text-destructive" : "text-warning";
              return (
                <p key={l} className={`gate-line font-mono text-[11px] tracking-[0.18em] ${tone}`}>
                  {isLevel && admin ? "> CLEARANCE LEVEL: ADMIN" : l}
                </p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
