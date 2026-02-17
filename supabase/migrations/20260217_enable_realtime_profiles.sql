-- Enable Realtime for profiles table
-- This allows the app to receive live updates when profile data changes

-- Enable realtime on the profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Ensure Row Level Security is properly configured
-- (Already done in previous migration, but good to verify)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Comment for documentation
COMMENT ON TABLE profiles IS 'User profiles with realtime updates enabled for live XP/level changes';
