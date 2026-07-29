-- Grant table-level privileges to service_role for all tables created by migrations.
-- In hosted Supabase, these are granted by default; local Supabase does not.
-- Without these, createAdminClient() (service_role key) gets "permission denied for table ...".

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Ensure future tables also get the grant by altering default privileges.
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO service_role;

-- Supabase hosted projects grant ALL on all tables to anon and authenticated by default.
-- Local Supabase does not, causing "permission denied" when browser-side createClient() queries.
-- RLS policies govern row-level access; table-level grants allow the requests through.
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated;
