
import { AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lawyer } from "@/types/admin-auth";

export function useAdminAuthOperations(refreshLawyerProfile: () => Promise<void>) {
  const { toast } = useToast();

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
            gender: lawyerData.gender,
            plan_type: "free", // Set default plan_type to "free"
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

  return {
    login,
    logout,
    register,
    resetPassword
  };
}
