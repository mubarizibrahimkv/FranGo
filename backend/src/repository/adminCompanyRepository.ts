import { FilterQuery } from "mongoose";
import { IAdminCompanyRepo } from "../interface/ṛepository/adminCompanyRepoInterface";
import Company, { ICompany } from "../models/companyModel";

export class AdminCompanyRepo implements IAdminCompanyRepo {
    async getPendingCompanies(limit: number, skip: number,search:string) {
        return Company.find({
            status: "pending",
            companyName: { $exists: true, $ne: "" },
            email: { $exists: true, $ne: "" },
            ownerName: { $exists: true, $ne: "" },
            contactPerson: { $exists: true, $ne: "" },
            industryCategory: { $exists: true, $ne: null },
            phoneNumber: { $exists: true, $ne: "" },
            about: { $exists: true, $ne: "" },
            companyLogo: { $exists: true, $ne: "" },
            companyRegistrationProof: { $exists: true, $ne: null },
            $or:[{email:{$regex:search,$options:"i"}},{companyName:{$regex:search,$options:"i"}},{brandName:{$regex:search,$options:"i"}}]
        })
            .sort({ createdAt: -1 })
            .skip(skip) 
            .limit(limit)
            .lean();
    }

    async getApprovedCompanies(
  limit: number,
  skip: number,
  search: string,
  filter: string
) {
  const query: FilterQuery<ICompany> = {
    status: "approve",
  };

  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { companyName: { $regex: search, $options: "i" } },
      { brandName: { $regex: search, $options: "i" } },
    ];
  }

  if (filter) {
    query.industryCategory = filter;
  }

  return Company.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}
    async findCompanyById(companyId: string) {
        return Company.findById(companyId);
    }
    async blockCompany(companyId: string, block: boolean) {
        return Company.findByIdAndUpdate((companyId), { isBlocked: block }, { new: true });
    }
}