import { StockResponseDTO } from "../../dtos/inventory";
import { ProductResponseDTO } from "../../dtos/product/product-reponse.dto";

export interface IInvestorInventoryService{
    getProducts(companyId:string):Promise<ProductResponseDTO[]>
    updateStock(productId: string, stock: number, applicationId: string, investorId: string):Promise<StockResponseDTO>
}