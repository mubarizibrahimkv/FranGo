import { IProduct } from "../../models/productModel";

export interface IProductRepo{
   create(data:Partial<IProduct>):Promise<IProduct>
   findProductsByCompany(companyId:string,skip?: number,limit?: number,search?: string):Promise<{products:IProduct[],totalCount:number}>
   findByCompanyId(companyId:string,skip:number,limit:number,search:string,filter?: string):Promise<IProduct[]|null>
   countByCompanyId(companyId:string):Promise<number>
   update(productId:string,data:Partial<IProduct>):Promise<IProduct|null>
   delete(productId:string):Promise<IProduct|null>
   findById(productId:string):Promise<IProduct|null>
    findDuplicateProduct(productId: string, companyId: string, category: string, name: string):Promise<IProduct|null>
}