import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

/**
 * Low prison ambience: a slow minor drone, deep sub pulse, distant CCTV
 * static and occasional far-off cell-door clanks. Muted by default, never
 * autoplays, generated with WebAudio so no asset is required.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => stopRef.current?.(), []);

  const toggle = async () => {
    if (on) {
      stopRef.current?.();
      stopRef.current = null;
      setOn(false);
      return;
    }
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = ctxRef.current ?? new Ctx();
    ctxRef.current = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0;

    // gentle room reverb so everything sounds far away, down a corridor
    const convolver = ctx.createConvolver();
    const irLen = ctx.sampleRate * 2.4;
    const ir = ctx.createBuffer(2, irLen, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const ch = ir.getChannelData(c);
      for (let i = 0; i < irLen; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.6);
      }
    }
    convolver.buffer = ir;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    convolver.connect(wet).connect(ctx.destination);
    master.connect(ctx.destination);
    master.connect(convolver);

    const stopables: Array<{ stop: (t?: number) => void }> = [];

    // slow minor drone chord (D, F, A) — the "music" bed
    const drone = ctx.createGain();
    drone.gain.value = 0.18;
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = "lowpass";
    droneFilter.frequency.value = 360;
    drone.connect(droneFilter).connect(master);

    for (const [freq, detune, gain] of [
      [36.7, 0, 0.9],
      [43.65, -6, 0.55],
      [55, 5, 0.45],
      [73.4, 3, 0.3],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      const g = ctx.createGain();
      g.gain.value = gain;
      osc.connect(g).connect(drone);
      osc.start();
      stopables.push(osc);
    }

    // very slow breathing of the drone
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.055;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.09;
    lfo.connect(lfoGain).connect(drone.gain);
    lfo.start();
    stopables.push(lfo);

    // distant CCTV static
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.35;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 480;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.07;
    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start();
    stopables.push(noise);

    // occasional far-off metal clank
    let clankTimer: ReturnType<typeof setTimeout> | undefined;
    const clank = () => {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 900 + Math.random() * 700;
      bp.Q.value = 9;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      src.connect(bp).connect(g).connect(convolver);
      src.start(t);
      src.stop(t + 1);
      clankTimer = setTimeout(clank, 14000 + Math.random() * 22000);
    };
    clankTimer = setTimeout(clank, 9000 + Math.random() * 9000);

    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.4);

    stopRef.current = () => {
      if (clankTimer) clearTimeout(clankTimer);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
      setTimeout(() => {
        for (const s of stopables) {
          try {
            s.stop();
          } catch {
            /* already stopped */
          }
        }
      }, 900);
    };
    setOn(true);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambience" : "Enable ambience"}
      className="hairline flex items-center gap-2 bg-card/60 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:border-rust hover:text-foreground"
    >
      {on ? <Volume2 className="h-3.5 w-3.5 animate-pulse-dot text-rust" /> : <VolumeX className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{on ? "Ambience on" : "Ambience off"}</span>
    </button>
  );
}
