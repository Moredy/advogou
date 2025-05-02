
import React from "react";
import { Lawyer } from "@/types/lawyer";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

type LawyerDetailsProps = {
  lawyer: Lawyer;
  formatDate: (dateString: string) => string;
  onApprove: (lawyerId: string) => Promise<void>;
  onReject: (lawyerId: string) => Promise<void>;
  onBack: () => void;
};

export const LawyerDetails: React.FC<LawyerDetailsProps> = ({
  lawyer,
  formatDate,
  onApprove,
  onReject,
  onBack,
}) => {
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
