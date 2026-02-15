import { Document, model, Types } from "mongoose";
import { Schema } from "mongoose";
import { DiscountApplicableOn, DiscountType } from "./offerModel";

export interface ICoupon extends Document {
    company:Types.ObjectId
    couponCode: string;
    discountType: DiscountType;
    discountValue: number;
    applicableOn: DiscountApplicableOn;
    products?: Types.ObjectId[];
    categories?: Types.ObjectId[];
    minOrderValue?: number;
    maxDiscountAmount?: number;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}


const couponSchema = new Schema<ICoupon>(
    {
        company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
        couponCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },

        discountType: {
            type: String,
            enum: Object.values(DiscountType),
            required: true,
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },

        applicableOn: {
            type: String,
            enum: Object.values(DiscountApplicableOn),
            required: true,
        },

        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],

        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category",
            },
        ],

        minOrderValue: {
            type: Number,
            min: 0,
        },

        maxDiscountAmount: {
            type: Number,
            min: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        startDate: Date,
        endDate: Date,
    },
    {
        timestamps: true,
    }
);



const Coupon = model<ICoupon>("Coupon", couponSchema);

export default Coupon;