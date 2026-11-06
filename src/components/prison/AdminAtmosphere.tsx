import { useEffect, useState } from "react";
import { playSfx } from "@/lib/sfx";

const WHISPERS = [
  "we can see you",
  "turn back",
  "this terminal is watched",
  "your location has been logged",
  "nobody leaves",
  "they never came back either",
];

/** Creepy "keep out" intro shown when the control room opens. Presentation only. */
export function AdminIntro() {
  const [show, setShow] = useState(true);
  const [line, setLine] = useState(0);
  const [ip, setIp] = useState("");
  useEffect(() => {
    setIp(`${(Math.random() * 223 + 10) | 0}.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}.${(Math.random() * 255) | 0}`);
    playSfx("whisper");
    const g = window.setTimeout(() => playSfx("glitch"), 900);
    const iv = window.setInterval(() => setLine((l) => (l + 1) % WHISPERS.length), 520);
    const t = window.setTimeout(() => setShow(false), 3600);
    return () => { window.clearTimeout(t); window.clearTimeout(g); window.clearInterval(iv); };
  }, []);
  if (!show) return null;
  return (
    <div aria-hidden className="admin-intro fixed inset-0 z-[70] flex flex-col items-center justify-center gap-5 bg-background">
      <div className="admin-intro-scan" />
      <div className="admin-intro-interference" />
      <div className="admin-intro-vignette" />
      <div className="admin-intro-eye" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.4em] text-signal">Signal intercepted / unauthorised terminal</p>
      <h2 className="admin-intro-title relative font-display text-6xl uppercase sm:text-9xl" data-text="Keep out">Keep out</h2>
      <p className="relative font-mono text-xs uppercase text-muted-foreground">You are not supposed to be here<span className="admin-cursor">_</span></p>
      <p key={line} className="admin-whisper relative font-mono text-[11px] lowercase tracking-[0.5em] text-signal/80">{WHISPERS[line]}</p>
      <p className="absolute bottom-6 left-6 font-mono text-[10px] uppercase text-muted-foreground/70">trace: {ip || "…"} · logged</p>
      <p className="absolute bottom-6 right-6 font-mono text-[10px] uppercase text-signal/70 admin-rec">● rec</p>
    </div>
  );
}
