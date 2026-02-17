-- Migration: Add Power Level & Streak System to profiles table
-- Author: AURA Architect
-- Date: 2026-02-17

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0 CHECK (xp >= 0),
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1 CHECK (level >= 1),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0 CHECK (streak_count >= 0),
ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 0 CHECK (max_streak >= 0);

-- Create index for efficient last_login queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login);

-- Add comment for documentation
COMMENT ON COLUMN profiles.xp IS 'Total experience points earned by the user';
COMMENT ON COLUMN profiles.level IS 'Current power level calculated from XP (level = floor(sqrt(xp / 10)))';
COMMENT ON COLUMN profiles.last_login IS 'Timestamp of the last daily login (used for streak calculation)';
COMMENT ON COLUMN profiles.streak_count IS 'Current consecutive days login streak';
COMMENT ON COLUMN profiles.max_streak IS 'Highest streak ever achieved by the user';

-- Update existing profiles to have default values
UPDATE profiles
SET 
    xp = 0,
    level = 1,
    streak_count = 0,
    max_streak = 0
WHERE xp IS NULL;
