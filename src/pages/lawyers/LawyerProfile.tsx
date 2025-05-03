
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const LawyerProfile: React.FC = () => {
  const { lawyer, user, refreshLawyerProfile } = useAdminAuth();
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: lawyer?.name || "",
    email: lawyer?.email || "",
    phone: lawyer?.phone || "",
    oab_number: lawyer?.oab_number || "",
    gender: lawyer?.gender || "masculino",
  });
  
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState(lawyer?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  
  // Atualiza os dados quando o advogado for carregado
  useEffect(() => {
    if (lawyer) {
      console.log("Atualizando formulário com dados do advogado:", lawyer);
      setPersonalInfo({
        name: lawyer.name || "",
        email: lawyer.email || "",
        phone: lawyer.phone || "",
        oab_number: lawyer.oab_number || "",
        gender: lawyer.gender || "masculino",
      });
      
      // Importante: Garantir que as especialidades sejam carregadas corretamente
      if (lawyer.specialties && lawyer.specialties.length > 0) {
        console.log("Carregando especialidades do advogado:", lawyer.specialties);
        const specialtyValues = lawyer.specialties.map(spec => spec.specialty);
        setSpecialties(specialtyValues);
      } else if (lawyer.specialty) {
        // Fallback para a especialidade única anterior
        console.log("Usando especialidade legada do advogado:", lawyer.specialty);
        setSpecialties([lawyer.specialty]);
      } else {
        setSpecialties([]);
      }
      
      if (lawyer.bio) {
        setBio(lawyer.bio);
      }
    }
  }, [lawyer]);

  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    console.log("Salvando informações pessoais:", personalInfo);
    
    try {
      const { error } = await supabase
        .from('lawyers')
        .update({
          name: personalInfo.name,
          email: personalInfo.email,
          phone: personalInfo.phone,
          oab_number: personalInfo.oab_number,
          gender: personalInfo.gender,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      console.log("Informações pessoais salvas com sucesso!");
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      
      // Atualiza os dados do advogado no contexto
      await refreshLawyerProfile();
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSaveSpecialties = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    console.log("Salvando especialidades:", specialties);
    
    try {
      // Verificamos se há especialidades selecionadas
      if (specialties.length === 0) {
        throw new Error("Selecione pelo menos uma área de atuação");
      }
      
      // Primeiro, deletamos todas as especialidades existentes
      const { error: deleteError } = await supabase
        .from('lawyer_specialties')
        .delete()
        .eq('lawyer_id', user.id);
        
      if (deleteError) {
        console.error("Erro ao remover especialidades existentes:", deleteError);
        throw deleteError;
      }
      
      // Agora, inserimos as novas especialidades
      const specialtiesToInsert = specialties.map(specialty => ({
        lawyer_id: user.id,
        specialty
      }));
      
      const { error: insertError } = await supabase
        .from('lawyer_specialties')
        .insert(specialtiesToInsert);
        
      if (insertError) {
        console.error("Erro ao inserir novas especialidades:", insertError);
        throw insertError;
      }
      
      // Atualizamos também a especialidade principal no perfil do advogado
      // para manter compatibilidade com código existente
      const { error: updateError } = await supabase
        .from('lawyers')
        .update({
          specialty: specialties[0], // Usamos a primeira especialidade como principal
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Erro ao atualizar especialidade principal:", updateError);
        throw updateError;
      }
      
      console.log("Especialidades salvas com sucesso!");
      
      toast({
        title: "Especialidades atualizadas",
        description: "Suas áreas de atuação foram atualizadas com sucesso.",
      });
      
      // Atualiza os dados do advogado no contexto
      await refreshLawyerProfile();
    } catch (error: any) {
      console.error('Erro ao atualizar especialidades:', error, typeof error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível atualizar suas áreas de atuação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddSpecialty = () => {
    if (specialty && !specialties.includes(specialty)) {
      setSpecialties(prev => [...prev, specialty]);
      setSpecialty("");
    }
  };
  
  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSaveBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    console.log("Salvando biografia:", bio);
    
    try {
      const { error } = await supabase
        .from('lawyers')
        .update({
          bio: bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      console.log("Biografia salva com sucesso!");
      toast({
        title: "Biografia atualizada",
        description: "Sua biografia foi atualizada com sucesso.",
      });
      
      // Atualiza os dados do advogado no contexto
      await refreshLawyerProfile();
    } catch (error) {
      console.error('Erro ao atualizar biografia:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar sua biografia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const availableAreas = [
    "Direito Civil", 
    "Direito Penal", 
    "Direito Tributário", 
    "Direito do Consumidor",
    "Direito Trabalhista", 
    "Direito Empresarial", 
    "Direito Imobiliário", 
    "Direito Digital",
    "Direito de Família"
  ];

  const handleSelectSpecialty = (value: string) => {
    if (!specialties.includes(value)) {
      setSpecialties(prev => [...prev, value]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações profissionais
        </p>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1">
          <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="specialties">Áreas de Atuação</TabsTrigger>
          <TabsTrigger value="bio">Biografia</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações básicas de contato
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSavePersonal}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={personalInfo.phone || ""}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oab">Número OAB</Label>
                    <Input
                      id="oab"
                      value={personalInfo.oab_number}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, oab_number: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select 
                    value={personalInfo.gender || "masculino"} 
                    onValueChange={(value) => setPersonalInfo({ ...personalInfo, gender: value })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecione seu gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro/Não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="specialties">
          <Card>
            <CardHeader>
              <CardTitle>Áreas de Atuação</CardTitle>
              <CardDescription>
                Selecione as áreas do direito em que você atua profissionalmente
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveSpecialties}>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Label>Suas áreas de atuação</Label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((spec, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1"
                      >
                        <span>{spec}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveSpecialty(index)}
                          className="text-gray-500 hover:text-gray-700 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {specialties.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma área de atuação selecionada. Selecione pelo menos uma área abaixo.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-specialty">Selecionar área</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={handleSelectSpecialty}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione uma área" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAreas
                          .filter(area => !specialties.includes(area))
                          .map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="custom-specialty">Ou adicione área personalizada</Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder="Digite uma área personalizada"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddSpecialty}
                        disabled={!specialty || specialties.includes(specialty)}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="text-sm font-medium mb-3">Áreas populares</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {availableAreas.map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`area-${area}`} 
                          checked={specialties.includes(area)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              if (!specialties.includes(area)) {
                                setSpecialties(prev => [...prev, area]);
                              }
                            } else {
                              setSpecialties(prev => prev.filter(s => s !== area));
                            }
                          }}
                        />
                        <label 
                          htmlFor={`area-${area}`}
                          className="text-sm cursor-pointer"
                        >
                          {area}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving || specialties.length === 0}>
                  {isSaving ? "Salvando..." : "Salvar Áreas"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="bio">
          <Card>
            <CardHeader>
              <CardTitle>Biografia Profissional</CardTitle>
              <CardDescription>
                Escreva uma breve descrição sobre sua experiência profissional
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveBio}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Sua biografia</Label>
                  <Textarea
                    id="bio"
                    value={bio || ""}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Escreva sobre sua formação, experiência e áreas de especialização..."
                    className="min-h-[200px]"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">
                    Dicas para uma boa biografia:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1 space-y-1">
                    <li>Mencione sua experiência e anos de atuação</li>
                    <li>Destaque suas principais conquistas</li>
                    <li>Informe onde se formou e especializações</li>
                    <li>Explique como você aborda os casos em sua área</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Biografia"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LawyerProfile;
