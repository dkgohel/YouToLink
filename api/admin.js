const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Admin user IDs (replace with your actual admin user IDs)
const ADMIN_USERS = [
  // Add your admin user IDs here
  'your-admin-user-id-1',
  'your-admin-user-id-2'
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const userId = req.headers['x-user-id'];
  if (!userId || !ADMIN_USERS.includes(userId)) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    if (req.method === 'GET') {
      const { action } = req.query;

      if (action === 'users') {
        // Get all users with subscription data
        const { data: subscriptions, error } = await supabase
          .from('user_subscriptions')
          .select(`
            *,
            user:user_id (
              email,
              created_at
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get URL counts for each user
        const usersWithStats = await Promise.all(
          subscriptions.map(async (sub) => {
            const { data: urls } = await supabase
              .from('urls')
              .select('id, created_at')
              .eq('user_id', sub.user_id);

            return {
              ...sub,
              actual_url_count: urls?.length || 0,
              urls: urls || []
            };
          })
        );

        res.json({ users: usersWithStats });
      }
      else if (action === 'stats') {
        // Get overall statistics
        const { data: totalUsers } = await supabase
          .from('user_subscriptions')
          .select('id', { count: 'exact' });

        const { data: premiumUsers } = await supabase
          .from('user_subscriptions')
          .select('id', { count: 'exact' })
          .eq('plan_type', 'premium');

        const { data: totalUrls } = await supabase
          .from('urls')
          .select('id', { count: 'exact' });

        const { data: recentUrls } = await supabase
          .from('urls')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        res.json({
          total_users: totalUsers?.length || 0,
          premium_users: premiumUsers?.length || 0,
          free_users: (totalUsers?.length || 0) - (premiumUsers?.length || 0),
          total_urls: totalUrls?.length || 0,
          recent_urls: recentUrls || []
        });
      }
      else {
        res.status(400).json({ error: 'Invalid action' });
      }
    }
    else if (req.method === 'POST') {
      const { action, user_id, plan_type } = req.body;

      if (action === 'update_plan') {
        // Update user's subscription plan
        const { data, error } = await supabase
          .from('user_subscriptions')
          .update({
            plan_type: plan_type,
            monthly_limit: plan_type === 'premium' ? 1000 : 25,
            billing_cycle_start: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user_id)
          .select()
          .single();

        if (error) throw error;

        res.json({ success: true, subscription: data });
      }
      else if (action === 'reset_usage') {
        // Reset user's monthly usage
        const { data, error } = await supabase
          .from('user_subscriptions')
          .update({
            current_usage: 0,
            billing_cycle_start: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user_id)
          .select()
          .single();

        if (error) throw error;

        res.json({ success: true, subscription: data });
      }
      else {
        res.status(400).json({ error: 'Invalid action' });
      }
    }
  } catch (error) {
    console.error('Admin API Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
