import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel, StatusDot } from "@/components/prison/Classified";
import { Reveal } from "@/components/prison/Reveal";
import { liveStreams } from "@/config/prison";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Transmissions — PRISON STREAM" },
      {
        name: "description",
        content:
          "Every active Prison Stream feed, monitored in one place. No active transmissions yet — the system is waiting.",
      },
      { property: "og:title", content: "Live Transmissions — PRISON STREAM" },
      { property: "og:description", content: "No active transmissions. The system is waiting." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  return (
    <PageShell
      kicker="Monitoring"
      title="Live transmissions"
      subtitle="Every active feed will appear on this wall the moment it goes online."
    >
      {liveStreams.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Reveal key={i} delay={i * 70}>
              <div className="panel corner-marks grain relative flex aspect-video flex-col items-center justify-center gap-3 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-16 animate-scan bg-gradient-to-b from-transparent via-foreground/[0.06] to-transparent" />
                <span className="animate-flicker font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
                  No signal
                </span>
                <span className="label-mono">CAM {String(i + 1).padStart(2, "0")}</span>
              </div>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liveStreams.map((s, i) => (
            <Reveal key={s.id} delay={i * 70}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="panel corner-marks grain group block overflow-hidden transition-colors hover:border-rust"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-signal uppercase">
                    <StatusDot tone="live" /> Live
                  </span>
                  <span className="label-mono">{s.platform}</span>
                </div>
                <div className="flex aspect-video items-center justify-center bg-background">
                  <span className="font-display text-xl">{s.creator}</span>
                </div>
                <div className="space-y-1 px-3 py-3">
                  <p className="truncate text-sm text-foreground">{s.title}</p>
                  <p className="label-mono">
                    {s.viewers != null ? `${s.viewers} watching` : "VIEWERS: UNKNOWN"}
                  </p>
                  <span className="mt-2 inline-block font-mono text-[11px] tracking-[0.24em] text-rust uppercase">
                    Watch →
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-10 max-w-lg">
        <ClassifiedPanel title="Control room">
          <p className="font-display text-2xl">
            {liveStreams.length === 0 ? "No active transmissions" : "Feeds online"}
          </p>
          <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
            The system is waiting...
          </p>
        </ClassifiedPanel>
      </div>
    </PageShell>
  );
}
