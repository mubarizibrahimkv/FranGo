import { CompanyIndustryCategoryDTO } from "../dtos/company/company.indutryCategory.dto";
import { IIndustryCategory, ISubCategory, ISubSubCategory } from "../models/industryCategoryModel";

export class IndustryCategoryMapper {
  static toResponse(category: IIndustryCategory): CompanyIndustryCategoryDTO {
    return {
      _id: category._id.toString(),
      categoryName: category.categoryName,
      createdAt: category.createdAt,
      image: category.image,
      status: category.status,
      subCategories: category.subCategories?.map((sub: ISubCategory) => ({
        _id: sub._id.toString(),
        name: sub.name,
        subSubCategories: sub.subSubCategories?.map((subSub: ISubSubCategory) => ({
          _id: subSub._id.toString(),
          name: subSub.name,
          productCategories: subSub.productCategories.map((p) => p.toString()),
        })) || [],
      })) || [],
    };
  }

  static toResponseList(categories: IIndustryCategory[]): CompanyIndustryCategoryDTO[] {
    return categories.map((cat) => this.toResponse(cat));
  }
}
