import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageUp, Pencil, Plus, RotateCcw, Search, Trash2, UserRound, X } from "lucide-react";
import {
  deleteGuest,
  listGuests,
  removeBuiltInGuest,
  saveGuest,
  uploadGuestPhoto,
  type GuestRow,
} from "@/lib/admin.functions";
import { roster as baseRoster } from "@/config/prison";

type Item = {
  file: string;
  name: string;
  role: string;
  image: string | undefined;
  original: boolean;
  removed: boolean;
  row: GuestRow | undefined;
};

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
  const removeOriginal = useServerFn(removeBuiltInGuest);
  const upload = useServerFn(uploadGuestPhoto);
  const [uploading, setUploading] = useState(false);
  const [fallbackImage, setFallbackImage] = useState<string | undefined>();
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

  const items = useMemo<Item[]>(() => {
    const byFile = new Map(guests.map((g) => [g.file, g]));
    const list: Item[] = baseRoster
      .filter((r) => r.name)
      .map((r) => {
        const row = byFile.get(r.file);
        byFile.delete(r.file);
        return {
          file: r.file,
          name: row && !row.deleted ? row.name : r.name!,
          role: row && !row.deleted ? row.role : (r.role ?? "GUEST"),
          image: (row && !row.deleted && row.image_url) || r.image,
          original: true,
          removed: !!row?.deleted,
          row,
        };
      });
    for (const row of byFile.values())
      list.push({ file: row.file, name: row.name, role: row.role, image: row.image_url ?? undefined, original: false, removed: false, row });
    return list.sort((a, b) => a.file.localeCompare(b.file));
  }, [guests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((g) => `${g.name} ${g.file} ${g.role}`.toLowerCase().includes(q));
  }, [items, query]);

  const startEdit = (it: Item) => {
    const base = baseRoster.find((r) => r.file === it.file);
    const row = it.row && !it.row.deleted ? it.row : undefined;
    setFallbackImage(base?.image);
    setDraft({
      ...(row ? { id: row.id } : {}),
      file: it.file,
      name: row?.name ?? base?.name ?? "",
      aliases: row?.aliases ?? (base?.aliases ?? []).join(", "),
      role: row?.role ?? base?.role ?? "GUEST",
      platform: row?.platform ?? base?.platform ?? "",
      bio: row?.bio ?? base?.bio ?? "",
      image_url: row?.image_url ?? "",
      socialsText: (row?.socials ?? base?.socials ?? []).map((s) => `${s.platform} | ${s.url}`).join("\n"),
      clearance: row?.clearance ?? base?.clearance ?? "REVEALED",
      published: row?.published ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = () => rej(new Error("Could not read file"));
        r.readAsDataURL(file);
      });
      const { url } = await upload({ data: { dataUrl } });
      setDraft((d) => ({ ...d, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

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
            (setDraft({ ...empty }), setFallbackImage(undefined));
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
            {draft.image_url || fallbackImage ? (
              <img src={draft.image_url || fallbackImage} alt="" className="h-full w-full object-cover" />
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
        <div>
          <label className="label-mono block">Photo</label>
          <label className="hairline mt-1.5 flex cursor-pointer items-center justify-center gap-2 bg-background/50 px-4 py-5 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors hover:border-rust">
            <ImageUp className="h-4 w-4" />
            {uploading ? "Uploading…" : draft.image_url ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => void onPhoto(e.target.files?.[0])}
            />
          </label>
          <p className="label-mono mt-2 text-center">— or paste a photo link —</p>
          <input
            value={draft.image_url}
            onChange={(e) => setDraft({ ...draft, image_url: e.target.value.trim() })}
            placeholder="https://…/photo.jpg"
            className="hairline mt-1.5 w-full bg-background/70 px-3 py-2.5 font-mono text-xs outline-none focus:border-rust"
          />
          {draft.image_url ? (
            <button type="button" onClick={() => setDraft({ ...draft, image_url: "" })} className="label-mono mt-1 hover:text-foreground">
              Remove photo
            </button>
          ) : null}
        </div>
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
          disabled={busy || uploading}
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
            No matches.
          </p>
        ) : null}
        {filtered.map((g) => (
          <article
            key={g.file}
            className={`panel flex items-center gap-4 p-4 transition-colors hover:border-rust ${
              draft.file === g.file && draft.name ? "border-rust" : ""
            } ${g.removed ? "opacity-50" : ""}`}
          >
            <div className="hairline flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-background">
              {g.image ? (
                <img src={g.image} alt={g.name} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="label-mono text-rust">#{g.file}</span>
                <span className="label-mono ml-auto bg-muted px-2 py-0.5 text-muted-foreground">
                  {g.removed ? "REMOVED" : g.row && !g.row.published ? "DRAFT" : g.original && !g.row ? "ORIGINAL" : "LIVE"}
                </span>
              </div>
              <h4 className="font-display truncate text-base tracking-[0.18em] uppercase">{g.name}</h4>
              <p className="label-mono truncate">{g.role}</p>
            </div>
            <div className="flex flex-col gap-1">
              {g.removed ? (
                <button
                  aria-label={`Restore ${g.name}`}
                  onClick={async () => {
                    if (g.row) await remove({ data: { id: g.row.id } });
                    await refresh();
                  }}
                  className="hairline p-2 hover:border-rust"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              ) : (
                <>
                  <button aria-label={`Edit ${g.name}`} onClick={() => startEdit(g)} className="hairline p-2 hover:border-rust">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label={`Remove ${g.name}`}
                    onClick={async () => {
                      if (!confirm(`Remove ${g.name} from the site?`)) return;
                      if (g.original) await removeOriginal({ data: { file: g.file, name: g.name } });
                      else if (g.row) await remove({ data: { id: g.row.id } });
                      await refresh();
                    }}
                    className="hairline p-2 text-destructive hover:border-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
