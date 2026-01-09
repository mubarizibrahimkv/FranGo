import { IApplicationRepo } from "../interface/ṛepository/applicationRepoInterface";
import Application, { IApplication } from "../models/applicationModel";
import { BaseRepository } from "./baseRepository";
import mongoose, { PipelineStage, Types } from "mongoose";
import { IFranchise } from "../models/franchiseModel";
import { ICompany } from "../models/companyModel";
import { IIndustryCategory } from "../models/industryCategoryModel";

export class ApplicationRepo extends BaseRepository<IApplication> implements IApplicationRepo {
    constructor() {
        super(Application);
    }
    async findByCompanyId(companyId: string, skip: number, limit: number, search: string, filter?: Record<string, string>) {

        const matchStage: PipelineStage.Match["$match"] = {
            "franchise.company": new Types.ObjectId(companyId),
        };

        if (search?.trim()) {
            matchStage.$or = [
                { "investor.email": { $regex: search, $options: "i" } },
                { "franchise.franchiseName": { $regex: search, $options: "i" } },
            ];
        }

        if (filter?.status) {
            matchStage.status = filter.status;
        }

        if (filter?.subCategoryId) {
            matchStage["franchise.industrySubCategory"] = new Types.ObjectId(
                filter.subCategoryId
            );
        }


        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "franchises",
                    localField: "franchise",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
            { $unwind: "$franchise" },

            {
                $lookup: {
                    from: "investors",
                    localField: "investor",
                    foreignField: "_id",
                    as: "investor",
                },
            },
            { $unwind: "$investor" },

            { $match: matchStage },

            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
                $project: {
                    "franchise.franchiseName": 1,
                    "franchise.advancefee": 1,
                    "investor.email": 1,
                    status: 1,
                    paymentStatus: 1,
                    createdAt: 1,
                },
            },
        ];

        return Application.aggregate(pipeline);
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
    async findByInvestorId(
        investorId: string,
        skip: number,
        limit: number,
        search: string,
        filter: string
    ) {
        const regex = new RegExp(search, "i");

        const matchStage: Record<string, unknown> = {
            investor: new mongoose.Types.ObjectId(investorId),
        };

        if (filter) {
            matchStage.status = filter;
        }

        return await Application.aggregate([
            {
                $match: matchStage,
            },
            {
                $lookup: {
                    from: "franchises",
                    localField: "franchise",
                    foreignField: "_id",
                    as: "franchise",
                },
            },
            { $unwind: "$franchise" },

            {
                $lookup: {
                    from: "companies",
                    localField: "franchise.company",
                    foreignField: "_id",
                    as: "franchise.company",
                },
            },
            { $unwind: "$franchise.company" },

            {
                $lookup: {
                    from: "industrycategories",
                    localField: "franchise.company.industryCategory",
                    foreignField: "_id",
                    as: "franchise.company.industryCategory",
                },
            },
            {
                $unwind: {
                    path: "$franchise.company.industryCategory",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $lookup: {
                    from: "payments",
                    localField: "payment",
                    foreignField: "_id",
                    as: "payment",
                },
            },
            {
                $unwind: {
                    path: "$payment",
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $match: {
                    $or: [
                        { "franchise.franchiseName": { $regex: regex } },
                        { "franchise.company.companyName": { $regex: regex } },
                    ],
                },
            },

            { $skip: skip },
            { $limit: limit },
        ]);
    }
    async countByInvestorId(investorId: string) {
        return await Application.countDocuments({ investor: investorId });
    }
    async findByInvestorAndFranchise(investorId: string, franchiseId: string) {
        return await Application.findOne({ investor: investorId, franchise: franchiseId });
    }
    async getApprovedFranchisesByInvestor(investorId: string) {
        return await Application.find({
            investor: investorId,
            status: "approved",
        })
            .populate({
                path: "franchise",
                populate: {
                    path: "company",
                    populate: {
                        path: "industryCategory",
                    },
                },
            })
            .exec() as unknown as (IApplication & {
                franchise: IFranchise & {
                    company: ICompany & {
                        industryCategory: IIndustryCategory;
                    };
                };
            })[];
    }
}