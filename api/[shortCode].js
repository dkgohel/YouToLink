const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  const { shortCode } = req.query;

  if (!shortCode) {
    return res.status(404).json({ error: 'Short code required' });
  }

  try {
    const { data, error } = await supabase
      .from('urls')
      .select('long_url, click_count')
      .eq('short_code', shortCode)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Increment click count
    await supabase
      .from('urls')
      .update({ click_count: data.click_count + 1 })
      .eq('short_code', shortCode);

    // Redirect to the long URL
    res.redirect(302, data.long_url);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
