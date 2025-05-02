
// Este cliente é específico para operações de administração que requerem acesso
// a dados de todos os usuários, ignorando as políticas de RLS
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jkmsxsklehovlvhfbazh.supabase.co";
// Atenção: Esta chave deve ser a chave de serviço (service_role), não a chave anônima
const SUPABASE_ADMIN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbXN4c2tsZWhvdmx2aGZiYXpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjE5OTg5MCwiZXhwIjoyMDYxNzc1ODkwfQ.4qjnAyfa3zZQIVGsY1CLeSIJI8kymf640inL492rLe8";

export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ADMIN_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'apikey': SUPABASE_ADMIN_KEY,
        'Authorization': `Bearer ${SUPABASE_ADMIN_KEY}`
      }
    }
  }
);

// Função utilitária para depuração de cabeçalhos
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${SUPABASE_ADMIN_KEY}`,
  'apikey': SUPABASE_ADMIN_KEY
});

// Função para testar a conexão manualmente no console
export const testAdminConnection = async () => {
  try {
    console.log("Testando conexão admin com Supabase...");
    console.log("URL:", SUPABASE_URL);
    console.log("Cabeçalhos:", getAuthHeaders());
    
    const { data, error } = await supabaseAdmin
      .from('lawyers')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error("Erro na conexão:", error);
      return { success: false, error };
    }
    
    console.log("Conexão bem-sucedida:", data);
    return { success: true, data };
  } catch (e) {
    console.error("Exceção ao testar conexão:", e);
    return { success: false, error: e };
  }
};
