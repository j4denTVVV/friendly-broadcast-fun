/** Tiny synthesized sound-effects kit (WebAudio, no assets). Browser only. */
type Sfx = "hover" | "clank" | "denied" | "reveal" | "glitch" | "whisper";
const MUTE_KEY = "ps-sfx-muted";
let ctx: AudioContext | null = null;
let lastHover = 0;

export function sfxMuted() {
  try { return window.localStorage.getItem(MUTE_KEY) === "1"; } catch { return false; }
}
export function setSfxMuted(m: boolean) {
  try { window.localStorage.setItem(MUTE_KEY, m ? "1" : "0"); } catch { /* ignore */ }
}

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(c: AudioContext, freq: number, dur: number, type: OscillatorType, vol: number, at = 0, slideTo?: number) {
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(c: AudioContext, dur: number, vol: number, freq: number, at = 0, q = 1) {
  const t = c.currentTime + at;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const s = c.createBufferSource();
  s.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  f.Q.value = q;
  const g = c.createGain();
  g.gain.value = vol;
  s.connect(f).connect(g).connect(c.destination);
  s.start(t);
}

export function playSfx(name: Sfx) {
  if (typeof window === "undefined" || sfxMuted()) return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches && name === "hover") return;
  const c = ac();
  if (!c) return;
  switch (name) {
    case "hover": {
      const now = performance.now();
      if (now - lastHover < 70) return;
      lastHover = now;
      tone(c, 1800, 0.03, "square", 0.012);
      break;
    }
    case "click":
      noise(c, 0.05, 0.25, 2400, 0, 3);
      tone(c, 220, 0.08, "triangle", 0.06, 0, 120);
      break;
    case "clank":
      noise(c, 0.5, 0.5, 600, 0, 2);
      tone(c, 90, 0.6, "sawtooth", 0.08, 0, 45);
      tone(c, 410, 0.4, "triangle", 0.04, 0.02);
      noise(c, 0.3, 0.3, 1500, 0.18, 6);
      break;
    case "denied":
      tone(c, 140, 0.18, "square", 0.05);
      tone(c, 110, 0.25, "square", 0.05, 0.2);
      break;
    case "reveal":
      [523, 659, 784, 1047].forEach((f, i) => tone(c, f, 0.5, "triangle", 0.06, i * 0.08));
      noise(c, 0.6, 0.08, 6000, 0.1, 0.7);
      break;
    case "glitch":
      for (let i = 0; i < 6; i++) tone(c, 200 + Math.random() * 2000, 0.04, "square", 0.025, i * 0.045);
      break;
    case "whisper":
      noise(c, 1.6, 0.18, 900, 0, 0.6);
      tone(c, 55, 2.2, "sine", 0.09, 0, 41);
      tone(c, 58.3, 2.2, "sine", 0.06, 0);
      break;
  }
}

/** Global UI sounds: soft tick on hover, latch click on press. */
export function installUiSfx() {
  const isTarget = (el: EventTarget | null) =>
    el instanceof Element ? el.closest("a,button,[role=tab]") : null;
  let lastEl: Element | null = null;
  const over = (e: Event) => {
    const t = isTarget(e.target);
    if (t && t !== lastEl) playSfx("hover");
    lastEl = t;
  };
  const down = (e: Event) => { if (isTarget(e.target)) playSfx("click"); };
  document.addEventListener("pointerover", over);
  document.addEventListener("pointerdown", down);
  return () => {
    document.removeEventListener("pointerover", over);
    document.removeEventListener("pointerdown", down);
  };
}
