
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { UserCheck, CreditCard, UserX, Clock, AlertTriangle, LayoutDashboard, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LawyerStatus } from "@/types/lawyer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

// Lista de emails administrativos
const adminEmails = ['admin@jurisquick.com'];

type AdminStats = {
  totalLawyers: number;
  approvedLawyers: number;
  pendingLawyers: number;
  rejectedLawyers: number;
  activePlans: {
    free: number;
    basic: number;
    premium: number;
    enterprise: number;
  };
  recentLawyers: LawyerInfo[];
};

type LawyerInfo = {
  id: string;
  name: string;
  email: string;
  status: LawyerStatus;
  created_at: string;
  plan_type: string | null;
  subscription_active: boolean;
};

const AdminDashboard: React.FC = () => {
  const { lawyer, user } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalLawyers: 0,
    approvedLawyers: 0,
    pendingLawyers: 0,
    rejectedLawyers: 0,
    activePlans: {
      free: 0,
      basic: 0, 
      premium: 0,
      enterprise: 0,
    },
    recentLawyers: [],
  });
  
  const isAdmin = lawyer?.email && adminEmails.includes(lawyer.email);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    if (!user || !isAdmin) return;

    setLoading(true);
    try {
      // Buscar todos os advogados, excluindo contas de admin
      const { data: lawyersData, error: lawyersError } = await supabase
        .from('lawyers')
        .select('*')
        .not('email', 'in', `(${adminEmails.join(',')})`)
        .order('created_at', { ascending: false });

      if (lawyersError) throw lawyersError;

      // Advogados excluindo contas admin
      const lawyers = lawyersData || [];

      // Calcular estatísticas
      const approvedCount = lawyers.filter(l => l.status === 'approved').length;
      const pendingCount = lawyers.filter(l => l.status === 'pending').length;
      const rejectedCount = lawyers.filter(l => l.status === 'rejected').length;

      // Contar planos ativos
      const activePlans = {
        free: lawyers.filter(l => l.plan_type === 'free' && l.subscription_active).length,
        basic: lawyers.filter(l => l.plan_type === 'basic' && l.subscription_active).length,
        premium: lawyers.filter(l => l.plan_type === 'premium' && l.subscription_active).length,
        enterprise: lawyers.filter(l => l.plan_type === 'enterprise' && l.subscription_active).length,
      };

      // Obter advogados recentes (5 mais recentes)
      const recentLawyers = lawyers.slice(0, 5).map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        status: l.status as LawyerStatus,
        created_at: l.created_at,
        plan_type: l.plan_type,
        subscription_active: l.subscription_active
      }));

      setStats({
        totalLawyers: lawyers.length,
        approvedLawyers: approvedCount,
        pendingLawyers: pendingCount,
        rejectedLawyers: rejectedCount,
        activePlans,
        recentLawyers
      });

    } catch (error) {
      console.error('Erro ao buscar dados administrativos:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: LawyerStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
            Pendente
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-800">
            Aprovado
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-800">
            Rejeitado
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

  const getPlanBadge = (planType: string | null, isActive: boolean) => {
    if (!planType || !isActive) {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800">
          Sem Plano
        </span>
      );
    }

    switch (planType) {
      case 'free':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
            Gratuito
          </span>
        );
      case 'basic':
        return (
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-800">
            Básico
          </span>
        );
      case 'premium':
        return (
          <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-800">
            Premium
          </span>
        );
      case 'enterprise':
        return (
          <span className="inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-800">
            Enterprise
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

  // Preparar dados para os gráficos
  const statusChartData = [
    { name: 'Aprovados', value: stats.approvedLawyers, color: '#10b981' },
    { name: 'Pendentes', value: stats.pendingLawyers, color: '#f59e0b' },
    { name: 'Rejeitados', value: stats.rejectedLawyers, color: '#ef4444' },
  ];

  const plansChartData = [
    { name: 'Gratuito', value: stats.activePlans.free, color: '#60a5fa' },
    { name: 'Básico', value: stats.activePlans.basic, color: '#818cf8' },
    { name: 'Premium', value: stats.activePlans.premium, color: '#a78bfa' },
    { name: 'Enterprise', value: stats.activePlans.enterprise, color: '#ec4899' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <LayoutDashboard className="mr-2 h-6 w-6 text-juris-accent" />
          <h1 className="text-2xl font-semibold">Dashboard Administrativo</h1>
        </div>
        <div className="flex items-center">
          <div className="text-sm text-gray-500 mr-4">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={fetchAdminData} 
            className="flex items-center"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {!isAdmin && (
        <Alert variant="destructive">
          <AlertTitle>Acesso restrito</AlertTitle>
          <AlertDescription>
            Esta página é restrita a administradores do sistema.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Advogados</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLawyers}</div>
            <p className="text-xs text-muted-foreground">
              Advogados cadastrados na plataforma
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advogados Aprovados</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedLawyers}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.approvedLawyers / stats.totalLawyers) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advogados Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingLawyers}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando aprovação
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planos Ativos</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(stats.activePlans).reduce((sum, current) => sum + current, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Assinaturas ativas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status dos Advogados</CardTitle>
            <CardDescription>
              Distribuição por status de aprovação
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Quantidade">
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planos Ativos</CardTitle>
            <CardDescription>
              Distribuição por tipo de plano
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={plansChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Assinaturas">
                  {plansChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advogados Recentes</CardTitle>
          <CardDescription>
            Últimos advogados cadastrados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentLawyers.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Nome</th>
                    <th className="py-3 px-4 text-left font-medium">Email</th>
                    <th className="py-3 px-4 text-left font-medium">Data</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Plano</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLawyers.map((lawyer) => (
                    <tr key={lawyer.id} className="border-b">
                      <td className="py-3 px-4">{lawyer.name}</td>
                      <td className="py-3 px-4">{lawyer.email}</td>
                      <td className="py-3 px-4">{formatDate(lawyer.created_at)}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(lawyer.status)}
                      </td>
                      <td className="py-3 px-4">
                        {getPlanBadge(lawyer.plan_type, lawyer.subscription_active)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Nenhum advogado cadastrado recentemente.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
