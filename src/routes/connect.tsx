import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel } from "@/components/prison/Classified";
import { officialSocials, roster } from "@/config/prison";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Official Channels — PRISON STREAM" },
      {
        name: "description",
        content: "Official Prison Stream channels and confirmed creator accounts. Nothing else is real.",
      },
      { property: "og:title", content: "Official Channels — PRISON STREAM" },
      { property: "og:description", content: "Confirmed channels only. Nothing else is real." },
    ],
  }),
  component: ConnectPage,
});

function ConnectPage() {
  const creatorSocials = roster
    .filter((r) => r.revealed && r.socials?.length)
    .flatMap((r) => r.socials!.map((s) => ({ ...s, who: r.name ?? r.file })));

  return (
    <PageShell
      kicker="Connect"
      title="Official channels"
      subtitle="If it isn't listed here, it isn't official. Beware of impersonators."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <ClassifiedPanel title="Project channels" className="h-full">
          {officialSocials.length === 0 ? (
            <>
              <p className="font-display text-2xl">Pending verification</p>
              <p className="mt-3 font-mono text-[11px] leading-loose tracking-[0.18em] text-muted-foreground uppercase">
                Official project accounts have not been confirmed yet. Any account claiming to be
                Prison Stream should be treated as unverified.
              </p>
            </>
          ) : (
            <ul className="space-y-3">
              {officialSocials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hairline flex items-center justify-between px-4 py-3 font-mono text-[11px] tracking-[0.2em] uppercase hover:border-rust"
                  >
                    {s.platform}
                    <ExternalLink className="h-3.5 w-3.5 text-rust" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </ClassifiedPanel>

        <ClassifiedPanel title="Confirmed creator channels" className="h-full">
          {creatorSocials.length === 0 ? (
            <p className="label-mono">No creator channels released</p>
          ) : (
            <ul className="space-y-3">
              {creatorSocials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="hairline flex items-center justify-between px-4 py-3 font-mono text-[11px] tracking-[0.2em] uppercase hover:border-rust"
                  >
                    <span>
                      {s.who} — <span className="text-muted-foreground">{s.platform}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-rust" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </ClassifiedPanel>
      </div>
    </PageShell>
  );
}
