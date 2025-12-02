import { IAdminInvestorRepo } from "../interface/ṛepository/adminInvestorRepoInterface";
import Investor from "../models/investorModel";

export class AdminInvestorRepo implements IAdminInvestorRepo {
    async getPendingInvestors(limit: number, skip: number) {
        return Investor.find({
            status: "pending",
            userName: { $exists: true, $ne: "" },
            email: { $exists: true, $ne: "" },
            phoneNumber: { $exists: true, $ne: "" },
            gender: { $exists: true, $ne: "" },
            nationality: { $exists: true, $ne: "" },
            location: { $exists: true, $ne: "" },
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
    }
    async getApprovedInvestors(limit: number, skip: number) {
        return Investor.find({ status: "approve" }).sort({ createdAt: -1 }).skip(skip).limit(limit);;
    }
    async findInvestorById(investorId: string) {
        return Investor.findById(investorId);
    }
    async blockInvestor(investorId: string, block: boolean) {
        return Investor.findByIdAndUpdate((investorId), { isBlocked: block }, { new: true });
    }
}
