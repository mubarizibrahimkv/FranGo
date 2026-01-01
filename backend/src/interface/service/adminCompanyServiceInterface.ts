import { ICompany } from "../../models/companyModel";

export interface IAdminCompanyService{
    getPendingCompanies(page:number,search:string):Promise<{users: ICompany[],totalPages: number}>
    getApprovedCompanies(page:number,search:string,filter:string): Promise<{companies: ICompany[],totalPages: number}>;
    changeStatusCompany(companyId:string,status:"approve"|"reject",reason?:string): Promise<void>;
    blockCompany(companyId:string,block:boolean): Promise<void>;
    getCompanyDetails(id:string): Promise<ICompany>;
}