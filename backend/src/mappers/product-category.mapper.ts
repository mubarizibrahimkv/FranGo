import { Types } from "mongoose";
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

interface ProductCategoryHierarchyRaw {
  _id?: Types.ObjectId | string;
  name?: string;
  status?: string;
  isListed?: boolean;
  categoryDetails?: {
    industryName?: string;
    subCategoryName?: string;
    subSubCategoryName?: string;
  };
}


export class ProductCategoryHierarchyMapper {
  static toResponse(
    raw: ProductCategoryHierarchyRaw
  ): ProductCategoryHierarchyResponseDTO {
    return {
      _id: raw._id
        ? raw._id instanceof Types.ObjectId
          ? raw._id.toString()
          : raw._id
        : "",

      name: raw.name ?? "",
      status: raw.status ?? "inactive",
      isListed: raw.isListed ?? false,

      categoryDetails: {
        industryName: raw.categoryDetails?.industryName ?? "",
        subCategoryName: raw.categoryDetails?.subCategoryName ?? "",
        subSubCategoryName: raw.categoryDetails?.subSubCategoryName ?? "",
      },
    };
  }
  static toResponseList(
    raws: ProductCategoryHierarchyRaw[]
  ): ProductCategoryHierarchyResponseDTO[] {
    return raws.map(raw =>
      ProductCategoryHierarchyMapper.toResponse(raw)
    );
  }
}

