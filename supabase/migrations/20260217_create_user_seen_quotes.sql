-- Create user_seen_quotes table to track viewed quotes
CREATE TABLE IF NOT EXISTS public.user_seen_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_id TEXT NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quote_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_seen_quotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own seen history
CREATE POLICY "Users can view their own seen quotes"
    ON public.user_seen_quotes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Users can insert their own seen quotes
CREATE POLICY "Users can mark quotes as seen"
    ON public.user_seen_quotes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_seen_quotes_user_id ON public.user_seen_quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_seen_quotes_quote_id ON public.user_seen_quotes(quote_id);
