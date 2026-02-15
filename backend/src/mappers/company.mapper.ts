import { Types } from "mongoose";
import { CompanyProfileDTO } from "../dtos/company/company.profile.dto";
import { CompanyResponseDTO } from "../dtos/company/company.response.dto";
import { ICompany } from "../models/companyModel";
import { IIndustryCategory } from "../models/industryCategoryModel";
import { CompanyIndustryCategoryDTO } from "../dtos/company/company.indutryCategory.dto";
export class CompanyMapper {
  static toResponse(company: ICompany): CompanyResponseDTO {
    return {
      _id: company._id.toString(),
      companyName: company.companyName,
      email: company.email,
      role: company.role,
      isVerified: company.isVerified,
      isBlocked: company.isBlocked,
      status:company.status,
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
      industryCategory: this.mapIndustryCategory(company.industryCategory),
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

 private static mapIndustryCategory(
  category?: Types.ObjectId | IIndustryCategory
): CompanyIndustryCategoryDTO | undefined {
  if (!category) return undefined;

  if (category instanceof Types.ObjectId) {
    return {
      _id: category.toString(),
      categoryName: "",
      subCategories: [],
      createdAt: new Date(),
      image: "",
      status: "inactive",
    };
  }

  return {
    _id: category._id.toString(),
    categoryName: category.categoryName,
    createdAt: category.createdAt,
    image: category.image,
    status: category.status,
    subCategories: category.subCategories?.map((sub) => ({
      _id: sub._id.toString(),
      name: sub.name,
      subSubCategories: sub.subSubCategories?.map((subSub) => ({
        _id: subSub._id.toString(),
        name: subSub.name,
        productCategories: subSub.productCategories.map((p) => p.toString()),
      })) || [],
    })) || [],
  };
}



  static toProfileList(companies: ICompany[]): CompanyProfileDTO[] {
    return companies.map(company => this.toProfile(company));
  }
}
