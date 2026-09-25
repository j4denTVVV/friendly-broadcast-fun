CREATE TABLE public.guests (
  id uuid primary key default gen_random_uuid(),
  file text not null,
  name text not null,
  aliases text not null default '',
  role text not null default 'GUEST',
  platform text,
  bio text not null default '',
  image_url text,
  socials jsonb not null default '[]'::jsonb,
  clearance text not null default 'CONFIRMED',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.guests TO anon, authenticated;
GRANT ALL ON public.guests TO service_role;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published guests are public" ON public.guests FOR SELECT TO anon, authenticated USING (published = true);
ALTER TABLE public.guests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guests;