
import { supabase } from "@/integrations/supabase/client";

// Função para criar lead diretamente, tentando contornar problemas de RLS
export async function createLead(leadData: any) {
  try {
    // Tentativa de inserir o lead diretamente
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select();
      
    if (error) {
      console.error('Erro ao criar lead via função auxiliar:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Erro na função createLead:', err);
    return { data: null, error: err };
  }
}
