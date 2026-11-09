import { useEffect, useState } from "react";
import logo from "@/assets/ps-logo.png";

const KEY = "hasSeenPrisonStreamIntro";

export function WelcomeIntro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch { /* ignore */ }
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setShow(true);
    const exitAt = reduced ? 1400 : 2900;
    const t1 = window.setTimeout(() => setLeaving(true), exitAt);
    const t2 = window.setTimeout(() => setShow(false), exitAt + 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!show) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [show]);

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Welcome to Prison Stream"
      onClick={() => setShow(false)}
      className={`ps-intro fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-background ${leaving ? "ps-intro-exit" : ""}`}
    >
      <div className="ps-intro-glow" aria-hidden />
      <img src={logo} alt="Prison Stream" className="ps-intro-logo relative w-48 md:w-64" />
      <p className="ps-intro-tag relative mt-8 font-mono text-xs uppercase tracking-[0.6em] text-muted-foreground">Welcome to</p>
      <h1 className="ps-intro-title relative mt-3 font-display text-5xl uppercase md:text-7xl">
        Prison <span className="text-signal">Stream</span>
      </h1>
      <div className="ps-intro-line relative mt-5 h-px w-64 md:w-96" />
      <p className="ps-intro-skip absolute bottom-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Tap anywhere to skip</p>
    </div>
  );
}
