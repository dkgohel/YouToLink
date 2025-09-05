-- Blog table setup for Supabase
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public to read published blogs" ON blogs FOR SELECT USING (published = true);
CREATE POLICY "Allow admins to manage blogs" ON blogs FOR ALL USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE email = 'admin@u2l.in' -- Replace with your admin email
));
