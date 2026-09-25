import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { setGuestEntries } from "@/lib/roster";
import type { RosterEntry, SocialLink, Clearance } from "@/config/prison";

/** Loads control-room guests into the roster and keeps them live. Returns a version number to re-render on. */
export function useLiveGuests() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const { data } = await supabase
        .from("guests")
        .select("*")
        .eq("published", true)
        .order("file", { ascending: true });
      if (!alive || !data) return;
      setGuestEntries(
        data.map(
          (g): RosterEntry => ({
            file: g.file,
            revealed: true,
            clearance: (g.clearance as Clearance) || "CONFIRMED",
            name: g.name,
            aliases: g.aliases
              .split(",")
              .map((a) => a.trim().toUpperCase())
              .filter(Boolean),
            role: g.role,
            platform: g.platform ?? undefined,
            bio: g.bio,
            image: g.image_url ?? undefined,
            socials: Array.isArray(g.socials) ? (g.socials as unknown as SocialLink[]) : [],
            status: "CONFIRMED — INSIDE",
          }),
        ),
      );
      setVersion((v) => v + 1);
    };
    void load();
    const channel = supabase
      .channel("guests-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "guests" }, () => void load())
      .subscribe();
    return () => {
      alive = false;
      void supabase.removeChannel(channel);
    };
  }, []);

  return version;
}
