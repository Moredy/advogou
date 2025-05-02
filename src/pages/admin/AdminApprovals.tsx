import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, ShieldX, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Loader2 } from "lucide-react";

type LawyerStatus = "pending" | "approved" | "rejected";

type Lawyer = {
  id: string;
  name: string;
  email: string;
  oab_number: string;
  specialty: string;
  created_at: string;
  status: LawyerStatus;
  bio: string | null;
};

const AdminApprovals: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);

  useEffect(() => {
    if (user) {
      fetchLawyers();
    }
  }, [user]);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      console.log("Buscando todos os advogados cadastrados");
      const { data, error } = await supabase
        .from('lawyers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Advogados encontrados:", data);
      
      // Transform the data to ensure type safety with our Lawyer type
      const transformedData: Lawyer[] = data.map((lawyer: any) => ({
        id: lawyer.id,
        name: lawyer.name,
        email: lawyer.email,
        oab_number: lawyer.oab_number,
        specialty: lawyer.specialty,
        created_at: lawyer.created_at,
        status: (lawyer.status as LawyerStatus) || "pending",
        bio: lawyer.bio
      }));
      
      setLawyers(transformedData);
    } catch (error) {
      console.error('Erro ao buscar advogados:', error);
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
      // Using the Update interface from Supabase, which now includes status
      const { error } = await supabase
        .from('lawyers')
        .update({ status: newStatus })
        .eq('id', lawyerId);

      if (error) throw error;

      // Update local state
      setLawyers(lawyers.map(lawyer => 
        lawyer.id === lawyerId ? { ...lawyer, status: newStatus } : lawyer
      ));
      
      setSelectedLawyer(null);
      
      toast({
        title: "Status atualizado",
        description: `Advogado ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`,
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao atualizar status do advogado:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do advogado.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
        <h1 className="text-2xl font-semibold">Validação de Advogados</h1>
        <Button onClick={fetchLawyers} variant="outline" size="sm" className="gap-2">
          <Loader2 className="h-4 w-4" />
          Atualizar lista
        </Button>
      </div>

      {selectedLawyer ? (
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{selectedLawyer.name}</CardTitle>
                <CardDescription>Detalhes do perfil para validação</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedLawyer(null)}>
                Voltar para lista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Informações Pessoais</h3>
                <div className="space-y-2 mt-2">
                  <p><span className="font-medium">Nome:</span> {selectedLawyer.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedLawyer.email}</p>
                  <p><span className="font-medium">Número OAB:</span> {selectedLawyer.oab_number}</p>
                  <p><span className="font-medium">Especialidade:</span> {selectedLawyer.specialty}</p>
                  <p><span className="font-medium">Cadastrado em:</span> {formatDate(selectedLawyer.created_at)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Biografia</h3>
                <p className="mt-2">{selectedLawyer.bio || "Nenhuma biografia fornecida"}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Validação</h3>
              <div className="flex gap-3">
                <Button 
                  variant="default" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusChange(selectedLawyer.id, "approved")}
                  disabled={selectedLawyer.status === "approved"}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Aprovar Advogado
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleStatusChange(selectedLawyer.id, "rejected")}
                  disabled={selectedLawyer.status === "rejected"}
                >
                  <ShieldX className="mr-2 h-4 w-4" />
                  Rejeitar Cadastro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Advogados</CardTitle>
            <CardDescription>
              Revise e valide os cadastros de advogados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lawyers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>OAB</TableHead>
                      <TableHead>Especialidade</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lawyers.map((lawyer) => (
                      <TableRow key={lawyer.id}>
                        <TableCell>{lawyer.name}</TableCell>
                        <TableCell>{lawyer.oab_number}</TableCell>
                        <TableCell>{lawyer.specialty}</TableCell>
                        <TableCell>{formatDate(lawyer.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(lawyer.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLawyer(lawyer)}
                          >
                            <Search className="h-4 w-4 mr-1" />
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Nenhum advogado encontrado.
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminApprovals;
