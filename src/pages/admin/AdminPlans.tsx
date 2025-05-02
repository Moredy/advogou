
import React, { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";

type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  leadsPerMonth: number;
  recommended?: boolean;
};

const AdminPlans: React.FC = () => {
  const { lawyer } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Básico",
      price: 249,
      description: "Para advogados iniciantes que querem expandir sua base de clientes.",
      features: [
        "5 leads qualificados por mês",
        "Perfil na plataforma",
        "Suporte por e-mail"
      ],
      leadsPerMonth: 5
    },
    {
      id: "premium",
      name: "Premium",
      price: 499,
      description: "Para advogados estabelecidos que buscam crescimento constante.",
      features: [
        "15 leads qualificados por mês",
        "Perfil destacado na plataforma",
        "Suporte prioritário",
        "Análise mensal de conversão"
      ],
      leadsPerMonth: 15,
      recommended: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 899,
      description: "Para escritórios com alta demanda por novos casos.",
      features: [
        "30 leads qualificados por mês",
        "Perfil premium na plataforma",
        "Suporte dedicado",
        "Análise semanal de conversão",
        "Exclusividade em área de atuação"
      ],
      leadsPerMonth: 30
    }
  ];

  const handleSubscribe = (planId: string) => {
    setLoading(planId);

    // Mock subscription process
    setTimeout(() => {
      // Update the lawyer object in context
      const mockSubscription = {
        planType: planId as "basic" | "premium" | "enterprise",
        subscriptionActive: true
      };

      // In a real implementation, this would be an API call
      const updatedLawyer = { ...lawyer, ...mockSubscription };
      localStorage.setItem("jurisquick_lawyer", JSON.stringify(updatedLawyer));

      toast({
        title: "Plano assinado com sucesso!",
        description: `Você assinou o plano ${plans.find(p => p.id === planId)?.name}. Você começará a receber leads em breve.`,
      });

      setLoading(null);
      
      // Force a page reload to update the lawyer context
      window.location.href = "/admin/dashboard";
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Planos de Assinatura</h1>
        <p className="text-muted-foreground mt-1">
          Escolha o melhor plano para receber leads qualificados
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={plan.recommended ? "border-juris-accent shadow-lg" : ""}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-juris-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                Recomendado
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">R$ {plan.price}</span>
                <span className="text-muted-foreground ml-1">/mês</span>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Inclui:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSubscribe(plan.id)} 
                className="w-full" 
                variant={plan.recommended ? "default" : "outline"}
                disabled={loading !== null}
              >
                {loading === plan.id ? "Processando..." : lawyer?.planType === plan.id ? "Plano Atual" : "Assinar Plano"}
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
            <h3 className="font-medium">Existe fidelidade?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Não há período de fidelidade. Você pode cancelar sua assinatura a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;
