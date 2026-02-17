-- Ouvre l'éditeur SQL de Supabase et lance ceci :

CREATE TABLE IF NOT EXISTS public.user_seen_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quote_id)
);

-- Active la sécurité (RLS)
ALTER TABLE public.user_seen_quotes ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Users can view their own seen quotes"
    ON public.user_seen_quotes FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can mark quotes as seen"
    ON public.user_seen_quotes FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);