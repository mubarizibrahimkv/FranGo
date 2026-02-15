import { IStockRepo } from "../interface/ṛepository/stockRepoInterface";
import Stock, { IStock } from "../models/stockSchema";
import { BaseRepository } from "./baseRepository";

export class CouponRepository extends BaseRepository<IStock> implements IStockRepo {
    constructor() {
        super(Stock);
    }
    async updateStock(applicationId: string, productId: string, stock: number) {
        return await Stock.findOneAndUpdate({ application: applicationId, product: productId }, { quantity: stock }, { new: true })
    }
    async existStock(applicationId: string, productId: string) {
        return await Stock.findOne({
            product: productId,
            application: applicationId
        });
    }
}