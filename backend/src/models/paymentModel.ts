import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPayment extends Document {
  application: Types.ObjectId;
  investor: Types.ObjectId;
  amount: number;
  transactionId?: string;
  method: "razorpay" ;
  status: "pending" | "success" | "failed";
  type: "advance" | "subscription" | "final";
  startDate?: Date;
  endDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    application: { type: Schema.Types.ObjectId, ref: "Application", required: true },
    investor: { type: Schema.Types.ObjectId, ref: "Investor", required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String },
    method: {
      type: String,
      enum: ["razorpay", "paypal"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["advance", "subscription"],
      required: true,
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;



export interface RazorpayOrder {
  id: string;
  amount: number|string;
  currency: string;
}