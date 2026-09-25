CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT,
  links TEXT,
  pitch TEXT NOT NULL,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an application" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.bulletins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  date_label TEXT NOT NULL DEFAULT 'CLASSIFIED',
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'VERIFIED',
  position INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bulletins TO anon, authenticated;
GRANT ALL ON public.bulletins TO service_role;
ALTER TABLE public.bulletins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published bulletins are public" ON public.bulletins FOR SELECT TO anon, authenticated USING (published = true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.bulletins;
ALTER TABLE public.bulletins REPLICA IDENTITY FULL;

INSERT INTO public.bulletins (code, date_label, title, body, status, position) VALUES
  ('BULLETIN 001', 'CLASSIFIED', 'THE FACILITY IS ONLINE', 'Prison Stream exists. The launch window is Autumn 2026. Everything else remains behind locked doors.', 'VERIFIED', 1),
  ('BULLETIN 002', '2026', 'FIRST FILES DECLASSIFIED', 'The first names are out. XKeonte, SebzOnAir and 4DidIt are confirmed inside. Transmission 001 is live. Every other file remains sealed until searched.', 'VERIFIED', 2),
  ('BULLETIN 003', '19 SEPTEMBER 2026', 'THE WEBSITE HAS OFFICIALLY LAUNCHED', 'Prison Stream is officially live. The roster, the files and every official channel are now open to the public. Search the clearance database, pull up a file and see who''s inside.', 'VERIFIED', 3),
  ('BULLETIN 004', '23 OCTOBER 2026', 'LAUNCH DATE CONFIRMED', 'The gates open on 23 October 2026. The countdown is live on the front page. Applications are now open.', 'VERIFIED', 4);