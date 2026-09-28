import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBannerAdmin, saveBanner, type BannerMessage, type BannerRow } from "@/lib/admin.functions";
import { BannerStrip, BannerText } from "./SiteBanner";

const blank: BannerMessage = { text: "", link: null, animation: "slide" };
const input = "hairline mt-2 w-full bg-background/70 px-3 py-3 font-mono text-xs outline-none focus:border-warning";

export function BannerAdmin() {
  const load = useServerFn(getBannerAdmin);
  const save = useServerFn(saveBanner);
  const [b, setB] = useState<BannerRow>({ message: "", link: null, enabled: false, messages: [{ ...blank }] });
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(0);

  useEffect(() => {
    void load({}).then((data) => setB({ ...data, messages: data.messages?.length ? data.messages : data.message ? [{ text: data.message, link: data.link, animation: "slide" }] : [{ ...blank }] })).catch(() => setNotice("Could not load the banner."));
  }, [load]);

  const updateMessage = (index: number, change: Partial<BannerMessage>) => setB((current) => ({ ...current, messages: current.messages.map((m, i) => i === index ? { ...m, ...change } : m) }));
  const move = (index: number, direction: number) => setB((current) => {
    const messages = [...current.messages];
    const next = index + direction;
    if (next < 0 || next >= messages.length) return current;
    const first = messages[index];
    const second = messages[next];
    if (!first || !second) return current;
    messages[index] = second;
    messages[next] = first;
    return { ...current, messages };
  });

  useEffect(() => {
    if (b.messages.length < 2) return;
    const timer = window.setInterval(() => setPreview((n) => (n + 1) % b.messages.length), 5500);
    return () => window.clearInterval(timer);
  }, [b.messages.length]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      await save({ data: b });
      setNotice(b.enabled ? "Sequence transmitted. Changes are live." : "Sequence saved. Banner hidden.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  };

  const active = b.messages[preview % b.messages.length] ?? blank;
  return (
    <form onSubmit={submit} className="animate-rise max-w-4xl space-y-7">
      <div className="border-b border-border pb-5">
        <p className="label-mono text-warning">Transmission / 04</p>
        <h2 className="mt-2 text-4xl sm:text-5xl">Site banner</h2>
        <p className="mt-2 text-sm text-muted-foreground">Messages play in order, then repeat. Each stays on screen for 5.5 seconds.</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-4">
        <span className="font-mono text-xs uppercase text-muted-foreground">Broadcast status <strong className={b.enabled ? "text-warning" : "text-foreground"}>{b.enabled ? " / Live" : " / Off air"}</strong></span>
        <label className="flex cursor-pointer items-center gap-3 font-mono text-xs uppercase text-foreground">
          <input type="checkbox" checked={b.enabled} onChange={(e) => setB({ ...b, enabled: e.target.checked })} className="accent-warning" /> Show on site
        </label>
      </div>
      <div className="space-y-3">
        {b.messages.map((item, i) => (
          <div key={i} className="admin-message-grid relative border border-border bg-card/40 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <span className="font-mono text-xs text-warning">TRANSMISSION {String(i + 1).padStart(2, "0")}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" title="Move up" aria-label={`Move message ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp /></Button>
                <Button type="button" variant="ghost" size="icon" title="Move down" aria-label={`Move message ${i + 1} down`} disabled={i === b.messages.length - 1} onClick={() => move(i, 1)}><ArrowDown /></Button>
                <Button type="button" variant="ghost" size="icon" title="Remove message" aria-label={`Remove message ${i + 1}`} disabled={b.messages.length === 1} onClick={() => setB({ ...b, messages: b.messages.filter((_, j) => j !== i) })}><Trash2 /></Button>
              </div>
            </div>
            <label className="label-mono block">Message
              <input required maxLength={200} value={item.text} onChange={(e) => updateMessage(i, { text: e.target.value })} className={input} placeholder="Enter your announcement" />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="label-mono block">Link / optional
                <input value={item.link ?? ""} onChange={(e) => updateMessage(i, { link: e.target.value || null })} className={input} placeholder="/trailer or https://…" />
              </label>
              <label className="label-mono block">Entrance
                <select value={item.animation} onChange={(e) => updateMessage(i, { animation: e.target.value as BannerMessage["animation"] })} className={input}>
                  <option value="slide">Slide up</option><option value="typewriter">Typewriter</option><option value="glitch">Signal glitch</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" disabled={b.messages.length >= 12} onClick={() => setB({ ...b, messages: [...b.messages, { ...blank }] })} className="rounded-none border-dashed font-mono text-xs uppercase tracking-widest"><Plus /> Add message</Button>
      <div className="space-y-3 border-t border-border pt-6">
        <div className="flex justify-between gap-4"><p className="label-mono">Live preview</p><span className="label-mono">{String(preview % b.messages.length + 1).padStart(2, "0")} / {String(b.messages.length).padStart(2, "0")}</span></div>
        <BannerStrip><BannerText key={`${preview}-${active.text}`} text={active.text || "YOUR MESSAGE"} animation={active.animation} /></BannerStrip>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={busy} className="rounded-none bg-warning px-6 font-mono text-xs uppercase tracking-widest text-background hover:bg-warning/85">{busy ? "Transmitting…" : "Save sequence"}</Button>
        {notice && <p role="status" className="font-mono text-xs text-warning">{notice}</p>}
      </div>
    </form>
  );
}