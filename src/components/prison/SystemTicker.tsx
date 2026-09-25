import { systemReadout } from "@/config/prison";
import { StatusDot } from "./Classified";

export function SystemTicker() {
  const items = [...systemReadout, ...systemReadout];
  return (
    <div className="relative overflow-hidden border-y border-border bg-card/40 py-2.5">
      <div className="flex w-max animate-[drift_none] gap-10 px-4 [animation:marquee_38s_linear_infinite]">
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
        {items.map((item, i) => (
          <span
            key={`${item.label}-${i}`}
            className="flex shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.24em] whitespace-nowrap text-muted-foreground uppercase"
          >
            <StatusDot tone={item.tone} />
            {item.label}: <span className="text-foreground/80">{item.value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
