import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { deleteGuest, listGuests, saveGuest, type GuestRow } from "@/lib/admin.functions";

const empty = {
  file: "",
  name: "",
  aliases: "",
  role: "GUEST",
  platform: "",
  bio: "",
  image_url: "",
  socialsText: "",
  clearance: "CONFIRMED",
  published: true,
};
type Draft = typeof empty & { id?: string };

const input =
  "hairline mt-1 w-full bg-background/70 px-3 py-2 font-mono text-sm outline-none focus:border-rust";

function parseSocials(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [platform, ...rest] = l.split("|");
      const url = rest.join("|").trim();
      return url ? { platform: platform.trim(), url } : { platform: "Link", url: platform.trim() };
    });
}

export function GuestsAdmin() {
  const load = useServerFn(listGuests);
  const save = useServerFn(saveGuest);
  const remove = useServerFn(deleteGuest);
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [draft, setDraft] = useState<Draft>({ ...empty });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => setGuests(await load({})), [load]);
  useEffect(() => {
    void refresh().catch(() => {});
  }, [refresh]);

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
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <form
        className="panel animate-rise space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          try {
            const { socialsText, ...rest } = draft;
            await save({ data: { ...rest, socials: parseSocials(socialsText) } });
            setDraft({ ...empty });
            await refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <h3 className="font-display text-lg tracking-[0.2em] uppercase">
          {draft.id ? "Edit guest" : "Add guest"}
        </h3>
        {field("file", "File number", "e.g. 039")}
        {field("name", "Name", "e.g. GUESTNAME")}
        {field("aliases", "Search nicknames (comma separated)", "NICK, OTHER NAME")}
        {field("role", "Role", "GUEST")}
        {field("platform", "Platform", "TWITCH")}
        {field("image_url", "Photo link (https://…)")}
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
          <label className="label-mono block">Socials (one per line: Platform | link)</label>
          <textarea
            rows={3}
            value={draft.socialsText}
            placeholder={"TikTok | https://www.tiktok.com/@name"}
            onChange={(e) => setDraft({ ...draft, socialsText: e.target.value })}
            className={input}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="label-mono">
            Visibility
            <select
              value={draft.clearance}
              onChange={(e) => setDraft({ ...draft, clearance: e.target.value })}
              className={input}
            >
              <option value="REVEALED">On roster (public)</option>
              <option value="CONFIRMED">Hidden until searched</option>
              <option value="CLASSIFIED">Classified</option>
            </select>
          </label>
          <label className="label-mono mt-5 flex items-center gap-2">
            <input
              type="checkbox"
              checked={draft.published}
              onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
            />
            Live
          </label>
        </div>
        {error ? <p className="font-mono text-xs text-destructive uppercase">{error}</p> : null}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="hairline bg-card/60 px-4 py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-rust disabled:opacity-50"
          >
            {busy ? "Saving…" : draft.id ? "Save" : "Add guest"}
          </button>
          {draft.id ? (
            <button
              type="button"
              onClick={() => setDraft({ ...empty })}
              className="hairline bg-card/40 px-4 py-3 font-mono text-[11px] tracking-[0.3em] text-muted-foreground uppercase"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {guests.length === 0 ? <p className="label-mono">No guests added yet.</p> : null}
        {guests.map((g) => (
          <article key={g.id} className="panel flex gap-4 p-5">
            {g.image_url ? (
              <img src={g.image_url} alt={g.name} className="h-16 w-16 shrink-0 object-cover" />
            ) : null}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <span className="label-mono text-rust">#{g.file}</span>
                <span className="label-mono ml-auto">{g.published ? g.clearance : "HIDDEN"}</span>
              </div>
              <h4 className="font-display text-base tracking-[0.18em] uppercase">{g.name}</h4>
              <p className="label-mono">{g.role}</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() =>
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
                    })
                  }
                  className="hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] uppercase hover:border-rust"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (!confirm(`Remove ${g.name}?`)) return;
                    await remove({ data: { id: g.id } });
                    await refresh();
                  }}
                  className="hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-destructive uppercase hover:border-destructive"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
