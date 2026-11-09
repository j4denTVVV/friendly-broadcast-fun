import { useEffect, useState } from "react";
import { playSfx } from "@/lib/sfx";
import { createPortal } from "react-dom";
import rust from "@/assets/texture-rust.jpg";
import { isAdminView } from "@/lib/roster";

type Phase = "idle" | "closing" | "scanning" | "covered" | "opening";

const normalLines = [
  "> INITIATING ACCESS REQUEST",
  "> CLEARANCE LEVEL: VISITOR",
  "> VERIFYING DESTINATION",
  "> AUTHORIZATION GRANTED",
];

const hardLines = [
  "> INITIATING ACCESS REQUEST",
  "> CLEARANCE LEVEL: VISITOR",
  "> LOCK JAMMED — ACCESS DENIED",
  "> FORCING BOLT...",
  "> BOLT RESISTING...",
  "> OVERRIDE ACCEPTED",
];

/** Security-door transition. Navigation occurs only during the covered phase. */
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
      return;
    }

    const gap = hard ? 310 : 190;
    const coveredAt = 740 + lines.length * gap + 100;
    const openingAt = coveredAt + 320;
    const timers: ReturnType<typeof setTimeout>[] = [];

    setPhase("closing");
    setStep(0);
    // door sound removed
    timers.push(setTimeout(() => setPhase("scanning"), 680));
    lines.forEach((_, index) => timers.push(setTimeout(() => setStep(index + 1), 740 + index * gap)));
    timers.push(setTimeout(() => {
      setPhase("covered");
      onComplete();
    }, coveredAt));
    timers.push(setTimeout(() => {
      setPhase("opening");
      // door sound removed
    }, openingAt));
    timers.push(setTimeout(() => setPhase("idle"), openingAt + 1500));

    return () => timers.forEach(clearTimeout);
  }, [active, onComplete, hard, lines]);

  if (phase === "idle") return null;

  const shut = phase === "closing" || phase === "scanning" || phase === "covered";
  const rattling = hard && phase === "scanning";
  const denied = hard && step >= 3 && step < lines.length;
  const showTerminal = phase === "scanning" || phase === "covered";

  const door = (side: "left" | "right") => (
    <div
      key={side}
      className={`gate-door absolute inset-y-0 w-1/2 overflow-hidden ${side === "left" ? "left-0 border-r" : "right-0 border-l"} border-rust-deep/70 ${
        phase === "closing" ? `gate-close-${side}` : ""
      } ${rattling ? (side === "left" ? "gate-rattle-l" : "gate-rattle-r") : ""}`}
      style={{
        transform: shut ? "translateX(0)" : side === "left" ? "translateX(-101%)" : "translateX(101%)",
        backgroundImage: `url(${rust})`,
      }}
    >
      <div className="gate-bars">
        {Array.from({ length: 4 }).map((_, index) => <span key={index} />)}
      </div>
      <div className="gate-hazard" />
      <div className={`gate-lock ${side === "left" ? "right-0" : "left-0"} ${rattling ? "gate-bolt" : ""}`} />
    </div>
  );

  return createPortal(
    <div className={`fixed inset-0 z-[100] ${rattling ? "gate-quake" : ""}`} aria-hidden>
      {door("left")}
      {door("right")}
      {showTerminal ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <div className={`panel corner-marks gate-panel w-[min(92vw,29rem)] p-6 ${denied ? "gate-panel-denied" : ""}`}>
            <div className="mb-5 flex items-center justify-between border-b border-border pb-3 font-mono text-[9px] tracking-[0.22em] text-muted-foreground uppercase">
              <span>Gate control / {hard ? "Roster" : "Transit"}</span>
              <span className="text-rust">{phase === "covered" ? "Route secured" : "Processing"}</span>
            </div>
            <div className="space-y-2.5">
              {lines.slice(0, step).map((line) => {
                const isLevel = line.includes("CLEARANCE LEVEL");
                const isBad = line.includes("DENIED") || line.includes("RESISTING");
                const tone = isLevel && admin ? "text-success" : isBad ? "text-destructive" : "text-warning";
                return (
                  <p key={line} className={`gate-line font-mono text-[10px] leading-relaxed tracking-[0.15em] sm:text-[11px] ${tone}`}>
                    {isLevel && admin ? "> CLEARANCE LEVEL: ADMIN" : line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
