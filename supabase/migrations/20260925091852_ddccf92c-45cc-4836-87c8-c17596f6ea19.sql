CREATE TABLE public.site_banner (id int PRIMARY KEY DEFAULT 1 CHECK (id = 1), message text NOT NULL DEFAULT '', link text, enabled boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_banner TO anon, authenticated;
GRANT ALL ON public.site_banner TO service_role;
ALTER TABLE public.site_banner ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Banner is public" ON public.site_banner FOR SELECT TO anon, authenticated USING (true);
INSERT INTO public.site_banner (id, message, enabled) VALUES (1, 'PRISON STREAM LAUNCHES 23 OCTOBER 2026', false);