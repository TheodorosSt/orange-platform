-- Migration 001: Documents table with RLS and Storage bucket

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    size BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
    storage_path TEXT NOT NULL,
    ocr_text TEXT,
    translated_text TEXT,
    audiobook_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Users can only see their own documents
CREATE POLICY "Users can view own documents"
    ON public.documents FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own documents
CREATE POLICY "Users can insert own documents"
    ON public.documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own documents
CREATE POLICY "Users can update own documents"
    ON public.documents FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents"
    ON public.documents FOR DELETE
    USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket (run via Supabase dashboard or management API)
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'orange-vault',
--     'orange-vault',
--     false,
--     52428800,  -- 50 MB
--     ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/webp']
-- ) ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
-- CREATE POLICY "Users can upload to own folder"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'orange-vault' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- CREATE POLICY "Users can view own files"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'orange-vault' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

-- CREATE POLICY "Users can delete own files"
--     ON storage.objects FOR DELETE
--     USING (bucket_id = 'orange-vault' AND auth.uid()::text = (string_to_array(name, '/'))[1]);
