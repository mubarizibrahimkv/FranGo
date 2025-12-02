import { IApplication } from "../../models/applicationModel"

export interface IApplicationRepo {
    create(data: Partial<IApplication>): Promise<IApplication>;
    findByCompanyId(companyId: string,skip: number, limit: number): Promise<IApplication[]>;
    findByInvestorId(investorId: string,skip:number,limit:number): Promise<IApplication[]>;
    findById(applicationId:string):Promise<IApplication|null> 
    countByCompanyId(companyId: string):Promise<number> 
    countByInvestorId(investoId: string):Promise<number> 
    findByInvestorAndFranchise(investoId: string,franchiseId:string):Promise<IApplication|null> 
}   