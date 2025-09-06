const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

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
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    if (req.method === 'GET') {
      // Get current subscription
      let { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Subscription fetch error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!subscription) {
        // Create default subscription
        const { data: newSub, error: insertError } = await supabase
          .from('user_subscriptions')
          .insert([{ 
            user_id: userId,
            plan_type: 'free',
            monthly_limit: 25,
            current_usage: 0,
            billing_cycle_start: new Date().toISOString().split('T')[0]
          }])
          .select()
          .single();
        
        if (insertError) {
          console.error('Subscription creation error:', insertError);
          // Return default values even if insert fails
          return res.json({
            plan_type: 'free',
            monthly_limit: 25,
            current_usage: 0,
            billing_cycle_start: new Date().toISOString().split('T')[0]
          });
        }
        subscription = newSub;
      }

      // Ensure we return valid numbers
      const responseData = {
        plan_type: subscription.plan_type || 'free',
        monthly_limit: Number(subscription.monthly_limit) || 25,
        current_usage: Number(subscription.current_usage) || 0,
        billing_cycle_start: subscription.billing_cycle_start || new Date().toISOString().split('T')[0]
      };

      res.json(responseData);
    } 
    else if (req.method === 'POST') {
      // Upgrade to premium
      const { data } = await supabase
        .from('user_subscriptions')
        .update({
          plan_type: 'premium',
          monthly_limit: 1000,
          billing_cycle_start: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', userId)
        .select()
        .single();

      res.json({ success: true, subscription: data });
    }
  } catch (error) {
    console.error('Subscription API Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
