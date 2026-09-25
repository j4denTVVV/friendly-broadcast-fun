import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Redacted({ children }: { children?: ReactNode }) {
  return (
    <span className="redacted font-mono" title="CLASSIFIED">
      {children ?? "REDACTED"}
    </span>
  );
}

export function StatusDot({ tone = "muted" }: { tone?: "ok" | "warn" | "live" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        tone === "ok" && "bg-warning",
        tone === "warn" && "bg-rust",
        tone === "live" && "animate-pulse-dot bg-signal",
        tone === "muted" && "bg-muted-foreground/50",
      )}
    />
  );
}

export function DataRow({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "live" | "muted";
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 last:border-b-0">
      <span className="label-mono">{label}</span>
      <span className="flex items-center gap-2 font-mono text-xs tracking-[0.18em] text-foreground">
        <StatusDot tone={tone} />
        {value}
      </span>
    </div>
  );
}

export function ClassifiedPanel({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel corner-marks grain relative p-5 sm:p-6", className)}>
      {title ? (
        <div className="mb-4 flex items-center gap-3">
          <span className="label-mono text-rust">{title}</span>
          <span className="h-px flex-1 bg-border" />
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {kicker ? (
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-rust" />
          <span className="label-mono text-rust">{kicker}</span>
        </div>
      ) : null}
      <h2 className="text-3xl leading-none font-semibold sm:text-5xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
