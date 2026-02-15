export interface CompanyResponseDTO {
  _id: string;
  companyName?: string;
  email?: string;
  status?:"pending" | "approve" | "reject";
  role?: "customer" | "admin" | "investor" | "company";
  isVerified?: boolean;
  isBlocked?: boolean;
  isAdmin?: boolean;
  companyLogo?: string;
  companyRegistrationProof?: string;
}
