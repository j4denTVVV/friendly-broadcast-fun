import { Link } from "@tanstack/react-router";
import { navLinks } from "./SiteHeader";
import { launch, officialSocials } from "@/config/prison";

export function SiteFooter() {
  return (
    <footer className="grain relative mt-24 border-t border-border bg-card/30">
      <div className="hazard-strip h-[3px] w-full opacity-25" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-[13vw] leading-[0.85] font-bold text-foreground/90 sm:text-[9vw]">
          Prison Stream
        </h2>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-rust">
              {launch.window} {launch.year}
            </p>
            <p className="mt-2 font-display text-lg tracking-[0.2em] text-muted-foreground">
              The gates are opening.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-rust"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/connect"
              className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-rust"
            >
              Socials
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <span className="label-mono">© 2026 Prison Stream</span>
          <span className="label-mono">
            {officialSocials.length === 0
              ? "OFFICIAL CHANNELS: PENDING VERIFICATION"
              : "OFFICIAL CHANNELS: LISTED"}
          </span>
        </div>
      </div>
    </footer>
  );
}
