import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddress extends Document {
  customer: Types.ObjectId;
  fullName: string;         
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
  isListed?: boolean;
}


const addressSchema = new Schema<IAddress>(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        fullName: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        pinCode: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        isListed: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Address = mongoose.model<IAddress>("Address", addressSchema);
export default Address;
