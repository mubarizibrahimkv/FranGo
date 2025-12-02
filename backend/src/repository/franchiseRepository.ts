import mongoose from "mongoose";
import { IFranchiseRepo } from "../interface/ṛepository/franchiseRepoInterface";
import Franchise, { IFranchise } from "../models/franchiseModel";
import { BaseRepository } from "./baseRepository";

export class FranchiseRepo extends BaseRepository<IFranchise> implements IFranchiseRepo {
    constructor() {
        super(Franchise);
    }
    async findByCompanyId(companyId: string, skip: number, limit: number) {
        const franchises = await Franchise.find({ company: new mongoose.Types.ObjectId(companyId) }).skip(skip).limit(limit).lean();
        return franchises;
    }
    async findAllWithCompany(query: any, sortOption: any) {
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