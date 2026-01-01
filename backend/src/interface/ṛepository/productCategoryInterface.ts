import { IProductCategory } from "../../models/productCategory";

export interface IProductCategoryRepo {
  create(data: Partial<IProductCategory>): Promise<IProductCategory>;
  findByNameAndSubSubCategory(
    name: string,
    subSubCategoryId: string,
    companyId: string
  ): Promise<IProductCategory | null>;
  findAllByCompany(companyId: string): Promise<IProductCategory[]>
  findAllWithCategoryHierarchy(companyId: string,search:string,filter?: string 
): Promise<
    {
      _id: string;
      name: string;
      status: string;
      isListed: boolean;
      categoryDetails: {
        industryName: string;
        subCategoryName: string;
        subSubCategoryName: string;
      };
    }[]
  >;
  updateCategory(
    companyId: string,
    categoryId: string,
    newName: string
  ): Promise<IProductCategory | null>;

  deleteCategory(
    companyId: string,
    categoryId: string
  ): Promise<IProductCategory | null>;
  findById(categoryId:string):Promise<IProductCategory|null>
}
