import { IStock } from "../../models/stockSchema";

export interface IStockRepo{
    create(data:Partial<IStock>):Promise<IStock>
    updateStock(applicationId:string,productId:string,stock:number):Promise<IStock|null>
    existStock(applicationId: string, productId: string):Promise<IStock|null>
}