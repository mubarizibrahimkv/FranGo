import mongoose from "mongoose";
import { IIndustryCategoryRepo } from "../interface/ṛepository/adminIndustryCategoryInterface";
import IndustryCategory, { IIndustryCategory } from "../models/industryCategoryModel";
import { BaseRepository } from "./baseRepository";

export class IndustryCategoryRepo extends BaseRepository<IIndustryCategory> implements IIndustryCategoryRepo {
    constructor() {
        super(IndustryCategory);
    }
    async findBySearch(
  limit: number,
  skip: number,
  search: string,
  filter?:string
) {
  const query: Record<string, unknown> = {};

  if (search?.trim()) {
    query.categoryName = { $regex: search, $options: "i" };
  }

  if (filter) {
    query._id = new mongoose.Types.ObjectId(
      filter
    );
  }

  return await IndustryCategory.find(query)
    .sort({ createdAt: 1 })
    .limit(limit)
    .skip(skip);
}

} 