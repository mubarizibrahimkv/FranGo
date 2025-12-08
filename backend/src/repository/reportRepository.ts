import { IRepoortRepo } from "../interface/ṛepository/reportRepoInterface";
import Report, { ReportDocument } from "../models/reportModel";
import { BaseRepository } from "./baseRepository";

export class ReportRepo extends BaseRepository<ReportDocument> implements IRepoortRepo {
    constructor() {
        super(Report);
    }
    findAllWithCompanyAndInvestor() {
        return Report.find()
            .populate({
                path: "reportedBy",
                model: "Investor"
            })
            .populate({
                path: "reportedAgainst",
                model: "Company"
            });
    }
}