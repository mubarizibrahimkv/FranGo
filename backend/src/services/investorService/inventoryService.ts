import { Types } from "mongoose"
import { IProductRepo } from "../../interface/ṛepository/productRepoInterface"
import { IStockRepo } from "../../interface/ṛepository/stockRepoInterface"
import { ProductMapper } from "../../mappers/product.mapper"
import { StockMapper } from "../../mappers/inventory.mapper"
import { IInvestorInventoryService } from "../../interface/service/investorInventoryServiceInterface"
import { ProductWithQuantity } from "../../models/productModel"


export class InvestorInventoryService implements IInvestorInventoryService {
    constructor(private _productRepo: IProductRepo, private _inventoryRepo: IStockRepo) { }
    getProducts = async (companyId: string, applicationId: string, page: number, search: string) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const { products, totalCount } =
                await this._productRepo.findProductsByCompany(
                    companyId,
                    skip,
                    limit,
                    search
                );
            const stocks = await this._inventoryRepo.getProductsByApplication(applicationId);

            const stockMap = new Map<string, number>();

            stocks.products.forEach((stock) => {
                const productId = stock.product?._id?.toString();
                if (productId) {
                    stockMap.set(productId, stock.quantity);
                }
            });
            const mergedProducts: ProductWithQuantity[] = products.map((product) => ({ ...product, quantity: stockMap.get(product._id.toString()) || 0, }));

            const totalPages = Math.ceil(totalCount / limit);

            return {
                products: ProductMapper.toResponseList(mergedProducts),
                totalCount,
                totalPages,
                currentPage: page,
            };
        } catch (error) {
            console.log("Error in get product in investor", error)
            throw error
        }
    }
    updateStock = async (productId: string, stock: number, applicationId: string, investorId: string) => {
        try {
            const product = await this._productRepo.findById(productId);
            console.log(product, "getting product")
            if (!product) {
                throw new Error("Product not found");
            }
            const existStock = await this._inventoryRepo.existStock(applicationId, productId)
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