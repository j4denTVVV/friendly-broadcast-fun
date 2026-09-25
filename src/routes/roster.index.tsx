import { useLiveGuests } from "@/lib/live-guests";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/prison/PageShell";
import { FileCard } from "@/components/prison/FileCard";
import { Reveal } from "@/components/prison/Reveal";
import { ClassifiedPanel, DataRow } from "@/components/prison/Classified";
import { getRosterFiles, readUnsealedFiles } from "@/lib/roster";
import { terms } from "@/config/prison";

export const Route = createFileRoute("/roster/")({
  head: () => ({
    meta: [
      { title: "The Roster — PRISON STREAM" },
      {
        name: "description",
        content:
          "Identities classified. The Prison Stream roster expands as each file is cleared for release.",
      },
      { property: "og:title", content: "The Roster — PRISON STREAM" },
      { property: "og:description", content: "Identities classified. The names are coming." },
    ],
  }),
  component: RosterPage,
});

const ROLE_GROUPS: { key: string; label: string; match: (role?: string) => boolean }[] = [
  { key: "guards", label: "Guards", match: (r) => r === "GUARD" },
  {
    key: "counsellor",
    label: "Guidance Counsellor",
    match: (r) => r === "GUIDANCE COUNSELOR" || r === "GUIDANCE COUNSELLOR",
  },
];

function RosterPage() {
  const [unsealed, setUnsealed] = useState<string[]>([]);
  useEffect(() => setUnsealed(readUnsealedFiles()), []);

  useLiveGuests();
  const files = getRosterFiles(unsealed);
  const revealedCount = files.filter((f) => f.revealed).length;

  const grouped = ROLE_GROUPS.map((g) => ({
    ...g,
    entries: files.filter((f) => f.revealed && g.match(f.role)),
  })).filter((g) => g.entries.length > 0);
  const inmates = files.filter((f) => !f.revealed || !ROLE_GROUPS.some((g) => g.match(f.role)));
  const sections = [...grouped, { key: "inmates", label: "Inmates", entries: inmates }];

  return (
    <PageShell
      kicker={terms.group}
      title="Who's inside?"
      subtitle="Three files are cleared for open release. The rest are sealed — find them by name in the clearance database and they are added here. File numbers are placeholders; they do not indicate how many people are inside."
    >
      <div className="mb-10 max-w-md">
        <ClassifiedPanel title="Clearance summary">
          <DataRow label="Roster status" value="CLASSIFIED" tone="muted" />
          <DataRow
            label="Files released"
            value={revealedCount === 0 ? "NONE" : String(revealedCount).padStart(2, "0")}
            tone={revealedCount === 0 ? "muted" : "ok"}
          />
          <DataRow label="Occupants" value="UNKNOWN" tone="muted" />
          <DataRow label="Next reveal" value="UNKNOWN" tone="warn" />
        </ClassifiedPanel>
      </div>

      <div className="mb-10">
        <Link
          to="/reveals"
          className="inline-flex h-12 items-center gap-3 border border-rust bg-rust/10 px-6 font-mono text-[11px] tracking-[0.24em] uppercase transition-colors hover:bg-rust/25"
        >
          Search the database →
        </Link>
      </div>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.key}>
            <div className="mb-5 flex items-center gap-4">
              <h2 className="font-display text-xl tracking-[0.25em] uppercase">{section.label}</h2>
              <span className="label-mono text-muted-foreground">
                {String(section.entries.filter((e) => e.revealed).length).padStart(2, "0")} FILES
              </span>
              <div className="hairline h-px flex-1 border-t" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {section.entries.map((f, i) => (
                <Reveal key={f.file} delay={(i % 4) * 80}>
                  <FileCard entry={f} index={i} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
