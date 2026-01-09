import type { ProductCategory } from "../pages/Company/CompanyProductCategory";
import type { IIndustryCategory, ISubCategory, ISubSubCategory } from "./admin";
import type { Investor } from "./investor";

export interface Company {
  _id?: string;
  brandName?: string;
  companyName?: string;
  ownerName?: string;
  industryCategory?: IIndustryCategory;
  industryCategoryString?: string;
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
  franchiseManager?: string;
  companyRegistrationProof?: string;
  googleId?: string;
  about?: string;
  isBlocked?: string;
  status?: "approve" | "reject" | "pending";
  subscription?: {
    isActive: boolean;
  };
}

export interface IFranchise {
  _id?: string;
  franchiseName?: string;
  industryCategory?: IIndustryCategory;
  industryCategoryString?: string;
  monthlyRevenue?: number;
  industrySubCategory?: ISubCategory;
  industrySubSubCategory?: ISubSubCategory[];

  company?: {
    _id?: string;
    companyName?: string;
    companyLogo?: string;
    description?: string;
    brandName?: string;
    yearFounded?: string;
    ownerName?: string;
    about?: string;
    numberOfRetailOutlets?: string;
    industryCategory?: {
      _id?: string;
      categoryName?: string;
    };
  };

  franchisefee?: number;

  advancefee?: number;
  royaltyfee?: number;
  advertisingfee?: string;
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
}

export type IApplication = {
  _id: string;
  investor: Investor;
  franchise: IFranchise;
  status: "pending" | "approved" | "rejected";
  paymentStatus: "paid" | "unpaid";
  createdAt?: Date;
  updatedAt?: Date;
};

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number | string;
  stock?: number;
  images: (string | File)[];
  isListed?: boolean;
  productCategory?: ProductCategory;
  category?: string;
  status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
