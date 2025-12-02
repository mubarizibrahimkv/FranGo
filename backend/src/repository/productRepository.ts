import { Types } from "mongoose";
import Product, { IProduct } from "../models/productModel";
import { IProductRepo } from "../interface/ṛepository/productRepoInterface";
import { BaseRepository } from "./baseRepository";

export class ProductRepo extends BaseRepository<IProduct> implements IProductRepo{
    constructor(
    ){ super(Product);}
    async findProductsByCompany(companyId: string) {
    return await Product.find({ company: new Types.ObjectId(companyId) })
      .populate("productCategory")
      .populate("industryCategory")
      .lean();
  }
  async findByCompanyId(companyId:string,skip:number,limit:number){
    return await Product.find({company:companyId}).populate("productCategory").skip(skip).limit(limit).sort({ createdAt: -1 })
  }
  async countByCompanyId(companyId:string){
    return await Product.countDocuments({company:companyId})
  }
  async findDuplicateProduct(
    productId: string | null,
    companyId: string,
    category: string,
    name: string
) {
    const query: any = {
        company: companyId,
        productCategory: category,
        name: { $regex: new RegExp(`^${name}$`, "i") }
    };
    if (productId) {
        query._id = { $ne: productId };
    }

    return Product.findOne(query);
}

}