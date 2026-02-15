import { Types } from "mongoose"
import { IProductRepo } from "../../interface/ṛepository/productRepoInterface"
import { IStockRepo } from "../../interface/ṛepository/stockRepoInterface"
import { ProductMapper } from "../../mappers/product.mapper"
import { StockMapper } from "../../mappers/inventory.mapper"
import { IInvestorInventoryService } from "../../interface/service/investorInventoryServiceInterface"

export class InvestorInventoryService implements IInvestorInventoryService {
    constructor(private _productRepo: IProductRepo, private _inventoryRepo: IStockRepo) { }
    getProducts = async (companyId: string) => {
        try {
            const products = await this._productRepo.findProductsByCompany(companyId)
            return ProductMapper.toResponseList(products)
        } catch (error) {
            console.log("Error in get product in investor", error)
            throw error
        }
    }
    updateStock = async (productId: string, stock: number, applicationId: string, investorId: string) => {
        try {
            const product = await this._productRepo.findById(productId);
            if (!product) {
                throw new Error("Product not found");
            }
            const existStock = this._inventoryRepo.existStock(applicationId, productId)
            if (existStock !== null) {
                const update = await this._inventoryRepo.updateStock(applicationId, productId, stock)
                if (!update) {
                    throw new Error("Stock update failed");
                }
                return StockMapper.toResponse(update);
            }
            const created = await this._inventoryRepo.create({
                product: new Types.ObjectId(productId),
                application: new Types.ObjectId(applicationId),
                investor: new Types.ObjectId(investorId),
                quantity: stock
            });
            return StockMapper.toResponse(created);
        } catch (error) {
            console.log("Error in update inventory in investor", error)
            throw error
        }
    }
}