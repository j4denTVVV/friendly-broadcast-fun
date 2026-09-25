import { useLiveGuests } from "@/lib/live-guests";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel, DataRow, Redacted } from "@/components/prison/Classified";
import { findFile, readUnsealedFiles } from "@/lib/roster";
import { terms } from "@/config/prison";

export const Route = createFileRoute("/roster/$fileId")({
  head: ({ params }) => {
    const title = `${terms.profile} #${params.fileId} — PRISON STREAM`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Prison Stream ${terms.profile.toLowerCase()} #${params.fileId}. Identity classified until officially released.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: "Identity classified. Access denied." },
      ],
    };
  },
  component: FilePage,
});

function FilePage() {
  const { fileId } = Route.useParams();
  const [unsealed, setUnsealed] = useState<string[]>([]);

  useEffect(() => setUnsealed(readUnsealedFiles()), []);

  useLiveGuests();
  const entry = findFile(fileId, unsealed);

  return (
    <PageShell
      kicker={`${terms.profile} #${entry.file}`}
      title={entry.revealed ? (entry.name ?? "[REVEALED]") : "Identity classified"}
      subtitle={
        entry.revealed
          ? entry.bio
          : "This file has not been cleared for release. Access to its contents requires an authorization that has not been granted."
      }
    >
      <Link
        to="/roster"
        className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-muted-foreground uppercase hover:text-rust"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to the roster
      </Link>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel corner-marks grain relative aspect-[3/4] overflow-hidden">
          {entry.revealed && entry.image ? (
            <img
              src={entry.image}
              alt={entry.name ?? "Confirmed creator portrait"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <Lock className="h-8 w-8 animate-flicker text-muted-foreground/50" />
              <span className="label-mono">Photograph withheld</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.3)_0px,rgba(0,0,0,0.3)_1px,transparent_1px,transparent_4px)] opacity-60" />
        </div>

        <div className="space-y-6">
          <ClassifiedPanel title={`Record ${entry.file}`}>
            <DataRow
              label="Identity"
              value={entry.revealed ? (entry.name ?? "[REVEALED]") : "[CLASSIFIED]"}
              tone={entry.revealed ? "ok" : "muted"}
            />
            <DataRow
              label="Status"
              value={entry.revealed ? (entry.status ?? "CONFIRMED") : "CLASSIFIED"}
              tone={entry.revealed ? "ok" : "muted"}
            />
            {entry.revealed && entry.role ? (
              <DataRow label="Role" value={entry.role} tone="warn" />
            ) : null}
            <DataRow
              label="Access"
              value={entry.revealed ? "AUTHORIZED" : "DENIED"}
              tone={entry.revealed ? "ok" : "muted"}
            />
          </ClassifiedPanel>

          <ClassifiedPanel title="Notes">
            {entry.revealed ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {entry.bio ?? "[COMING SOON]"}
              </p>
            ) : (
              <p className="font-mono text-sm leading-loose text-muted-foreground">
                SUBJECT <Redacted>████████</Redacted> HAS NOT BEEN CLEARED. ALL REFERENCES TO{" "}
                <Redacted>██████████</Redacted> REMAIN SEALED UNTIL OFFICIAL ANNOUNCEMENT.
              </p>
            )}
          </ClassifiedPanel>

          <ClassifiedPanel title="Channels">
            {entry.revealed && entry.socials?.length ? (
              <ul className="flex flex-wrap gap-3">
                {entry.socials.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hairline block px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase hover:border-rust"
                    >
                      {s.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="label-mono">No channels released</p>
            )}
          </ClassifiedPanel>
        </div>
      </div>
    </PageShell>
  );
}
