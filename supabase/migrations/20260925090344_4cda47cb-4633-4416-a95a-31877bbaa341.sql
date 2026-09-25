ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS deleted boolean NOT NULL DEFAULT false;
DROP POLICY IF EXISTS "Published guests are public" ON public.guests;
CREATE POLICY "Published or removed guests are public" ON public.guests FOR SELECT TO anon, authenticated USING (published = true OR deleted = true);