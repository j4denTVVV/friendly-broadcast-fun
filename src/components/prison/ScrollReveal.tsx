import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Fades sections and cards in as they scroll into view. Presentation only. */
export function ScrollReveal() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("sr-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    const t = setTimeout(() => {
      document.querySelectorAll("main section:not(:first-child), .panel").forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) return;
        el.classList.add("sr");
        (el as HTMLElement).style.setProperty("--sr-delay", `${(i % 4) * 70}ms`);
        io.observe(el);
      });
    }, 60);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [path]);
  return null;
}
