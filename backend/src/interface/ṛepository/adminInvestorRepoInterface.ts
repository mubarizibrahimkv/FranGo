import { IInvestor } from "../../models/investorModel";

export interface IAdminInvestorRepo {
    getPendingInvestors(limit:number,skip:number): Promise<IInvestor[]> | null
    getApprovedInvestors(limit:number,skip:number): Promise<IInvestor[]|null> 
    findInvestorById(investorId: string): Promise<IInvestor|null> ;
    blockInvestor(investorId:string,block:boolean): Promise<IInvestor | null>
}