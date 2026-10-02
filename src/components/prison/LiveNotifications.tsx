import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; title: string; body: string | null; tone: string; link: string | null };

/** Pops up notifications sent from the control room, live, for every visitor on the site. */
export function LiveNotifications() {
  useEffect(() => {
    const channel = supabase
      .channel("site-notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "site_notifications" }, (payload) => {
        const n = payload.new as Row;
        const opts = {
          description: n.body ?? undefined,
          duration: 9000,
          ...(n.link ? { action: { label: "Open", onClick: () => window.location.assign(n.link!) } } : {}),
        };
        const title = `▲ ${n.title}`;
        if (n.tone === "alert") toast.error(title, opts);
        else if (n.tone === "success") toast.success(title, opts);
        else toast(title, opts);
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);
  return null;
}
