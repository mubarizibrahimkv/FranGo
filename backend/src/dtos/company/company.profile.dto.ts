export interface CompanyProfileDTO {
  _id: string;

  brandName?: string;
  companyName?: string;
  ownerName?: string;

  industryCategory?: string;
  industrySubCategory?: string;

  yearFounded?: number;
  country?: string;
  yearCommencedFranchising?: number;

  contactPerson?: string;
  designation?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;

  numberOfRetailOutlets?: number;
  numberOfFranchiseOutlets?: number;

  companyLogo?: string;
  companyRegistrationProof?: string;
  about?: string;

  role?: "customer" | "admin" | "investor" | "company";
  status?: "pending" | "approve" | "reject";
  rejectionReason?: string;

  isVerified?: boolean;
  isBlocked?: boolean;
  isAdmin?: boolean;
  isVerifiedByAdmin?: boolean;

  subscription?: {
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
  };

  createdAt?: Date;
}
