import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { BannerMessage } from "@/lib/admin.functions";

type Banner = { message: string; link: string | null; enabled: boolean; messages: BannerMessage[]; updated_at: string };

export function SiteBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [hidden, setHidden] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_banner").select("message, link, enabled, messages, updated_at").eq("id", 1).maybeSingle();
      if (data) setBanner(data as Banner);
    };
    void load();
    const ch = supabase.channel("site-banner")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_banner" }, () => { setIndex(0); setHidden(false); void load(); })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
  }, []);

  const messages = banner?.messages?.length ? banner.messages : banner?.message ? [{ text: banner.message, link: banner.link, animation: "slide" as const }] : [];
  useEffect(() => {
    if (messages.length < 2 || !banner?.enabled || hidden) return;
    const timer = window.setInterval(() => setIndex((n) => (n + 1) % messages.length), 5500);
    return () => window.clearInterval(timer);
  }, [messages.length, banner?.enabled, banner?.updated_at, hidden]);

  if (!banner?.enabled || messages.length === 0 || hidden) return null;
  const current = messages[index % messages.length];
  if (!current) return null;
  const content = <BannerText key={`${banner.updated_at}-${index}`} text={current.text} animation={current.animation} />;
  return <BannerStrip onClose={() => setHidden(true)}>{current.link ? <a href={current.link} className="hover:underline">{content}</a> : content}</BannerStrip>;
}

export function BannerText({ text, animation }: { text: string; animation: BannerMessage["animation"] }) {
  return <span className={`site-banner-message site-banner-${animation} font-display text-[11px] uppercase sm:text-xs`} aria-label={text}>{text}</span>;
}

export function BannerStrip({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="site-banner relative z-40 overflow-hidden border-y border-foreground/80 bg-background text-foreground">
      <div className="site-banner-grain pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex min-h-10 items-center justify-center gap-4 px-10 py-2.5">
        <span className="site-banner-chevron" aria-hidden />
        <span className="site-banner-bars" aria-hidden><i /><i /><i /></span>
        <span className="site-banner-text min-w-0 text-center">{children}</span>
        <span className="site-banner-bars" aria-hidden><i /><i /><i /></span>
        <span className="site-banner-chevron rotate-180" aria-hidden />
        {onClose && <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Dismiss banner" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-none text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></Button>}
      </div>
    </div>
  );
}