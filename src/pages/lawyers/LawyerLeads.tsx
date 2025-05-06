
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { Loader2, Phone, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LeadStatus = "pending" | "contacted" | "converted" | "not_converted";

type Lead = {
  id: string;
  client_name: string;
  client_phone: string | null;
  case_area: string;
  created_at: string;
  description: string | null;
  status: LeadStatus;
  quality_rating?: number;
  relevant?: boolean;
  comments?: string;
  client_email: string; // We'll keep this in the type but won't display it
  lawyer_id: string;
  updated_at: string;
};

const LawyerLeads: React.FC = () => {
  const { toast } = useToast();
  const { user, lawyer } = useAdminAuth();
  const [openLeadId, setOpenLeadId] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    relevant: true,
    quality: 5,
    comments: "",
  });
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if lawyer is approved
  const isApproved = lawyer?.status === "approved";

  // Load leads from Supabase
  useEffect(() => {
    if (user && isApproved) {
      fetchLeads();
    } else if (user) {
      setLoading(false);
    }
  }, [user, isApproved]);

  const fetchLeads = async () => {
    if (!user || !isApproved) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('lawyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Cast the status to ensure it matches the LeadStatus type
        const typedLeads = data.map(lead => ({
          ...lead,
          status: lead.status as LeadStatus
        }));
        
        setLeads(typedLeads);
      }
    } catch (error) {
      console.error('Erro ao carregar leads:', error);
      toast({
        title: "Erro ao carregar leads",
        description: "Não foi possível carregar seus leads. Tente novamente mais tarde.",
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

  const formatPhone = (phone: string | null) => {
    if (!phone) return "N/A";
    
    // Simple formatting for Brazilian phone numbers (just an example)
    // Format: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    
    return phone; // Return original if doesn't match expected formats
  };

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
    if (lead) {
      setFeedbackForm({
        relevant: lead.relevant !== undefined ? lead.relevant : true,
        quality: lead.quality_rating !== undefined ? lead.quality_rating : 5,
        comments: lead.comments || "",
      });
    } else {
      setFeedbackForm({
        relevant: true,
        quality: 5,
        comments: "",
      });
    }
  };

  const handleCloseLead = () => {
    setOpenLeadId(null);
  };

  const handleUpdateStatus = async (leadId: string, status: LeadStatus) => {
    if (!user || !isApproved) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .eq('lawyer_id', user.id);

      if (error) throw error;

      // Atualizar o estado local
      setLeads(
        leads.map(lead => 
          lead.id === leadId ? { ...lead, status } : lead
        )
      );

      toast({
        title: "Status atualizado",
        description: `O lead foi marcado como ${getStatusLabel(status).text.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Erro ao atualizar status do lead:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do lead. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleSubmitFeedback = async (leadId: string) => {
    if (!user || !isApproved) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          relevant: feedbackForm.relevant,
          quality_rating: feedbackForm.quality,
          comments: feedbackForm.comments,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId)
        .eq('lawyer_id', user.id);

      if (error) throw error;

      // Atualizar o estado local
      setLeads(
        leads.map(lead => 
          lead.id === leadId ? { 
            ...lead, 
            relevant: feedbackForm.relevant,
            quality_rating: feedbackForm.quality,
            comments: feedbackForm.comments
          } : lead
        )
      );

      toast({
        title: "Feedback enviado",
        description: "Obrigado por avaliar a qualidade deste lead.",
      });

      handleCloseLead();
    } catch (error) {
      console.error('Erro ao enviar feedback do lead:', error);
      toast({
        title: "Erro ao enviar feedback",
        description: "Não foi possível enviar seu feedback. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const filteredLeads = statusFilter 
    ? leads.filter(lead => lead.status === statusFilter)
    : leads;

  // If lawyer is not approved, show a warning message
  if (!isApproved) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Leads Recebidos</h1>
        <Alert variant="warning">
          <ShieldAlert className="h-4 w-4 mr-2" />
          <AlertTitle>Conta não aprovada</AlertTitle>
          <AlertDescription>
            Sua conta precisa ser aprovada por um administrador antes que você possa receber leads.
            {lawyer?.status === "pending" ? (
              <p className="mt-2">Seu cadastro está em análise. Por favor, aguarde a aprovação.</p>
            ) : (
              <p className="mt-2">Seu cadastro foi rejeitado. Visite o Dashboard para solicitar uma reavaliação.</p>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-juris-accent" />
          <span className="ml-2 text-lg">Carregando leads...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <Card key={lead.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" 
                    style={{ borderLeftColor: getStatusColor(lead.status) }}>
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{lead.client_name}</h3>
                          <Badge className={getStatusLabel(lead.status).color + " ml-2"}>
                            {getStatusLabel(lead.status).text}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-2">
                          <span className="font-medium text-juris-accent">{lead.case_area}</span>
                          <span className="text-gray-300">•</span>
                          <span>{formatDate(lead.created_at)}</span>
                          
                          {lead.client_phone && (
                            <>
                              <span className="text-gray-300">•</span>
                              <a 
                                href={`tel:${lead.client_phone}`} 
                                className="flex items-center text-juris-accent hover:underline"
                              >
                                <Phone size={16} className="mr-1" />
                                {formatPhone(lead.client_phone)}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                      <h4 className="text-xs uppercase text-gray-500 font-medium mb-1">RESUMO GERADO COM IA</h4>
                      <p className="text-sm">{lead.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenLead(lead.id)}
                        className="bg-white"
                      >
                        {lead.quality_rating !== undefined ? "Ver detalhes" : "Avaliar lead"}
                      </Button>
                      
                      {lead.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateStatus(lead.id, "contacted")}
                          className="bg-white border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          Marcar como contatado
                        </Button>
                      )}
                      
                      {(lead.status === "pending" || lead.status === "contacted") && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleUpdateStatus(lead.id, "converted")}
                          >
                            Converter lead
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleUpdateStatus(lead.id, "not_converted")}
                          >
                            Não convertido
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {lead.quality_rating !== undefined && (
                    <div className="bg-gray-50 p-4 md:w-64 border-t md:border-l md:border-t-0">
                      <h4 className="text-sm font-medium mb-2">Seu feedback</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Relevância:</span>{" "}
                          {lead.relevant ? "Relevante" : "Irrelevante"}
                        </p>
                        <p>
                          <span className="font-medium">Qualidade:</span>{" "}
                          {lead.quality_rating === 5 && "Excelente"}
                          {lead.quality_rating === 4 && "Boa"}
                          {lead.quality_rating === 3 && "Regular"}
                          {lead.quality_rating === 2 && "Ruim"}
                          {lead.quality_rating === 1 && "Péssima"}
                        </p>
                        {lead.comments && (
                          <p className="text-gray-600 text-xs">
                            "{lead.comments}"
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
      )}
      
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
                  <h3 className="font-medium">{leads.find(l => l.id === openLeadId)?.client_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{leads.find(l => l.id === openLeadId)?.case_area}</span>
                    <span>•</span>
                    <span>{formatDate(leads.find(l => l.id === openLeadId)?.created_at || '')}</span>
                  </div>
                  
                  {leads.find(l => l.id === openLeadId)?.client_phone && (
                    <div className="flex items-center text-sm mt-2">
                      <Phone size={16} className="mr-2" />
                      <a 
                        href={`tel:${leads.find(l => l.id === openLeadId)?.client_phone}`}
                        className="text-juris-accent hover:underline"
                      >
                        {formatPhone(leads.find(l => l.id === openLeadId)?.client_phone || '')}
                      </a>
                    </div>
                  )}
                  
                  
                </div>
                
                <Badge className={getStatusLabel(leads.find(l => l.id === openLeadId)?.status || "").color}>
                  {getStatusLabel(leads.find(l => l.id === openLeadId)?.status || "").text}
                </Badge>
                
       
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
                  <Label htmlFor="lead-quality">Qualidade do lead (1-5)</Label>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`quality-${value}`}
                          value={value}
                          checked={feedbackForm.quality === value}
                          onChange={() => setFeedbackForm({ ...feedbackForm, quality: value })}
                          className="text-juris-accent focus:ring-juris-accent"
                        />
                        <Label htmlFor={`quality-${value}`}>{value}</Label>
                      </div>
                    ))}
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

// Helper function to get the status color for the left border
const getStatusColor = (status: LeadStatus): string => {
  switch (status) {
    case "pending":
      return "#f59e0b"; // Amber/yellow
    case "contacted":
      return "#3b82f6"; // Blue
    case "converted":
      return "#10b981"; // Green
    case "not_converted":
      return "#ef4444"; // Red
    default:
      return "#d1d5db"; // Gray
  }
};

export default LawyerLeads;