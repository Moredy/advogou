
import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

type PlanType = "free" | "basic" | "premium";

type Plan = {
  id: PlanType;
  name: string;
  price: number;
  description: string;
  features: string[];
  leadsPerMonth: number | string;
  recommended?: boolean;
  disabled?: boolean;
  free?: boolean;
};

const AdminPlans: React.FC = () => {
  const { lawyer, user, refreshLawyerProfile } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PlanType | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Carregar o plano atual do advogado
  useEffect(() => {
    if (lawyer) {
      setCurrentPlan(lawyer.plan_type as PlanType || null);
      setIsInitialLoading(false);
    }
  }, [lawyer]);

  // Atualize os dados do advogado quando a página for carregada
  useEffect(() => {
    if (user) {
      fetchLawyerData();
    }
  }, [user]);

  const fetchLawyerData = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Erro ao buscar dados do advogado:', error);
        return;
      }
      
      if (data) {
        setCurrentPlan(data.plan_type as PlanType || null);
        setIsInitialLoading(false);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do advogado:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const plans: Plan[] = [
    {
      id: "free",
      name: "Gratuito",
      price: 0,
      description: "Acesso a leads de todos os tipos",
      features: [
        "Limite de 5 leads por mês"
      ],
      leadsPerMonth: 5,
      free: true
    },
    {
      id: "basic",
      name: "Básico",
      price: 249,
      description: "Prioridade no recebimento de até 10 leads por mês",
      features: [
        "Leads com maior intenção:",
        "Pessoas que estão para entrar com processo",
        "Pessoas que foram citadas em processos"
      ],
      leadsPerMonth: 10
    },
    {
      id: "premium",
      name: "Premium",
      price: 499,
      description: "Prioridade máxima, sem limite de leads",
      features: [
        "Leads com alta intenção:",
        "Pessoas que estão para entrar com processo",
        "Pessoas que foram citadas em processos"
      ],
      leadsPerMonth: "Ilimitado",
      recommended: true
    }
  ];

  const handleSubscribe = async (planId: PlanType) => {
    if (!user) return;
    
    setLoading(planId);

    try {
      console.log(`Tentando assinar plano: ${planId} para usuário: ${user.id}`);
      
      // Atualizar o plano do advogado no Supabase
      const { data, error } = await supabase
        .from('lawyers')
        .update({
          plan_type: planId,
          subscription_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar plano:', error);
        throw error;
      }

      console.log('Plano atualizado com sucesso:', data);
      
      setCurrentPlan(planId);
      
      // Atualizar o perfil do advogado no contexto
      await refreshLawyerProfile();
      
      toast({
        title: "Plano assinado com sucesso!",
        description: `Você assinou o plano ${plans.find(p => p.id === planId)?.name}. Você começará a receber leads em breve.`,
      });
    } catch (error) {
      console.error('Erro ao assinar plano:', error);
      toast({
        title: "Erro ao assinar plano",
        description: "Ocorreu um erro ao processar sua assinatura. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  // Auto-select the free plan if no plan is selected
  useEffect(() => {
    if (!isInitialLoading && user && !currentPlan && !loading) {
      console.log("Auto-selecionando plano gratuito");
      handleSubscribe("free");
    }
  }, [currentPlan, user, isInitialLoading, loading]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Planos Disponíveis</h1>
        <p className="text-muted-foreground mt-1">
          Escolha o plano que melhor se adapta às suas necessidades.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`
              ${plan.recommended ? "border-juris-accent shadow-lg" : ""}
              ${plan.free ? "border-green-500 shadow-md" : ""}
              ${currentPlan === plan.id ? "ring-2 ring-green-500" : ""}
            `}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle>{plan.name}</CardTitle>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">{plan.price > 0 ? `R$ ${plan.price}` : 'Grátis'}</span>
                {plan.price > 0 && <span className="text-muted-foreground ml-1">/mês</span>}
              </div>
              
              <div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {i === 0 || (plan.id !== "free" && i > 0) ? 
                        <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" /> : 
                        <div className="w-4 ml-6"></div>
                      }
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(plan.id)} 
                className="w-full" 
                variant={plan.free ? "default" : plan.recommended ? "default" : "outline"}
              >
                {loading === plan.id ? "Processando..." : 
                 currentPlan === plan.id ? "Plano Atual" : 
                 "Assinar Plano"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-lg font-medium mb-4">Perguntas Frequentes</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Como são qualificados os leads?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Todos os leads são pré-filtrados conforme sua área de atuação e passam por uma análise prévia para garantir que se enquadram no seu perfil profissional.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Posso mudar de plano depois?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Mudanças serão refletidas no próximo ciclo de faturamento.
            </p>
          </div>
          <div>
            <h3 className="font-medium">O que são leads com maior intenção?</h3>
            <p className="text-sm text-gray-600 mt-1">
              São pessoas que demonstram intenção clara de iniciar um processo judicial ou que já foram citadas em processos, representando oportunidades de maior potencial para conversão.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
