import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Users, MessageSquare, TrendingUp, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LawyerStatus } from "@/types/lawyer"; // Import LawyerStatus type

type LeadStatus = "pending" | "contacted" | "converted" | "not_converted";

type DashboardStats = {
  leadsReceived: number;
  leadsConvertidos: number;
  conversion: number;
  pendingEvaluation: number;
};

type Lead = {
  id: string;
  client_name: string;
  case_area: string;
  created_at: string;
  status: LeadStatus;
};

// Lista de emails administrativos
const adminEmails = ['admin@jurisquick.com'];

const AdminDashboard: React.FC = () => {
  const { lawyer, user, refreshLawyerProfile } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requestingReeval, setRequestingReeval] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    leadsReceived: 0,
    leadsConvertidos: 0,
    conversion: 0,
    pendingEvaluation: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  
  const isAdmin = lawyer?.email && adminEmails.includes(lawyer.email);
  // Fix the TypeScript error by checking the status properly, ensuring it's type-safe
  const isPending = lawyer?.status === "pending";
  const isRejected = lawyer?.status === "rejected";

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Buscar todos os leads do advogado
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('lawyer_id', user.id);

      if (leadsError) throw leadsError;

      // Calcular estatísticas
      const leads = leadsData || [];
      const totalLeads = leads.length;
      const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
      const pendingEvaluation = leads.filter(lead => lead.quality_rating === null).length;

      setStats({
        leadsReceived: totalLeads,
        leadsConvertidos: convertedLeads,
        conversion: Number(conversionRate.toFixed(2)),
        pendingEvaluation
      });

      // Buscar leads recentes
      const { data: recentLeadsData, error: recentLeadsError } = await supabase
        .from('leads')
        .select('id, client_name, case_area, created_at, status')
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentLeadsError) throw recentLeadsError;

      // Cast the status to ensure it matches the LeadStatus type
      if (recentLeadsData) {
        setRecentLeads(recentLeadsData.map(lead => ({
          ...lead,
          status: lead.status as LeadStatus
        })));
      }

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const requestReevaluation = async () => {
    if (!user) return;
    
    setRequestingReeval(true);
    try {
      const { error } = await supabase
        .from('lawyers')
        .update({ status: 'pending' })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshLawyerProfile();
      
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de reavaliação foi enviada com sucesso. Seu perfil será analisado novamente.",
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao solicitar reavaliação:', error);
      toast({
        title: "Erro ao solicitar reavaliação",
        description: "Não foi possível processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setRequestingReeval(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
            Pendente
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
            Contatado
          </span>
        );
      case 'converted':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-800">
            Convertido
          </span>
        );
      case 'not_converted':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-800">
            Não Convertido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800">
            Desconhecido
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-juris-accent" />
        <span className="ml-2 text-lg">Carregando dados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {!isAdmin && isPending && (
        <Alert>
          <AlertTitle>Aguardando aprovação</AlertTitle>
          <AlertDescription>
            Sua conta está em análise e será avaliada por um especialista em até 24 horas. 
            Para aumentar suas chances de aprovação, mantenha seu perfil o mais completo possível,
            incluindo especialidades, biografia profissional e informações de contato.
          </AlertDescription>
        </Alert>
      )}

      {!isAdmin && isRejected && (
        <Alert variant="destructive">
          <AlertTitle>Cadastro rejeitado</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              Seu cadastro foi analisado e não foi aprovado. Isto pode ocorrer por diversos motivos, 
              como informações incompletas ou inconsistentes. Sugerimos revisar seus dados e certificar-se 
              de que todas as informações estejam corretas e completas.
            </p>
            <Button 
              onClick={requestReevaluation} 
              variant="outline" 
              className="mt-2 bg-white"
              disabled={requestingReeval}
            >
              {requestingReeval ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" /> 
                  Solicitar nova avaliação
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!lawyer?.plan_type && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 flex items-start space-x-4">
            <div className="rounded-full bg-orange-100 p-3">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-orange-800">Assine um plano</h3>
              <p className="text-orange-700 mt-1">
                Para começar a receber leads, assine um dos nossos planos e aumente sua carteira de clientes.
              </p>
              <a 
                href="/admin/planos" 
                className="mt-3 inline-block text-sm font-medium text-orange-700 hover:text-orange-600 underline"
              >
                Ver planos disponíveis
              </a>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Recebidos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leadsReceived}</div>
            <p className="text-xs text-muted-foreground">
              Total de leads recebidos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Convertidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.leadsConvertidos}</div>
            <p className="text-xs text-muted-foreground">
              Clientes adquiridos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversion}%</div>
            <p className="text-xs text-muted-foreground">
              De leads para clientes
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEvaluation}</div>
            <p className="text-xs text-muted-foreground">
              Avaliar qualidade dos leads
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads Recentes</CardTitle>
          <CardDescription>
            Últimos leads recebidos através da plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLeads.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Cliente</th>
                    <th className="py-3 px-4 text-left font-medium">Área</th>
                    <th className="py-3 px-4 text-left font-medium">Data</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b">
                      <td className="py-3 px-4">{lead.client_name}</td>
                      <td className="py-3 px-4">{lead.case_area}</td>
                      <td className="py-3 px-4">{formatDate(lead.created_at)}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(lead.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum lead recebido ainda. Assine um plano para começar a receber leads.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
