import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel, DataRow } from "@/components/prison/Classified";
import { launch, projectFile, terms } from "@/config/prison";

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
              Prison Stream is a newly announced creator project launching in{" "}
              <span className="text-foreground">
                {launch.window} {launch.year}
              </span>
              . The exact date has not been announced. The full concept, the format, and the
              complete list of {terms.people.toLowerCase()} inside have not been revealed. Three files are open;
              the rest are sealed until someone finds them by name.
            </p>
            <p>
              One name has been declassified:{" "}
              <Link to="/roster/$fileId" params={{ fileId: "001" }} className="text-rust hover:text-foreground">
                XKEONTE
              </Link>{" "}
              — the creator who built and organised the whole thing, and still an inmate. He
              assembled the project from the inside: the concept, the roster and every door in the
              facility run through him. He walks in with everyone else.
            </p>
            <p>
              Everything else is behind locked doors. This site updates the moment anything is
              officially cleared for release — never before.
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
