import type { ReactNode } from "react";
import { SystemTicker } from "./SystemTicker";

export function PageShell({
  kicker,
  title,
  subtitle,
  children,
}: {
  kicker: string;
  title: string;
  subtitle?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="page-shell">
      <SystemTicker />
      <header className="page-masthead texture-concrete">
        <div className="relative mx-auto max-w-[90rem] px-4 sm:px-6">
          <div className="cine-rise mb-5 flex items-center gap-3">
            <span className="cine-line h-px w-10 bg-rust" />
            <span className="label-mono text-rust">{kicker}</span>
          </div>
          <h1 className="cine-rise cine-d1 cine-title page-title">{title}</h1>
          {subtitle ? <p className="cine-rise cine-d2 page-subtitle mt-6">{subtitle}</p> : null}
          <span className="page-index" aria-hidden>PRISON STREAM / RESTRICTED RECORD</span>
        </div>
      </header>
      <section className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 sm:py-16">
        <div className="cine-rise cine-d3">{children}</div>
      </section>
    </div>
  );
}
