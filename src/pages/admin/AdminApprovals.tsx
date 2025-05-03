
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, BugPlay } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { LawyersList } from "@/components/admin/lawyers/LawyersList";
import { LawyerDetails } from "@/components/admin/lawyers/LawyerDetails";
import { Lawyer, LawyerStatus } from "@/types/lawyer";

const AdminApprovals: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLawyers();
    }
  }, [user]);

  const fetchLawyers = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      console.log("Buscando advogados cadastrados com cliente normal");
      
      const { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar advogados:", error);
        setFetchError(`Erro ao buscar advogados: ${error.message}`);
        throw error;
      }
      
      console.log("Advogados encontrados:", data?.length || 0);
      console.log("Detalhes dos advogados:", data?.map(l => ({ 
        id: l.id, 
        email: l.email, 
        specialty: l.specialty, 
        status: l.status 
      })));
      
      if (data) {
        setLawyers(data as Lawyer[]);
      }
    } catch (error) {
      console.error('Erro detalhado:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar a lista de advogados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (lawyerId: string, newStatus: LawyerStatus) => {
    try {
      console.log(`Atualizando status do advogado ${lawyerId} para ${newStatus}`);
      
      const { error } = await supabase
        .from('lawyers')
        .update({ status: newStatus })
        .eq('id', lawyerId);

      if (error) {
        console.error("Erro ao atualizar status:", error);
        throw error;
      }

      console.log(`Status atualizado com sucesso para ${newStatus}`);

      // Atualiza o estado local
      setLawyers(lawyers.map(lawyer => 
        lawyer.id === lawyerId ? { ...lawyer, status: newStatus } : lawyer
      ));
      
      setSelectedLawyer(null);
      
      toast({
        title: "Status atualizado",
        description: `Advogado ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`,
        variant: "default"
      });
      
      // Buscar novamente a lista atualizada
      fetchLawyers();
    } catch (error) {
      console.error('Erro ao atualizar status do advogado:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do advogado.",
        variant: "destructive"
      });
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      console.log("Testando conexão admin com Supabase...");
      
      const { data, error } = await supabase
        .from('lawyers')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error("Erro na conexão:", error);
        toast({
          title: "Erro na conexão",
          description: `A conexão falhou: ${error.message || "Erro desconhecido"}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Conexão bem-sucedida",
          description: "A conexão com Supabase está funcionando corretamente.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro ao testar a conexão.",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
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

  if (loading && lawyers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-juris-accent mr-2" />
        <span className="text-lg">Carregando dados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Validação de Advogados</h1>
        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={testingConnection}
          >
            {testingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BugPlay className="h-4 w-4" />
            )}
            {testingConnection ? "Testando..." : "Testar Conexão"}
          </Button>
          <Button 
            onClick={fetchLawyers} 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            {loading ? "Carregando..." : "Atualizar lista"}
          </Button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          <p className="font-medium">Erro ao carregar dados</p>
          <p className="text-sm">{fetchError}</p>
        </div>
      )}

      {selectedLawyer ? (
        <LawyerDetails
          lawyer={selectedLawyer}
          formatDate={formatDate}
          onApprove={(lawyerId) => handleStatusChange(lawyerId, "approved")}
          onReject={(lawyerId) => handleStatusChange(lawyerId, "rejected")}
          onBack={() => setSelectedLawyer(null)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Advogados</CardTitle>
            <CardDescription>
              Revise e valide os cadastros de advogados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LawyersList
              lawyers={lawyers}
              loading={loading}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
              onViewDetails={setSelectedLawyer}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminApprovals;
