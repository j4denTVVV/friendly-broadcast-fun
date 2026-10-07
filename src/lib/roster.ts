import { roster as baseRoster, type RosterEntry } from "@/config/prison";

/** Guests added from the control room, merged in at runtime. */
let guestEntries: RosterEntry[] = [];
let removedFiles = new Set<string>();
export function setGuestEntries(entries: RosterEntry[], removed: string[] = []) {
  guestEntries = entries;
  removedFiles = new Set(removed);
}
function allEntries(): RosterEntry[] {
  const overrides = new Map(guestEntries.map((g) => [g.file, g]));
  const merged = baseRoster
    .filter((r) => !removedFiles.has(r.file))
    .map((r) => {
      const o = overrides.get(r.file);
      if (!o) return r;
      overrides.delete(r.file);
      return { ...r, ...o, ...(o.image ? {} : r.image ? { image: r.image } : {}) };
    });
  return [...merged, ...overrides.values()];
}

/** Visitors only see the identities they have personally unsealed. */
export const UNSEALED_STORAGE_KEY = "ps-unsealed-files";

/** Presentation-only flag: staff signed into the control room see every file in this browser. */
const ADMIN_VIEW_KEY = "ps-admin-view";
export function setAdminView(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (on) window.localStorage.setItem(ADMIN_VIEW_KEY, "1");
    else window.localStorage.removeItem(ADMIN_VIEW_KEY);
  } catch {
    /* ignore */
  }
}

/** File numbers the visitor has personally unsealed through the reveals search. */
export function readUnsealedFiles(): string[] {
  if (typeof window === "undefined") return [];
  try {
    if (window.localStorage.getItem(ADMIN_VIEW_KEY) === "1") return allEntries().map((r) => r.file);
    const raw = window.localStorage.getItem(UNSEALED_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((f): f is string => typeof f === "string") : [];
  } catch {
    return [];
  }
}

/** Every real file gets a slot; only public or personally unsealed files show details. */
export function getRosterFiles(unsealed: string[] = []): RosterEntry[] {
  return allEntries()
    .filter((r) => r.revealed)
    .sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }))
    .map((entry) =>
      clearanceOf(entry) === "REVEALED" || unsealed.includes(entry.file)
        ? entry
        : { file: entry.file, revealed: false, ...(entry.role ? { role: entry.role } : {}) },
    );
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

/** True when this browser has accessed the control room (presentation only). */
export function isAdminView(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("ps-admin-view") === "1";
  } catch {
    return false;
  }
}
