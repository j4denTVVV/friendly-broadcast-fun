GRANT SELECT ON public.site_banner TO anon, authenticated;
GRANT ALL ON public.site_banner TO service_role;
GRANT ALL ON public.applications TO service_role;
UPDATE public.site_banner SET message = 'PRISON STREAM LAUNCHES 19 OCTOBER 2026' WHERE id = 1;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.site_banner;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;