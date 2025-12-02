import { Schema, model, Types, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  isListed: boolean;
  status: "active" | "inactive";
  company: Types.ObjectId;
  productCategory: Types.ObjectId;
  subSubCategory: Types.ObjectId;
  subCategory: Types.ObjectId;
  industryCategory: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },

    images: [{ type: String, required: true }],
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    productCategory: { type: Schema.Types.ObjectId, ref: "ProductCategory", required: true },
    subSubCategory: { type: Schema.Types.ObjectId},
    subCategory: { type: Schema.Types.ObjectId },
    industryCategory: { type: Schema.Types.ObjectId, ref: "IndustryCategory", required: true },
    isListed: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);

export default Product;
