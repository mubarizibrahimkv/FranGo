import { ICompany } from "../../models/companyModel";

export interface IAdminCompanyRepo {
    getPendingCompanies(limit:number,skip:number,search:string): Promise<ICompany[]> | null
    getApprovedCompanies(limit:number,skip:number,search:string,filter:string): Promise<ICompany[]|null> 
    findCompanyById(companyId: string): Promise<ICompany|null> ;
    blockCompany(companyId:string,block:boolean): Promise<ICompany | null>
}