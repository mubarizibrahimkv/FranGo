import mongoose, { Schema, Document, HydratedDocument, Types } from "mongoose";

export interface ICompany extends Document {
  _id: Types.ObjectId;
  brandName?: string;
  companyName?: string;
  ownerName?: string;
  industryCategory?: Types.ObjectId;
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
  about?: string;
  password?: string;
  role?: "customer" | "admin" | "investor" | "company";
  status?: "pending"|"approve"|"reject";
  rejectionReason:string
  verificationToken?: string | null;
  isVerified?: boolean;
  isBlocked: boolean
  isAdmin?: boolean;
  isVerifiedByAdmin: boolean;
  googleId?: string;
  createdAt?: Date;
  subscription?: {
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
  };
}

export type CompanyDocument = HydratedDocument<ICompany>;

const companySchema = new Schema<ICompany>(
  {
    brandName: { type: String, trim: true },
    companyName: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true },
    industryCategory: { type: Schema.Types.ObjectId, ref: "IndustryCategory" },
    industrySubCategory: { type: String, trim: true },
    yearFounded: { type: Number },
    country: { type: String, trim: true },
    yearCommencedFranchising: { type: Number },
    contactPerson: { type: String, trim: true },
    designation: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phoneNumber: { type: String, trim: true },
    website: { type: String, trim: true },
    numberOfRetailOutlets: { type: Number, default: 0 },
    numberOfFranchiseOutlets: { type: Number, default: 0 },
    companyLogo: { type: String, default: "" },
    franchiseManager: { type: String, trim: true },
    companyRegistrationProof: { type: String, default: null },
    about: { type: String, trim: true },
    role: { type: String, enum: ["customer", "admin", "investor", "company"], default: "company" },
    status: { type: String, enum: ["pending", "approve", "reject"], default: "pending" },
    rejectionReason: { type: String, default: null },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isVerifiedByAdmin: { type: Boolean, default: false },
    googleId: { type: String },
    createdAt: { type: Date, default: Date.now },
    subscription: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  },
  { timestamps: true }
);

const Company = mongoose.model<ICompany>("Company", companySchema);
export default Company;
