GRANT SELECT ON public.guests TO anon, authenticated;
GRANT ALL ON public.guests TO service_role;
GRANT SELECT ON public.bulletins TO anon, authenticated;
GRANT ALL ON public.bulletins TO service_role;
GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;