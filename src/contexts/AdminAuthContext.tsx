
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type Specialty = {
  id: string;
  specialty: string;
};

type Lawyer = {
  id: string;
  name: string;
  email: string;
  oab_number: string;
  specialty: string; // Keep for backward compatibility
  specialties: Specialty[]; // New field for multiple specialties
  plan_type: "basic" | "premium" | "enterprise" | null;
  subscription_active: boolean;
  bio: string | null;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
};

interface AdminAuthContextType {
  lawyer: Lawyer | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (lawyerData: Partial<Lawyer>, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshLawyerProfile: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  lawyer: null,
  user: null,
  session: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  refreshLawyerProfile: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Função para buscar o perfil do advogado
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
    } catch (error) {
      console.error("Erro ao buscar perfil do advogado:", error);
    }
  };
  
  // Função pública para recarregar o perfil do advogado
  const refreshLawyerProfile = async () => {
    if (user) {
      console.log("Recarregando perfil do advogado:", user.id);
      await fetchLawyerProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Configure os listeners de autenticação e verifique a sessão existente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!mounted) return;
        
        console.log("Evento de autenticação:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);

        if (currentSession?.user) {
          // Usar setTimeout para evitar deadlock no Supabase auth
          setTimeout(() => {
            if (mounted) {
              fetchLawyerProfile(currentSession.user.id);
            }
          }, 0);
        } else {
          setLawyer(null);
        }
      }
    );

    // Verifique se há uma sessão existente - fora do listener para evitar deadlocks
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);

      if (currentSession?.user) {
        fetchLawyerProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error("Erro ao obter sessão:", error);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao fazer login:", authError);
      
      // Traduzir mensagens de erro comuns para portugês
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      
      if (authError.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
      } else if (authError.message.includes("Email not confirmed")) {
        errorMessage = "E-mail não confirmado. Verifique sua caixa de entrada.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  const register = async (lawyerData: Partial<Lawyer>, password: string) => {
    try {
      if (!lawyerData.email) {
        throw new Error("E-mail é obrigatório");
      }

      // Registre o usuário no Auth do Supabase
      const { data, error } = await supabase.auth.signUp({
        email: lawyerData.email,
        password: password,
        options: {
          data: {
            name: lawyerData.name,
            oabNumber: lawyerData.oab_number,
            specialty: lawyerData.specialty,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cadastro realizado com sucesso",
        description: data.user ? "Verifique seu e-mail para confirmar seu cadastro." : "Sua conta foi criada com sucesso.",
      });
      
      // O trigger no Supabase vai criar automaticamente um registro na tabela lawyers
      // quando o usuário é criado no auth.users
    } catch (error) {
      const authError = error as AuthError;
      console.error("Erro ao registrar:", authError);
      
      // Traduzir mensagens de erro comuns para portugês
      let errorMessage = "Erro ao registrar. Tente novamente.";
      
      if (authError.message.includes("already registered")) {
        errorMessage = "Este e-mail já está cadastrado.";
      } else if (authError.message.includes("password")) {
        errorMessage = "A senha não atende aos requisitos mínimos.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin/reset-password',
      });

      if (error) throw error;

      toast({
        title: "E-mail enviado",
        description: "Instruções para redefinir sua senha foram enviadas para seu e-mail."
      });
    } catch (error) {
      console.error("Erro ao enviar e-mail de recuperação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar o e-mail de recuperação de senha.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-juris-accent mx-auto mb-4"></div>
          <p className="text-juris-text">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ 
      lawyer, 
      user, 
      session, 
      isAuthenticated, 
      login, 
      logout, 
      register, 
      resetPassword,
      refreshLawyerProfile
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
