import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getBannerAdmin, saveBanner, type BannerRow } from "@/lib/admin.functions";
import { BannerStrip } from "./SiteBanner";

const input = "hairline mt-1 w-full bg-background/70 px-3 py-2 font-mono text-sm outline-none focus:border-rust";

export function BannerAdmin() {
  const load = useServerFn(getBannerAdmin);
  const save = useServerFn(saveBanner);
  const [b, setB] = useState<BannerRow>({ message: "", link: null, enabled: false });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void load({}).then(setB);
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      await save({ data: b });
      setMsg(b.enabled ? "Banner is live across the site ✓" : "Banner saved (hidden) ✓");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel animate-rise max-w-2xl space-y-4 p-6">
      <h3 className="font-display text-lg tracking-[0.2em] uppercase">Site banner</h3>
      <p className="label-mono">Announcement strip shown at the top of every page.</p>
      <div>
        <label className="label-mono block">Message</label>
        <input maxLength={200} value={b.message} onChange={(e) => setB({ ...b, message: e.target.value })} className={input} />
      </div>
      <div>
        <label className="label-mono block">Link (optional)</label>
        <input value={b.link ?? ""} placeholder="/trailer or https://…" onChange={(e) => setB({ ...b, link: e.target.value || null })} className={input} />
      </div>
      <label className="label-mono flex items-center gap-2">
        <input type="checkbox" checked={b.enabled} onChange={(e) => setB({ ...b, enabled: e.target.checked })} />
        Show on site
      </label>
      <div>
        <p className="label-mono mb-2">Preview</p>
        <BannerStrip>
          <span className="font-display text-[11px] tracking-[0.35em] uppercase sm:text-xs">{b.message || "YOUR MESSAGE"}</span>
        </BannerStrip>
      </div>
      {msg ? <p className="label-mono text-rust">{msg}</p> : null}
      <button disabled={busy} className="hairline bg-card/60 px-4 py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-rust disabled:opacity-50">
        {busy ? "Saving…" : "Save banner"}
      </button>
    </form>
  );
}
