import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteNotification, listNotifications, sendNotification, type NotificationRow } from "@/lib/admin.functions";

const field = "w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-destructive";

export function NotificationsAdmin() {
  const list = useServerFn(listNotifications);
  const send = useServerFn(sendNotification);
  const remove = useServerFn(deleteNotification);
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [form, setForm] = useState({ title: "", body: "", tone: "info", link: "" });
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => setRows(await list({})), [list]);
  useEffect(() => { void refresh(); }, [refresh]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        className="panel space-y-3 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await send({ data: form });
            toast.success("Alert sent to everyone on the site");
            setForm({ title: "", body: "", tone: "info", link: "" });
            await refresh();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to send");
          } finally {
            setBusy(false);
          }
        }}
      >
        <p className="label-mono text-destructive">Broadcast live alert</p>
        <p className="text-xs text-muted-foreground">Pops up instantly for every visitor currently on the site.</p>
        <input className={field} placeholder="Title (e.g. NEW FILE UNSEALED)" value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className={field} rows={3} placeholder="Message (optional)" value={form.body} maxLength={400} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select className={field} value={form.tone} onChange={(e) => setForm({ ...form, tone: e.target.value })}>
            <option value="info">Notice</option>
            <option value="alert">Alarm (red)</option>
            <option value="success">Good news (green)</option>
          </select>
          <input className={field} placeholder="Link (optional, e.g. /roster)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        </div>
        <Button type="submit" disabled={busy || !form.title.trim()} className="w-full rounded-none font-mono uppercase">
          {busy ? "Transmitting…" : "Send live alert"}
        </Button>
      </form>

      <div className="panel p-6">
        <p className="label-mono">Recent alerts</p>
        <ul className="mt-4 space-y-2">
          {rows.length === 0 && <li className="text-sm text-muted-foreground">No alerts sent yet.</li>}
          {rows.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-3 border border-border bg-background/60 p-3">
              <div>
                <p className="font-mono text-xs uppercase text-foreground">{r.title}</p>
                {r.body && <p className="mt-1 text-xs text-muted-foreground">{r.body}</p>}
                <p className="mt-1 font-mono text-[10px] uppercase text-muted-foreground">{r.tone} · {new Date(r.created_at).toLocaleString()}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-none font-mono text-[10px] uppercase" onClick={async () => { await remove({ data: { id: r.id } }); await refresh(); }}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
