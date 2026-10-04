import { useLiveGuests } from "@/lib/live-guests";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import heroImg from "@/assets/hero-corridor.jpg";
import { DoorTransition } from "@/components/prison/DoorTransition";
import { SystemTicker } from "@/components/prison/SystemTicker";
import { Lockdown } from "@/components/prison/Lockdown";
import { Reveal } from "@/components/prison/Reveal";
import { FileCard } from "@/components/prison/FileCard";
import { Button } from "@/components/ui/button";
import { ClassifiedPanel, DataRow, SectionHeading, StatusDot } from "@/components/prison/Classified";
import { getRosterFiles } from "@/lib/roster";
import { bulletins, launch, liveStreams, projectFile, terms, trailer, upcoming } from "@/config/prison";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PRISON STREAM — The Gates Are Opening | Autumn 2026" },
      {
        name: "description",
        content:
          "PRISON STREAM. Launch window Autumn 2026. Exact date classified, roster classified. Something is being built underground.",
      },
      { property: "og:title", content: "PRISON STREAM — The Gates Are Opening" },
      {
        property: "og:description",
        content: "Autumn 2026. Exact date classified. Who's inside?",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [entering, setEntering] = useState(false);
  useLiveGuests();
  const files = getRosterFiles().slice(0, 4);

  const onDoorsOpen = useCallback(() => {
    document.getElementById("facility")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => setEntering(false), 1800);
  }, []);

  return (
    <>
      <DoorTransition active={entering} onComplete={onDoorsOpen} />

      {/* HERO */}
      <section className="grain relative flex min-h-[88svh] items-center overflow-hidden border-b border-border">
        <img
          src={heroImg}
          alt="A heavy steel prison door standing ajar in a dark concrete corridor"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/65 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/60" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-8 sm:px-6 sm:pt-32 sm:pb-12">
          <div className="border-x-4 border-rust bg-background/60 backdrop-blur-[2px]">
            <div className="grid md:min-h-[560px] md:grid-cols-[minmax(0,1.35fr)_minmax(310px,0.65fr)]">
              <div className="flex min-w-0 flex-col justify-end border-b border-border p-6 py-12 sm:p-12 md:border-r md:border-b-0 lg:p-16">
                <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-rust"><StatusDot tone="live" /> Unauthorized access detected</div>
                <h1 className="animate-rise font-gateway text-[clamp(5.4rem,13vw,12rem)] font-black uppercase leading-[0.78] text-foreground">
                  Prison<br /><span className="text-rust">Stream</span>
                </h1>
                <p className="mt-8 font-sans text-xl font-semibold uppercase text-foreground sm:text-2xl">The gates are opening.</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-rust">{launch.window} {launch.year}</p>
              </div>
              <div className="flex min-w-0 flex-col justify-center bg-card/70 p-6 py-10 sm:p-10">
                <span className="mb-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust"><StatusDot tone="live" /> Facility entrance / 01</span>
                <h2 className="border-b border-rust pb-3 font-gateway text-3xl font-black uppercase leading-none sm:text-4xl">Access the facility</h2>
                <div className="my-8 space-y-3 border border-border bg-background/80 p-5 font-mono text-[11px] uppercase tracking-[0.12em]">
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Launch window</span><span>{launch.window} {launch.year}</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Exact date</span><span className="text-rust">Classified</span></div>
                  <div className="flex justify-between gap-3"><span className="text-muted-foreground">Roster</span><span className="text-rust">Classified</span></div>
                </div>
                <Button onClick={() => setEntering(true)} className="h-14 justify-between rounded-none bg-rust px-5 font-mono text-xs uppercase tracking-[0.16em] text-background hover:bg-foreground">Enter the prison <ArrowRight className="size-4" /></Button>
                <Button asChild variant="outline" className="mt-3 h-14 justify-between rounded-none border-border bg-background/70 px-5 font-mono text-xs uppercase tracking-[0.16em] hover:border-rust"><Link to="/trailer">Watch the trailer <Play className="size-4" /></Link></Button>
                <div className="mt-8 flex justify-between border-t border-border pt-4 font-mono text-[10px] uppercase text-muted-foreground"><span>Transmission pending</span><span>PS / 2026</span></div>
              </div>
            </div>
            <div className="flex justify-between gap-3 border-t border-border bg-background/85 px-6 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-rust sm:px-12"><span>Established site access only</span><span>Facility entrance</span></div>
          </div>
        </div>
      </section>

      <SystemTicker />

      {/* FACILITY RECORD */}
      <section id="facility" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="Facility record"
            title="Project: Prison Stream"
            subtitle="A file exists. Most of it is blacked out. What follows is everything currently cleared for public release."
          />
        </Reveal>
        <div className="grid gap-8">
          <Reveal>
            <ClassifiedPanel title="Document 001">
              {projectFile.map((row) => (
                <DataRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  tone={row.value === "CLASSIFIED" ? "muted" : "ok"}
                />
              ))}
            </ClassifiedPanel>
          </Reveal>
        </div>
      </section>

      {/* THE LOCKDOWN */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="Launch status"
            title="The Lockdown"
            subtitle="No countdown has been authorized, because no date has been released."
          />
        </Reveal>
        <Reveal delay={100}>
          <Lockdown />
        </Reveal>
      </section>

      {/* WHO'S INSIDE */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker={terms.group}
            title="Who's inside?"
             subtitle="Every file is on the roster. Most identities stay sealed until you guess their names in the clearance database."
          />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {files.map((f, i) => (
            <Reveal key={f.file} delay={i * 90}>
              <FileCard entry={f} index={i} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <Link
            to="/roster"
            className="mt-8 inline-flex items-center gap-3 border border-border px-6 py-3 font-mono text-[11px] tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:border-rust hover:text-foreground"
          >
            Open the roster <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </section>

      {/* LIVE + TRAILER + NEXT */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3">
        <Reveal>
          <ClassifiedPanel title="Live transmissions" className="h-full">
            <p className="font-display text-2xl">
              {liveStreams.length === 0 ? "No active transmissions" : "Signal detected"}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              The system is waiting...
            </p>
            <Link
              to="/live"
              className="mt-8 inline-block font-mono text-[11px] tracking-[0.24em] text-rust uppercase"
            >
              Monitor feeds →
            </Link>
          </ClassifiedPanel>
        </Reveal>
        <Reveal delay={100}>
          <ClassifiedPanel title={trailer.label} className="h-full">
            <p className="font-display text-2xl">
              {trailer.released ? "Transmission available" : "Transmission pending"}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Runtime: {trailer.runtime}
            </p>
            <Link
              to="/trailer"
              className="mt-8 inline-block font-mono text-[11px] tracking-[0.24em] text-rust uppercase"
            >
              Open player →
            </Link>
          </ClassifiedPanel>
        </Reveal>
        <Reveal delay={200}>
          <ClassifiedPanel title="What's next" className="h-full">
            <p className="font-display text-2xl">
              {upcoming.length === 0 ? "Nothing cleared for release" : "Scheduled"}
            </p>
            <p className="mt-3 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Latest bulletin: {bulletins[0]?.title ?? "[REDACTED]"}
            </p>
            <Link
              to="/bulletin"
              className="mt-8 inline-block font-mono text-[11px] tracking-[0.24em] text-rust uppercase"
            >
              Read the bulletin →
            </Link>
          </ClassifiedPanel>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="panel grain relative overflow-hidden px-6 py-20 text-center sm:px-16">
            <p className="label-mono text-rust">Final notice</p>
            <p className="mx-auto mt-6 max-w-3xl font-display text-2xl leading-tight tracking-[0.06em] sm:text-4xl">
              Autumn 2026. The exact date? That information is currently behind locked doors.
            </p>
            <Link
              to="/reveals"
              className="mt-10 inline-flex items-center gap-3 border border-rust bg-rust/15 px-8 py-4 font-mono text-xs tracking-[0.3em] uppercase transition-colors hover:bg-rust/30"
            >
              Track the reveals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
