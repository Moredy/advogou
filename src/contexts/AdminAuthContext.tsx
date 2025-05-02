
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { AdminAuthContextType, Lawyer } from "@/types/admin-auth";
import { useLawyerProfile } from "@/hooks/use-lawyer-profile";
import { useAdminAuthOperations } from "@/hooks/use-admin-auth-operations";
import { LoadingSpinner } from "@/components/admin/LoadingSpinner";

// Lista de emails administrativos
const adminEmails = ['admin@jurisquick.com'];

const AdminAuthContext = createContext<AdminAuthContextType>({
  lawyer: null,
  user: null,
  session: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  refreshLawyerProfile: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { lawyer, setLawyer, fetchLawyerProfile } = useLawyerProfile();
  
  // Função pública para recarregar o perfil do advogado
  const refreshLawyerProfile = async () => {
    if (user) {
      console.log("Recarregando perfil do advogado:", user.id);
      await fetchLawyerProfile(user.id);
    }
  };
  
  const { login, logout, register, resetPassword } = useAdminAuthOperations(refreshLawyerProfile);

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

        // Verificar se é admin pelo email
        if (currentSession?.user) {
          const userEmail = currentSession.user.email;
          setIsAdmin(userEmail ? adminEmails.includes(userEmail) : false);
          
          // Usar setTimeout para evitar deadlock no Supabase auth
          setTimeout(() => {
            if (mounted) {
              fetchLawyerProfile(currentSession.user.id);
            }
          }, 0);
        } else {
          setLawyer(null);
          setIsAdmin(false);
        }
      }
    );

    // Verifique se há uma sessão existente - fora do listener para evitar deadlocks
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession);

      // Verificar se é admin pelo email
      if (currentSession?.user) {
        const userEmail = currentSession.user.email;
        setIsAdmin(userEmail ? adminEmails.includes(userEmail) : false);
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AdminAuthContext.Provider value={{ 
      lawyer, 
      user, 
      session, 
      isAuthenticated,
      isAdmin, 
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
