import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { PageShell } from "@/components/prison/PageShell";
import { GuestsAdmin } from "@/components/prison/GuestsAdmin";
import {
  adminLogin,
  adminLogout,
  adminStatus,
  listApplications,
  setApplicationStatus,
  deleteApplication,
  listAllBulletins,
  saveBulletin,
  deleteBulletin,
  type ApplicationRow,
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
  const loadApps = useServerFn(listApplications);
  const setStatus = useServerFn(setApplicationStatus);
  const removeApp = useServerFn(deleteApplication);
  const loadBulletins = useServerFn(listAllBulletins);
  const persistBulletin = useServerFn(saveBulletin);
  const removeBulletin = useServerFn(deleteBulletin);

  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"apps" | "board" | "guests">("apps");
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [bulletins, setBulletins] = useState<BulletinRow[]>([]);
  const [draft, setDraft] = useState<BulletinDraft>({ ...emptyBulletin });
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [a, b] = await Promise.all([loadApps({}), loadBulletins({})]);
    setApps(a);
    setBulletins(b);
  }, [loadApps, loadBulletins]);

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
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (unlocked === null) {
    return (
      <PageShell kicker="Restricted" title="Control room">
        <p className="label-mono animate-flicker">Verifying clearance…</p>
      </PageShell>
    );
  }

  if (!unlocked) {
    return (
      <PageShell kicker="Restricted" title="Control room">
        <form onSubmit={onLogin} className="panel animate-siren max-w-md space-y-4 p-8">
          <label className="label-mono block text-rust">Staff passcode</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="hairline w-full bg-background/70 px-3 py-3 font-mono text-sm outline-none focus:border-rust"
          />
          {error ? <p className="font-mono text-xs tracking-[0.2em] text-destructive uppercase">{error}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="hairline w-full bg-card/60 px-4 py-3 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors hover:border-rust hover:text-foreground disabled:opacity-50"
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </PageShell>
    );
  }

  return (
    <PageShell kicker="Restricted" title="Control room">
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {(["apps", "board", "guests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`hairline px-4 py-2 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors ${
              tab === t ? "border-rust bg-card text-foreground" : "bg-card/40 text-muted-foreground"
            }`}
          >
            {t === "apps" ? `Requests (${apps.length})` : t === "board" ? `Bulletin board (${bulletins.length})` : "Guests"}
          </button>
        ))}
        <button
          onClick={async () => {
            await logout({});
            setUnlocked(false);
          }}
          className="hairline ml-auto bg-card/40 px-4 py-2 font-mono text-[11px] tracking-[0.25em] text-muted-foreground uppercase hover:border-rust"
        >
          Lock
        </button>
      </div>

      {tab === "guests" ? (
        <GuestsAdmin />
      ) : tab === "apps" ? (
        <div className="space-y-4">
          {apps.length === 0 ? (
            <p className="label-mono">No requests yet.</p>
          ) : null}
          {apps.map((a) => (
            <article key={a.id} className="panel animate-rise space-y-3 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-display text-lg tracking-[0.2em] uppercase">{a.name}</h3>
                <span className="label-mono text-rust">{a.handle}</span>
                <span className="label-mono ml-auto">{a.status}</span>
              </div>
              <dl className="grid gap-1 font-mono text-xs text-muted-foreground">
                {a.platform ? <div>Platform: {a.platform}</div> : null}
                {a.contact ? <div>Contact: {a.contact}</div> : null}
                {a.links ? <div className="break-all">Links: {a.links}</div> : null}
              </dl>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{a.pitch}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["APPROVED", "REJECTED", "PENDING"].map((s) => (
                  <button
                    key={s}
                    onClick={async () => {
                      await setStatus({ data: { id: a.id, status: s } });
                      await refresh();
                    }}
                    className="hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-rust"
                  >
                    {s}
                  </button>
                ))}
                <button
                  onClick={async () => {
                    await removeApp({ data: { id: a.id } });
                    await refresh();
                  }}
                  className="hairline ml-auto bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-destructive uppercase hover:border-destructive"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
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
