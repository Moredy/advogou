
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type Lead = {
  id: string;
  clientName: string;
  area: string;
  date: string;
  message: string;
  status: "pending" | "contacted" | "converted" | "not_converted";
  feedback?: {
    relevant: boolean;
    quality: "high" | "medium" | "low";
    comments: string;
  };
};

const AdminLeads: React.FC = () => {
  const { toast } = useToast();
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    relevant: true,
    quality: "high" as "high" | "medium" | "low",
    comments: "",
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Mock leads data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "lead-1",
      clientName: "João Silva",
      area: "Direito do Consumidor",
      date: "16/04/2025",
      message: "Preciso de ajuda com um problema de produto com defeito que comprei. A empresa não quer fazer a troca mesmo dentro da garantia.",
      status: "pending"
    },
    {
      id: "lead-2",
      clientName: "Maria Oliveira",
      area: "Direito Civil",
      date: "15/04/2025",
      message: "Estou com problemas em um contrato de prestação de serviços. O serviço não foi prestado conforme acordado.",
      status: "contacted",
      feedback: {
        relevant: true,
        quality: "high",
        comments: "Cliente bem qualificado e com caso dentro da minha área."
      }
    },
    {
      id: "lead-3",
      clientName: "Pedro Santos",
      area: "Direito Trabalhista",
      date: "14/04/2025",
      message: "Fui demitido sem justa causa e não recebi todos os meus direitos. Gostaria de uma análise do meu caso.",
      status: "converted",
      feedback: {
        relevant: true,
        quality: "medium",
        comments: "Cliente convertido, mas caso um pouco complexo."
      }
    },
    {
      id: "lead-4",
      clientName: "Ana Souza",
      area: "Direito Civil",
      date: "13/04/2025",
      message: "Tenho uma disputa com meu vizinho sobre os limites do terreno. Já tentamos resolver amigavelmente, sem sucesso.",
      status: "not_converted",
      feedback: {
        relevant: false,
        quality: "low",
        comments: "Não era um caso dentro da minha especialidade específica de direito civil."
      }
    },
    {
      id: "lead-5",
      clientName: "Luiz Ferreira",
      area: "Direito do Consumidor",
      date: "12/04/2025",
      message: "Comprei um produto online que nunca foi entregue. A empresa não responde minhas tentativas de contato.",
      status: "pending"
    }
  ]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return {
          text: "Pendente",
          color: "bg-yellow-100 text-yellow-800"
        };
      case "contacted":
        return {
          text: "Contatado",
          color: "bg-blue-100 text-blue-800"
        };
      case "converted":
        return {
          text: "Convertido",
          color: "bg-green-100 text-green-800"
        };
      case "not_converted":
        return {
          text: "Não Convertido",
          color: "bg-red-100 text-red-800"
        };
      default:
        return {
          text: status,
          color: "bg-gray-100 text-gray-800"
        };
    }
  };

  const handleOpenLead = (leadId: string) => {
    setOpenLeadId(leadId);
    const lead = leads.find(l => l.id === leadId);
    if (lead?.feedback) {
      setFeedbackForm(lead.feedback);
    } else {
      setFeedbackForm({
        relevant: true,
        quality: "high",
        comments: "",
      });
    }
  };

  const handleCloseLead = () => {
    setOpenLeadId(null);
  };

  const handleUpdateStatus = (leadId: string, status: Lead['status']) => {
    setLeads(
      leads.map(lead => 
        lead.id === leadId ? { ...lead, status } : lead
      )
    );

    toast({
      title: "Status atualizado",
      description: `O lead foi marcado como ${getStatusLabel(status).text.toLowerCase()}.`,
    });
  };

  const handleSubmitFeedback = (leadId: string) => {
    setLeads(
      leads.map(lead => 
        lead.id === leadId ? { 
          ...lead, 
          feedback: { ...feedbackForm } 
        } : lead
      )
    );

    toast({
      title: "Feedback enviado",
      description: "Obrigado por avaliar a qualidade deste lead.",
    });

    handleCloseLead();
  };

  const filteredLeads = statusFilter 
    ? leads.filter(lead => lead.status === statusFilter)
    : leads;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Leads Recebidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e avalie os leads que você recebeu através da plataforma
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm">Filtrar por:</Label>
          <select
            id="status-filter"
            className="text-sm border rounded p-1"
            value={statusFilter || ""}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="contacted">Contatados</option>
            <option value="converted">Convertidos</option>
            <option value="not_converted">Não Convertidos</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{lead.clientName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{lead.area}</span>
                        <span>•</span>
                        <span>{lead.date}</span>
                      </div>
                    </div>
                    <Badge className={getStatusLabel(lead.status).color}>
                      {getStatusLabel(lead.status).text}
                    </Badge>
                  </div>
                  
                  <p className="text-sm mt-4 line-clamp-2">{lead.message}</p>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenLead(lead.id)}
                    >
                      {lead.feedback ? "Ver detalhes" : "Avaliar lead"}
                    </Button>
                    
                    {lead.status === "pending" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUpdateStatus(lead.id, "contacted")}
                      >
                        Marcar como contatado
                      </Button>
                    )}
                    
                    {(lead.status === "pending" || lead.status === "contacted") && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleUpdateStatus(lead.id, "converted")}
                        >
                          Converter lead
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(lead.id, "not_converted")}
                        >
                          Não convertido
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                {lead.feedback && (
                  <div className="bg-gray-50 p-4 md:w-64 border-t md:border-l md:border-t-0">
                    <h4 className="text-sm font-medium mb-2">Seu feedback</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Relevância:</span>{" "}
                        {lead.feedback.relevant ? "Relevante" : "Irrelevante"}
                      </p>
                      <p>
                        <span className="font-medium">Qualidade:</span>{" "}
                        {lead.feedback.quality === "high" && "Alta"}
                        {lead.feedback.quality === "medium" && "Média"}
                        {lead.feedback.quality === "low" && "Baixa"}
                      </p>
                      {lead.feedback.comments && (
                        <p className="text-gray-600 text-xs">
                          "{lead.feedback.comments}"
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-10">
              <p className="text-muted-foreground">Nenhum lead encontrado com esses filtros</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Sheet open={openLeadId !== null} onOpenChange={() => handleCloseLead()}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes do Lead</SheetTitle>
            <SheetDescription>
              Avalie a qualidade e relevância deste lead para sua prática
            </SheetDescription>
          </SheetHeader>
          
          {openLeadId && (
            <div className="mt-6 space-y-6">
              {/* Lead details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{leads.find(l => l.id === openLeadId)?.clientName}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{leads.find(l => l.id === openLeadId)?.area}</span>
                    <span>•</span>
                    <span>{leads.find(l => l.id === openLeadId)?.date}</span>
                  </div>
                </div>
                
                <Badge className={getStatusLabel(leads.find(l => l.id === openLeadId)?.status || "").color}>
                  {getStatusLabel(leads.find(l => l.id === openLeadId)?.status || "").text}
                </Badge>
                
                <div className="bg-gray-50 p-4 rounded border">
                  <p className="text-sm">{leads.find(l => l.id === openLeadId)?.message}</p>
                </div>
              </div>
              
              {/* Feedback form */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Avaliação do Lead</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lead-relevancy"
                    checked={feedbackForm.relevant}
                    onCheckedChange={(checked) => 
                      setFeedbackForm({ 
                        ...feedbackForm, 
                        relevant: checked as boolean 
                      })
                    }
                  />
                  <Label htmlFor="lead-relevancy">Este lead é relevante para minha área de atuação</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lead-quality">Qualidade do lead</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="quality-high"
                        value="high"
                        checked={feedbackForm.quality === "high"}
                        onChange={() => setFeedbackForm({ ...feedbackForm, quality: "high" })}
                        className="text-juris-accent focus:ring-juris-accent"
                      />
                      <Label htmlFor="quality-high">Alta</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="quality-medium"
                        value="medium"
                        checked={feedbackForm.quality === "medium"}
                        onChange={() => setFeedbackForm({ ...feedbackForm, quality: "medium" })}
                        className="text-juris-accent focus:ring-juris-accent"
                      />
                      <Label htmlFor="quality-medium">Média</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="quality-low"
                        value="low"
                        checked={feedbackForm.quality === "low"}
                        onChange={() => setFeedbackForm({ ...feedbackForm, quality: "low" })}
                        className="text-juris-accent focus:ring-juris-accent"
                      />
                      <Label htmlFor="quality-low">Baixa</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lead-comments">Comentários adicionais</Label>
                  <Textarea
                    id="lead-comments"
                    placeholder="Compartilhe sua opinião sobre este lead..."
                    value={feedbackForm.comments}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  />
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => handleSubmitFeedback(openLeadId)}
                >
                  Enviar Avaliação
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminLeads;
