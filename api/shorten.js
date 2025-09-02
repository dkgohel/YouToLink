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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { longUrl, customCode, urls } = req.body;
    
    // Handle bulk URLs
    if (urls && Array.isArray(urls)) {
      const results = [];
      
      for (const url of urls) {
        if (!url.trim()) continue;
        
        let processedUrl = url.trim();
        if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
          processedUrl = 'https://' + processedUrl;
        }
        
        const shortCode = generateShortCode();
        
        const { error } = await supabase
          .from('urls')
          .insert([{
            short_code: shortCode,
            long_url: processedUrl
          }]);
        
        if (!error) {
          results.push({
            longUrl: processedUrl,
            shortUrl: `https://u2l.in/${shortCode}`,
            shortCode
          });
        }
      }
      
      return res.json({ results });
    }
    
    // Handle single URL
    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    let processedUrl = longUrl.trim();
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    const shortCode = customCode || generateShortCode();
    
    const { error } = await supabase
      .from('urls')
      .insert([{ 
        short_code: shortCode, 
        long_url: processedUrl 
      }]);

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Custom URL already exists' });
      }
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }

    res.json({ shortUrl: `https://u2l.in/${shortCode}` });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
