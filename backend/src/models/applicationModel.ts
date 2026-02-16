import mongoose, { Document, Schema, Types } from "mongoose";
import { IFranchise } from "./franchiseModel";

export interface IApplication extends Document {
    investor: Types.ObjectId;
    franchise: Types.ObjectId|IFranchise;
    status: "pending" | "approved" | "rejected";
    payment: Types.ObjectId;
    paymentStatus?: "unpaid" | "paid";
    createdAt?: Date;
    updatedAt?: Date;
}

const applicationSchema = new Schema<IApplication>(
    {
        investor: {
            type: Schema.Types.ObjectId,
            ref: "Investor",
            required: true,
        },
        franchise: {
            type: Schema.Types.ObjectId,
            ref: "Franchise",
            required: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
        paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },

    },
    { timestamps: true }
);

const Application = mongoose.model<IApplication>(
    "Application",
    applicationSchema
);

export default Application;
