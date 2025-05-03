
export type LawyerStatus = "pending" | "approved" | "rejected";

export type Lawyer = {
  id: string;
  name: string;
  email: string;
  oab_number: string;
  specialty: string;
  created_at: string;
  status: LawyerStatus;
  bio: string | null;
  phone?: string | null;
  plan_type?: "free" | "basic" | "premium" | "enterprise" | null;
  subscription_active?: boolean;
  gender?: string | null;
};
