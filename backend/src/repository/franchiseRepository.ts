import mongoose, { FilterQuery, ObjectId, SortOrder } from "mongoose";
import { IFranchiseRepo } from "../interface/ṛepository/franchiseRepoInterface";
import Franchise, { IFranchise } from "../models/franchiseModel";
import { BaseRepository } from "./baseRepository";

export class FranchiseRepo extends BaseRepository<IFranchise> implements IFranchiseRepo {
    constructor() {
        super(Franchise);
    }
    async findByCompanyId(
        companyId: string,
        skip: number,
        limit: number,
        search: string,
        filter?: Record<string, string>
    ) {
        const query: FilterQuery<IFranchise> = {
            company: new mongoose.Types.ObjectId(companyId),
        }; 

        if (search?.trim()) {
            query.franchiseName = { $regex: search, $options: "i" };
        }

        if (filter?.industrySubCategory) {
            query.industrySubCategory = new mongoose.Types.ObjectId(
                filter.industrySubCategory
            );
        }

        if (filter?.ownershipModel) {
            query.ownershipModel = filter.ownershipModel;
        }

        if (filter?.minInvestment || filter?.maxInvestment) {
            query.totalInvestement = {};

            if (filter.minInvestment) {
                query.totalInvestement.$gte = Number(filter.minInvestment);
            }

            if (filter.maxInvestment) {
                query.totalInvestement.$lte = Number(filter.maxInvestment);
            }
        }

        const franchises = await Franchise.find(query)
            .skip(skip)
            .limit(limit)
            .lean();

        return franchises;
    }

    async findAllWithCompany(
        query: FilterQuery<IFranchise>,
        sortOption: Record<string, SortOrder>
    ) {
        return await Franchise.find(query)
            .populate({
                path: "company",
                populate: { path: "industryCategory" },
            })
            .sort(sortOption);
    }
    async countByCompanyId(companyId: string) {
        return await Franchise.countDocuments({ company: new mongoose.Types.ObjectId(companyId) });
    }

    async findByIdWithComapny(franchiseId: string) {
        return await Franchise.findById(franchiseId).populate({
            path: "company",
            populate: { path: "industryCategory" }
        });
    }
    async findById(id: string) {
        return await Franchise.findById(id).populate("industryCategory").populate("industrySubCategory");
    }
    async findAllByIndustryCategory(
        industryCategoryId: string,
        limit: number,
        skip: number,
        search: string
    ) {
        const result = await Franchise.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "company",
                },
            },
            { $unwind: "$company" },

            {
                $match: {
                    "company.industryCategory": new mongoose.Types.ObjectId(
                        industryCategoryId
                    ),
                },
            },

            {
                $lookup: {
                    from: "industrycategories",
                    let: {
                        subCategoryId: "$industrySubCategory",
                        subSubCategoryIds: "$industrySubSubCategory",
                    },
                    pipeline: [
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(industryCategoryId),
                            },
                        },
                        {
                            $project: {
                                subCategory: {
                                    $first: {
                                        $filter: {
                                            input: "$subCategories",
                                            as: "sub",
                                            cond: { $eq: ["$$sub._id", "$$subCategoryId"] },
                                        },
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                subCategoryName: "$subCategory.name",
                                subSubCategoryNames: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$subCategory.subSubCategories",
                                                as: "ssc",
                                                cond: {
                                                    $in: ["$$ssc._id", "$$subSubCategoryIds"],
                                                },
                                            },
                                        },
                                        as: "matchedSSC",
                                        in: "$$matchedSSC.name",
                                    },
                                },
                            },
                        },
                    ],
                    as: "industryInfo",
                },
            },
            { $unwind: "$industryInfo" },

            ...(search
                ? [
                    {
                        $match: {
                            franchiseName: { $regex: search, $options: "i" },
                        },
                    },
                ]
                : []),

            {
                $facet: {
                    data: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                franchiseName: 1,
                                monthlyRevenue: 1,
                                totalInvestement: 1,
                                createdAt: 1,

                                industrySubCategoryName: "$industryInfo.subCategoryName",
                                industrySubSubCategoryNames:
                                    "$industryInfo.subSubCategoryNames",

                                "company.companyName": 1,
                                "company.companyLogo": 1,
                            },
                        },
                    ],
                    totalCount: [
                        { $count: "count" }
                    ],
                },
            },

            {
                $project: {
                    data: 1,
                    totalCount: {
                        $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
                    },
                },
            },
        ]);

        return result[0];
    }

} 