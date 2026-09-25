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
    <div className="pt-24">
      <SystemTicker />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-rust" />
          <span className="label-mono text-rust">{kicker}</span>
        </div>
        <h1 className="text-[12vw] leading-[0.85] font-bold sm:text-7xl">{title}</h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
        ) : null}
        <div className="mt-12">{children}</div>
      </section>
    </div>
  );
}
