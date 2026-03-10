import { StockResponseDTO } from "../../dtos/inventory";
import { ProductResponseDTO } from "../../dtos/product/product-reponse.dto";

export interface IInvestorInventoryService{
    getProducts(companyId:string,applicationId: string, page: number,search:string):Promise<{ products: ProductResponseDTO[], totalPages: number }>
    updateStock(productId: string, stock: number, applicationId: string, investorId: string):Promise<StockResponseDTO>
} 