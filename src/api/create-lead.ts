
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Como estamos em um contexto de API, podemos usar service role key
// que permite contornar o RLS (Row Level Security)
const supabaseAdmin = createClient(
  'https://jkmsxsklehovlvhfbazh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-service-key'
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData = req.body;
    
    // Inserir o lead no banco de dados usando o client administrativo
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(leadData)
      .select();
      
    if (error) {
      console.error('Erro ao criar lead:', error);
      return res.status(500).json({ error: error.message });
    }
    
    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro na API create-lead:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
