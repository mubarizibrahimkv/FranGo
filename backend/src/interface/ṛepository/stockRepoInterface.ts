import { IStock } from "../../models/stockSchema";

export interface IStockRepo{
    create(data:Partial<IStock>):Promise<IStock>
    updateStock(productId:string,stock:number):Promise<IStock|null>
}