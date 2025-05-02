
import React, { createContext, useState, useContext, useEffect } from "react";

type Lawyer = {
  id: string;
  name: string;
  email: string;
  oabNumber: string;
  specialty: string;
  planType: "basic" | "premium" | "enterprise" | null;
  subscriptionActive: boolean;
};

interface AdminAuthContextType {
  lawyer: Lawyer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (lawyerData: Partial<Lawyer>, password: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  lawyer: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if the lawyer is already logged in on page load
  useEffect(() => {
    const storedLawyer = localStorage.getItem("jurisquick_lawyer");
    if (storedLawyer) {
      try {
        const parsedLawyer = JSON.parse(storedLawyer);
        setLawyer(parsedLawyer);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored lawyer data", error);
        localStorage.removeItem("jurisquick_lawyer");
      }
    }
  }, []);

  // Mock login function (would be replaced with an actual API call in production)
  const login = async (email: string, password: string) => {
    // For demonstration purposes, simulate a successful login after validation
    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    // In a real app, you'd call an API to verify credentials
    // This is just a mock implementation for demo purposes
    const mockLawyer: Lawyer = {
      id: "lawyer-123",
      name: "Dr. Exemplo Silva",
      email,
      oabNumber: "123456/SP",
      specialty: "Direito Civil",
      planType: null,
      subscriptionActive: false
    };

    setLawyer(mockLawyer);
    setIsAuthenticated(true);
    localStorage.setItem("jurisquick_lawyer", JSON.stringify(mockLawyer));
  };

  // Mock register function
  const register = async (lawyerData: Partial<Lawyer>, password: string) => {
    if (!lawyerData.email || !lawyerData.name || !lawyerData.oabNumber || !lawyerData.specialty || !password) {
      throw new Error("Todos os campos são obrigatórios");
    }

    // In a real app, you'd call an API to register the lawyer
    const mockLawyer: Lawyer = {
      id: `lawyer-${Date.now()}`,
      name: lawyerData.name || "",
      email: lawyerData.email || "",
      oabNumber: lawyerData.oabNumber || "",
      specialty: lawyerData.specialty || "",
      planType: null,
      subscriptionActive: false
    };

    setLawyer(mockLawyer);
    setIsAuthenticated(true);
    localStorage.setItem("jurisquick_lawyer", JSON.stringify(mockLawyer));
  };

  const logout = () => {
    setLawyer(null);
    setIsAuthenticated(false);
    localStorage.removeItem("jurisquick_lawyer");
  };

  return (
    <AdminAuthContext.Provider value={{ lawyer, isAuthenticated, login, logout, register }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
