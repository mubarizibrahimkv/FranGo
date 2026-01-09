import { InvestorResponseDTO } from "../dtos/investor/investor.response.dto";
import { IInvestor } from "../models/investorModel";


export class InvestorMapper {
  static toResponse(investor: IInvestor): InvestorResponseDTO {
    return {
      _id: investor._id.toString(),
      userName: investor.userName,
      email: investor.email,
      role: investor.role,
      isBlocked: investor.isBlocked,
      gender: investor.gender,
      dateOfBirth: investor.dateOfBirth,
      nationality: investor.nationality,
      phoneNumber: investor.phoneNumber,
      location: investor.location,
      qualifications: investor.qualifications,
      ownProperty: investor.ownProperty,
      floorArea: investor.floorArea,
      investmentRange: investor.investmentRange,
      fundingSource: investor.fundingSource,
      previousBusiness: investor.previousBusiness?.map(String),
      jobExperience: investor.jobExperience,
      yearsOfExperience: investor.yearsOfExperience,
      numberOfEmployees: investor.numberOfEmployees,
      preferredFranchiseType: investor.preferredFranchiseType?.map(String),
      reasonForSeeking: investor.reasonForSeeking,
      ownershipTimeframe: investor.ownershipTimeframe,
      findingSource: investor.findingSource,
      status: investor.status,
      rejectionReason: investor.rejectionReason,
      profileImage: investor.profileImage,
      isAdmin: investor.isAdmin,
      isVerifiedByAdmin: investor.isVerifiedByAdmin,
      googleId: investor.googleId,
      createdAt: investor.createdAt,
    };
  }

  static toResponseList(investors: IInvestor[]): InvestorResponseDTO[] {
    return investors.map(this.toResponse);
  }
}
