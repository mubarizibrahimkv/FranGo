import { ICompanyProfileRepo } from "../interface/ṛepository/companyProfileRepositoryInterface";
import Company, { CompanyDocument, ICompany } from "../models/companyModel";

export class CompanyProfileRepository implements ICompanyProfileRepo{
    async findById(id:string): Promise<CompanyDocument | null>{
       return Company.findById(id).populate("industryCategory");
    }
    async updateProfile( data: Partial<ICompany>,companyId: string): Promise<ICompany | null> {
      return await Company.findByIdAndUpdate(companyId, data, { new: true });
  }
  
} 