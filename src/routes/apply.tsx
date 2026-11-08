import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/prison/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

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
  "field-input mt-2";

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
        <div role="status" className="scan-result border-y border-border py-10">
          <CheckCircle2 className="mb-6 size-10 text-success" />
          <p className="label-mono text-success">Your request is under review. Watch your inbox.</p>
        </div>
      </PageShell>
    );
  }

  const completed = [f.name, f.handle, f.contact, f.pitch].filter((value) => value.trim()).length;
  const field = (key: keyof typeof f, label: string, required = false, type = "text") => (
    <div><label htmlFor={`application-${key}`} className="label-mono block">{label}</label><input id={`application-${key}`} required={required} type={type} value={f[key]} onChange={set(key)} className={input} autoComplete={key === "name" ? "name" : key === "contact" ? "email" : "off"} /></div>
  );

  return (
    <PageShell kicker="Intake" title="Apply for entry">
      <form onSubmit={submit} aria-busy={state === "busy"} className="max-w-3xl space-y-8">
        <div className="flex items-center justify-between border-b border-border pb-4"><span className="label-mono text-rust">Admission file</span><span className="label-mono">{completed} / 4 required fields</span></div>
        <div className="form-section"><div className="form-section-title"><span className="form-section-number">01</span><h2 className="text-2xl">Identification</h2></div><div className="grid gap-6 sm:grid-cols-2">{field("name", "Name", true)}{field("handle", "Handle", true)}<div className="sm:col-span-2">{field("contact", "Email", true, "email")}</div></div></div>
        <div className="form-section"><div className="form-section-title"><span className="form-section-number">02</span><h2 className="text-2xl">Channels</h2></div><div className="grid gap-6 sm:grid-cols-2">{field("platform", "Main platform")}{field("links", "Links")}</div></div>
        <div className="form-section"><div className="form-section-title"><span className="form-section-number">03</span><h2 className="text-2xl">Statement</h2></div><label htmlFor="application-pitch" className="label-mono block">Why should you be inside?</label><textarea id="application-pitch" required rows={6} value={f.pitch} onChange={set("pitch")} className={input} /></div>
        {state === "error" ? <p role="alert" className="border-l-2 border-destructive py-3 pl-4 font-mono text-xs text-destructive uppercase">Something went wrong. Try again.</p> : null}
        <Button disabled={state === "busy"} className="ps-button ps-button-primary rounded-none">
          {state === "busy" ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}<span>{state === "busy" ? "Sending…" : "Submit file"}</span>
        </Button>
      </form>
    </PageShell>
  );
}
