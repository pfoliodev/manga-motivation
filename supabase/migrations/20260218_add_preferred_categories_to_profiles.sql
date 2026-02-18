-- Migration: Add preferred_categories to profiles table
-- Author: AURA Architect
-- Date: 2026-02-18

-- Add preferred_categories column as a text array
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS preferred_categories TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN profiles.preferred_categories IS 'List of category IDs or names selected by the user during onboarding';
