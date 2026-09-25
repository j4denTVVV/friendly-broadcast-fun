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
      <section className="grain vignette relative flex min-h-screen items-center overflow-hidden">
        <img
          src={heroImg}
          alt="A heavy steel prison door standing ajar in a dark concrete corridor"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/85" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-28 pb-20 sm:px-6">
          <div className="mb-6 inline-flex items-center gap-3 border border-border bg-background/70 px-3 py-1.5">
            <StatusDot tone="live" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Unauthorized access detected
            </span>
          </div>

          <h1 className="animate-rise text-[16vw] leading-[0.82] font-bold sm:text-[11vw] lg:text-[10rem]">
            Prison
            <br />
            <span className="text-rust">Stream</span>
          </h1>

          <p className="animate-rise mt-6 font-display text-xl tracking-[0.28em] text-foreground/90 sm:text-3xl">
            The gates are opening.
          </p>
          <p className="mt-2 font-mono text-sm tracking-[0.4em] text-warning uppercase">
            {launch.window} {launch.year}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setEntering(true)}
              className="group inline-flex items-center justify-center gap-3 border border-rust bg-rust/15 px-8 py-4 font-mono text-xs tracking-[0.3em] text-foreground uppercase transition-colors hover:bg-rust/30"
            >
              Enter the prison
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              to="/trailer"
              className="inline-flex items-center justify-center gap-3 border border-border bg-card/50 px-8 py-4 font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              <Play className="h-4 w-4" />
              Watch the trailer
            </Link>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-x-8 sm:grid-cols-4">
            {[
              ["Launch window", `${launch.window} ${launch.year}`],
              ["Exact date", "CLASSIFIED"],
              ["Roster", "CLASSIFIED"],
              ["Format", "CLASSIFIED"],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-border pt-3">
                <p className="label-mono">{k}</p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.16em] text-foreground">{v}</p>
              </div>
            ))}
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
            subtitle="The names are coming. Some identities may already be behind these doors — none have been cleared for release."
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
