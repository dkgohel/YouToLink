# You To Link (u2l.in) - URL Shortener

A simple URL shortener web application built with React.js and Node.js.

**Live at: https://u2l.in**

## Features

- Shorten long URLs to compact links
- Copy shortened URLs to clipboard
- Click tracking for analytics
- User authentication with Supabase
- Dashboard for managing links
- QR code generation
- Bulk URL shortening
- Comprehensive analytics
- Clean, responsive UI with TailwindCSS

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd YouToLink
```

### 2. Install dependencies
```bash
npm run install-all
```

### 3. Environment Variables Setup

**Server (.env in server/ directory):**
```bash
cp .env.example server/.env
```
Edit `server/.env` with your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

**Client (.env in client/ directory):**
```bash
cp .env.example client/.env
```
Edit `client/.env` with your Supabase credentials:
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_ADSENSE_PUBLISHER_ID=ca-pub-your_adsense_publisher_id
```

### 4. Supabase Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create URLs table
CREATE TABLE IF NOT EXISTS urls (
  id BIGSERIAL PRIMARY KEY,
  short_code TEXT UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  click_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS url_analytics (
  id BIGSERIAL PRIMARY KEY,
  url_id BIGINT REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  country VARCHAR(2),
  city VARCHAR(100),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  os VARCHAR(50)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_url_id ON url_analytics(url_id);

-- Enable RLS
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow anonymous URL creation" ON urls FOR INSERT WITH CHECK (user_id IS NULL);
CREATE POLICY "Allow anonymous URL access" ON urls FOR SELECT USING (user_id IS NULL);
CREATE POLICY "Users can manage own URLs" ON urls FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow URL redirection" ON urls FOR SELECT USING (true);
CREATE POLICY "Users can view own URL analytics" ON url_analytics FOR SELECT USING (url_id IN (SELECT id FROM urls WHERE user_id = auth.uid()));
CREATE POLICY "Allow analytics insertion" ON url_analytics FOR INSERT WITH CHECK (true);
```

### 5. Run the application
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5001
- Frontend React app on http://localhost:3000

## API Endpoints

- `POST /api/shorten` - Create a short URL
- `GET /:shortCode` - Redirect to original URL
- `GET /api/stats/:shortCode` - Get click statistics
- `GET /api/analytics/:shortCode` - Get detailed analytics
- `GET /api/my-urls` - Get user's URLs (authenticated)
- `PUT /api/urls/:id` - Update URL alias (authenticated)
- `DELETE /api/urls/:id` - Delete URL (authenticated)

## Project Structure

```
YouToLink/
├── client/          # React frontend
├── server/          # Node.js backend
├── .env.example     # Environment variables template
├── vercel.json      # Vercel deployment config
├── package.json     # Root package with scripts
└── README.md
```

## Deployment

### Vercel Deployment
1. Push to GitHub (environment files are ignored)
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
Set these in your deployment platform:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_ADSENSE_PUBLISHER_ID`
- `NODE_ENV=production`

## Security Notes

- Environment files (`.env`) are never committed to Git
- Supabase anon key is safe for client-side use
- Row Level Security (RLS) is enabled for data protection
- User authentication is handled by Supabase Auth

## Features

- ✅ URL shortening with custom aliases
- ✅ User authentication and dashboard
- ✅ Comprehensive analytics with geolocation
- ✅ QR code generation
- ✅ Bulk URL processing
- ✅ Real-time click tracking
- ✅ Mobile-responsive design
- ✅ Secure environment variable handling
