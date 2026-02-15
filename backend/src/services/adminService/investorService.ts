import mongoose from "mongoose";
import { Messages } from "../../constants/messages";
import { IAdminInvestorService } from "../../interface/service/adminInvestorServiceInterface";
import { IAdminInvestorRepo } from "../../interface/ṛepository/adminInvestorRepoInterface";
import Investor from "../../models/investorModel";
import { INotificationRepo } from "../../interface/ṛepository/notificationRepoInterface";
import { InvestorMapper } from "../../mappers/investor.mapper";
import { io } from "../../config/socket";

export class AdminInvestorService implements IAdminInvestorService {
    constructor(private _investorRepo: IAdminInvestorRepo, private _notificationRepo: INotificationRepo) { }

    getPendingInvestors = async (page: number, search: string) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const investor = await this._investorRepo.getPendingInvestors(limit, skip, search);
            const totalInvestors = await Investor.countDocuments({ status: "pending" });
            const totalPages = Math.ceil(totalInvestors / limit);
            if (!investor) {
                throw { success: false, message: Messages.INVESTOR_NOT_FOUND };
            }
            return { investor: InvestorMapper.toResponseList(investor), totalPages };
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while fetching pending investors.");
        }
    };

    getApprovedInvestors = async (page: number, search: string) => {
        const limit = 10;
        const skip = (page - 1) * limit;
        try {
            const investor = await this._investorRepo.getApprovedInvestors(limit, skip, search);
            const totalInvestors = await Investor.countDocuments({ status: "approve" });
            const totalPages = Math.ceil(totalInvestors / limit);
            if (!investor) {
                throw { success: false, message: Messages.INVESTOR_NOT_FOUND };
            }
            return { investor: InvestorMapper.toResponseList(investor), totalPages };
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while fetching approved investors.");
        }
    };

    changeStatusInvestor = async (investorId: string, status: "approve" | "reject", reason?: string) => {
        try {
            const investor = await this._investorRepo.findInvestorById(investorId);
            if (!investor) {
                throw { success: false, message: Messages.INVESTOR_NOT_FOUND };
            }
            investor.status = status;
            if (reason) {
                investor.rejectionReason = reason.trim();
            }
            const notificationMessage = status === "approve" ? "Your registration has been approved!" : "Your registration has been rejected!";

            const notification=await this._notificationRepo.create({
                userId: new mongoose.Types.ObjectId(investorId),
                message: notificationMessage,
                isRead: false,
            });

            io.to(investorId).emit("receive_notification", {
                id: notification._id,
                message: notification.message,
                createdAt: notification.createdAt,
                isRead: false,
            });

            await investor.save();
            return;
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while changing investor status.");
        }
    };

    blockInvestor = async (investorId: string, block: boolean) => {
        try {
            const investor = await this._investorRepo.blockInvestor(investorId, block);
            if (!investor) {
                throw { success: false, message: Messages.INVESTOR_NOT_FOUND };
            }
            return;
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while blocking investor.");
        }
    };

    getInvestorDetails = async (investorId: string) => {
        try {
            const investor = await this._investorRepo.findInvestorById(investorId);
            if (!investor) {
                throw { success: false, message: Messages.INVESTOR_NOT_FOUND };
            }
            return InvestorMapper.toResponse(investor);
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("An unknown error occurred while fetching investor details.");
        }
    };
}
