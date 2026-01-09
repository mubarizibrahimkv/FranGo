import { ProductResponseDTO } from "../../dtos/product/product-reponse.dto";
import { ProductCategoryHierarchyResponseDTO, ProductCategoryResponseDTO } from "../../dtos/productCategory/product-category-response.dto";
import { IProductCategory } from "../../models/productCategory";
import { IProduct } from "../../models/productModel";

export interface ICompanyProductManagementService {
    addProductCategory(companyId: string, data: {
        industryCategoryId: string,
        subCategoryId: string,
        subSubCategoryId: string,
        productCategoryName: string,
    }): Promise<{ success: boolean; createdProducts?: ProductCategoryResponseDTO[]; message: string }>
    getAllProductCategories(companyId: string,search:string,filter?: string): Promise<ProductCategoryHierarchyResponseDTO[]>;
    editProductCategory(companyId:string,categoryId:string,newName:string):Promise<ProductCategoryResponseDTO>
    deleteProductCategory(companyId:string,categoryId:string):Promise<IProductCategory>
    addProduct(companyId:string, category:string, name:string, price:string, description:string, imagePaths:string[]):Promise<ProductResponseDTO>
    editProduct(companyId:string,productId:string, category:string, name:string, price:string, description:string, imagePaths:string[],removedImages:string[]):Promise<ProductResponseDTO>
    getProducts(companyId:string,page:number,search:string,filter?: string):Promise<{products:ProductResponseDTO[],totalPages:number}>
    deleteProduct(productId:string):Promise<IProduct>
}