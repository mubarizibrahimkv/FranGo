import { IFranchise } from "../../models/franchiseModel";

export interface ICustomerCommerceService{
    getFranchisesByCategory(industryCategory:string, page: number, search: string):Promise<{franchises:IFranchise[]|null,totalPages:number}>
}