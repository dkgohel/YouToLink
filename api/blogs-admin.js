import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json(data);
    }

    if (req.method === 'POST') {
      const { title, content, slug, published } = req.body;

      // Use a placeholder author_id for now
      const { data, error } = await supabase
        .from('blogs')
        .insert([{ 
          title, 
          content, 
          slug, 
          published, 
          author_id: '00000000-0000-0000-0000-000000000000' 
        }])
        .select()
        .single();

      if (error) throw error;
      return res.json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
