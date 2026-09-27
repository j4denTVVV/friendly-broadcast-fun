import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Banner = { message: string; link: string | null; enabled: boolean };

export function SiteBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_banner").select("message, link, enabled").eq("id", 1).maybeSingle();
      setBanner(data ?? null);
    };
    void load();
    const ch = supabase
      .channel("site-banner")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_banner" }, () => void load())
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, []);

  if (!banner?.enabled || !banner.message.trim() || hidden) return null;

  const inner = (
    <span className="font-display text-[11px] tracking-[0.35em] uppercase sm:text-xs">{banner.message}</span>
  );

  return <BannerStrip onClose={() => setHidden(true)}>{banner.link ? <a href={banner.link} className="hover:underline">{inner}</a> : inner}</BannerStrip>;
}

export function BannerStrip({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="site-banner relative z-40 border-y border-foreground/80 bg-background text-foreground">
      <div className="site-banner-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex items-center justify-center gap-4 px-10 py-2.5">
        <span className="site-banner-chevron" aria-hidden />
        <span className="site-banner-bars" aria-hidden><i /><i /><i /></span>
        <span className="site-banner-text text-center">{children}</span>
        <span className="site-banner-bars" aria-hidden><i /><i /><i /></span>
        <span className="site-banner-chevron rotate-180" aria-hidden />
        {onClose ? (
          <button onClick={onClose} aria-label="Dismiss banner" className="absolute right-3 text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
