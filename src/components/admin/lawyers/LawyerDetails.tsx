
import React from "react";
import { Lawyer } from "@/types/lawyer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const isPending = lawyer.status === "pending";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{lawyer.name}</CardTitle>
            <CardDescription>Detalhes do perfil para validação</CardDescription>
          </div>
          <Button variant="outline" onClick={onBack}>
            Voltar para lista
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Informações Pessoais</h3>
            <div className="space-y-2 mt-2">
              <p><span className="font-medium">Nome:</span> {lawyer.name}</p>
              <p><span className="font-medium">Email:</span> {lawyer.email}</p>
              <p><span className="font-medium">Número OAB:</span> {lawyer.oab_number}</p>
              <p><span className="font-medium">Especialidade:</span> {lawyer.specialty}</p>
              <p><span className="font-medium">Cadastrado em:</span> {formatDate(lawyer.created_at)}</p>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Biografia</h3>
            <p className="mt-2">{lawyer.bio || "Nenhuma biografia fornecida"}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Validação</h3>
          <div className="flex gap-3">
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
