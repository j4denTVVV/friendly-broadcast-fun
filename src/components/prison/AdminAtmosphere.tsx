import { useEffect, useState } from "react";

/** Glitchy "keep out" intro shown when the control room opens. Presentation only. */
export function AdminIntro() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setShow(false), 2600);
    return () => window.clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div aria-hidden className="admin-intro fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-background">
      <div className="admin-intro-scan" />
      <p className="font-mono text-[10px] uppercase text-signal">Signal intercepted / unauthorised terminal</p>
      <h2 className="admin-intro-title font-display text-6xl uppercase sm:text-8xl" data-text="Keep out">Keep out</h2>
      <p className="font-mono text-xs uppercase text-muted-foreground">You are not supposed to be here<span className="admin-cursor">_</span></p>
    </div>
  );
}
