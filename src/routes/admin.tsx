import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Flag, Inbox, Lock, Megaphone, ShieldAlert, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/ps-logo.png";
import { PageShell } from "@/components/prison/PageShell";
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
      <div className="admin-entry flex min-h-screen items-center justify-center pt-24"><p className="label-mono animate-flicker text-warning">Verifying clearance…</p></div>
    );
  }

  if (!unlocked) {
    return (
      <main className="admin-entry relative flex min-h-screen flex-col overflow-hidden pt-28">
        <div aria-hidden className="admin-entry-beam" />
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-16 sm:px-10 lg:py-24">
          <div className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-warning"><ShieldAlert className="size-4" /> Restricted access <span className="h-px w-12 bg-warning/50" /> 01 / 01</div>
          <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Prison Stream / internal network</p>
              <h1 className="admin-glitch-title mt-5 max-w-[850px] font-display text-[clamp(5rem,12vw,11rem)] leading-[0.76] font-bold uppercase" data-text="CONTROL ROOM">CONTROL<br />ROOM<span className="text-warning">.</span></h1>
              <div className="mt-8 flex items-center gap-4"><span className="h-px w-14 bg-warning" /><p className="font-mono text-[11px] uppercase tracking-widest text-warning">Unauthorised entry prohibited</p></div>
              <p className="mt-6 max-w-md text-lg leading-snug text-muted-foreground">This area is not part of the public transmission.</p>
              <img src={logoAsset} alt="" className="mt-12 w-16 opacity-60" />
            </div>
            <form onSubmit={onLogin} className="admin-access relative border-t-2 border-warning bg-card/70 p-6 sm:p-8 lg:mb-3" aria-label="Staff access">
              <div className="mb-10 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-widest text-warning">Access terminal</span><span className="font-mono text-[10px] text-muted-foreground">PS // AUTH-01</span></div>
              <h2 className="font-display text-4xl leading-none uppercase">Identify yourself.</h2>
              <p className="mt-3 text-sm text-muted-foreground">Staff credentials required to proceed.</p>
              <label htmlFor="staff-passcode" className="mt-10 block font-mono text-[10px] uppercase tracking-widest text-warning">Staff passcode</label>
              <input id="staff-passcode" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="mt-3 h-13 w-full rounded-none border border-border bg-background px-4 font-mono text-base tracking-widest outline-none transition-colors focus:border-warning" placeholder="••••••••••••" />
              {error && <p role="alert" className="mt-3 font-mono text-xs uppercase text-destructive">{error}</p>}
              <Button type="submit" disabled={busy} className="mt-5 flex h-13 w-full justify-between rounded-none bg-warning px-5 font-mono text-xs uppercase tracking-widest text-background hover:bg-warning/85">{busy ? "Verifying…" : "Request clearance"}<ArrowRight /></Button>
              <div className="mt-9 flex justify-between border-t border-border pt-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground"><span>Encrypted channel</span><span>Internal use only</span></div>
            </form>
          </div>
        </div>
        <div className="admin-warning-band border-y border-warning/50 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-warning">Restricted // Surveillance active // Restricted // Surveillance active</div>
      </main>
    );
  }

  const stats = [
    { key: "guests" as const, label: "Custom guest files", value: guestCount, sub: "edits & additions", Icon: Users },
    { key: "board" as const, label: "Bulletins", value: bulletins.length, sub: `${bulletins.filter((b) => b.published).length} live`, Icon: Megaphone },
    { key: "apps" as const, label: "Entry requests", value: appCount, sub: "accept or reject", Icon: Inbox },
    { key: "banner" as const, label: "Site banner", value: "▲", sub: "top-of-site notice", Icon: Flag },
  ];

  return (
    <PageShell kicker="Internal network / Clearance granted" title="Control room">
      {accessing && <div aria-live="polite" className="admin-access-flash fixed inset-0 z-[60] flex items-center justify-center bg-background font-display text-5xl uppercase text-warning">Access granted</div>}
      <div className="mb-8 flex flex-wrap items-center gap-3 border-y border-border py-4">
        <span className="h-2 w-2 animate-pulse rounded-full bg-warning" />
        <span className="label-mono">Secure session active <span className="text-warning">/</span> Changes go live instantly</span>
        <Button variant="outline" size="sm"
          onClick={async () => {
            await logout({});
            setUnlocked(false);
          }}
          className="ml-auto rounded-none border-border bg-card/40 font-mono text-[11px] uppercase text-muted-foreground hover:border-warning hover:text-foreground"
        >
          <Lock className="h-3.5 w-3.5" /> Lock
        </Button>
      </div>

      <div className="mb-10 grid border border-border sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Control room sections">
        {stats.map(({ key, label, value, sub, Icon }, i) => (
          <Button variant="ghost"
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`admin-section relative h-auto min-h-36 flex-col items-start justify-between rounded-none border-b border-border p-5 text-left transition-colors hover:bg-warning/5 sm:border-b-0 ${i > 0 ? "lg:border-l" : ""} ${
              tab === key ? "bg-warning/10" : "bg-card/30"
            }`}
          >
            {tab === key && <span className="absolute inset-x-0 top-0 h-0.5 bg-warning" />}
            <div className="flex w-full items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">0{i + 1} / {label}</span>
              <Icon className={`h-4 w-4 ${tab === key ? "text-warning" : "text-muted-foreground"}`} />
            </div>
            <div><p className="font-display text-5xl leading-none text-foreground">{value}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-warning">{sub}</p></div>
          </Button>
        ))}
      </div>

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
              <button
                type="submit"
                disabled={busy}
                className="hairline bg-card/60 px-4 py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-rust disabled:opacity-50"
              >
                {busy ? "Saving…" : "Publish"}
              </button>
              {draft.id ? (
                <button
                  type="button"
                  onClick={() => setDraft({ ...emptyBulletin })}
                  className="hairline bg-card/40 px-4 py-3 font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase"
                >
                  Cancel
                </button>
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
                  <button
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
                    className="hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-rust"
                  >
                    Edit
                  </button>
                  <button
                    onClick={async () => {
                      await removeBulletin({ data: { id: b.id } });
                      await refresh();
                    }}
                    className="hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-destructive uppercase hover:border-destructive"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
