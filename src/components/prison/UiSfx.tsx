import { useEffect } from "react";
import { installUiSfx } from "@/lib/sfx";

/** Mounts site-wide hover/click sound effects. */
export function UiSfx() {
  useEffect(() => installUiSfx(), []);
  return null;
}
