require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const QRCode = require('qrcode');
const geoip = require('geoip-lite');
const UAParser = require('ua-parser-js');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase connected successfully');

// Generate random 6-character code
function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate custom short code
function isValidCustomCode(code) {
  return /^[a-zA-Z0-9-_]{3,20}$/.test(code);
}

// Auth middleware
function getAuthUser(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  return { id: req.headers['x-user-id'] };
}

// Parse analytics data
function parseAnalytics(req) {
  const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
  const userAgent = req.headers['user-agent'] || '';
  const referrer = req.headers.referer || req.headers.referrer || '';
  
  const geo = geoip.lookup(ip);
  const ua = UAParser(userAgent);
  
  return {
    ip_address: ip,
    user_agent: userAgent,
    referrer: referrer,
    country: geo?.country || null,
    city: geo?.city || null,
    device_type: ua.device.type || 'desktop',
    browser: ua.browser.name || null,
    os: ua.os.name || null
  };
}

// Shorten URL endpoint (supports bulk)
app.post('/api/shorten', async (req, res) => {
  let { longUrl, customCode, urls } = req.body;
  const user = getAuthUser(req);
  
  try {
    // Bulk URL shortening
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
            long_url: processedUrl,
            user_id: user?.id || null
          }]);
        
        if (!error) {
          const baseUrl = process.env.NODE_ENV === 'production' 
            ? `https://${req.get('host')}`
            : 'http://localhost:5001';

          results.push({
            longUrl: processedUrl,
            shortUrl: `${baseUrl}/${shortCode}`,
            shortCode
          });
        }
      }
      
      return res.json({ results });
    }
    
    // Single URL shortening
    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
      longUrl = 'https://' + longUrl;
    }

    let shortCode;
    if (customCode) {
      if (!isValidCustomCode(customCode)) {
        return res.status(400).json({ 
          error: 'Custom code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores' 
        });
      }
      shortCode = customCode;
    } else {
      shortCode = generateShortCode();
    }

    const { error } = await supabase
      .from('urls')
      .insert([{
        short_code: shortCode,
        long_url: longUrl,
        user_id: user?.id || null
      }]);

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Custom URL already exists. Please choose a different one.' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? `https://${req.get('host')}`
      : 'http://localhost:5001';

    res.json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's URLs
app.get('/api/my-urls', async (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ urls: data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get analytics for a specific URL
app.get('/api/analytics/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const user = getAuthUser(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Get URL info
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .select('id, short_code, long_url, created_at, click_count')
      .eq('short_code', shortCode)
      .eq('user_id', user.id)
      .single();

    if (urlError || !urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Get analytics data
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('url_analytics')
      .select('*')
      .eq('url_id', urlData.id)
      .order('clicked_at', { ascending: false });

    if (analyticsError) {
      return res.status(500).json({ error: 'Analytics error' });
    }

    // Process analytics for charts
    const analytics = {
      url: urlData,
      totalClicks: analyticsData.length,
      clicks: analyticsData,
      
      // Country distribution
      countries: analyticsData.reduce((acc, click) => {
        const country = click.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {}),
      
      // Device type distribution
      devices: analyticsData.reduce((acc, click) => {
        const device = click.device_type || 'desktop';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {}),
      
      // Browser distribution
      browsers: analyticsData.reduce((acc, click) => {
        const browser = click.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {}),
      
      // Daily clicks (last 30 days)
      dailyClicks: analyticsData.reduce((acc, click) => {
        const date = new Date(click.clicked_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}),
      
      // Referrer distribution
      referrers: analyticsData.reduce((acc, click) => {
        const referrer = click.referrer || 'Direct';
        const domain = referrer === 'Direct' ? 'Direct' : 
                      referrer ? new URL(referrer).hostname : 'Unknown';
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {})
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update URL alias
app.put('/api/urls/:id', async (req, res) => {
  const { id } = req.params;
  const { short_code } = req.body;
  const user = getAuthUser(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!isValidCustomCode(short_code)) {
    return res.status(400).json({ error: 'Invalid short code format' });
  }

  try {
    const { error } = await supabase
      .from('urls')
      .update({ short_code })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Short code already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete URL
app.delete('/api/urls/:id', async (req, res) => {
  const { id } = req.params;
  const user = getAuthUser(req);
  
  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { error } = await supabase
      .from('urls')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// QR Code endpoint
app.get('/api/qr/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  
  try {
    const shortUrl = `http://localhost:5001/${shortCode}`;
    const qrCodeDataURL = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    res.json({ qrCode: qrCodeDataURL });
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Redirect endpoint with analytics tracking
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('id, long_url, click_count')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    // Parse analytics data
    const analyticsData = parseAnalytics(req);
    
    // Insert analytics record
    await supabase
      .from('url_analytics')
      .insert([{
        url_id: data.id,
        ...analyticsData
      }]);
    
    // Increment click count
    await supabase
      .from('urls')
      .update({ click_count: data.click_count + 1 })
      .eq('short_code', shortCode);
    
    res.redirect(data.long_url);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Stats endpoint
app.get('/api/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('urls')
      .select('click_count, created_at')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    res.json({
      shortCode,
      clickCount: data.click_count,
      createdAt: data.created_at
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
