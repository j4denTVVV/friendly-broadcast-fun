import { useEffect, useState } from "react";
import { launch } from "@/config/prison";
import { ClassifiedPanel, DataRow } from "./Classified";

function useCountdown(targetIso: string | null) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!targetIso) return;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!targetIso || now === null) return null;
  const diff = Math.max(0, new Date(targetIso).getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="panel corner-marks animate-siren flex flex-col items-center px-4 py-5 sm:px-8">
      <span key={value} className="animate-tick font-display text-4xl leading-none tabular-nums sm:text-6xl">
        {value}
      </span>
      <span className="label-mono mt-2">{label}</span>
    </div>
  );
}

/**
 * Launch status display. While the exact date is unannounced this shows the
 * mystery placeholder; flipping `launch.exactDateAnnounced` + `targetIso`
 * in src/config/prison.ts turns it into a real countdown with no other edits.
 */
export function Lockdown() {
  const countdown = useCountdown(launch.exactDateAnnounced ? launch.targetIso : null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="panel grain vignette animate-breathe relative overflow-hidden p-8 sm:p-12">
        <span className="label-mono text-rust">Launch window</span>
        {countdown ? (
          <>
            <p className="mt-4 font-display text-2xl tracking-[0.2em] sm:text-3xl">
              The gates open in
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-4">
              <Unit value={String(countdown.days).padStart(2, "0")} label="Days" />
              <Unit value={String(countdown.hours).padStart(2, "0")} label="Hours" />
              <Unit value={String(countdown.minutes).padStart(2, "0")} label="Minutes" />
              <Unit value={String(countdown.seconds).padStart(2, "0")} label="Seconds" />
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-[16vw] leading-[0.78] font-bold sm:text-[9rem]">
              {launch.window}
            </p>
            <p className="font-display text-[16vw] leading-[0.78] font-bold text-rust sm:text-[9rem]">
              {launch.year}
            </p>
            <div className="mt-8 inline-flex items-center gap-3 border border-border bg-background/70 px-4 py-2">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-warning" />
              <span className="animate-flicker font-mono text-[11px] tracking-[0.3em] text-warning uppercase">
                Date to be announced
              </span>
            </div>
          </>
        )}
      </div>

      <ClassifiedPanel title="Facility record">
        <DataRow label="Project" value="PRISON STREAM" tone="ok" />
        <DataRow label="Launch window" value={`${launch.window} ${launch.year}`} tone="ok" />
        <DataRow label="Exact date" value={launch.dateLabel} tone="muted" />
        <DataRow label="Exact time" value={launch.timeLabel} tone="muted" />
        <DataRow label="Status" value={launch.status} tone="warn" />
        <p className="mt-6 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-muted-foreground uppercase">
          The exact date? That information is currently behind locked doors.
        </p>
      </ClassifiedPanel>
    </div>
  );
}
