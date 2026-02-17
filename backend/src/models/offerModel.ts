import { Document, model, Types, Schema } from "mongoose";


export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}

export enum DiscountApplicableOn {
  PRODUCT = "PRODUCT",
  CATEGORY = "CATEGORY",
}



export interface IOffer extends Document {
  _id: Types.ObjectId;
  company: Types.ObjectId;
  offerName: string;
  maxDiscountAmount?: number;
  discountType: DiscountType;
  discountValue: number;

  applicableOn: DiscountApplicableOn;

  products?: Types.ObjectId[];
  categories?: Types.ObjectId[];

  isActive: boolean;

  startDate?: Date;
  endDate?: Date;

  createdAt: Date;
  updatedAt: Date;
}



const offerSchema = new Schema<IOffer>(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    offerName: {
      type: String,
      required: true,
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
    maxDiscountAmount: {
      type: Number,
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
        ref: "ProductCategory",
      },
    ],

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



const Offer = model<IOffer>("Offer", offerSchema);

export default Offer;