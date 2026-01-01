import { IApplication } from "../../models/applicationModel";
import { IFranchise } from "../../models/franchiseModel";

export interface IApplicationRepo {
    create(data: Partial<IApplication>): Promise<IApplication>;
    findByCompanyId(companyId: string,skip: number, limit: number,search:string,filter?: Record<string, string>): Promise<IApplication[]>;
    findByInvestorId(investorId: string,skip:number,limit:number,search:string,filter:string): Promise<IApplication[]>;
    findById(applicationId:string):Promise<IApplication|null> 
    countByCompanyId(companyId: string):Promise<number> 
    countByInvestorId(investoId: string):Promise<number> 
    findByInvestorAndFranchise(investoId: string,franchiseId:string):Promise<IApplication|null> 
    delete(id:string):Promise<IApplication|null> 
    getApprovedFranchisesByInvestor(investorId:string):Promise<(IApplication&{franchise:IFranchise})[]|null> 
}   