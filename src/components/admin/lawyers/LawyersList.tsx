
import React from "react";
import { Lawyer } from "@/types/lawyer";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type LawyersListProps = {
  lawyers: Lawyer[];
  loading: boolean;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
  onViewDetails: (lawyer: Lawyer) => void;
};

// Lista de emails administrativos
const adminEmails = ['admin@jurisquick.com'];

export const LawyersList: React.FC<LawyersListProps> = ({
  lawyers,
  loading,
  formatDate,
  getStatusBadge,
  onViewDetails,
}) => {
  // Filtrar advogados para excluir contas administrativas
  const filteredLawyers = lawyers.filter(lawyer => !adminEmails.includes(lawyer.email));

  if (filteredLawyers.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {loading ? "Carregando..." : "Nenhum advogado encontrado."}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">OAB</TableHead>
            <TableHead className="hidden md:table-cell">Especialidade</TableHead>
            <TableHead className="hidden md:table-cell">Data de Cadastro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLawyers.map((lawyer) => (
            <TableRow key={lawyer.id}>
              <TableCell className="font-medium">{lawyer.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{lawyer.email}</TableCell>
              <TableCell className="hidden md:table-cell">{lawyer.oab_number}</TableCell>
              <TableCell className="hidden md:table-cell max-w-[150px] truncate">{lawyer.specialty}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(lawyer.created_at)}</TableCell>
              <TableCell>{getStatusBadge(lawyer.status)}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewDetails(lawyer)}
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
  );
};
