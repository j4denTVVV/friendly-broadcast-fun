import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";

type AdminSession = { unlocked?: boolean };

function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "ps-admin",
    maxAge: 60 * 60 * 12,
    cookie: { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" },
  };
}

function matches(input: string, expected: string) {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

async function requireAdmin() {
  const session = await useSession<AdminSession>(sessionConfig());
  if (!session.data.unlocked) throw new Error("LOCKED");
  return session;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((data: { password: string }) => data)
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_PASSWORD"];
    if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
    if (!matches(data.password, expected)) return { ok: false as const };
    const session = await useSession<AdminSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});

export const adminStatus = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<AdminSession>(sessionConfig());
  return { unlocked: session.data.unlocked === true };
});

export type ApplicationRow = {
  id: string;
  name: string;
  handle: string;
  platform: string | null;
  links: string | null;
  pitch: string;
  contact: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  reviewed_at: string | null;
};

export const listApplications = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data, error } = await db
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ApplicationRow[];
});

export const setApplicationStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string; notes?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db
      .from("applications")
      .update({
        status: data.status,
        notes: data.notes ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteApplication = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("applications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export type BulletinRow = {
  id: string;
  code: string;
  date_label: string;
  title: string;
  body: string;
  status: string;
  position: number;
  published: boolean;
};

export const listAllBulletins = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data, error } = await db
    .from("bulletins")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as BulletinRow[];
});

export const saveBulletin = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      id?: string;
      code: string;
      date_label: string;
      title: string;
      body: string;
      status: string;
      position: number;
      published: boolean;
    }) => data,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const row = {
      code: data.code,
      date_label: data.date_label,
      title: data.title,
      body: data.body,
      status: data.status,
      position: data.position,
      published: data.published,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await db.from("bulletins").update(row).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await db.from("bulletins").insert(row);
      if (error) throw new Error(error.message);
    }
    return { ok: true as const };
  });

export const deleteBulletin = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("bulletins").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export type GuestRow = {
  id: string;
  file: string;
  name: string;
  aliases: string;
  role: string;
  platform: string | null;
  bio: string;
  image_url: string | null;
  socials: { platform: string; url: string }[];
  clearance: string;
  published: boolean;
};

export const listGuests = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data, error } = await db.from("guests").select("*").order("file", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as GuestRow[];
});

export const saveGuest = createServerFn({ method: "POST" })
  .inputValidator((data: Omit<GuestRow, "id"> & { id?: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const row = {
      file: data.file.trim().slice(0, 10),
      name: data.name.trim().slice(0, 100),
      aliases: data.aliases.slice(0, 500),
      role: data.role.trim().slice(0, 60) || "GUEST",
      platform: data.platform?.trim() || null,
      bio: data.bio.slice(0, 4000),
      image_url: data.image_url?.trim() || null,
      socials: (data.socials ?? []).filter((s) => s.url?.startsWith("http")).slice(0, 12),
      clearance: data.clearance,
      published: data.published,
      updated_at: new Date().toISOString(),
    };
    if (!row.file || !row.name) throw new Error("File number and name are required");
    const q = data.id ? db.from("guests").update(row).eq("id", data.id) : db.from("guests").insert(row);
    const { error } = await q;
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deleteGuest = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("guests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
