import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICustomer extends Document {
  _id: Types.ObjectId;
  userName: string;
  email: string;
  password?: string;
  role?: "customer" | "admin" | "investor" | "company";
  otp?: string | null;
  otpExpires?: number | null;
  isBlocked?: boolean;
  isVerifiedByAdmin: boolean;
  googleId?:string;
  isAdmin?: boolean;
  createdAt?: Date;
}


const customerSchema = new Schema<ICustomer>(
  {
    userName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },

    role: { type: String, enum: ["customer", "admin", "investor", "company"], default: "customer" },

    otp: { type: String, default: null },
    otpExpires: { type: Number, default: null },

    isBlocked: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isVerifiedByAdmin: { type: Boolean, default: false },
    googleId: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Customer = mongoose.model<ICustomer>("Customer", customerSchema);
export default Customer;
