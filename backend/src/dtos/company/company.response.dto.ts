export interface CompanyResponseDTO {
  _id: string;
  companyName?: string;
  email?: string;
  role?: "customer" | "admin" | "investor" | "company";
  isVerified?: boolean;
  isBlocked?: boolean;
  isAdmin?: boolean;
  companyLogo?: string;
  companyRegistrationProof?: string;
}
