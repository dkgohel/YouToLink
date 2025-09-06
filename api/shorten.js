const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

function generateShortCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function checkUsageLimit(supabase, userId, urlCount = 1) {
  if (!userId) return { allowed: true }; // Anonymous users allowed
  
  const { data: subscription } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (!subscription) {
    // Create default subscription
    await supabase.from('user_subscriptions').insert([{ user_id: userId }]);
    return { allowed: urlCount <= 25, remaining: 25 - urlCount };
  }
  
  const remaining = subscription.monthly_limit - subscription.current_usage;
  return { 
    allowed: remaining >= urlCount, 
    remaining: remaining - urlCount,
    plan: subscription.plan_type 
  };
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
    
    // Get user ID from headers
    const userId = req.headers['x-user-id'] || null;
    const authToken = req.headers.authorization?.replace('Bearer ', '');
    
    // Create supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Handle bulk URLs
    if (urls && Array.isArray(urls)) {
      const validUrls = urls.filter(url => url.trim());
      
      // Check usage limit for authenticated users
      if (userId) {
        const { allowed, remaining, plan } = await checkUsageLimit(supabase, userId, validUrls.length);
        if (!allowed) {
          return res.status(429).json({ 
            error: 'Usage limit exceeded', 
            remaining: Math.max(0, remaining + validUrls.length),
            plan,
            upgradeRequired: plan === 'free'
          });
        }
      }
      
      const results = [];
      
      for (const url of validUrls) {
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
            user_id: userId
          }]);
        
        if (!error) {
          results.push({
            longUrl: processedUrl,
            shortUrl: `https://u2l.in/${shortCode}`,
            shortCode
          });
        }
      }
      
      // Update usage count for authenticated users
      if (userId && results.length > 0) {
        try {
          // First, ensure subscription exists
          const { data: existingSub, error: selectError } = await supabase
            .from('user_subscriptions')
            .select('current_usage, monthly_limit')
            .eq('user_id', userId)
            .single();
          
          if (selectError && selectError.code === 'PGRST116') {
            // Subscription doesn't exist, create it
            await supabase
              .from('user_subscriptions')
              .insert([{ 
                user_id: userId,
                plan_type: 'free',
                monthly_limit: 25,
                current_usage: results.length,
                billing_cycle_start: new Date().toISOString().split('T')[0]
              }]);
          } else if (existingSub) {
            // Update existing subscription
            await supabase
              .from('user_subscriptions')
              .update({ current_usage: existingSub.current_usage + results.length })
              .eq('user_id', userId);
          }
        } catch (usageError) {
          console.error('Bulk usage tracking error:', usageError);
          // Don't fail the URL creation if usage tracking fails
        }
      }
      
      return res.json({ results });
    }
    
    // Handle single URL
    if (!longUrl) {
      return res.status(400).json({ error: 'Long URL is required' });
    }

    // Check usage limit for authenticated users
    if (userId) {
      const { allowed, remaining, plan } = await checkUsageLimit(supabase, userId, 1);
      if (!allowed) {
        return res.status(429).json({ 
          error: 'Usage limit exceeded', 
          remaining: Math.max(0, remaining + 1),
          plan,
          upgradeRequired: plan === 'free'
        });
      }
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
        long_url: processedUrl,
        user_id: userId
      }]);

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Custom URL already exists' });
      }
      return res.status(500).json({ error: 'Database error: ' + error.message });
    }

    // Update usage count for authenticated users
    if (userId) {
      try {
        // First, ensure subscription exists
        const { data: existingSub, error: selectError } = await supabase
          .from('user_subscriptions')
          .select('current_usage, monthly_limit')
          .eq('user_id', userId)
          .single();
        
        if (selectError && selectError.code === 'PGRST116') {
          // Subscription doesn't exist, create it
          await supabase
            .from('user_subscriptions')
            .insert([{ 
              user_id: userId,
              plan_type: 'free',
              monthly_limit: 25,
              current_usage: 1,
              billing_cycle_start: new Date().toISOString().split('T')[0]
            }]);
        } else if (existingSub) {
          // Update existing subscription
          await supabase
            .from('user_subscriptions')
            .update({ current_usage: existingSub.current_usage + 1 })
            .eq('user_id', userId);
        }
      } catch (usageError) {
        console.error('Usage tracking error:', usageError);
        // Don't fail the URL creation if usage tracking fails
      }
    }

    res.json({ shortUrl: `https://u2l.in/${shortCode}` });
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};
