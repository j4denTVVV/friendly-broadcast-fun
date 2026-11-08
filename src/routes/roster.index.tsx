import { useLiveGuests } from "@/lib/live-guests";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/prison/PageShell";
import { FileCard } from "@/components/prison/FileCard";
import { Reveal } from "@/components/prison/Reveal";
import { BreakoutComplete } from "@/components/prison/BreakoutComplete";
import { isAdminView } from "@/lib/roster";
import { getRosterFiles, readUnsealedFiles } from "@/lib/roster";
import { terms } from "@/config/prison";

/** Stable pseudo-random shake timing per file so cards rattle out of sync. */
function jostleStyle(file: string) {
  let h = 0;
  for (const c of file) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
  const duration = 4.5 + (h % 500) / 100;
  const delay = -((h >>> 9) % 900) / 100;
  return { animationDuration: `${duration}s`, animationDelay: `${delay}s` };
}

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const [adminView, setAdminView] = useState(false);
  useEffect(() => {
    setUnsealed(readUnsealedFiles());
    setAdminView(isAdminView());
  }, []);

  useLiveGuests();
  const files = getRosterFiles(unsealed, adminView);
  const revealedCount = files.filter((f) => f.revealed).length;

  const grouped = ROLE_GROUPS.map((g) => ({
    ...g,
    entries: files.filter((f) => g.match(f.role)),
  })).filter((g) => g.entries.length > 0);
  const inmates = files.filter((f) => !ROLE_GROUPS.some((g) => g.match(f.role)));
  const sections = [...grouped, { key: "inmates", label: "Inmates", entries: inmates }];

  return (
    <PageShell
      kicker={terms.group}
      title="Who's inside?"
      subtitle="Every file has a place here. Most identities are sealed — guess a name in the clearance database to unseal its file."
    >
      {revealedCount === files.length || adminView ? <BreakoutComplete admin={adminView && revealedCount !== files.length} total={files.length} /> : null}

      <div className="database-summary mb-8 grid-cols-2 sm:grid-cols-4">
        {[["Roster status", adminView ? "ADMIN" : "CLASSIFIED"], ["Files released", String(revealedCount).padStart(2, "0")], ["Files on record", String(files.length).padStart(2, "0")], ["Next reveal", "UNKNOWN"]].map(([label, value]) => <div key={label} className="database-summary-cell"><p className="label-mono">{label}</p><p className="mt-2 font-mono text-sm text-rust">{value}</p></div>)}
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
            <div className="database-section-head flex-wrap">
              <h2 className="font-display text-xl tracking-[0.25em] uppercase">{section.label}</h2>
              <span className="label-mono text-muted-foreground">
                {String(section.entries.length).padStart(2, "0")} FILES
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {section.entries.map((f, i) => (
                <Reveal key={f.file} delay={(i % 4) * 80}>
                  <div className="ps-jostle" style={jostleStyle(f.file)}>
                    <FileCard entry={f} index={i} />
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
