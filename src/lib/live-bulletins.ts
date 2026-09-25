import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveBulletin = {
  id: string;
  code: string;
  date_label: string;
  title: string;
  body: string;
  status: string;
  position: number;
};

/**
 * Published bulletins, kept in sync in real time. Any change made in the
 * admin panel appears on every open browser without a refresh.
 */
export function useLiveBulletins() {
  const [bulletins, setBulletins] = useState<LiveBulletin[] | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const { data } = await supabase
        .from("bulletins")
        .select("id, code, date_label, title, body, status, position")
        .eq("published", true)
        .order("position", { ascending: true });
      if (alive) setBulletins((data ?? []) as LiveBulletin[]);
    };

    void load();

    const channel = supabase
      .channel("bulletins-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "bulletins" }, () => {
        void load();
      })
      .subscribe();

    return () => {
      alive = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return bulletins;
}
