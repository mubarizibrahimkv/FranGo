export interface SubSubCategoryDTO {
  _id: string;
  name: string;
  productCategories: string[]; 
}

export interface SubCategoryDTO {
  _id: string;
  name: string;
  subSubCategories: SubSubCategoryDTO[];
}

export interface CompanyIndustryCategoryDTO {
  _id: string;
  categoryName: string;
  subCategories: SubCategoryDTO[];
  createdAt: Date;
  image: string;
  status: "active" | "inactive";
}
