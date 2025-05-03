
import { createClient } from '@supabase/supabase-js';

// Como estamos em um contexto de API, podemos usar service role key
// que permite contornar o RLS (Row Level Security)
const supabaseAdmin = createClient(
  'https://jkmsxsklehovlvhfbazh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-service-key'
);

export async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return {
      status: 405, 
      body: { error: 'Method not allowed' }
    };
  }

  try {
    const leadData = req.body;
    
    // Inserir o lead no banco de dados usando o client administrativo
    // que contorna as políticas RLS quando necessário
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert(leadData)
      .select();
      
    if (error) {
      console.error('Erro ao criar lead:', error);
      return {
        status: 500,
        body: { error: error.message }
      };
    }
    
    return {
      status: 200,
      body: data
    };
  } catch (err) {
    console.error('Erro na API create-lead:', err);
    return {
      status: 500,
      body: { error: 'Internal server error' }
    };
  }
}
