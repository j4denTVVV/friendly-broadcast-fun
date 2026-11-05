import { Confetti } from "./Confetti";

/** Shown on "Who's inside?" once every file is unsealed (or an admin is viewing). */
export function BreakoutComplete({ admin, total }: { admin: boolean; total: number }) {
  return (
    <div className="breakout-card panel corner-marks relative mb-10 overflow-hidden p-6 md:p-8">
      <Confetti count={70} />
      <div className="absolute inset-x-0 top-0 h-2 [background:repeating-linear-gradient(-45deg,var(--rust)_0_12px,transparent_12px_24px)]" />
      <p className="font-mono text-[11px] tracking-[0.25em] text-success">
        {admin ? "> ADMIN OVERRIDE · ALL CELLS OPEN" : "> ALL FILES UNSEALED"}
      </p>
      <h2 className="breakout-title mt-3 font-display text-5xl uppercase leading-none text-foreground md:text-7xl">
        Break<span className="text-rust">out</span>
      </h2>
      <p className="mt-3 max-w-xl text-muted-foreground">
        {admin
          ? `Staff clearance active. All ${total} files on record are open to you.`
          : `You've found all ${total} files. Every identity inside is exposed — nobody stays locked up now.`}
      </p>
    </div>
  );
}
