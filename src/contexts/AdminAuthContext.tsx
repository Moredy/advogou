
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User, AuthError } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

type Lawyer = {
  id: string;
  name: string;
  email: string;
  oab_number: string;
  specialty: string;
  plan_type: "basic" | "premium" | "enterprise" | null;
  subscription_active: boolean;
};

interface AdminAuthContextType {
  lawyer: Lawyer | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (lawyerData: Partial<Lawyer>, password: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  lawyer: null,
  user: null,
  session: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Configure os listeners de autenticação e verifique a sessão existente
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession);

        if (currentSession?.user) {
          await fetchLawyerProfile(currentSession.user.id);
        } else {
          setLawyer(null);
        }
      }
    );

    // Verifique se há uma sessão existente
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);

      if (currentSession?.user) {
        await fetchLawyerProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para buscar o perfil do advogado
  const fetchLawyerProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil do advogado:", error);
        return;
      }

      setLawyer(data as Lawyer);
    } catch (error) {
      console.error("Erro ao buscar perfil do advogado:", error);
    }
  };

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

  if (isLoading) {
    // Você pode adicionar um componente de loading aqui se desejar
    return <div>Carregando...</div>;
  }

  return (
    <AdminAuthContext.Provider value={{ lawyer, user, session, isAuthenticated, login, logout, register }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
