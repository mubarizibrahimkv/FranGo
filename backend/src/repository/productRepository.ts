import mongoose, { FilterQuery, Types } from "mongoose";
import Product, { IProduct } from "../models/productModel";
import { IProductRepo } from "../interface/ṛepository/productRepoInterface";
import { BaseRepository } from "./baseRepository";

export class ProductRepo extends BaseRepository<IProduct> implements IProductRepo {
  constructor(
  ) { super(Product) }
  async findProductsByCompany(
    companyId: string,
    skip?: number,
    limit?: number,
    search?: string
  ) {
    const filter: FilterQuery<IProduct> = {
      company: new Types.ObjectId(companyId),
    };

    if (search?.trim()) {
      filter.name = { $regex: search, $options: "i" };
    }

    let query = Product.find(filter)
      .populate("productCategory")
      .populate("industryCategory");

    if (typeof skip === "number") {
      query = query.skip(skip);
    }
    if (typeof limit === "number") {
      query = query.limit(limit);
    }

    const [products, totalCount] = await Promise.all([
      query.lean(),
      Product.countDocuments(filter),
    ]);

    return { products, totalCount };
  }
  async findByCompanyId(
    companyId: string,
    skip: number,
    limit: number,
    search: string,
    filter?: string
  ) {
    const query: FilterQuery<IProduct> = {
      company: new mongoose.Types.ObjectId(companyId),
    };

    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (filter) {
      query.productCategory = new mongoose.Types.ObjectId(filter);
    }

    return await Product.find(query)
      .populate("productCategory")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  async countByCompanyId(companyId: string) {
    return await Product.countDocuments({ company: companyId });
  }
  async findDuplicateProduct(
    productId: string | null,
    companyId: string,
    category: string,
    name: string
  ) {
    const query: FilterQuery<IProduct> = {
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