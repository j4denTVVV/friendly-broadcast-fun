import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DoorTransition } from "./DoorTransition";
import { SoundToggle } from "./SoundToggle";
import { StatusDot } from "./Classified";
import { SiteBanner } from "./SiteBanner";
import logoAsset from "@/assets/ps-logo.png";

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/roster", label: "Who's Inside?" },
  { to: "/about", label: "About" },
  { to: "/trailer", label: "Watch" },
  { to: "/connect", label: "Socials" },
  { to: "/live", label: "Live" },
  { to: "/reveals", label: "Reveals" },
  { to: "/bulletin", label: "Bulletin" },
  { to: "/apply", label: "Apply" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const destination = useRef<(typeof navLinks)[number]["to"] | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const startGate = (event: MouseEvent<HTMLAnchorElement>, to: (typeof navLinks)[number]["to"]) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    if (entering) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void navigate({ to });
      return;
    }
    destination.current = to;
    setEntering(true);
  };

  const finishGate = useCallback(() => {
    const to = destination.current;
    destination.current = null;
    if (to) void navigate({ to });
    resetTimer.current = setTimeout(() => setEntering(false), 1400);
  }, [navigate]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <DoorTransition active={entering} onComplete={finishGate} />
      <SiteBanner />
      <div className="hazard-strip h-[3px] w-full opacity-30" />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" onClick={(event) => startGate(event, "/")} className="group flex items-center gap-3">
          <img
            src={logoAsset}
            alt="Prison Stream emblem"
            className="h-9 w-auto opacity-90 transition-opacity group-hover:opacity-100"
          />
          <span className="font-display text-sm tracking-[0.35em] text-foreground uppercase">
            Prison Stream
          </span>
        </Link>


        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={(event) => startGate(event, l.to)}
              activeProps={{ className: "text-foreground border-rust" }}
              activeOptions={{ exact: l.to === "/" }}
              className="border-b border-transparent px-3 py-2 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase xl:flex">
            <StatusDot tone="live" /> System active
          </span>
          <SoundToggle />
          <Button variant="outline" size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="hairline bg-card/60 p-2 lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="grid grid-cols-2 gap-px border-t border-border bg-border lg:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={(event) => startGate(event, l.to)}
              className="bg-background px-4 py-4 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase active:bg-card"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
