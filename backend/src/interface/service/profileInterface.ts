import { IIndustryCategory } from "../../models/industryCategoryModel";
import { IInvestor } from "../../models/investorModel";

export interface IProfileService {
    getProfile(investorId: string): Promise<{seeker:IInvestor,industryCategory:IIndustryCategory[]|null}>
    reapply(investorId: string): Promise<void>
    updateProfileImage(investorId: string, imageUrl: string): Promise<void>
    updateProfile(investorId: string, updatedData: IInvestor): Promise<IInvestor>
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean>
}