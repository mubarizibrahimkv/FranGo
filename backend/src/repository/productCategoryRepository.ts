import mongoose, { PipelineStage, Types } from "mongoose";
import { IProductCategoryRepo } from "../interface/ṛepository/productCategoryInterface";
import ProductCategory, { IProductCategory } from "../models/productCategory";

export class ProductCategoryRepo implements IProductCategoryRepo {
  constructor() { }

  async create(data: Partial<IProductCategory>): Promise<IProductCategory> {
    const product = new ProductCategory(data);
    return await product.save();
  }

  async findByNameAndSubSubCategory(
    name: string,
    subSubCategoryId: string,
    companyId: string
  ): Promise<IProductCategory | null> {
    return await ProductCategory.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      subSubCategoryId: new Types.ObjectId(subSubCategoryId),
      company: new Types.ObjectId(companyId),
    }).lean<IProductCategory>();
  }

  async findAllByCompany(companyId: string): Promise<IProductCategory[]> {
    return await ProductCategory.find({ company: companyId }).lean<IProductCategory[]>();
  }

async findAllWithCategoryHierarchy(
  companyId: string,
  search: string,
  filter?: string 
) {
  const pipeline: PipelineStage[] = [];

  pipeline.push({
    $match: {
      company: new mongoose.Types.ObjectId(companyId),
    },
  });

  if (filter) {
    pipeline.push({
      $match: {
        subCategoryId: new mongoose.Types.ObjectId(filter),
      },
    });
  }

  pipeline.push({
    $lookup: {
      from: "industrycategories",
      let: { subSubId: "$subSubCategoryId" },
      pipeline: [
        { $unwind: "$subCategories" },
        { $unwind: "$subCategories.subSubCategories" },
        {
          $match: {
            $expr: {
              $eq: [
                "$subCategories.subSubCategories._id",
                "$$subSubId",
              ],
            },
          },
        },
        {
          $project: {
            industryName: "$categoryName",
            subCategoryName: "$subCategories.name",
            subSubCategoryName:
              "$subCategories.subSubCategories.name",
          },
        },
      ],
      as: "categoryDetails",
    },
  });

  pipeline.push({
    $unwind: "$categoryDetails",
  });

  if (search?.trim()) {
    const searchRegex = new RegExp(search, "i");

    pipeline.push({
      $match: {
        $or: [
          { name: { $regex: searchRegex } },
          {
            "categoryDetails.subCategoryName": {
              $regex: searchRegex,
            },
          },
          {
            "categoryDetails.subSubCategoryName": {
              $regex: searchRegex,
            },
          },
        ],
      },
    });
  }

  pipeline.push({
    $project: {
      name: 1,
      status: 1,
      isListed: 1,
      "categoryDetails.industryName": 1,
      "categoryDetails.subCategoryName": 1,
      "categoryDetails.subSubCategoryName": 1,
    },
  });

  return ProductCategory.aggregate(pipeline);
}




  async updateCategory(companyId: string, categoryId: string, newName: string) {
    try {
      const updated = await ProductCategory.findOneAndUpdate(
        { _id: categoryId, company: companyId },
        { $set: { name: newName } },
        { new: true }
      );

      return updated;
    } catch (error) {
      console.error("Edit Product category Error:", error);
      throw error;
    }
  }

  async deleteCategory(companyId: string, categoryId: string) {
    try {
      const deleted = await ProductCategory.findOneAndDelete({
        _id: categoryId,
        company: companyId,
      });

      return deleted;
    } catch (error) {
      console.error("Delete Product category Error:", error);
      throw error;
    }
  }
  async findById(categoryId: string) {
    return await ProductCategory.findById(categoryId);
  }
  async findByProductCategory(productCategoryId: string) {
    return await ProductCategory.findOne({ productCategoryId });
  }
}
