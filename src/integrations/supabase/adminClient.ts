
// Este cliente é específico para operações de administração que requerem acesso
// a dados de todos os usuários, ignorando as políticas de RLS
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jkmsxsklehovlvhfbazh.supabase.co";
// Atenção: Esta chave deve ser a chave de serviço (service_role), não a chave anônima
// Na implementação real, esta chave deve estar em uma variável de ambiente segura
const SUPABASE_ADMIN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprbXN4c2tsZWhvdmx2aGZiYXpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjE5OTg5MCwiZXhwIjoyMDYxNzc1ODkwfQ.4qjnAyfa3zZQIVGsY1CLeSIJI8kymf640inL492rLe8";

// Criando o cliente admin com configurações específicas para garantir que esteja usando a service_role
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
        // Garantir que estamos enviando os cabeçalhos corretos
        'Authorization': `Bearer ${SUPABASE_ADMIN_KEY}`,
        'apikey': SUPABASE_ADMIN_KEY
      }
    }
  }
);

// Função utilitária para depuração de cabeçalhos sem acessar diretamente propriedades protegidas
export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${SUPABASE_ADMIN_KEY}`,
  'apikey': SUPABASE_ADMIN_KEY
});
