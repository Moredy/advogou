import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  oabNumber: z.string().min(3, "Número OAB inválido"),
  specialty: z.string().min(3, "Especialidade deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "As senhas não conferem",
});

const AdminLogin: React.FC = () => {
  const { login, register, isAuthenticated, resetPassword } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulários com validação
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      oabNumber: "",
      specialty: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [activeTab, setActiveTab] = useState("login");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Verificar parâmetros de erro na URL
  useEffect(() => {
    const hashParams = window.location.hash.substring(1).split('&').reduce((acc, item) => {
      const [key, value] = item.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    if (hashParams.error) {
      let errorMessage = "Ocorreu um erro durante a autenticação.";
      
      if (hashParams.error_code === "otp_expired" || hashParams.error_description?.includes("Email link is invalid or has expired")) {
        errorMessage = "O link de confirmação expirou ou é inválido. Por favor, solicite um novo.";
      }
      
      toast({
        title: "Erro de autenticação",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Limpar os parâmetros de erro da URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [toast]);

  const handleLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);

    try {
      await login(values.email, values.password);
      navigate("/admin/dashboard");
      toast({
        title: "Login efetuado com sucesso",
        description: "Bem-vindo de volta ao JurisQuick",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: error instanceof Error ? error.message : "Verifique seus dados e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);

    try {
      await register(
        {
          name: values.name,
          email: values.email,
          oab_number: values.oabNumber,
          specialty: values.specialty,
        },
        values.password
      );
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Por favor, verifique seu e-mail para confirmar seu cadastro.",
      });
      
    } catch (error) {
      toast({
        title: "Erro ao realizar cadastro",
        description: error instanceof Error ? error.message : "Verifique seus dados e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail) {
      toast({
        title: "Erro",
        description: "Por favor, informe seu e-mail.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(recoveryEmail);
      setIsForgotPassword(false);
      setActiveTab("login");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o e-mail de recuperação.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar o formulário de recuperação de senha
  if (isForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-juris-dark to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Juris<span className="text-juris-accent">Quick</span>
            </h1>
            <p className="text-gray-400">Recuperação de Senha</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Esqueceu sua senha?</CardTitle>
              <CardDescription className="text-center">
                Digite seu e-mail para receber um link de recuperação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recovery-email">E-mail</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsForgotPassword(false)}
                  disabled={isSubmitting}
                >
                  Voltar ao login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-juris-dark to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Juris<span className="text-juris-accent">Quick</span>
          </h1>
          <p className="text-gray-400">Painel de Advogados</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Área Restrita</CardTitle>
            <CardDescription className="text-center">
              Faça login ou cadastre-se para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="seu@email.com"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center">
                            <FormLabel>Senha</FormLabel>
                            <Button
                              type="button"
                              variant="link"
                              className="p-0 h-auto font-normal text-xs"
                              onClick={() => setIsForgotPassword(true)}
                            >
                              Esqueceu a senha?
                            </Button>
                          </div>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Processando..." : "Entrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Dr. Nome Completo"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="seu@email.com"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="oabNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número OAB</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="123456/UF"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="specialty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Especialidade</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Direito Civil"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirme a Senha</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Processando..." : "Cadastrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Ao entrar, você concorda com os nossos{" "}
              <a href="#" className="text-juris-accent hover:underline">
                Termos de Serviço
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
