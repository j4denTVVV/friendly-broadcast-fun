import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import {
  listApplications,
  setApplicationStatus,
  deleteApplication,
  type ApplicationRow,
} from "@/lib/admin.functions";

const btn = "hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] uppercase disabled:opacity-50";

export function ApplicationsAdmin({ onCount }: { onCount: (n: number) => void }) {
  const load = useServerFn(listApplications);
  const setStatus = useServerFn(setApplicationStatus);
  const remove = useServerFn(deleteApplication);
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const refresh = useCallback(async () => {
    const a = await load({});
    setApps(a);
    onCount(a.length);
  }, [load, onCount]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const decide = async (a: ApplicationRow, status: string) => {
    setBusy(a.id);
    setMsg("");
    try {
      const res = await setStatus({ data: { id: a.id, status, notes: notes[a.id] ?? a.notes ?? "" } });
      if (status === "REJECTED") setMsg(res.emailed ? `Rejection email sent to ${a.contact}.` : `Rejected — no valid email on file for ${a.name}.`);
      await refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      {msg ? <p className="label-mono text-rust">{msg}</p> : null}
      {apps.length === 0 ? <p className="label-mono">No entry requests yet.</p> : null}
      {apps.map((a) => (
        <article key={a.id} className="panel space-y-2 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-base tracking-[0.18em] uppercase">{a.name}</span>
            <span className="label-mono">@{a.handle}</span>
            <span className={`label-mono ml-auto ${a.status === "REJECTED" ? "text-destructive" : a.status === "ACCEPTED" ? "text-rust" : ""}`}>{a.status}</span>
          </div>
          <p className="label-mono">{a.contact} {a.platform ? `· ${a.platform}` : ""}</p>
          {a.links ? <p className="font-mono text-xs break-all text-muted-foreground">{a.links}</p> : null}
          <p className="text-sm leading-relaxed text-muted-foreground">{a.pitch}</p>
          <input
            placeholder="Optional note (included in rejection email)"
            value={notes[a.id] ?? a.notes ?? ""}
            onChange={(e) => setNotes({ ...notes, [a.id]: e.target.value })}
            className="hairline w-full bg-background/70 px-3 py-2 font-mono text-xs outline-none focus:border-rust"
          />
          <div className="flex gap-2 pt-1">
            <button disabled={busy === a.id} onClick={() => decide(a, "ACCEPTED")} className={`${btn} hover:border-rust`}>Accept</button>
            <button disabled={busy === a.id} onClick={() => decide(a, "REJECTED")} className={`${btn} text-destructive hover:border-destructive`}>Reject & email</button>
            <button
              disabled={busy === a.id}
              onClick={async () => {
                await remove({ data: { id: a.id } });
                await refresh();
              }}
              className={`${btn} ml-auto text-muted-foreground`}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
