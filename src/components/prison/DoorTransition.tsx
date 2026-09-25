import { useEffect, useState } from "react";
import rust from "@/assets/texture-rust.jpg";

type Phase = "idle" | "closing" | "scanning" | "opening";

const lines = [
  "> INITIATING ACCESS REQUEST",
  "> CLEARANCE LEVEL: VISITOR",
  "> SCANNING...",
  "> AUTHORIZATION GRANTED",
];

/** Cinematic security-door transition used by ENTER THE PRISON. */
export function DoorTransition({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      setStep(0);
      return;
    }
    setPhase("closing");
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase("scanning"), 700));
    lines.forEach((_, i) => timers.push(setTimeout(() => setStep(i + 1), 800 + i * 320)));
    timers.push(
      setTimeout(() => {
        setPhase("opening");
        onComplete();
      }, 800 + lines.length * 320 + 200),
    );
    timers.push(setTimeout(() => setPhase("idle"), 800 + lines.length * 320 + 1600));
    return () => timers.forEach(clearTimeout);
  }, [active, onComplete]);

  if (phase === "idle") return null;

  const doorTransform =
    phase === "closing" || phase === "scanning" ? "translateX(0)" : "translateX(-101%)";
  const doorTransformRight =
    phase === "closing" || phase === "scanning" ? "translateX(0)" : "translateX(101%)";

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden>
      <div
        className="absolute inset-y-0 left-0 w-1/2 border-r border-rust-deep/60 bg-background transition-transform duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{
          transform: doorTransform,
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.75), rgba(0,0,0,0.35)), url(${rust})`,
          backgroundSize: "cover",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 border-l border-rust-deep/60 bg-background transition-transform duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{
          transform: doorTransformRight,
          backgroundImage: `linear-gradient(270deg, rgba(0,0,0,0.75), rgba(0,0,0,0.35)), url(${rust})`,
          backgroundSize: "cover",
        }}
      />
      {phase === "scanning" ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="panel corner-marks w-[min(92vw,26rem)] p-6">
            <div className="mb-4 h-px w-full animate-sweep bg-gradient-to-r from-transparent via-rust to-transparent" />
            {lines.slice(0, step).map((l) => (
              <p key={l} className="font-mono text-[11px] tracking-[0.18em] text-warning">
                {l}
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
