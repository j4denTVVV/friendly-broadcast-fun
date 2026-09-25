import { Link } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";
import type { RosterEntry } from "@/config/prison";
import { terms } from "@/config/prison";

export function FileCard({ entry, index = 0 }: { entry: RosterEntry; index?: number }) {
  const revealed = entry.revealed;

  return (
    <Link
      to="/roster/$fileId"
      params={{ fileId: entry.file }}
      className="panel corner-marks grain group relative block overflow-hidden transition-colors hover:border-rust"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div className="absolute inset-y-0 -left-1/3 w-1/3 animate-sweep bg-gradient-to-r from-transparent via-foreground/[0.07] to-transparent" />
      </div>

      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-[0.22em] text-rust">
          {terms.profile.toUpperCase()} #{entry.file}
        </span>
        {revealed ? (
          <ShieldCheck className="h-3.5 w-3.5 text-warning" />
        ) : (
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>

      <div className="relative aspect-[3/4] overflow-hidden bg-background">
        {revealed && entry.image ? (
          <img
            src={entry.image}
            alt={entry.name ?? "Confirmed creator portrait"}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3">
            <div className="animate-flicker font-display text-5xl text-muted-foreground/25">
              ?
            </div>
            <span className="label-mono">Identity unknown</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)] opacity-60" />
      </div>

      <div className="space-y-2 px-4 py-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="label-mono">Identity</span>
          <span className="font-mono text-xs tracking-[0.16em]">
            {revealed ? (entry.name ?? "[REVEALED]") : "[CLASSIFIED]"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="label-mono">Status</span>
          <span className="font-mono text-xs tracking-[0.16em] text-rust">
            {revealed ? (entry.status ?? "CONFIRMED") : "CLASSIFIED"}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="label-mono">Access</span>
          <span className="font-mono text-xs tracking-[0.16em]">
            {revealed ? "AUTHORIZED" : "DENIED"}
          </span>
        </div>
      </div>
    </Link>
  );
}
