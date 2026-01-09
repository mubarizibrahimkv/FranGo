import { CompanyIndustryCategoryDTO } from "../dtos/company/company.indutryCategory.dto";
import { IIndustryCategory } from "../models/industryCategoryModel";

export class IndustryCategoryMapper {
  static toResponse(category: IIndustryCategory): CompanyIndustryCategoryDTO {
    return {
      _id: category._id.toString(),
      name: category.categoryName,
    };
  }
  static toResponseList(categories: IIndustryCategory[]): CompanyIndustryCategoryDTO[] {
    return categories.map(cat => this.toResponse(cat));
  }
}
