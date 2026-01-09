import { ProductCategoryHierarchyResponseDTO, ProductCategoryResponseDTO } from "../dtos/productCategory/product-category-response.dto";
import { IProductCategory } from "../models/productCategory";


export class ProductCategoryMapper {
  static toResponse(category: IProductCategory): ProductCategoryResponseDTO {
    return {
      _id: category._id!.toString(),
      name: category.name,
      isListed: category.isListed,
      status: category.status,

      industryCategoryId: category.industryCategoryId.toString(),
      subCategoryId: category.subCategoryId.toString(),
      subSubCategoryId: category.subSubCategoryId.toString(),

      company: category.company.toString(),
      createdAt: (category as any).createdAt,
    };
  }

  static toResponseList(categories: IProductCategory[]) {
    return categories.map((cat) => this.toResponse(cat));
  }
}




export class ProductCategoryHierarchyMapper {
  static toResponse(raw: any): ProductCategoryHierarchyResponseDTO {
    return {
      _id: raw._id.toString(),
      name: raw.name,
      status: raw.status,
      isListed: raw.isListed,
      categoryDetails: {
        industryName: raw.categoryDetails.industryName,
        subCategoryName: raw.categoryDetails.subCategoryName,
        subSubCategoryName: raw.categoryDetails.subSubCategoryName,
      },
    };
  }

  static toResponseList(rawList: any[]): ProductCategoryHierarchyResponseDTO[] {
    return rawList.map(this.toResponse);
  }
}
