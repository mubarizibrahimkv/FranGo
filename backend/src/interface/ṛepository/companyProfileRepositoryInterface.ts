import { CompanyDocument, ICompany } from "../../models/companyModel";

export interface ICompanyProfileRepo {
    findById(companyId:string):Promise<CompanyDocument|null>
    updateProfile(data:ICompany,companyId:string): Promise<ICompany | null>
}