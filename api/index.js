const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, url } = req;
  const urlPath = url.split('?')[0];

  try {
    // Handle different routes
    if (method === 'POST' && urlPath === '/api/shorten') {
      const { longUrl, customCode } = req.body;
      
      if (!longUrl) {
        return res.status(400).json({ error: 'Long URL is required' });
      }

      const processedUrl = longUrl.startsWith('http') ? longUrl : `https://${longUrl}`;
      const shortCode = customCode || generateShortCode();
      
      const { error } = await supabase
        .from('urls')
        .insert([{ short_code: shortCode, long_url: processedUrl }]);

      if (error) {
        if (error.code === '23505') {
          return res.status(409).json({ error: 'Custom URL already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      const baseUrl = req.headers.host.includes('localhost') ? 
        `http://${req.headers.host}` : 
        'https://u2l.in';
      res.json({ shortUrl: `${baseUrl}/${shortCode}` });
    }
    else if (method === 'GET' && urlPath.startsWith('/api/')) {
      res.status(404).json({ error: 'API endpoint not found' });
    }
    else {
      // Handle short URL redirects
      const shortCode = urlPath.substring(1);
      
      if (!shortCode) {
        return res.status(404).json({ error: 'Short code required' });
      }

      const { data, error } = await supabase
        .from('urls')
        .select('long_url, click_count')
        .eq('short_code', shortCode)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Short URL not found' });
      }

      // Increment click count
      await supabase
        .from('urls')
        .update({ click_count: data.click_count + 1 })
        .eq('short_code', shortCode);

      res.redirect(302, data.long_url);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
