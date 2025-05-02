
import { Session, User, AuthError } from "@supabase/supabase-js";
import { LawyerStatus } from "../types/lawyer"; // Import LawyerStatus type

export type Specialty = {
  id: string;
  specialty: string;
};

export type PlanType = "free" | "basic" | "premium" | "enterprise" | null;

export type Lawyer = {
  id: string;
  name: string;
  email: string;
  oab_number: string;
  specialty: string; // Keep for backward compatibility
  specialties: Specialty[]; // New field for multiple specialties
  plan_type: PlanType;
  subscription_active: boolean;
  bio: string | null;
  phone: string | null;
  status: LawyerStatus; // Add the status property using LawyerStatus type
  created_at?: string;
  updated_at?: string;
};

export interface AdminAuthContextType {
  lawyer: Lawyer | null;
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean; // Add this property
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (lawyerData: Partial<Lawyer>, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshLawyerProfile: () => Promise<void>;
}
