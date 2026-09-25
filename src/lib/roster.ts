import { placeholderFiles, roster as baseRoster, type RosterEntry } from "@/config/prison";

/** Guests added from the control room, merged in at runtime. */
let guestEntries: RosterEntry[] = [];
export function setGuestEntries(entries: RosterEntry[]) {
  guestEntries = entries;
}
function allEntries(): RosterEntry[] {
  const baseFiles = new Set(baseRoster.map((r) => r.file));
  return [...baseRoster, ...guestEntries.filter((g) => !baseFiles.has(g.file))];
}

/** Real announcements first, then unnamed placeholder files. */
export const UNSEALED_STORAGE_KEY = "ps-unsealed-files";

/** File numbers the visitor has personally unsealed through the reveals search. */
export function readUnsealedFiles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(UNSEALED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((f): f is string => typeof f === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Files shown publicly on the roster: those cleared for open release, plus any
 * file this visitor has unsealed via the reveals search terminal.
 */
export function getRosterFiles(unsealed: string[] = []): RosterEntry[] {
  const revealed = allEntries().filter(
    (r) => r.revealed && (clearanceOf(r) === "REVEALED" || unsealed.includes(r.file)),
  );
  const used = new Set(revealed.map((r) => r.file));
  const placeholders: RosterEntry[] = [];
  let n = 1;
  while (placeholders.length < Math.max(0, placeholderFiles)) {
    const file = String(n).padStart(3, "0");
    if (!used.has(file)) placeholders.push({ file, revealed: false });
    n++;
  }
  return [...revealed, ...placeholders];
}

export function findFile(fileId: string, unsealed: string[] = []): RosterEntry {
  const entry = allEntries().find((r) => r.file === fileId);
  if (!entry) return { file: fileId, revealed: false };

  const isPublic = clearanceOf(entry) === "REVEALED";
  const isPersonallyUnsealed = unsealed.includes(entry.file);
  return isPublic || isPersonallyUnsealed ? entry : { file: entry.file, revealed: false };
}

/** Normalise a name for search: case-insensitive, ignores spaces/symbols. */
export function normalizeName(input: string): string {
  return input
    .toLowerCase()
    .replace(/£/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function clearanceOf(entry: RosterEntry): "CLASSIFIED" | "CONFIRMED" | "REVEALED" {
  return entry.clearance ?? (entry.revealed ? "CONFIRMED" : "CLASSIFIED");
}

/** Every creator in the database that carries a name. */
export function creatorDatabase(): RosterEntry[] {
  return allEntries().filter((r) => !!r.name);
}

/** Case-insensitive lookup across names, aliases and usernames. */
export function searchCreator(query: string): RosterEntry | undefined {
  const q = normalizeName(query);
  if (!q) return undefined;
  return creatorDatabase().find((r) => {
    const keys = [r.name, r.username, ...(r.aliases ?? [])].filter(Boolean) as string[];
    return keys.some((k) => normalizeName(k) === q);
  });
}
