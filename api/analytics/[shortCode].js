const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  const { shortCode } = req.query;

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

    if (analyticsError) {
      console.error('Analytics error:', analyticsError);
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }

    // Process analytics data
    const totalClicks = analyticsData?.length || 0;
    const uniqueClicks = new Set(analyticsData?.map(a => a.ip_address)).size;
    
    const clicksByDate = {};
    const clicksByCountry = {};
    const clicksByDevice = {};
    const clicksByBrowser = {};

    analyticsData?.forEach(click => {
      const date = new Date(click.clicked_at).toDateString();
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      
      if (click.country) {
        clicksByCountry[click.country] = (clicksByCountry[click.country] || 0) + 1;
      }
      
      if (click.device_type) {
        clicksByDevice[click.device_type] = (clicksByDevice[click.device_type] || 0) + 1;
      }
      
      if (click.browser) {
        clicksByBrowser[click.browser] = (clicksByBrowser[click.browser] || 0) + 1;
      }
    });

    res.json({
      url: urlData,
      analytics: {
        totalClicks,
        uniqueClicks,
        clicksByDate,
        clicksByCountry,
        clicksByDevice,
        clicksByBrowser,
        recentClicks: analyticsData?.slice(0, 10) || []
      }
    });
    
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
