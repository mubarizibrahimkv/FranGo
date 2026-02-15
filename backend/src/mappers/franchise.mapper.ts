import { Types } from "mongoose";
import { IFranchise } from "../models/franchiseModel";
import { FranchiseResponseDTO } from "../dtos/franchise/franchise.response.dto";
import { CompanyMapper } from "./company.mapper";
import { ICompany } from "../models/companyModel";

export class FranchiseMapper {
  static toResponse(franchise: IFranchise): FranchiseResponseDTO {
    return {
      _id: franchise?._id.toString(),
      franchiseName: franchise.franchiseName,
      franchiseType: franchise.franchiseType,
      monthlyRevenue: franchise.monthlyRevenue,

      industryCategory: this.toId(franchise.industryCategory),
      industrySubCategory: franchise.industrySubCategory,
      industrySubSubCategory: franchise.industrySubSubCategory, 

      franchisefee: franchise.franchisefee,
      advancefee: franchise.advancefee,
      royaltyfee: franchise.royaltyfee,
      advertisingfee: franchise.advertisingfee,
      renewelfee: franchise.renewelfee,
      platformfee: franchise.platformfee,
      totalInvestement: franchise.totalInvestement,

      minimumSpace: franchise.minimumSpace,
      preferedProperty: franchise.preferedProperty,
      preferedLocation: franchise.preferedLocation,
      accessibility: franchise.accessibility,

      outletFormat: franchise.outletFormat,
      ownershipModel: franchise.ownershipModel,
      supportProvided: franchise.supportProvided,
      staffRequired: franchise.staffRequired,
      trainingType: franchise.trainingType,

      agreementDuration: franchise.agreementDuration,
      renewelDuration: franchise.renewelDuration,

      contactName: franchise.contactName,
      designation: franchise.designation,
      email: franchise.email,
      phone: franchise.phone,

      company: this.mapCompany(franchise.company),
    };
  }

  static toResponseList(franchises: IFranchise[]): FranchiseResponseDTO[] {
    return franchises.map(franchise => this.toResponse(franchise));
  }

  private static mapCompany(
  company?: Types.ObjectId | ICompany
) {
  if (!company) return undefined;

  if (company instanceof Types.ObjectId) {
    return company.toString();
  }

  if (!company._id) return undefined;

  return CompanyMapper.toResponse(company);
}



  private static toId(
    value?: Types.ObjectId | { _id: Types.ObjectId } | string
  ): string | undefined {
    if (!value) return undefined;
    if (typeof value === "string") return value;
    if ("_id" in value) return value._id.toString();
    return String(value);
  }
}
