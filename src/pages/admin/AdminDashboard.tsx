
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Users, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { lawyer } = useAdminAuth();
  
  // Dummy data for the dashboard
  const dashboardData = {
    leadsReceived: 12,
    leadsConvertidos: 5,
    conversion: 41.67,
    pendingEvaluation: 3,
  };

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

      {!lawyer?.planType && (
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
            <div className="text-2xl font-bold">{dashboardData.leadsReceived}</div>
            <p className="text-xs text-muted-foreground">
              +2 nos últimos 7 dias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Convertidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.leadsConvertidos}</div>
            <p className="text-xs text-muted-foreground">
              +1 na última semana
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.conversion}%</div>
            <p className="text-xs text-muted-foreground">
              +2% que o mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações Pendentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingEvaluation}</div>
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
                <tr className="border-b">
                  <td className="py-3 px-4">João Silva</td>
                  <td className="py-3 px-4">Direito do Consumidor</td>
                  <td className="py-3 px-4">16/04/2025</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                      Pendente
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Maria Oliveira</td>
                  <td className="py-3 px-4">Direito Civil</td>
                  <td className="py-3 px-4">15/04/2025</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-800">
                      Convertido
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Pedro Santos</td>
                  <td className="py-3 px-4">Direito Trabalhista</td>
                  <td className="py-3 px-4">14/04/2025</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-800">
                      Não Convertido
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
