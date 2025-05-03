
import { supabase } from "@/integrations/supabase/client";

// Função para criar lead diretamente usando RLS
export async function createLead(leadData: any) {
  try {
    console.log("Tentando criar lead com dados:", leadData);
    
    // Usando supabase client com RLS habilitado
    const { data, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select();
      
    if (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
    
    console.log("Lead criado com sucesso:", data);
    return { data, error: null };
  } catch (err) {
    console.error('Erro na função createLead:', err);
    return { data: null, error: err };
  }
}
