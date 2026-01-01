import { IProductCategory } from "../../models/productCategory";
import { IProduct } from "../../models/productModel";

export interface ICompanyProductManagementService {
    addProductCategory(companyId: string, data: {
        industryCategoryId: string,
        subCategoryId: string,
        subSubCategoryId: string,
        productCategoryName: string,
    }): Promise<{ success: boolean; createdProducts?: IProductCategory[]; message: string }>
    getAllProductCategories(companyId: string,search:string,filter?: string): Promise<
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
    editProductCategory(companyId:string,categoryId:string,newName:string):Promise<IProductCategory>
    deleteProductCategory(companyId:string,categoryId:string):Promise<IProductCategory>
    addProduct(companyId:string, category:string, name:string, price:string, description:string, imagePaths:string[]):Promise<IProduct>
    editProduct(companyId:string,productId:string, category:string, name:string, price:string, description:string, imagePaths:string[],removedImages:string[]):Promise<IProduct>
    getProducts(companyId:string,page:number,search:string,filter?: string):Promise<{products:IProduct[],totalPages:number}>
    deleteProduct(productId:string):Promise<IProduct>
}