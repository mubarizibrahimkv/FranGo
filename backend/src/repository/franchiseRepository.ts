import mongoose, { FilterQuery, SortOrder } from "mongoose";
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
} 