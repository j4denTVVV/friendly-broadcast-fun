import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, UserRound, X } from "lucide-react";
import { deleteGuest, listGuests, saveGuest, type GuestRow } from "@/lib/admin.functions";

const empty = {
  file: "",
  name: "",
  aliases: "",
  role: "INMATE",
  platform: "",
  bio: "",
  image_url: "",
  socialsText: "",
  clearance: "REVEALED",
  published: true,
};
type Draft = typeof empty & { id?: string };

const input =
  "hairline mt-1.5 w-full bg-background/70 px-3 py-2.5 font-mono text-sm outline-none transition-colors focus:border-rust";

function parseSocials(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [rawPlatform = "", ...rest] = l.split("|");
      const platform = rawPlatform.trim();
      const url = rest.join("|").trim();
      return url ? { platform, url } : { platform: "Link", url: platform };
    });
}

export function GuestsAdmin({ onCount }: { onCount?: (n: number) => void }) {
  const load = useServerFn(listGuests);
  const save = useServerFn(saveGuest);
  const remove = useServerFn(deleteGuest);
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [draft, setDraft] = useState<Draft>({ ...empty });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");

  const refresh = useCallback(async () => {
    const g = await load({});
    setGuests(g);
    onCount?.(g.length);
  }, [load, onCount]);
  useEffect(() => {
    void refresh().catch(() => {});
  }, [refresh]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) => `${g.name} ${g.file} ${g.role} ${g.aliases}`.toLowerCase().includes(q));
  }, [guests, query]);

  const field = (key: keyof typeof empty, label: string, placeholder = "") => (
    <div>
      <label className="label-mono block">{label}</label>
      <input
        value={String(draft[key])}
        placeholder={placeholder}
        onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
        className={input}
      />
    </div>
  );

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <form
        className="panel animate-rise space-y-5 p-6 md:p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          setNotice("");
          try {
            const { socialsText, ...rest } = draft;
            await save({ data: { ...rest, socials: parseSocials(socialsText) } });
            setNotice(`${draft.name.toUpperCase()} saved — live for everyone now.`);
            setDraft({ ...empty });
            await refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl tracking-[0.2em] uppercase">
            {draft.id ? "Edit file" : "New file"}
          </h3>
          {draft.id ? (
            <button
              type="button"
              onClick={() => setDraft({ ...empty })}
              className="label-mono flex items-center gap-1 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          ) : null}
        </div>

        {/* Preview */}
        <div className="hairline flex items-center gap-4 bg-background/50 p-4">
          <div className="hairline flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden bg-card">
            {draft.image_url ? (
              <img src={draft.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserRound className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="label-mono text-rust">#{draft.file || "000"}</p>
            <p className="font-display truncate text-lg tracking-[0.18em] uppercase">
              {draft.name || "Name here"}
            </p>
            <p className="label-mono">
              {draft.role || "INMATE"}
              {draft.platform ? ` · ${draft.platform}` : ""}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {field("file", "File number", "039")}
          {field("name", "Name", "GUESTNAME")}
          <div>
            <label className="label-mono block">Role</label>
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className={input}
            >
              <option value="GUARD">Guard</option>
              <option value="GUIDANCE COUNSELLOR">Guidance Counsellor</option>
              <option value="INMATE">Inmate</option>
              <option value="GUEST">Guest</option>
            </select>
          </div>
          {field("platform", "Platform", "TWITCH")}
        </div>
        {field("image_url", "Photo link", "https://…")}
        {field("aliases", "Search nicknames (comma separated)", "NICK, OTHER NAME")}
        <div>
          <label className="label-mono block">Bio</label>
          <textarea
            rows={4}
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            className={input}
          />
        </div>
        <div>
          <label className="label-mono block">Socials — one per line: Platform | link</label>
          <textarea
            rows={3}
            value={draft.socialsText}
            placeholder={"TikTok | https://www.tiktok.com/@name"}
            onChange={(e) => setDraft({ ...draft, socialsText: e.target.value })}
            className={input}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-mono block">Visibility</label>
            <select
              value={draft.clearance}
              onChange={(e) => setDraft({ ...draft, clearance: e.target.value })}
              className={input}
            >
              <option value="REVEALED">On roster (public)</option>
              <option value="CONFIRMED">Hidden until searched</option>
              <option value="CLASSIFIED">Classified</option>
            </select>
          </div>
          <label className="hairline mt-6 flex cursor-pointer items-center justify-between bg-background/50 px-4 py-2.5">
            <span className="label-mono">{draft.published ? "Live on site" : "Draft (hidden)"}</span>
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              className="h-4 w-4 accent-[var(--rust)]"
            />
          </label>
        </div>
        {error ? <p className="font-mono text-xs text-destructive uppercase">{error}</p> : null}
        {notice ? <p className="font-mono text-xs text-rust uppercase">{notice}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="hairline flex w-full items-center justify-center gap-2 bg-card px-4 py-3.5 font-mono text-[11px] tracking-[0.3em] uppercase transition-colors hover:border-rust disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {busy ? "Saving…" : draft.id ? "Save changes" : "Add to roster"}
        </button>
      </form>

      <div className="space-y-4">
        <div className="hairline flex items-center gap-2 bg-card/50 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full bg-transparent py-3 font-mono text-sm outline-none"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="label-mono panel p-6 text-center">
            {guests.length ? "No matches." : "No guests added yet."}
          </p>
        ) : null}
        {filtered.map((g) => (
          <article
            key={g.id}
            className={`panel group flex items-center gap-4 p-4 transition-colors hover:border-rust ${
              draft.id === g.id ? "border-rust" : ""
            }`}
          >
            <div className="hairline flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-background">
              {g.image_url ? (
                <img src={g.image_url} alt={g.name} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="label-mono text-rust">#{g.file}</span>
                <span
                  className={`label-mono ml-auto px-2 py-0.5 ${
                    g.published ? "bg-rust/15 text-rust" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {g.published ? "LIVE" : "DRAFT"}
                </span>
              </div>
              <h4 className="font-display truncate text-base tracking-[0.18em] uppercase">{g.name}</h4>
              <p className="label-mono truncate">{g.role}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                aria-label={`Edit ${g.name}`}
                onClick={() => {
                  setDraft({
                    id: g.id,
                    file: g.file,
                    name: g.name,
                    aliases: g.aliases,
                    role: g.role,
                    platform: g.platform ?? "",
                    bio: g.bio,
                    image_url: g.image_url ?? "",
                    socialsText: (g.socials ?? []).map((s) => `${s.platform} | ${s.url}`).join("\n"),
                    clearance: g.clearance,
                    published: g.published,
                  });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hairline p-2 hover:border-rust"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                aria-label={`Delete ${g.name}`}
                onClick={async () => {
                  if (!confirm(`Remove ${g.name}?`)) return;
                  await remove({ data: { id: g.id } });
                  await refresh();
                }}
                className="hairline p-2 text-destructive hover:border-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
