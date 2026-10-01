import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

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
      <p className="font-mono text-[10px] uppercase text-destructive">Signal intercepted / unauthorised terminal</p>
      <h2 className="admin-intro-title font-display text-6xl uppercase sm:text-8xl" data-text="Keep out">Keep out</h2>
      <p className="font-mono text-xs uppercase text-muted-foreground">You are not supposed to be here<span className="admin-cursor">_</span></p>
    </div>
  );
}

/** Light music-box ambience with an eerie detune. Starts on first interaction. */
export function AdminAmbience() {
  const [on, setOn] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!on) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const ctx = ctxRef.current ?? new AudioContext();
      ctxRef.current = ctx;
      void ctx.resume();
      const master = ctx.createGain();
      master.gain.value = 0.12;
      const delay = ctx.createDelay();
      delay.delayTime.value = 0.42;
      const fb = ctx.createGain();
      fb.gain.value = 0.38;
      delay.connect(fb).connect(delay);
      delay.connect(master);
      master.connect(ctx.destination);
      const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 739.99];
      let step = 0;
      const tick = () => {
        const f = notes[(step * 3 + (step % 2)) % notes.length]! * (step % 8 === 7 ? 0.985 : 1);
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = f;
        o.detune.value = Math.sin(step) * 12;
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        o.connect(g);
        g.connect(master);
        g.connect(delay);
        o.start(t);
        o.stop(t + 1.7);
        step++;
        timer.current = window.setTimeout(tick, step % 4 === 0 ? 1100 : 550);
      };
      tick();
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      if (timer.current) window.clearTimeout(timer.current);
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, [on]);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-label={on ? "Mute control room ambience" : "Play control room ambience"}
      className="fixed bottom-4 left-4 z-[65] flex items-center gap-2 border-2 border-border bg-background px-3 py-2 font-mono text-[10px] uppercase text-foreground hover:border-destructive"
    >
      {on ? <Volume2 className="size-3.5 text-destructive" /> : <VolumeX className="size-3.5" />}
      {on ? "Ambience on" : "Ambience off"}
    </button>
  );
}
