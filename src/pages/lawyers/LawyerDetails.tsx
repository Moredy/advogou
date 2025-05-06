import React from "react";
import { Lawyer } from "@/types/lawyer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type LawyerDetailsProps = {
  lawyer: Lawyer;
  formatDate: (dateString: string) => string;
  onApprove: (lawyerId: string) => Promise<void>;
  onReject: (lawyerId: string) => Promise<void>;
  onBack: () => void;
};

// Lista de emails administrativos
const adminEmails = ['admin@jurisquick.com'];

export const LawyerDetails: React.FC<LawyerDetailsProps> = ({
  lawyer,
  formatDate,
  onApprove,
  onReject,
  onBack,
}) => {
  const isAdmin = adminEmails.includes(lawyer.email);
  
  // Function to determine status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejected': 
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-medium text-gray-400">{lawyer.name.toUpperCase()}</CardTitle>
              {getStatusBadge(lawyer.status || 'pending')}
            </div>
            <CardDescription className="mt-1">
              {lawyer.oab_number && (
                <div className="text-sm space-x-1">
                  <span className="text-juris-accent font-medium">{lawyer.specialty}</span>
                  <span>•</span>
                  <span>{formatDate(lawyer.created_at)}</span>
                  <span>•</span>
                  <span>{lawyer.oab_number}</span>
                </div>
              )}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onBack} size="sm">
            Voltar para lista
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {lawyer.bio && (
          <div className="bg-gray-50 rounded-md p-3 border text-sm">
            <p>{lawyer.bio}</p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Informações Pessoais</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Nome:</span> {lawyer.name}</p>
              <p><span className="font-medium">Email:</span> {lawyer.email}</p>
              <p><span className="font-medium">Número OAB:</span> {lawyer.oab_number}</p>
              <p><span className="font-medium">Especialidade:</span> {lawyer.specialty}</p>
              <p><span className="font-medium">Cadastrado em:</span> {formatDate(lawyer.created_at)}</p>
              {lawyer.phone && <p><span className="font-medium">Telefone:</span> {lawyer.phone}</p>}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Informações de Plano</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Plano:</span> 
                {lawyer.plan_type ? lawyer.plan_type : "Sem plano"}
              </p>
              <p>
                <span className="font-medium">Status da assinatura:</span> 
                {lawyer.subscription_active ? (
                  <span className="text-green-600">Ativa</span>
                ) : (
                  <span className="text-red-600">Inativa</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-wrap gap-3">
        <Button 
          variant="default" 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => onApprove(lawyer.id)}
          disabled={lawyer.status === "approved"}
        >
          <ShieldCheck className="mr-2 h-4 w-4" />
          Aprovar Advogado
        </Button>
        <Button 
          variant="destructive"
          onClick={() => onReject(lawyer.id)}
          disabled={lawyer.status === "rejected"}
        >
          <ShieldX className="mr-2 h-4 w-4" />
          Rejeitar Cadastro
        </Button>
      </CardFooter>
    </Card>
  );
};
