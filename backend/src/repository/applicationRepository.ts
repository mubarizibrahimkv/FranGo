import { IApplicationRepo } from "../interface/ṛepository/applicationRepoInterface";
import Application, { IApplication } from "../models/applicationModel";
import { BaseRepository } from "./baseRepository";
import { Types } from "mongoose";
import { IFranchise } from "../models/franchiseModel";

export class ApplicationRepo extends BaseRepository<IApplication> implements IApplicationRepo {
    constructor() {
        super(Application);
    }
    async findByCompanyId(companyId: string, skip: number, limit: number) {
        return await Application.aggregate([
            {
                $lookup: {
                    from: "franchises",
                    localField: "franchise",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
            { $unwind: "$franchise" },
            { $match: { "franchise.company": new Types.ObjectId(companyId) } },
            {
                $lookup: {
                    from: "investors",
                    localField: "investor",
                    foreignField: "_id",
                    as: "investor",
                },
            },
            { $unwind: "$investor" },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    "franchise.franchiseName": 1,
                    "investor.email": 1,
                    "franchise.advancefee": 1,
                    status: 1,
                    paymentStatus: 1,
                    createdAt: 1,
                },
            },
        ]);
    }
    async countByCompanyId(companyId: string) {
        const result = await Application.aggregate([
            {
                $lookup: {
                    from: "franchises",
                    localField: "franchise",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
            { $unwind: "$franchise" },
            { $match: { "franchise.company": new Types.ObjectId(companyId) } },
            { $count: "total" },
        ]);

        return result.length > 0 ? result[0].total : 0;
    }
    async findByInvestorId(investorId: string, skip: number, limit: number) {
        return await Application.find({ investor: investorId }).populate({ path: "franchise", populate: { path: "company", populate: { path: "industryCategory" } } }).populate("payment").skip(skip).limit(limit).lean();
    }
    async countByInvestorId(investorId: string) {
        return await Application.countDocuments({ investor: investorId });
    }
    async findByInvestorAndFranchise(investorId: string, franchiseId: string) {
        return await Application.findOne({ investor: investorId, franchise: franchiseId });
    }
    async getApprovedFranchisesByInvestor(
        investorId: string
    ) {
        return await Application.find({
            investor: investorId,
            status: "approved",
        })
            .populate<{ franchise: IFranchise }>("franchise")
            .exec() as unknown as (IApplication & { franchise: IFranchise })[];
    }

}