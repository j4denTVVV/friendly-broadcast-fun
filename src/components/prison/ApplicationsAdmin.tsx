import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import {
  listApplications,
  setApplicationStatus,
  deleteApplication,
  type ApplicationRow,
} from "@/lib/admin.functions";

const btn = "hairline bg-card/50 px-3 py-2 font-mono text-[10px] tracking-[0.25em] uppercase disabled:opacity-50";

type Pending = { app: ApplicationRow; status: "ACCEPTED" | "REJECTED"; resend: boolean };

export function ApplicationsAdmin({ onCount }: { onCount: (n: number) => void }) {
  const load = useServerFn(listApplications);
  const setStatus = useServerFn(setApplicationStatus);
  const remove = useServerFn(deleteApplication);
  const [apps, setApps] = useState<ApplicationRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  const [confirm, setConfirm] = useState<Pending | null>(null);

  const refresh = useCallback(async () => {
    const a = await load({});
    setApps(a);
    onCount(a.length);
  }, [load, onCount]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const ask = (app: ApplicationRow, status: "ACCEPTED" | "REJECTED") => {
    const already = app.decision_email_sent && app.decision_email_type === status;
    setConfirm({ app, status, resend: already });
  };

  const run = async (app: ApplicationRow, status: string, sendEmail: boolean) => {
    setBusy(app.id);
    setMsg(null);
    try {
      const res = await setStatus({ data: { id: app.id, status, sendEmail } });
      if (status === "PENDING") setMsg({ text: "Marked as pending — no email sent." });
      else if (res.email === "sent")
        setMsg({ text: status === "ACCEPTED" ? "APPLICATION ACCEPTED · EMAIL SENT ✓" : "APPLICATION REJECTED · DECISION EMAIL SENT ✓" });
      else if (res.email === "failed")
        setMsg({ text: `Decision saved (${status}) · EMAIL FAILED TO SEND${"error" in res && res.error ? ` — ${res.error}` : ""}`, bad: true });
      await refresh();
    } catch (e) {
      setMsg({ text: e instanceof Error ? e.message : "Something went wrong", bad: true });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      {msg ? <p className={`label-mono ${msg.bad ? "text-destructive" : "text-rust"}`}>{msg.text}</p> : null}
      {apps.length === 0 ? <p className="label-mono">No entry requests yet.</p> : null}
      {apps.map((a) => (
        <article key={a.id} className="panel space-y-2 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-display text-base tracking-[0.18em] uppercase">{a.name}</span>
            <span className="label-mono">@{a.handle}</span>
            <span className={`label-mono hairline ml-auto px-2 py-1 ${a.status === "REJECTED" ? "text-destructive" : a.status === "ACCEPTED" ? "text-rust" : ""}`}>{a.status}</span>
          </div>
          <p className="label-mono">{a.contact} {a.platform ? `· ${a.platform}` : ""}</p>
          {a.links ? <p className="font-mono text-xs break-all text-muted-foreground">{a.links}</p> : null}
          <p className="text-sm leading-relaxed text-muted-foreground">{a.pitch}</p>

          <div className="hairline bg-background/40 p-3 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground space-y-1">
            <p className="text-foreground">Email history</p>
            <p>
              Email status:{" "}
              <span className={a.decision_email_status === "FAILED" ? "text-destructive" : a.decision_email_status === "SENT" ? "text-rust" : ""}>
                {a.decision_email_status ?? "NOT SENT"}
              </span>
            </p>
            {a.decision_email_type ? <p>Decision: {a.decision_email_type}</p> : null}
            {a.decision_email_to ? <p className="normal-case">Sent to: {a.decision_email_to}</p> : null}
            {a.decision_email_sent_at ? <p>Sent: {new Date(a.decision_email_sent_at).toLocaleString()}</p> : null}
            {a.email_log && a.email_log.length > 0 ? (
              <ul className="space-y-0.5 border-t border-border/50 pt-2">
                {[...a.email_log].reverse().map((e, i) => (
                  <li key={i} className="normal-case">
                    <span className={e.status === "FAILED" ? "text-destructive" : "text-rust"}>{e.status}</span> · {e.type} · {new Date(e.at).toLocaleString()}
                    {e.error ? ` — ${e.error}` : ""}
                  </li>
                ))}
              </ul>
            ) : null}
            {a.decision_email_status === "FAILED" ? (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-destructive">Email failed to send{a.decision_email_error ? ` — ${a.decision_email_error}` : ""}</span>
                {a.status !== "PENDING" ? (
                  <button disabled={busy === a.id} onClick={() => run(a, a.status, true)} className={`${btn} hover:border-rust`}>Retry email</button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button disabled={busy === a.id} onClick={() => ask(a, "ACCEPTED")} className={`${btn} hover:border-rust`}>Accept application</button>
            <button disabled={busy === a.id} onClick={() => ask(a, "REJECTED")} className={`${btn} text-destructive hover:border-destructive`}>Reject application</button>
            <button disabled={busy === a.id || a.status === "PENDING"} onClick={() => run(a, "PENDING", false)} className={btn}>Mark as pending</button>
            <button
              disabled={busy === a.id}
              onClick={async () => {
                if (!window.confirm(`Delete ${a.name}'s application?`)) return;
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

      {confirm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={() => setConfirm(null)}>
          <div className="panel w-full max-w-md space-y-4 p-6" onClick={(e) => e.stopPropagation()}>
            {confirm.resend ? (
              <>
                <p className="font-display text-lg tracking-[0.18em] uppercase">Decision email already sent</p>
                <p className="text-sm text-muted-foreground">
                  This applicant has already received {confirm.status === "ACCEPTED" ? "an" : "a"} {confirm.status === "ACCEPTED" ? "ACCEPTANCE" : "REJECTION"} email. Send again?
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-lg tracking-[0.18em] uppercase">
                  {confirm.status === "ACCEPTED" ? "Accept this application?" : "Reject this application?"}
                </p>
                <p className="text-sm text-muted-foreground">
                  This will mark the applicant as {confirm.status === "ACCEPTED" ? "accepted and send an acceptance email" : "unsuccessful and send a decision email"} to:
                </p>
                <p className="label-mono text-foreground normal-case">{confirm.app.contact}</p>
              </>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} className={btn}>Cancel</button>
              <button
                onClick={() => {
                  const c = confirm;
                  setConfirm(null);
                  void run(c.app, c.status, true);
                }}
                className={`${btn} ${confirm.status === "ACCEPTED" ? "hover:border-rust" : "text-destructive hover:border-destructive"}`}
              >
                {confirm.resend ? "Resend email" : "Confirm & send"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
