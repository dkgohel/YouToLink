const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  const shortCode = req.query.shortCode || req.url.split('/').pop();

  if (!shortCode) {
    return res.status(400).json({ error: 'Short code required' });
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

    // Update click count
    await supabase
      .from('urls')
      .update({ click_count: (data.click_count || 0) + 1 })
      .eq('id', data.id);

    // Log analytics (optional)
    try {
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      
      await supabase
        .from('url_analytics')
        .insert([{
          url_id: data.id,
          ip_address: ip,
          user_agent: userAgent,
          referrer: req.headers.referer || null
        }]);
    } catch (analyticsError) {
      console.log('Analytics logging failed:', analyticsError);
    }

    // Redirect to the original URL
    res.writeHead(302, { Location: data.long_url });
    res.end();
    
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
