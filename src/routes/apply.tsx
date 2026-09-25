import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { PageShell } from "@/components/prison/PageShell";
import { ClassifiedPanel } from "@/components/prison/Classified";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Request Entry — PRISON STREAM" },
      {
        name: "description",
        content:
          "Apply to be considered for Prison Stream. Submit your name, platform and links for review by the facility.",
      },
      { property: "og:title", content: "Request Entry — PRISON STREAM" },
      { property: "og:description", content: "Submit your file. The facility reviews every request." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplyPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  handle: z.string().trim().min(2, "Enter your main username").max(80),
  platform: z.string().trim().max(60).optional(),
  contact: z.string().trim().max(160).optional(),
  links: z.string().trim().max(1000).optional(),
  pitch: z.string().trim().min(10, "Tell us a bit more").max(1500),
});

const field =
  "w-full border border-border bg-background/70 px-4 py-3 font-mono text-[12px] tracking-[0.12em] text-foreground uppercase outline-none transition-colors focus:border-rust";

function ApplyPage() {
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      handle: fd.get("handle"),
      platform: fd.get("platform"),
      contact: fd.get("contact"),
      links: fd.get("links"),
      pitch: fd.get("pitch"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("applications").insert({
      name: parsed.data.name,
      handle: parsed.data.handle,
      platform: parsed.data.platform ?? null,
      contact: parsed.data.contact ?? null,
      links: parsed.data.links ?? null,
      pitch: parsed.data.pitch,
    });
    setSending(false);
    if (error) {
      toast.error("Transmission failed. Try again.");
      return;
    }
    setDone(true);
  }

  return (
    <PageShell
      kicker="Intake"
      title="Request entry"
      subtitle="Applications are read by the facility. If your file is approved you will be contacted directly."
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <ClassifiedPanel title="Intake form">
          {done ? (
            <div className="py-10 text-center">
              <p className="animate-glitch font-display text-3xl">Application received</p>
              <p className="mt-4 label-mono">Status: pending review</p>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
                Your file has been logged. Do not submit twice — the facility has it.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label-mono">Name *</span>
                  <input name="name" maxLength={80} className={`mt-2 ${field}`} required />
                </label>
                <label className="block">
                  <span className="label-mono">Main username *</span>
                  <input name="handle" maxLength={80} className={`mt-2 ${field}`} required />
                </label>
                <label className="block">
                  <span className="label-mono">Main platform</span>
                  <input
                    name="platform"
                    maxLength={60}
                    placeholder="TWITCH / TIKTOK / YOUTUBE"
                    className={`mt-2 ${field}`}
                  />
                </label>
                <label className="block">
                  <span className="label-mono">Contact (email / discord)</span>
                  <input name="contact" maxLength={160} className={`mt-2 ${field}`} />
                </label>
              </div>
              <label className="block">
                <span className="label-mono">Links</span>
                <textarea name="links" rows={3} maxLength={1000} className={`mt-2 ${field} normal-case`} />
              </label>
              <label className="block">
                <span className="label-mono">Why should you be inside? *</span>
                <textarea
                  name="pitch"
                  rows={5}
                  maxLength={1500}
                  className={`mt-2 ${field} normal-case`}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={sending}
                className="btn-riveted w-full px-6 py-4 font-mono text-[12px] tracking-[0.3em] uppercase disabled:opacity-50"
              >
                {sending ? "Transmitting…" : "Submit application"}
              </button>
            </form>
          )}
        </ClassifiedPanel>

        <ClassifiedPanel title="Intake notice" className="h-full">
          <ul className="space-y-4 font-mono text-[11px] leading-loose tracking-[0.16em] text-muted-foreground uppercase">
            <li>01 — Every application is read manually.</li>
            <li>02 — Fake or duplicate files are discarded.</li>
            <li>03 — Approved applicants are contacted on the details you provide.</li>
            <li>04 — Silence is not a rejection. The list moves slowly.</li>
          </ul>
        </ClassifiedPanel>
      </div>
    </PageShell>
  );
}
