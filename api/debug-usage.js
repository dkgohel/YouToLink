const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get subscription data
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get user's URLs count
    const { data: urls, error: urlsError } = await supabase
      .from('urls')
      .select('id, created_at')
      .eq('user_id', userId);

    res.json({
      subscription: subscription || null,
      subscriptionError: error?.message || null,
      urlsCount: urls?.length || 0,
      urls: urls || [],
      urlsError: urlsError?.message || null
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
