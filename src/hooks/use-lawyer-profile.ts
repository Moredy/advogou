
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lawyer } from "@/types/admin-auth";

export function useLawyerProfile() {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  
  const fetchLawyerProfile = async (userId: string) => {
    try {
      console.log("Buscando perfil do advogado para o ID:", userId);
      const { data: lawyerData, error: lawyerError } = await supabase
        .from('lawyers')
        .select('*')
        .eq('id', userId)
        .single();

      if (lawyerError) {
        console.error("Erro ao buscar perfil do advogado:", lawyerError);
        return;
      }

      console.log("Perfil do advogado encontrado:", lawyerData);
      
      // Now fetch specialties from the new table
      const { data: specialtiesData, error: specialtiesError } = await supabase
        .from('lawyer_specialties')
        .select('id, specialty')
        .eq('lawyer_id', userId);
        
      if (specialtiesError) {
        console.error("Erro ao buscar especialidades do advogado:", specialtiesError);
      }
      
      console.log("Especialidades do advogado encontradas:", specialtiesData || []);
      
      // Combine the lawyer data with specialties
      const lawyerWithSpecialties = {
        ...lawyerData,
        specialties: specialtiesData || []
      };
      
      setLawyer(lawyerWithSpecialties as Lawyer);
      return lawyerWithSpecialties as Lawyer;
    } catch (error) {
      console.error("Erro ao buscar perfil do advogado:", error);
      return null;
    }
  };
  
  return {
    lawyer,
    setLawyer,
    fetchLawyerProfile
  };
}
