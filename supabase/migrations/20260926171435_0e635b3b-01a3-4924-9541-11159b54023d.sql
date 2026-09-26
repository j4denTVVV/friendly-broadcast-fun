ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS decision_email_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS decision_email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS decision_email_type text,
  ADD COLUMN IF NOT EXISTS decision_email_status text,
  ADD COLUMN IF NOT EXISTS decision_email_to text,
  ADD COLUMN IF NOT EXISTS decision_email_error text;