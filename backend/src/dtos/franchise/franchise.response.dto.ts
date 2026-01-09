export interface FranchiseResponseDTO {
  _id: string;

  franchiseName?: string;
  franchiseType?: string;
  monthlyRevenue?: number;

  industryCategory?: string;
  industrySubCategory?: string;
  industrySubSubCategory?: string[];

  franchisefee?: number;
  advancefee?: number;
  royaltyfee?: number;
  advertisingfee?: number;
  renewelfee?: number;
  platformfee?: number;
  totalInvestement?: number;

  minimumSpace?: number;
  preferedProperty?: string;
  preferedLocation?: string[];
  accessibility?: string;

  outletFormat?: string;
  ownershipModel?: string;
  supportProvided?: string[];
  staffRequired?: number;
  trainingType?: string;

  agreementDuration?: number;
  renewelDuration?: number;

  contactName?: string;
  designation?: string;
  email?: string;
  phone?: string;

  companyId?: string;
}
export interface FranchiseListDTO {
  franchises: FranchiseResponseDTO[];
  totalPages: number;
}