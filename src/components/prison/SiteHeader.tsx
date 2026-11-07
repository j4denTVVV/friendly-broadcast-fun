import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
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

type Destination = (typeof navLinks)[number]["to"];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [entering, setEntering] = useState(false);
  const [hardGate, setHardGate] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const destination = useRef<Destination | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const isActive = (to: Destination) =>
    location.pathname === to || (to === "/roster" && location.pathname.startsWith("/roster/"));

  const startGate = (event: MouseEvent<HTMLAnchorElement>, to: Destination) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setOpen(false);
    if (entering) return;
    if (location.pathname === to) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void navigate({ to });
      return;
    }
    destination.current = to;
    setHardGate(to === "/roster");
    setEntering(true);
  };

  // Called only once the doors are completely closed. The next page is mounted
  // behind them, so visitors never watch old content turn into new content.
  const finishGate = useCallback(() => {
    const to = destination.current;
    destination.current = null;
    if (to) void navigate({ to });
    resetTimer.current = setTimeout(() => setEntering(false), 2100);
  }, [navigate]);

  return (
    <header data-scrolled={scrolled} className="site-header fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/88 backdrop-blur-lg">
      <DoorTransition active={entering} onComplete={finishGate} hard={hardGate} />
      <SiteBanner />
      <div className="hazard-strip h-[2px] w-full opacity-45" />
      <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-5 px-4 sm:px-6">
        <a href="/" onClick={(event) => startGate(event, "/")} className="group flex shrink-0 items-center gap-3" aria-label="Prison Stream home">
          <img src={logoAsset} alt="" className="brand-mark h-10 w-auto opacity-95" />
          <span className="hidden font-display text-sm tracking-[0.32em] text-foreground uppercase min-[380px]:inline">
            Prison Stream
          </span>
        </a>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={(event) => startGate(event, link.to)}
              aria-current={isActive(link.to) ? "page" : undefined}
              className="nav-link px-3 py-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-muted-foreground uppercase 2xl:flex">
            <StatusDot tone="live" /> System active
          </span>
          <SoundToggle />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="hairline bg-card/60 xl:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-menu max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-border bg-background px-4 py-4 xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-1 sm:grid-cols-2">
            {navLinks.map((link, index) => (
              <a
                key={link.to}
                href={link.to}
                onClick={(event) => startGate(event, link.to)}
                aria-current={isActive(link.to) ? "page" : undefined}
                className="mobile-menu-link flex items-center justify-between border-b border-border/70 px-3 py-4 font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase transition-colors hover:bg-card hover:text-foreground aria-[current=page]:text-rust"
              >
                <span>{link.label}</span>
                <span className="text-[9px] text-muted-foreground/60">{String(index + 1).padStart(2, "0")}</span>
              </a>
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-2xl px-3 pb-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">Restricted broadcast / Autumn 2026</p>
        </nav>
      ) : null}
    </header>
  );
}
