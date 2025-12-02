import { Schema, Types, model } from "mongoose";
import { Document } from "mongoose";

export interface IInvestor extends Document {
  _id:Types.ObjectId;
  userName: string;
  email: string;
  password?: string;
  role: "customer" | "admin" | "investor" | "company";
  otp: string | null;
  otpExpires: number | null;
  isBlocked: boolean;

  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: Date;
  nationality?: string;
  phoneNumber?: string;
  location?: string;

  qualifications: string[];

  ownProperty: boolean;
  floorArea?: string;
  investmentRange?: string;
  fundingSource?: string;

  previousBusiness?: Types.ObjectId[];
  jobExperience?: string;
  yearsOfExperience?: string;
  numberOfEmployees?: number;

  preferredFranchiseType?: Types.ObjectId[];
  reasonForSeeking?: string;
  ownershipTimeframe?: string;
  findingSource?: string;
  status?: "pending" | "approve" | "reject"
  rejectionReason?:string

  profileImage: string;
  createdAt: Date;
  isAdmin: boolean;
  isVerifiedByAdmin: boolean;
  googleId?: string;
}


const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
  },

  role: {
    type: String,
    enum: ["customer", "admin", "investor", "company"],
    default: "investor",
  },

  otp: {
    type: String,
    default: null,
  },

  otpExpires: {
    type: Number,
    default: null,
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  status: { type: String, enum: ["pending", "approve", "reject"], default: "pending" },
  rejectionReason: { type: String, default: null },


  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: Date,
  },
  nationality: { type: String },
  phoneNumber: { type: String },
  location: { type: String },

  qualifications: {
    type: [String],
    default: [],
  },


  ownProperty: { type: Boolean, default: false },
  floorArea: { type: String },
  investmentRange: { type: String },
  fundingSource: { type: String },

  previousBusiness: [{ type: Schema.Types.ObjectId, ref: "IndustryCategory" }],
  jobExperience: { type: String },
  yearsOfExperience: { type: String },
  numberOfEmployees: { type: Number },


  preferredFranchiseType: [{ type: Schema.Types.ObjectId, ref: "IndustryCategory" }],
  reasonForSeeking: { type: String },
  ownershipTimeframe: { type: String },
  findingSource: { type: String },


  profileImage: { type: String, default: "" },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isVerifiedByAdmin: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
  }
});
const Investor = model<IInvestor>("Investor", userSchema);
export default Investor;

