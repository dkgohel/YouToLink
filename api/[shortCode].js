const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function getDeviceType(userAgent) {
  if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return 'Mobile';
  if (/Tablet/.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

function getBrowser(userAgent) {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Other';
}

module.exports = async (req, res) => {
  const shortCode = req.query.shortCode || req.url.split('/').pop();

  if (!shortCode || shortCode.length !== 6) {
    return res.status(400).json({ error: 'Invalid short code' });
  }

  try {
    // Get the URL from database
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Ensure the URL has a protocol
    let redirectUrl = data.long_url;
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = 'https://' + redirectUrl;
    }

    // Update click count
    const { error: updateError } = await supabase
      .from('urls')
      .update({ click_count: (data.click_count || 0) + 1 })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating click count:', updateError);
    }

    // Log detailed analytics
    try {
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || '0.0.0.0';
      const referrer = req.headers['referer'] || req.headers['referrer'] || null;
      
      const deviceType = getDeviceType(userAgent);
      const browser = getBrowser(userAgent);

      const { error: analyticsError } = await supabase
        .from('url_analytics')
        .insert([{
          url_id: data.id,
          ip_address: ip.split(',')[0].trim(), // Get first IP if multiple
          user_agent: userAgent.substring(0, 500), // Limit length
          referrer: referrer ? referrer.substring(0, 500) : null,
          device_type: deviceType,
          browser: browser,
          clicked_at: new Date().toISOString()
        }]);

      if (analyticsError) {
        console.error('Analytics logging error:', analyticsError);
      } else {
        console.log(`Analytics logged for ${shortCode}: ${deviceType}, ${browser}`);
      }
    } catch (analyticsError) {
      console.error('Analytics logging failed:', analyticsError);
    }

    // Redirect to the original URL
    res.writeHead(302, { 
      Location: redirectUrl,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end();
    
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
