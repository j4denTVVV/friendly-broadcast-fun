import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/guest-photo/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = String(params._splat ?? "");
        if (!/^[a-z0-9-]+\.(png|jpg|webp|gif)$/i.test(path)) return new Response("Not found", { status: 404 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("guest-photos").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });
        return new Response(data, {
          headers: {
            "Content-Type": data.type || "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
