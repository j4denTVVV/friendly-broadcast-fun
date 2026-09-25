import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel, DataRow } from "@/components/prison/Classified";
import { projectFile } from "@/config/prison";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Facility — PRISON STREAM" },
      {
        name: "description",
        content:
          "What is Prison Stream? A creator project launching Autumn 2026. Most of the file is still classified.",
      },
      { property: "og:title", content: "About the Facility — PRISON STREAM" },
      {
        property: "og:description",
        content: "A creator project launching Autumn 2026. Most of the file is still classified.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      kicker="About"
      title="What is Prison Stream?"
      subtitle="An honest answer: we know less than we'd like, and more than we're saying."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <ClassifiedPanel title="The short version" className="h-full">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Prison Stream is a newly announced creator project launching{" "}
              <span className="text-foreground">23 October 2026</span>. The full concept, format
              and complete lineup remain under wraps. Only a handful of files have been opened so
              far — everyone else remains classified, waiting to be discovered by name.
            </p>
            <p>
              One of those names is{" "}
              <Link
                to="/roster/$fileId"
                params={{ fileId: "001" }}
                className="font-semibold text-rust underline decoration-rust/40 underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                xKeonte
              </Link>{" "}
              — the creator behind Prison Stream and an inmate himself. He built the project from
              the ground up, bringing together the concept, the roster and the world surrounding
              it. But when the doors close, he doesn't stand on the outside watching. He walks
              into the facility with everyone else.
            </p>
            <p>
              For now, everything else stays behind locked doors. Names, details and information
              are only released once they've been officially declassified.
            </p>
            <p className="font-mono text-[11px] tracking-[0.24em] text-rust uppercase">
              Nothing leaves the facility early.
            </p>
          </div>
        </ClassifiedPanel>

        <ClassifiedPanel title="What we don't know" className="h-full">
          <ul className="space-y-3 font-mono text-[11px] tracking-[0.18em] uppercase">
            {[
              "The exact launch date",
              "The full roster",
              "The format of the streams",
              "The location of the facility",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-muted-foreground">
                <span className="h-1.5 w-1.5 shrink-0 bg-rust" />
                {item} — <span className="text-warning">classified</span>
              </li>
            ))}
          </ul>
          <Link
            to="/reveals"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-rust uppercase hover:text-foreground"
          >
            Track what gets revealed <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </ClassifiedPanel>
      </div>

      <div className="mt-8 max-w-lg">
        <ClassifiedPanel title="Project file">
          {projectFile.map((row) => (
            <DataRow
              key={row.label}
              label={row.label}
              value={row.value}
              tone={row.value === "CLASSIFIED" ? "muted" : "ok"}
            />
          ))}
        </ClassifiedPanel>
      </div>
    </PageShell>
  );
}
