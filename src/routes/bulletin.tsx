import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/prison/PageShell";
import { Reveal } from "@/components/prison/Reveal";
import { StatusDot } from "@/components/prison/Classified";
import { bulletins as fallbackBulletins, upcoming } from "@/config/prison";
import { useLiveBulletins } from "@/lib/live-bulletins";

export const Route = createFileRoute("/bulletin")({
  head: () => ({
    meta: [
      { title: "The Bulletin — PRISON STREAM" },
      {
        name: "description",
        content:
          "Official Prison Stream transmissions: reveals, launch information and verified announcements.",
      },
      { property: "og:title", content: "The Bulletin — PRISON STREAM" },
      { property: "og:description", content: "Official transmissions. Status: verified." },
    ],
  }),
  component: BulletinPage,
});

function BulletinPage() {
  const live = useLiveBulletins();
  const items =
    live && live.length > 0
      ? live.map((b) => ({
          id: b.id,
          code: b.code,
          date: b.date_label,
          title: b.title,
          body: b.body,
          status: b.status,
        }))
      : fallbackBulletins;

  return (
    <PageShell
      kicker="Official transmissions"
      title="The bulletin"
      subtitle="Anything published here is verified. Anything not published here is speculation."
    >
      <div className="mb-6 inline-flex items-center gap-2 border border-border bg-card/50 px-3 py-2">
        <StatusDot tone="live" />
        <span className="label-mono">{live ? "Live feed connected" : "Connecting to feed…"}</span>
      </div>

      <ul className="space-y-5">
        {items.map((b, i) => (
          <Reveal as="li" key={b.id} delay={i * 90}>
            <article className="panel corner-marks grain hover-lift relative overflow-hidden">
              <div className="hazard-strip h-[3px] w-full opacity-25" />
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                <span className="font-mono text-[10px] tracking-[0.26em] text-rust uppercase">
                  Prison Stream / {b.code}
                </span>
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.26em] uppercase">
                  <StatusDot tone={b.status === "VERIFIED" ? "ok" : "muted"} />
                  Status: {b.status}
                </span>
              </div>
              <div className="px-5 py-6 sm:px-8 sm:py-8">
                <p className="label-mono">Filed: {b.date}</p>
                <h2 className="mt-3 text-2xl sm:text-3xl">{b.title}</h2>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl">What's next?</h2>
        {upcoming.length === 0 ? (
          <div className="panel corner-marks grain px-6 py-14 text-center">
            <p className="animate-flicker font-display text-2xl sm:text-4xl">
              Nothing cleared for release
            </p>
            <p className="mt-3 label-mono">Next transmission pending</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {upcoming.map((u) => (
              <li key={u.id} className="panel corner-marks hover-lift p-5">
                <p className="label-mono">{u.kind}</p>
                <p className="mt-2 font-display text-xl">{u.label}</p>
                <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-rust uppercase">
                  {u.when}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
