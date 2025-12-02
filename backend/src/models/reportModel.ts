import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReport {
    _id?: Types.ObjectId;
    reportedBy: Types.ObjectId;
    reportedAgainst: Types.ObjectId;
    status: "pending" | "resolved" | "rejected";
    reason:string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type ReportDocument = IReport & Document;


const reportSchema = new Schema<ReportDocument>(
  {
    reportedBy: {type: Schema.Types.ObjectId, ref: "Investor", required: true },
    reportedAgainst: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved","rejected"], default: "pending" },
  },
  { timestamps: true }
);

const Report = mongoose.model<ReportDocument>(
    "Report",
    reportSchema
);

export default Report;
