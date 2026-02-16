import { IApplication } from "../../models/applicationModel";
import { IFranchise } from "../../models/franchiseModel";
import { IStock } from "../../models/stockSchema";

export interface ICustomerCommerceService{
    getFranchisesByCategory(industryCategory:string, page: number, search: string):Promise<{franchises:IApplication[]|null,totalPages:number}>
    getProducts(applicationId:string, page: number, search: string):Promise<{products:IStock[]|null,totalPages:number}>
}