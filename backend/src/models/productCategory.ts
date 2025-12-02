import { model, Schema, Types } from "mongoose";

export interface IProductCategory {
    _id?: Types.ObjectId
    name: string
    status: "active"
    isListed: boolean
    subSubCategoryId: Types.ObjectId
    industryCategoryId: Types.ObjectId
    subCategoryId: Types.ObjectId
    company: Types.ObjectId
}

const productCategorySchema = new Schema<IProductCategory>({
    name: String,
    status: { type: String, default: "active" },
    isListed: { type: Boolean, default: true },
    industryCategoryId: { type: Schema.Types.ObjectId, required: true },
    subCategoryId: { type: Schema.Types.ObjectId, required: true },
    subSubCategoryId: { type: Schema.Types.ObjectId, required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
},
    { timestamps: true }
);


const ProductCategory = model<IProductCategory>(
    "ProductCategory",
    productCategorySchema
);

export default ProductCategory;