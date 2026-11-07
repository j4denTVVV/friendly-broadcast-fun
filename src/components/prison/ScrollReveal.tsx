import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Opt-in scroll reveals; dynamic controls and admin panels are never hidden. */
export function ScrollReveal() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("sr-in");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );
    const frame = requestAnimationFrame(() => {
      document.querySelectorAll("[data-scroll-reveal]").forEach((element, index) => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
        element.classList.add("sr");
        (element as HTMLElement).style.setProperty("--sr-delay", `${(index % 3) * 60}ms`);
        observer.observe(element);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [path]);
  return null;
}
