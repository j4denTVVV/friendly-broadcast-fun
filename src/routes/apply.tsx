import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/prison/PageShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for Entry | Prison Stream" },
      { name: "description", content: "Submit your file to be considered for the Prison Stream facility." },
      { property: "og:title", content: "Apply for Entry | Prison Stream" },
      { property: "og:description", content: "Submit your file to be considered for the Prison Stream facility." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplyPage,
});

const input =
  "hairline mt-1 w-full bg-background/70 px-3 py-2 font-mono text-sm outline-none focus:border-rust";

function ApplyPage() {
  const [f, setF] = useState({ name: "", handle: "", platform: "", links: "", pitch: "", contact: "" });
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    const { error } = await supabase.from("applications").insert({
      name: f.name.trim().slice(0, 100),
      handle: f.handle.trim().slice(0, 100),
      platform: f.platform.trim().slice(0, 60) || null,
      links: f.links.trim().slice(0, 1000) || null,
      pitch: f.pitch.trim().slice(0, 3000),
      contact: f.contact.trim().slice(0, 255),
    });
    setState(error ? "error" : "done");
  };

  if (state === "done") {
    return (
      <PageShell kicker="Intake" title="File received">
        <p className="label-mono text-rust">Your request is under review. Watch your inbox.</p>
      </PageShell>
    );
  }

  return (
    <PageShell kicker="Intake" title="Apply for entry">
      <form onSubmit={submit} className="panel max-w-xl space-y-4 p-6">
        <div><label className="label-mono block">Name</label><input required value={f.name} onChange={set("name")} className={input} /></div>
        <div><label className="label-mono block">Handle</label><input required value={f.handle} onChange={set("handle")} className={input} /></div>
        <div><label className="label-mono block">Email</label><input required type="email" value={f.contact} onChange={set("contact")} className={input} /></div>
        <div><label className="label-mono block">Main platform</label><input value={f.platform} onChange={set("platform")} className={input} /></div>
        <div><label className="label-mono block">Links</label><input value={f.links} onChange={set("links")} className={input} /></div>
        <div><label className="label-mono block">Why should you be inside?</label><textarea required rows={5} value={f.pitch} onChange={set("pitch")} className={input} /></div>
        {state === "error" ? <p className="font-mono text-xs text-destructive uppercase">Something went wrong. Try again.</p> : null}
        <button disabled={state === "busy"} className="hairline w-full bg-card/60 px-4 py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-rust disabled:opacity-50">
          {state === "busy" ? "Sending…" : "Submit file"}
        </button>
      </form>
    </PageShell>
  );
}
