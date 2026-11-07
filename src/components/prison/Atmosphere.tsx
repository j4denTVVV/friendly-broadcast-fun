import { useEffect, useRef } from "react";

/** Lightweight fixed atmosphere: sparse dust, faint scanlines and a vignette. */
export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let previous = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const count = Math.min(42, Math.round(width / 32));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.08,
      vy: -Math.random() * 0.12 - 0.02,
      alpha: Math.random() * 0.22 + 0.04,
    }));
    const dustColor = getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim();

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize, { passive: true });

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (document.hidden || time - previous < 33) return;
      previous = time;
      context.clearRect(0, 0, width, height);
      context.fillStyle = dustColor;
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.y < -5) { particle.y = height + 5; particle.x = Math.random() * width; }
        if (particle.x < -5) particle.x = width + 5;
        if (particle.x > width + 5) particle.x = -5;
        context.globalAlpha = particle.alpha;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-20">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-35" />
      <div className="media-scanlines absolute inset-0 opacity-[0.07]" />
      <div className="absolute inset-0 opacity-70" style={{ background: "var(--gradient-vignette)" }} />
    </div>
  );
}
