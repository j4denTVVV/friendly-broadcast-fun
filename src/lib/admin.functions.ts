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
  decision_email_sent: boolean;
  decision_email_sent_at: string | null;
  decision_email_type: string | null;
  decision_email_status: string | null;
  decision_email_to: string | null;
  decision_email_error: string | null;
  email_log?: { at: string; type: string; status: string; to: string | null; error?: string | null }[];
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

const EMAIL_RE = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/;

/** Sets status. For ACCEPTED/REJECTED with sendEmail=true, sends the branded decision email and records the result. */
export const setApplicationStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: string; sendEmail?: boolean }) => {
    if (!["PENDING", "ACCEPTED", "REJECTED"].includes(data.status)) throw new Error("Invalid status");
    return data;
  })
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db
      .from("applications")
      .update({ status: data.status, reviewed_at: new Date().toISOString() })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    if (data.status === "PENDING" || !data.sendEmail) return { ok: true as const, email: "skipped" as const };

    const { data: app } = await db.from("applications").select("name, contact, email_log").eq("id", data.id).maybeSingle();
    const to = app?.contact?.trim() ?? "";
    const prior = (Array.isArray(app?.email_log) ? app.email_log : []) as import("@/integrations/supabase/types").Json[];
    const log = (status: string, error: string | null = null) => [
      ...prior,
      { at: new Date().toISOString(), type: data.status, status, to: to || null, error },
    ];
    if (!EMAIL_RE.test(to)) {
      await db.from("applications").update({ decision_email_status: "FAILED", decision_email_type: data.status, decision_email_to: to || null, decision_email_error: "No valid email on file", email_log: log("FAILED", "No valid email on file") }).eq("id", data.id);
      return { ok: true as const, email: "failed" as const, error: "No valid email on file" };
    }
    try {
      const { buildDecisionEmail } = await import("./decision-email.server");
      const { sendGmail } = await import("./gmail.server");
      const m = buildDecisionEmail(data.status as "ACCEPTED" | "REJECTED", app?.name, data.id);
      await sendGmail(to, m.subject, m.text, m.html);
      await db.from("applications").update({
        decision_email_sent: true,
        decision_email_sent_at: new Date().toISOString(),
        decision_email_type: data.status,
        decision_email_status: "SENT",
        decision_email_to: to,
        decision_email_error: null,
        email_log: log("SENT"),
      }).eq("id", data.id);
      return { ok: true as const, email: "sent" as const };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      await db.from("applications").update({ decision_email_status: "FAILED", decision_email_type: data.status, decision_email_to: to, decision_email_error: msg, email_log: log("FAILED", msg) }).eq("id", data.id);
      return { ok: true as const, email: "failed" as const, error: msg };
    }
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
  deleted?: boolean;
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
    let id = data.id;
    if (!id) {
      const { data: existing } = await db.from("guests").select("id").eq("file", row.file).limit(1);
      id = existing?.[0]?.id;
    }
    const full = { ...row, deleted: false };
    const q = id ? db.from("guests").update(full).eq("id", id) : db.from("guests").insert(full);
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

/** Removes a built-in (original) guest from the site by storing a "removed" marker. */
export const removeBuiltInGuest = createServerFn({ method: "POST" })
  .inputValidator((data: { file: string; name: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { data: existing } = await db.from("guests").select("id").eq("file", data.file).limit(1);
    const row = { file: data.file, name: data.name, published: false, deleted: true, updated_at: new Date().toISOString() };
    const id = existing?.[0]?.id;
    const { error } = id ? await db.from("guests").update(row).eq("id", id) : await db.from("guests").insert(row);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const uploadGuestPhoto = createServerFn({ method: "POST" })
  .inputValidator((data: { dataUrl: string }) => data)
  .handler(async ({ data }) => {
    await requireAdmin();
    const m = /^data:(image\/(png|jpe?g|webp|gif));base64,(.+)$/.exec(data.dataUrl);
    if (!m) throw new Error("Please choose a PNG, JPG, WEBP or GIF image");
    const bytes = Buffer.from(m[3]!, "base64");
    if (bytes.length > 8 * 1024 * 1024) throw new Error("Photo must be under 8MB");
    const ext = m[2] === "jpeg" ? "jpg" : m[2];
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const db = await admin();
    const { error } = await db.storage.from("guest-photos").upload(path, bytes, { contentType: m[1]! });
    if (error) throw new Error(error.message);
    return { url: `/api/public/guest-photo/${path}` };
  });

export type BannerRow = { message: string; link: string | null; enabled: boolean };

export const getBannerAdmin = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  const db = await admin();
  const { data, error } = await db.from("site_banner").select("message, link, enabled").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? { message: "", link: null, enabled: false }) as BannerRow;
});

export const saveBanner = createServerFn({ method: "POST" })
  .inputValidator((data: BannerRow) => ({
    message: String(data.message ?? "").slice(0, 200),
    link: data.link ? String(data.link).slice(0, 500) : null,
    enabled: !!data.enabled,
  }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const db = await admin();
    const { error } = await db.from("site_banner").upsert({ id: 1, ...data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
