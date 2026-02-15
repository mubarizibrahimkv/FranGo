import { IStockRepo } from "../interface/ṛepository/stockRepoInterface";
import Stock, { IStock } from "../models/stockSchema";
import { BaseRepository } from "./baseRepository";

export class CouponRepository extends BaseRepository<IStock> implements IStockRepo {
    constructor() {
        super(Stock);
    }
    async updateStock(productId:string,stock:number){
      return await Stock.findOneAndUpdate({productId},{quantity:stock},{new:true})
    }   
}