import { useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; title: string; body: string | null; tone: string; link: string | null; created_at: string };

const toneLabel: Record<string, string> = { info: "Facility notice", alert: "Alarm triggered", success: "Clearance granted" };
const toneColor: Record<string, string> = { info: "text-signal", alert: "text-destructive", success: "text-ok" };

/** Pops up notifications sent from the control room, live, for every visitor on the site. */
export function LiveNotifications() {
  useEffect(() => {
    const channel = supabase
      .channel("site-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "site_notifications" }, (payload) => {
        const n = payload.new as Row;
        const time = new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        toast.custom(
          (id) => (
            <div className="ps-alert" role="status">
              <div className="flex items-start gap-3 p-4 pt-5">
                <span className="mt-1 size-2 shrink-0 animate-pulse-dot rounded-full bg-signal" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-[0.25em] uppercase">
                    <span className={toneColor[n.tone] ?? "text-signal"}>{toneLabel[n.tone] ?? "Facility notice"}</span>
                    <span className="text-muted-foreground">{time}</span>
                  </div>
                  <p className="mt-2 font-display text-xl leading-tight uppercase text-foreground">{n.title}</p>
                  {n.body && <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>}
                  {n.link && (
                    <a href={n.link} onClick={() => toast.dismiss(id)} className="mt-3 inline-block border border-signal px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-signal hover:bg-signal hover:text-background">
                      Open file →
                    </a>
                  )}
                </div>
                <button aria-label="Dismiss" onClick={() => toast.dismiss(id)} className="text-muted-foreground hover:text-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <span className="ps-alert-bar" />
            </div>
          ),
          { duration: 9000, unstyled: true },
        );
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
  return null;
}
