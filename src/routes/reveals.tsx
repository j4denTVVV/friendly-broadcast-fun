import { useLiveGuests } from "@/lib/live-guests";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search, Lock, ShieldCheck, FileWarning } from "lucide-react";
import { PageShell } from "@/components/prison/PageShell";
import { clearanceOf, creatorDatabase, searchCreator } from "@/lib/roster";
import type { RosterEntry } from "@/config/prison";

export const Route = createFileRoute("/reveals")({
  head: () => ({
    meta: [
      { title: "The Reveals — Search the Prison Stream Database" },
      {
        name: "description",
        content:
          "Think you know who's inside? Search the Prison Stream clearance database by creator name and unseal confirmed files.",
      },
      { property: "og:title", content: "The Reveals — Prison Stream" },
      {
        property: "og:description",
        content: "Search the clearance database. Identity match or classified.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RevealsPage,
});

const SCAN_LINES = [
  "DATABASE ACCESS REQUESTED",
  "CONNECTING TO DATABASE...",
  "SEARCHING IDENTITIES...",
  "SCANNING RECORDS...",
  "MATCH ANALYSIS...",
  "VERIFYING DATABASE ENTRY...",
];

const STEP_MS = 620;

type Phase = "idle" | "scanning" | "match" | "classified" | "nomatch";

function Terminal({ lines }: { lines: string[] }) {
  return (
    <div className="relative mt-8 overflow-hidden border border-border bg-background/80 p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
        <div className="h-px w-full animate-sweep bg-rust/80" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_4px)] opacity-50" />
      <ul className="relative space-y-2 font-mono text-[11px] tracking-[0.24em] uppercase sm:text-xs">
        {lines.map((l, i) => (
          <li
            key={l}
            className="animate-rise text-muted-foreground"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="text-rust">&gt;</span> {l}
            {i === lines.length - 1 ? <span className="animate-flicker"> _</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialList({ entry }: { entry: RosterEntry }) {
  if (!entry.socials?.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {entry.socials.map((s) => (
        <li key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="hairline block px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-rust hover:text-rust"
          >
            {s.platform}
          </a>
        </li>
      ))}
    </ul>
  );
}

function FileUnseal({ entry }: { entry: RosterEntry }) {
  return (
    <div className="panel corner-marks grain animate-rise relative mt-8 overflow-hidden">
      <div className="hazard-strip h-1.5 w-full opacity-70" />
      <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,240px)_1fr] sm:p-8">
        <div className="relative aspect-[3/4] overflow-hidden border border-border bg-background">
          {entry.image ? (
            <img
              src={entry.image}
              alt={`${entry.name} — confirmed Prison Stream creator`}
              loading="lazy"
              className="h-full w-full animate-rise object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Lock className="h-7 w-7 text-muted-foreground/50" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.28)_0px,rgba(0,0,0,0.28)_1px,transparent_1px,transparent_4px)] opacity-50" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="label-mono text-rust">File {entry.file}</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h3 className="mt-3 text-3xl leading-none sm:text-4xl">{entry.name}</h3>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.24em] uppercase">
            <span className="border border-warning/50 bg-warning/10 px-3 py-1 text-warning">
              Confirmed
            </span>
            <span className="border border-rust/60 bg-rust/15 px-3 py-1 text-foreground">
              File unsealed
            </span>
            {entry.role ? (
              <span className="hairline px-3 py-1 text-muted-foreground">{entry.role}</span>
            ) : null}
          </div>
          {entry.bio ? (
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{entry.bio}</p>
          ) : null}
          <SocialList entry={entry} />
        </div>
      </div>
    </div>
  );
}

function GuestCard({ entry }: { entry: RosterEntry }) {
  return (
    <article className="panel corner-marks grain relative overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden border-b border-border bg-background">
        {entry.image ? (
          <img
            src={entry.image}
            alt={`${entry.name} — confirmed Prison Stream creator`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Lock className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.25)_0px,rgba(0,0,0,0.25)_1px,transparent_1px,transparent_4px)] opacity-45" />
      </div>
      <div className="p-5">
        <span className="label-mono text-rust">File {entry.file}</span>
        <h3 className="mt-2 text-xl leading-none">{entry.name}</h3>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.22em] uppercase">
          <span className="border border-warning/50 bg-warning/10 px-2.5 py-1 text-warning">
            Confirmed
          </span>
          <span className="border border-rust/60 bg-rust/15 px-2.5 py-1">File unsealed</span>
        </div>
        {entry.bio ? (
          <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-muted-foreground">
            {entry.bio}
          </p>
        ) : null}
        <SocialList entry={entry} />
      </div>
    </article>
  );
}

const STORAGE_KEY = "ps-unsealed-files";

function RevealsPage() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<RosterEntry | null>(null);
  const [attempted, setAttempted] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setGuests(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const persist = (files: string[]) => {
    setGuests(files);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    } catch {
      /* ignore */
    }
  };

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    if (!term || phase === "scanning") return;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAttempted(term);
    setResult(null);
    setStep(1);
    setPhase("scanning");

    for (let i = 2; i <= SCAN_LINES.length; i++) {
      timers.current.push(setTimeout(() => setStep(i), (i - 1) * STEP_MS));
    }

    timers.current.push(
      setTimeout(() => {
        const entry = searchCreator(term);
        if (!entry) {
          setPhase("nomatch");
          return;
        }
        if (clearanceOf(entry) === "CLASSIFIED") {
          setPhase("classified");
          return;
        }
        setResult(entry);
        setPhase("match");
        setGuests((prev) => {
          if (prev.includes(entry.file)) return prev;
          const next = [...prev, entry.file];
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
          return next;
        });
      }, SCAN_LINES.length * STEP_MS),
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("idle");
    setStep(0);
    setResult(null);
    setQuery("");
  };

  useLiveGuests();
  const db = creatorDatabase();
  const unsealed = guests
    .map((file) => db.find((c) => c.file === file))
    .filter((c): c is RosterEntry => Boolean(c));

  return (
    <PageShell
      kicker="Clearance database"
      title="The reveals"
      subtitle="Think you know who's inside? Search the clearance database. Confirmed files are unsealed on match — everything else stays classified."
    >
      <section className="panel corner-marks grain vignette relative overflow-hidden p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-rust" />
            <span className="label-mono text-rust">Search terminal</span>
            <span className="h-px w-8 bg-rust" />
          </div>
          <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
            Prison Stream identity records
          </p>

          <form onSubmit={runSearch} className="mt-8 space-y-4">
            <label htmlFor="creator-search" className="sr-only">
              Enter creator name
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="creator-search"
                value={query}
                onChange={(ev) => setQuery(ev.target.value)}
                placeholder="ENTER CREATOR NAME..."
                autoComplete="off"
                className="h-14 w-full border border-border bg-background/80 pr-4 pl-11 font-mono text-sm tracking-[0.18em] uppercase outline-none placeholder:text-muted-foreground/70 focus:border-rust sm:h-16 sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={phase === "scanning"}
              className="inline-flex h-14 w-full items-center justify-center gap-3 border border-rust bg-rust/15 px-6 font-mono text-[11px] tracking-[0.28em] uppercase transition-colors hover:bg-rust/30 disabled:opacity-50 sm:h-16 sm:w-auto sm:min-w-64"
            >
              {phase === "scanning" ? "Scanning..." : "Search database →"}
            </button>
          </form>

          {phase !== "idle" ? <Terminal lines={SCAN_LINES.slice(0, step)} /> : null}

          {phase === "match" && result ? (
            <div className="mt-8 animate-rise font-mono text-[11px] tracking-[0.26em] uppercase">
              <p className="text-warning">Identity match found</p>
              <p className="mt-2 text-muted-foreground">File found · Clearance verified</p>
              <p className="mt-1 text-foreground">File status: Confirmed</p>
            </div>
          ) : null}

          {phase === "nomatch" || phase === "classified" ? (
            <div className="mt-8 animate-rise border border-border bg-background/70 p-6">
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                {phase === "nomatch" ? (
                  <FileWarning className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
                <span className="font-mono text-[11px] tracking-[0.28em] uppercase">
                  {phase === "nomatch" ? "No match found" : "Record sealed"}
                </span>
              </div>
              <p className="mt-4 font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase">
                {phase === "nomatch" ? "Identity not found" : "Identity withheld"} · Status:
                Classified
              </p>
              <p className="mt-4 font-mono text-xs leading-loose text-muted-foreground">
                “THIS IDENTITY IS NOT CURRENTLY IN THE DATABASE.”
              </p>
              <p className="mt-3 label-mono">Query: {attempted}</p>
            </div>
          ) : null}
        </div>

        {phase === "match" && result ? (
          <div className="mx-auto max-w-4xl">
            <FileUnseal entry={result} />
          </div>
        ) : null}

        {phase !== "idle" && phase !== "scanning" ? (
          <div className="mt-8 text-center">
            <button
              onClick={reset}
              className="hairline px-5 py-2.5 font-mono text-[10px] tracking-[0.26em] uppercase text-muted-foreground transition-colors hover:border-rust hover:text-rust"
            >
              New search
            </button>
          </div>
        ) : null}
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-8 bg-rust" />
          <h2 className="text-2xl leading-none">Confirmed guests</h2>
          <span className="h-px flex-1 bg-border" />
          <span className="label-mono">{String(unsealed.length).padStart(2, "0")} unsealed</span>
        </div>

        {unsealed.length === 0 ? (
          <div className="panel grain p-8 text-center">
            <Lock className="mx-auto h-6 w-6 animate-flicker text-muted-foreground/50" />
            <p className="mt-4 font-mono text-[11px] tracking-[0.26em] text-muted-foreground uppercase">
              No files unsealed · Run a database search
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {unsealed.map((entry) => (
              <GuestCard key={entry.file} entry={entry} />
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
