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
    // Get URL info
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .select('*')
      .eq('short_code', shortCode)
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

    console.log(`Analytics for ${shortCode}: Found ${analyticsData?.length || 0} clicks`);

    // Process analytics data (even if empty)
    const totalClicks = urlData.click_count || 0; // Use URL click count as primary source
    const analyticsClicks = analyticsData?.length || 0;
    const uniqueClicks = analyticsData ? new Set(analyticsData.map(a => a.ip_address)).size : 0;
    
    const clicksByDate = {};
    const clicksByCountry = {};
    const clicksByDevice = {};
    const clicksByBrowser = {};

    if (analyticsData && analyticsData.length > 0) {
      analyticsData.forEach(click => {
        // Fix date formatting
        const clickDate = new Date(click.clicked_at);
        const dateKey = clickDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        clicksByDate[dateKey] = (clicksByDate[dateKey] || 0) + 1;
        
        // Country data (add default if missing)
        const country = click.country || 'Unknown';
        clicksByCountry[country] = (clicksByCountry[country] || 0) + 1;
        
        // Device data (add default if missing)
        const device = click.device_type || 'Unknown';
        clicksByDevice[device] = (clicksByDevice[device] || 0) + 1;
        
        // Browser data (add default if missing)
        const browser = click.browser || 'Unknown';
        clicksByBrowser[browser] = (clicksByBrowser[browser] || 0) + 1;
      });
    }

    const response = {
      url: urlData,
      analytics: {
        totalClicks: Math.max(totalClicks, analyticsClicks), // Use higher count
        uniqueClicks,
        clicksByDate,
        clicksByCountry,
        clicksByDevice,
        clicksByBrowser,
        recentClicks: analyticsData?.slice(0, 10) || []
      }
    };

    console.log(`Returning analytics: ${response.analytics.totalClicks} total clicks`);
    res.json(response);
    
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
