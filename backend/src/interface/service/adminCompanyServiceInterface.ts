import { CompanyProfileDTO } from "../../dtos/company/company.profile.dto";

export interface IAdminCompanyService{
    getPendingCompanies(page:number,search:string):Promise<{users: CompanyProfileDTO[],totalPages: number}>
    getApprovedCompanies(page:number,search:string,filter:string): Promise<{companies: CompanyProfileDTO[],totalPages: number}>;
    changeStatusCompany(companyId:string,status:"approve"|"reject",reason?:string): Promise<void>;
    blockCompany(companyId:string,block:boolean): Promise<void>;
    getCompanyDetails(id:string): Promise<CompanyProfileDTO>;
}