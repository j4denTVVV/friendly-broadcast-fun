import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel, DataRow } from "@/components/prison/Classified";
import { trailer } from "@/config/prison";

export const Route = createFileRoute("/trailer")({
  head: () => ({
    meta: [
      { title: "Transmission 001 — PRISON STREAM" },
      {
        name: "description",
        content: "The official Prison Stream trailer. Transmission 001 is live — the first footage from inside the facility.",
      },
      { property: "og:title", content: "Transmission 001 — PRISON STREAM" },
      { property: "og:description", content: "The first transmission is live." },
    ],
  }),
  component: TrailerPage,
});

/** Convert a YouTube or Instagram URL into its embed URL. */
function toEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const ig = url.match(/instagram\.com\/(reel|p|reels)\/([\w-]+)/);
  if (ig) return `https://www.instagram.com/${ig[1]}/${ig[2]}/embed`;
  return null;
}

function TrailerPage() {
  const [playing, setPlaying] = useState(false);
  const embedUrl = trailer.url ? toEmbed(trailer.url) : null;

  return (
    <PageShell
      kicker={trailer.label}
      title="Official trailer"
      subtitle="A single feed, routed through the facility's monitoring system."
    >
      <div className="panel corner-marks grain vignette relative aspect-video overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 animate-scan bg-gradient-to-b from-transparent via-foreground/[0.06] to-transparent" />
        <div className="absolute top-3 left-4 z-20 flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" /> REC
        </div>
        <div className="absolute top-3 right-4 z-20 font-mono text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
          CAM 001 — MAIN GATE
        </div>

        {trailer.released && trailer.url ? (
          playing && embedUrl ? (
            <iframe
              src={embedUrl}
              title="Prison Stream — Transmission 001"
              className="h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group flex h-full w-full flex-col items-center justify-center gap-4"
            >
              <span className="flex h-16 w-16 items-center justify-center border border-rust bg-rust/15 transition-colors group-hover:bg-rust/30">
                <Play className="h-6 w-6" />
              </span>
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase">
                Play transmission
              </span>
            </button>
          )
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4">
            <span className="animate-flicker font-display text-3xl tracking-[0.15em] sm:text-5xl">
              Transmission pending
            </span>
            <span className="label-mono">No footage cleared for release</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.28)_0px,rgba(0,0,0,0.28)_1px,transparent_1px,transparent_4px)] opacity-70" />
      </div>

      {trailer.released && trailer.url ? (
        <a
          href={trailer.url}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-rust uppercase hover:text-foreground"
        >
          Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}

      <div className="mt-8 max-w-lg">
        <ClassifiedPanel title="Media record">
          <DataRow label="Transmission" value={trailer.label} tone="ok" />
          <DataRow
            label="Status"
            value={trailer.released ? "RELEASED" : "PENDING"}
            tone={trailer.released ? "ok" : "warn"}
          />
          <DataRow label="Runtime" value={trailer.runtime} tone="muted" />
          <DataRow label="Source" value="YOUTUBE" tone="ok" />
        </ClassifiedPanel>
      </div>
    </PageShell>
  );
}
