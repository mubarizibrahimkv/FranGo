import mongoose, { Schema, Document, Types } from "mongoose";
import { ICompany } from "./companyModel";


export interface IFranchise extends Document {
  franchiseName?: string;
  industryCategory?: Types.ObjectId;
  monthlyRevenue?: number;
  franchiseType?: string;
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
  company?: Types.ObjectId|ICompany;
}


const franchiseSchema = new Schema<IFranchise>(
  {
    franchiseName: { type: String, required: true },
    industryCategory: { type: Schema.Types.ObjectId, ref: "IndustryCategory" },
    monthlyRevenue: { type: Number },
    franchiseType: { type: String },
    industrySubCategory: { type: Schema.Types.ObjectId, required: true },
    industrySubSubCategory: [{ type: Schema.Types.ObjectId }],

    franchisefee: { type: Number },
    advancefee: { type: Number },
    royaltyfee: { type: Number },
    advertisingfee: { type: Number },
    renewelfee: { type: Number },
    platformfee: { type: Number },
    totalInvestement: { type: Number },

    minimumSpace: { type: Number },
    preferedProperty: { type: String },
    preferedLocation: [{ type: String }],
    accessibility: { type: String },

    outletFormat: { type: String },
    ownershipModel: { type: String },
    supportProvided: [{ type: String }],
    staffRequired: { type: Number },
    trainingType: { type: String },

    agreementDuration: { type: Number },
    renewelDuration: { type: Number },

    contactName: { type: String },
    designation: { type: String },
    email: { type: String },
    phone: { type: String },

    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

const Franchise = mongoose.model<IFranchise>("Franchise", franchiseSchema);
export default Franchise;
