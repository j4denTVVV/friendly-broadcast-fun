CREATE TABLE public.site_notifications (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, body text, tone text NOT NULL DEFAULT 'info', link text, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_notifications TO anon, authenticated;
GRANT ALL ON public.site_notifications TO service_role;
ALTER TABLE public.site_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read notifications" ON public.site_notifications FOR SELECT TO anon, authenticated USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_notifications;
UPDATE public.site_banner SET message = 'PRISON STREAM — DATE CLASSIFIED', messages = '[]'::jsonb WHERE id = 1 AND message ILIKE '%OCTOBER%';