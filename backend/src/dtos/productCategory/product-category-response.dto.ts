export interface ProductCategoryResponseDTO {
  _id: string;
  name: string;
  isListed: boolean;
  status: string;

  industryCategoryId: string;
  subCategoryId: string;
  subSubCategoryId: string;

  company: string;
  createdAt: Date;
}


export interface ProductCategoryHierarchyResponseDTO {
  _id: string;
  name: string;
  status: string;
  isListed: boolean;
  categoryDetails: {
    industryName: string;
    subCategoryName: string;
    subSubCategoryName: string;
  };
}
