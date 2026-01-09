import { PipelineStage } from "mongoose";
import { IRepoortRepo } from "../interface/ṛepository/reportRepoInterface";
import Report, { ReportDocument } from "../models/reportModel";
import { BaseRepository } from "./baseRepository";

export class ReportRepo extends BaseRepository<ReportDocument> implements IRepoortRepo {
    constructor() {
        super(Report);
    }
  async findAllWithCompanyAndInvestor(limit: number, skip: number, search: string) {
    const pipeline: PipelineStage[] = [];

    pipeline.push({
        $lookup: {
            from: "investors",
            localField: "reportedBy",
            foreignField: "_id",
            as: "reportedBy"
        }
    });

    pipeline.push({ $unwind: "$reportedBy" });

    pipeline.push({
        $lookup: {
            from: "companies",
            localField: "reportedAgainst",
            foreignField: "_id",
            as: "reportedAgainst"
        }
    });

    pipeline.push({ $unwind: "$reportedAgainst" });

    if (search) {
        pipeline.push({
            $match: {
                $or: [
                    { reason: { $regex: search, $options: "i" } },
                    { "reportedBy.userName": { $regex: search, $options: "i" } },
                    { "reportedAgainst.companyName": { $regex: search, $options: "i" } },
                ]
            }
        });
    }

    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    return Report.aggregate(pipeline);
}

}