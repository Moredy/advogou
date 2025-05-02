
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const AdminProfile: React.FC = () => {
  const { lawyer } = useAdminAuth();
  const { toast } = useToast();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: lawyer?.name || "",
    email: lawyer?.email || "",
    phone: "",
    oabNumber: lawyer?.oab_number || "", // Changed from oabNumber to oab_number to match the Lawyer type
  });
  
  const [specialties, setSpecialties] = useState<string[]>([
    lawyer?.specialty || "Direito Civil"
  ]);

  const [specialty, setSpecialty] = useState("");
  
  const [bio, setBio] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const handleSaveSpecialties = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Especialidades atualizadas",
        description: "Suas áreas de atuação foram atualizadas com sucesso.",
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const handleAddSpecialty = () => {
    if (specialty && !specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
      setSpecialty("");
    }
  };
  
  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };
  
  const handleSaveBio = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Biografia atualizada",
        description: "Sua biografia foi atualizada com sucesso.",
      });
      setIsSaving(false);
    }, 1000);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações profissionais
        </p>
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oab">Número OAB</Label>
                    <Input
                      id="oab"
                      value={personalInfo.oabNumber}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, oabNumber: e.target.value })}
                    />
                  </div>
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
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-specialty">Adicionar nova área</Label>
                  <div className="flex gap-2">
                    <Input
                      id="add-specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      list="specialties-list"
                    />
                    <datalist id="specialties-list">
                      {availableAreas.map((area) => (
                        <option key={area} value={area} />
                      ))}
                    </datalist>
                    <Button 
                      type="button" 
                      onClick={handleAddSpecialty}
                      disabled={!specialty}
                    >
                      Adicionar
                    </Button>
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
                              setSpecialties([...specialties, area]);
                            } else {
                              setSpecialties(specialties.filter(s => s !== area));
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
                <Button type="submit" disabled={isSaving}>
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
                    value={bio}
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

export default AdminProfile;
