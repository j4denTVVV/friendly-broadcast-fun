import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Flag, Inbox, Lock, Megaphone, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/ps-logo.png";

import { SystemTicker } from "@/components/prison/SystemTicker";
import { GuestsAdmin } from "@/components/prison/GuestsAdmin";
import { ApplicationsAdmin } from "@/components/prison/ApplicationsAdmin";
import { BannerAdmin } from "@/components/prison/BannerAdmin";
import {
  adminLogin,
  adminLogout,
  adminStatus,
  listAllBulletins,
  listGuests,
  saveBulletin,
  deleteBulletin,
  type BulletinRow,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Control Room | Prison Stream" },
      {
        name: "description",
        content: "Restricted control room for Prison Stream staff: review entry requests and post bulletins.",
      },
      { property: "og:title", content: "Control Room | Prison Stream" },
      {
        property: "og:description",
        content: "Restricted control room for Prison Stream staff.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const emptyBulletin = {
  code: "",
  date_label: "CLASSIFIED",
  title: "",
  body: "",
  status: "VERIFIED",
  position: 0,
  published: true,
};

type BulletinDraft = typeof emptyBulletin & { id?: string };

function AdminPage() {
  const login = useServerFn(adminLogin);
  const logout = useServerFn(adminLogout);
  const status = useServerFn(adminStatus);
  const loadBulletins = useServerFn(listAllBulletins);
  const persistBulletin = useServerFn(saveBulletin);
  const removeBulletin = useServerFn(deleteBulletin);
  const loadGuests = useServerFn(listGuests);

  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"board" | "guests" | "apps" | "banner">("guests");
  const [appCount, setAppCount] = useState(0);
  const [bulletins, setBulletins] = useState<BulletinRow[]>([]);
  const [draft, setDraft] = useState<BulletinDraft>({ ...emptyBulletin });
  const [busy, setBusy] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [accessing, setAccessing] = useState(false);

  const refresh = useCallback(async () => {
    const [b, g] = await Promise.all([loadBulletins({}), loadGuests({})]);
    setBulletins(b);
    setGuestCount(g.length);
  }, [loadBulletins, loadGuests]);

  useEffect(() => {
    void (async () => {
      const s = await status({});
      setUnlocked(s.unlocked);
      if (s.unlocked) await refresh().catch(() => setUnlocked(false));
    })();
  }, [status, refresh]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await login({ data: { password } });
      if (!res.ok) {
        setError("Access denied.");
        return;
      }
      setUnlocked(true);
      setPassword("");
      setAccessing(true);
      window.setTimeout(() => setAccessing(false), 900);
      await refresh();
    } catch {
      setError("Connection interrupted. Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (unlocked === null) {
    return (
      <div className="admin-theme admin-entry flex min-h-screen items-center justify-center pt-24"><p className="label-mono animate-flicker text-destructive">Verifying clearance…</p></div>
    );
  }

  if (!unlocked) {
    return (
      <main className="admin-theme admin-entry relative min-h-screen px-4 pb-16 pt-32 sm:px-8 lg:pt-40">
        <div className="admin-terminal mx-auto max-w-6xl">
          <div className="admin-terminal-stripe h-1.5" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-background px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3"><span className="admin-led size-2 rounded-full bg-destructive" /><img src={logoAsset} alt="" className="h-7 w-7 object-contain" /><span className="font-mono text-[10px] font-bold uppercase text-foreground sm:text-xs">Prison Stream // Control Room</span></div>
            <span className="font-mono text-[10px] uppercase text-destructive">● Restricted access</span>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <form onSubmit={onLogin} className="admin-access relative flex flex-col justify-center border-b-2 border-border p-6 sm:p-10 lg:border-b-0 lg:border-r-2" aria-label="Staff access">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase text-destructive"><ShieldAlert className="size-4" /> Restricted zone / 01</div>
              <h1 className="admin-glitch-title mt-6 font-display text-4xl uppercase leading-none sm:text-5xl">Clearance<br />verification<span className="text-destructive">.</span></h1>
              <p className="mt-5 max-w-sm text-sm text-muted-foreground">This area is not part of the public transmission.</p>
              <label htmlFor="staff-passcode" className="mt-12 block font-mono text-[10px] uppercase text-muted-foreground">Staff passcode</label>
              <input id="staff-passcode" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="mt-3 h-14 w-full rounded-none border-2 border-border bg-background px-4 font-mono text-base text-foreground outline-none transition-colors focus:border-destructive" placeholder="••••••••••••" />
              {error && <p role="alert" className="mt-3 font-mono text-xs uppercase text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="admin-command-button mt-5 flex h-14 w-full justify-between rounded-none bg-foreground px-5 font-mono text-xs uppercase text-background hover:bg-foreground/85">{busy ? "Verifying…" : "Request clearance"}<ArrowRight className="size-4" /></Button>
              <div className="mt-10 flex justify-between border-t border-border pt-4 font-mono text-[9px] uppercase text-muted-foreground"><span>Encrypted channel</span><span>Internal use only</span></div>
            </form>
            <div className="bg-background/45 p-6 sm:p-10">
              <p className="font-mono text-[10px] uppercase text-destructive">System locked / authorization pending</p>
              <div className="mt-5 border border-border bg-background px-4 py-4 font-mono text-[10px] uppercase text-muted-foreground"><span className="text-destructive">&gt;</span> Awaiting staff clearance<span className="admin-cursor">_</span></div>
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t-2 border-border bg-background px-5 py-3 font-mono text-[9px] uppercase text-muted-foreground sm:px-7"><span>Prison Stream / Internal network</span><span>Unauthorised entry prohibited</span></div>
        </div>
      </main>
    );
  }

  const stats = [
    { key: "guests" as const, label: "Guest files", value: guestCount, sub: "edits & additions", Icon: Users },
    { key: "board" as const, label: "Bulletins", value: bulletins.length, sub: `${bulletins.filter((b) => b.published).length} live`, Icon: Megaphone },
    { key: "apps" as const, label: "Entry requests", value: appCount, sub: "accept or reject", Icon: Inbox },
    { key: "banner" as const, label: "Site banner", value: "▲", sub: "top-of-site notice", Icon: Flag },
  ];

  return (
    <div className="admin-theme admin-entry min-h-screen pt-24"><SystemTicker /><section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      {accessing && <div aria-live="polite" className="admin-access-flash fixed inset-0 z-[60] flex items-center justify-center bg-background font-display text-5xl uppercase text-destructive">Access granted</div>}
      <div className="admin-terminal-stripe h-1.5" />
      <div className="flex flex-wrap items-center justify-between gap-4 border-x border-b-2 border-border bg-background px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3"><span className="admin-led size-2 rounded-full bg-destructive" /><img src={logoAsset} alt="" className="size-7 object-contain" /><span className="font-mono text-[10px] uppercase text-foreground">Prison Stream // Site admin</span></div><span className="font-mono text-[10px] uppercase text-destructive">Secure line / Active</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6 border-x border-border bg-card/60 px-5 py-8 sm:px-7 sm:py-10">
        <div><p className="font-mono text-[10px] uppercase text-destructive">Internal network / Clearance granted</p><h1 className="mt-3 font-display text-4xl uppercase leading-none sm:text-6xl">Control room<span className="text-destructive">.</span></h1><p className="mt-3 text-sm text-muted-foreground">Changes go live instantly.</p></div>
        <Button variant="outline" size="sm"
          onClick={async () => {
            await logout({});
            setUnlocked(false);
          }}
          className="rounded-none border-border bg-background font-mono text-[11px] uppercase text-foreground hover:border-destructive hover:text-destructive"
        >
          <Lock className="h-3.5 w-3.5" /> Lock
        </Button>
      </div>

      <div className="grid border-2 border-border bg-background sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Control room sections">
        {stats.map(({ key, label, value, sub, Icon }, i) => (
          <Button variant="ghost"
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`admin-section relative h-auto min-h-36 flex-col items-start justify-between rounded-none border-b border-border p-5 text-left transition-colors hover:bg-destructive/5 sm:border-b-0 ${i > 0 ? "lg:border-l" : ""} ${
              tab === key ? "bg-destructive/10" : "bg-card/30"
            }`}
          >
            {tab === key && <span className="absolute inset-x-0 top-0 h-0.5 bg-destructive" />}
            <div className="flex w-full items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">0{i + 1} / {label}</span>
              <Icon className={`h-4 w-4 ${tab === key ? "text-destructive" : "text-muted-foreground"}`} />
            </div>
            <div><p className="font-display text-5xl leading-none text-foreground">{value}</p><p className="mt-1 font-mono text-[10px] uppercase text-destructive">{sub}</p></div>
          </Button>
        ))}
      </div>

      <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-3 border-b-2 border-border pb-4"><div><p className="font-mono text-[10px] uppercase text-destructive">Workstation / {String(stats.findIndex((item) => item.key === tab) + 1).padStart(2, "0")}</p><h2 className="mt-1 font-display text-2xl uppercase sm:text-3xl">{stats.find((item) => item.key === tab)?.label}</h2></div><span className="font-mono text-[10px] uppercase text-muted-foreground">Session active <span className="text-destructive">●</span></span></div>

      {tab === "guests" ? (
        <GuestsAdmin onCount={setGuestCount} />
      ) : tab === "apps" ? (
        <ApplicationsAdmin onCount={setAppCount} />
      ) : tab === "banner" ? (
        <BannerAdmin />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form
            className="panel animate-rise space-y-3 p-6"
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await persistBulletin({ data: draft });
                setDraft({ ...emptyBulletin });
                await refresh();
              } finally {
                setBusy(false);
              }
            }}
          >
            <h3 className="font-display text-lg tracking-[0.2em] uppercase">
              {draft.id ? "Edit post" : "New post"}
            </h3>
            {(
              [
                ["code", "Code (e.g. B-005)"],
                ["date_label", "Date label"],
                ["title", "Title"],
                ["status", "Status"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="label-mono block">{label}</label>
                <input
                  value={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  className="hairline mt-1 w-full bg-background/70 px-3 py-2 font-mono text-sm outline-none focus:border-rust"
                />
              </div>
            ))}
            <div>
              <label className="label-mono block">Body</label>
              <textarea
                rows={5}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                className="hairline mt-1 w-full bg-background/70 px-3 py-2 text-sm outline-none focus:border-rust"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="label-mono block">Order</label>
                <input
                  type="number"
                  value={draft.position}
                  onChange={(e) => setDraft({ ...draft, position: Number(e.target.value) })}
                  className="hairline mt-1 w-24 bg-background/70 px-3 py-2 font-mono text-sm outline-none focus:border-rust"
                />
              </div>
              <label className="label-mono mt-5 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Published
              </label>
            </div>
            <div className="flex gap-2 pt-2">
               <Button
                type="submit"
                disabled={busy}
                 variant="outline" className="h-auto rounded-none bg-card/60 px-4 py-3 font-mono text-[11px] uppercase hover:border-destructive disabled:opacity-50"
              >
                {busy ? "Saving…" : "Publish"}
               </Button>
              {draft.id ? (
                 <Button
                  type="button"
                  onClick={() => setDraft({ ...emptyBulletin })}
                   variant="outline" className="h-auto rounded-none bg-card/40 px-4 py-3 font-mono text-[11px] text-muted-foreground uppercase"
                >
                  Cancel
                 </Button>
              ) : null}
            </div>
          </form>

          <div className="space-y-3">
            {bulletins.map((b) => (
              <article key={b.id} className="panel space-y-2 p-5">
                <div className="flex items-center gap-3">
                  <span className="label-mono text-rust">{b.code}</span>
                  <span className="label-mono">{b.date_label}</span>
                  <span className="label-mono ml-auto">{b.published ? "LIVE" : "HIDDEN"}</span>
                </div>
                <h4 className="font-display text-base tracking-[0.18em] uppercase">{b.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                <div className="flex gap-2 pt-1">
                   <Button variant="outline" size="sm"
                    onClick={() =>
                      setDraft({
                        id: b.id,
                        code: b.code,
                        date_label: b.date_label,
                        title: b.title,
                        body: b.body,
                        status: b.status,
                        position: b.position,
                        published: b.published,
                      })
                    }
                     className="rounded-none bg-card/50 font-mono text-[10px] uppercase hover:border-destructive"
                  >
                    Edit
                   </Button>
                   <Button variant="outline" size="sm"
                    onClick={async () => {
                      await removeBulletin({ data: { id: b.id } });
                      await refresh();
                    }}
                     className="rounded-none bg-card/50 font-mono text-[10px] text-destructive uppercase hover:border-destructive"
                  >
                    Delete
                   </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section></div>
  );
}
