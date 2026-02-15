-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create quotes table
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  aura_level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id TEXT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quote_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_category ON public.quotes(category);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_quote_id ON public.favorites(quote_id);

-- Enable Row Level Security
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quotes table (public read access)
CREATE POLICY "Allow public read access to quotes"
  ON public.quotes
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for favorites table (users can only manage their own favorites)
CREATE POLICY "Users can view their own favorites"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anon users to also manage favorites (for anonymous auth)
CREATE POLICY "Anon users can view their own favorites"
  ON public.favorites
  FOR SELECT
  TO anon
  USING (auth.uid() = user_id);

CREATE POLICY "Anon users can insert their own favorites"
  ON public.favorites
  FOR INSERT
  TO anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anon users can delete their own favorites"
  ON public.favorites
  FOR DELETE
  TO anon
  USING (auth.uid() = user_id);
