import { IProfileRepo } from "../interface/ṛepository/profileRepoInterface";
import Investor, { IInvestor } from "../models/investorModel";

export class ProfileRepository implements IProfileRepo {
    updateProfile = async (investorId: string, updatedData: IInvestor) => {
        try {
        const updatedSeeker=await Investor.findByIdAndUpdate(investorId,{$set:updatedData},{new:true});
        return updatedSeeker;
        } catch (error) {
            console.error("Error in updateProfile:", error);
            throw error;
        }
    };
    async findById(investorId: string) {
    return Investor.findById(investorId);
  }
} 