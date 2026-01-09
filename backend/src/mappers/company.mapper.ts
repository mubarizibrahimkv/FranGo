import { CompanyProfileDTO } from "../dtos/company/company.profile.dto";
import { CompanyResponseDTO } from "../dtos/company/company.response.dto";
import { ICompany } from "../models/companyModel";
export class CompanyMapper {
  static toResponse(company: ICompany): CompanyResponseDTO {
    return {
      _id: company._id.toString(),
      companyName: company.companyName,
      email: company.email,
      role: company.role,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
      isAdmin: company.isAdmin,
      companyLogo: company.companyLogo,
      companyRegistrationProof: company.companyRegistrationProof,
    };
  }

  static toResponseList(companies: ICompany[]): CompanyResponseDTO[] {
    return companies.map(company => this.toResponse(company));
  }

  static toProfile(company: ICompany): CompanyProfileDTO {
    return {
      _id: company._id.toString(),
      brandName: company.brandName,
      companyName: company.companyName,
      ownerName: company.ownerName,
      industryCategory: company.industryCategory?.toString(),
      industrySubCategory: company.industrySubCategory,
      yearFounded: company.yearFounded,
      country: company.country,
      yearCommencedFranchising: company.yearCommencedFranchising,
      contactPerson: company.contactPerson,
      designation: company.designation,
      email: company.email,
      phoneNumber: company.phoneNumber,
      website: company.website,
      numberOfRetailOutlets: company.numberOfRetailOutlets,
      numberOfFranchiseOutlets: company.numberOfFranchiseOutlets,
      companyLogo: company.companyLogo,
      companyRegistrationProof: company.companyRegistrationProof,
      about: company.about,
      role: company.role,
      status: company.status,
      rejectionReason: company.rejectionReason,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
      isAdmin: company.isAdmin,
      isVerifiedByAdmin: company.isVerifiedByAdmin,
      subscription: company.subscription,
      createdAt: company.createdAt,
    };
  }

  static toProfileList(companies: ICompany[]): CompanyProfileDTO[] {
    return companies.map(company => this.toProfile(company));
  }
}
