import { Document, Schema, Types, model } from "mongoose";

export interface ISubSubCategory {
  _id:string
  name: string;
  productCategories:Types.ObjectId[]
}

export interface ISubCategory {
  _id:string
  name: string;
  subSubCategories: ISubSubCategory[];
}

export interface IIndustryCategory extends Document {
    _id:string;
  categoryName: string;
  subCategories: ISubCategory[];
  createdAt: Date;
  image:string
  status: "active" | "inactive";
}

const subSubCategorySchema = new Schema<ISubSubCategory>({
  name: { type: String, required: true, trim: true },
  productCategories: [{ type: Schema.Types.ObjectId, ref: "ProductCategory" }],
});

const subCategorySchema = new Schema<ISubCategory>({
  name: { type: String, required: true, trim: true },
  subSubCategories: { type: [subSubCategorySchema], default: [] },
});

const industryCategorySchema = new Schema<IIndustryCategory>({
  categoryName: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  subCategories: { type: [subCategorySchema], default: [] },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});
    
const IndustryCategory = model<IIndustryCategory>(
  "IndustryCategory",
  industryCategorySchema    
);

export default IndustryCategory;


